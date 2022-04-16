import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  Texture,
  NearestFilter,
  RepeatWrapping,
  ClampToEdgeWrapping,
  Color,
} from 'three';

import type { System } from '../../../engine/system';
import type { Entity, EntityObserver } from '../../../engine/entity';
import type { Store } from '../../../engine/scene/store';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Transform } from '../../components/transform';
import type { Renderable } from '../../components/renderable';
import type { Camera } from '../../components/camera';
import { MathOps } from '../../../engine/mathLib';
import { filterByKey } from '../../../engine/utils';

import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
  sortByFit,
} from './sort';
import { LightSubsystem } from './light-subsystem';
import { createMaterial, updateMaterial } from './material-factory';
import {
  CAMERA_COMPONENT_NAME,
  CURRENT_CAMERA_NAME,
  TRANSFORM_COMPONENT_NAME,
  RENDERABLE_COMPONENT_NAME,
  STD_SCREEN_SIZE,
} from './consts';

interface UpdateFrameMessage extends Message {
  id: string
  currentFrame?: number
  rotation?: number
  flipX?: boolean
  flipY?: boolean
  disabled?: boolean
}

interface RendererOptions {
  entityObserver: EntityObserver
  lightsObserver: EntityObserver
  store: Store
  messageBus: MessageBus
  window: HTMLElement
  sortingLayers: Array<string>
  backgroundColor: string
  scaleSensitivity: number
  textureMap: Record<string, Array<Texture>>
}

export class ThreeJSRenderer implements System {
  private entityObserver: EntityObserver;
  private store: Store;
  private messageBus: MessageBus;
  private window: HTMLElement;
  private renderScene: Scene;
  private currentCamera: OrthographicCamera;
  private renderer: WebGLRenderer;
  private textureMap: Record<string, Array<Texture>>;
  private entitiesMap: Record<string, number>;
  private sortFn: SortFn;
  private lightSubsystem: LightSubsystem;
  private viewWidth: number;
  private viewHeight: number;
  private scaleSensitivity: number;
  private screenScale: number;

  constructor(options: RendererOptions) {
    const {
      entityObserver,
      lightsObserver,
      store,
      messageBus,
      window,
      sortingLayers,
      backgroundColor,
      scaleSensitivity,
      textureMap,
    } = options;

    this.entityObserver = entityObserver;
    this.store = store;
    this.messageBus = messageBus;
    this.window = window;

    this.sortFn = composeSort([
      createSortByLayer(sortingLayers),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
      sortByFit,
    ]);

    this.entitiesMap = {};
    this.viewWidth = 0;
    this.viewHeight = 0;
    this.scaleSensitivity = MathOps.clamp(scaleSensitivity, 0, 1) as number;
    this.screenScale = 1;

    this.renderScene = new Scene();
    this.currentCamera = new OrthographicCamera();
    this.renderer = new WebGLRenderer();
    this.renderer.setClearColor(new Color(backgroundColor));

    this.lightSubsystem = new LightSubsystem(this.renderScene, lightsObserver);

    // TODO: Figure out how to set up camera correctly to avoid scale usage
    this.renderScene.scale.set(1, -1, 1);

    this.textureMap = textureMap;
    Object.keys(this.textureMap).forEach((key) => {
      this.textureMap[key].forEach((texture) => {
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.flipY = false;
      });
    });
  }

  systemDidMount(): void {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);

    this.entityObserver.subscribe('onadd', this.handleEntityAdd);
    this.entityObserver.subscribe('onremove', this.handleEntityRemove);

    this.lightSubsystem.mount();

    this.window.appendChild(this.renderer.domElement);
  }

  systemWillUnmount(): void {
    window.removeEventListener('resize', this.handleWindowResize);

    this.entityObserver.unsubscribe('onadd', this.handleEntityAdd);
    this.entityObserver.unsubscribe('onremove', this.handleEntityRemove);

    this.lightSubsystem.unmount();

    this.window.removeChild(this.renderer.domElement);
  }

  private handleEntityAdd = (entity: Entity): void => {
    const renderable = entity.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    const material = createMaterial(renderable.material.type);
    const geometry = new PlaneGeometry(renderable.width, renderable.height);
    const object = new Mesh(geometry, material);

    object.userData.entity = entity;
    this.entitiesMap[entity.getId()] = object.id;

    this.renderScene.add(object);
  };

  private handleEntityRemove = (entity: Entity): void => {
    const entityId = entity.getId();
    const object = this.renderScene.getObjectById(this.entitiesMap[entityId]);

    if (object) {
      this.renderScene.remove(object);
    }

    this.entitiesMap = filterByKey(this.entitiesMap, entityId);
  };

  private handleWindowResize = (): void => {
    this.viewWidth = this.window.clientWidth;
    this.viewHeight = this.window.clientHeight;

    this.currentCamera.left = this.viewWidth / -2;
    this.currentCamera.top = this.viewHeight / 2;
    this.currentCamera.right = this.viewWidth / 2;
    this.currentCamera.bottom = this.viewHeight / -2;

    this.currentCamera.updateProjectionMatrix();

    this.renderer.setSize(this.viewWidth, this.viewHeight);
    this.updateScreenScale();
  };

  private updateScreenScale(): void {
    const screenSize = Math.sqrt(
      Math.pow(this.viewWidth, 2) + Math.pow(this.viewHeight, 2),
    );
    const avaragingValue = 1 - this.scaleSensitivity;
    const normalizedSize = screenSize - ((screenSize - STD_SCREEN_SIZE) * avaragingValue);

    this.screenScale = normalizedSize / STD_SCREEN_SIZE;
  }

  private updateCamera(): void {
    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as Entity;
    const transform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME) as Camera;

    const scale = zoom * this.screenScale;

    this.currentCamera.zoom = scale;
    // TODO: Figure out how to set up camera correctly to avoid negative transform by y axis
    this.currentCamera.position.set(transform.offsetX, -transform.offsetY, 1);

    this.currentCamera.updateProjectionMatrix();
  }

  private updateEntities(): void {
    this.entityObserver.getList().forEach((entity, index) => {
      const transform = entity.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const renderable = entity.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

      const object = this.renderScene.getObjectById(
        this.entitiesMap[entity.getId()],
      ) as Mesh;

      if (!object) {
        return;
      }

      object.visible = !renderable.disabled;
      if (!object.visible) {
        return;
      }

      object.scale.set(
        (renderable.flipX ? -1 : 1) * transform.scaleX,
        (renderable.flipY ? -1 : 1) * transform.scaleY,
        1,
      );
      object.rotation.set(0, 0, MathOps.degToRad(transform.rotation + renderable.rotation));
      object.position.set(transform.offsetX, transform.offsetY, 0);
      object.renderOrder = index;

      if (!this.textureMap[renderable.src]) {
        return;
      }

      const material = object.material as MeshStandardMaterial;
      const texture = this.textureMap[renderable.src][renderable.currentFrame || 0];

      updateMaterial(renderable.material.type, material, renderable.material.options, texture);

      if (renderable.fit === 'repeat') {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;

        texture.repeat.set(
          renderable.width / (texture.image as HTMLImageElement).width,
          renderable.height / (texture.image as HTMLImageElement).height,
        );
      } else {
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;

        texture.repeat.set(1, 1);
      }
    });
  }

  update(): void {
    this.entityObserver.fireEvents();

    this.updateCamera();

    this.lightSubsystem.update();

    this.entityObserver.getList().sort(this.sortFn);
    this.updateEntities();

    this.renderer.render(this.renderScene, this.currentCamera);
  }
}