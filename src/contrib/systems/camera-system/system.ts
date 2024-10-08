import { MathOps } from '../../../engine/math-lib';
import { System } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import type { SystemOptions } from '../../../engine/system';
import type { Actor } from '../../../engine/actor';
import { ActorCollection } from '../../../engine/actor';
import { Camera } from '../../components/camera';
import { getWindowNode } from '../../utils/get-window-node';
import { SetCamera } from '../../events';
import type { SetCameraEvent } from '../../events';

import { CameraService } from './service';

export const STD_SCREEN_SIZE = 1080;

interface CameraSystemOptions extends SystemOptions {
  initialCamera: string
  windowNodeId: string
  scaleSensitivity: number
}

export class CameraSystem extends System {
  private actorCollection: ActorCollection;
  private scene: Scene;
  private window: Window & HTMLElement;
  private scaleSensitivity: number;
  private cameraService: CameraService;

  constructor(options: SystemOptions) {
    super();

    const {
      initialCamera,
      windowNodeId,
      scaleSensitivity,
      scene,
    } = options as CameraSystemOptions;

    const windowNode = getWindowNode(windowNodeId);

    this.actorCollection = new ActorCollection(scene, {
      components: [
        Camera,
      ],
    });
    this.scene = scene;
    this.window = windowNode as (Window & HTMLElement);

    this.scaleSensitivity = MathOps.clamp(scaleSensitivity, 0, 1);

    const currentCamera = this.actorCollection.getById(initialCamera);

    if (!currentCamera) {
      throw new Error(`Could not set camera with id ${initialCamera} for the scene`);
    }

    this.cameraService = new CameraService({ camera: currentCamera });
    scene.addService(this.cameraService);

    this.setCamera(currentCamera);
  }

  mount(): void {
    this.handleCameraUpdate();
    window.addEventListener('resize', this.handleCameraUpdate);
    this.scene.addEventListener(SetCamera, this.handleSetCamera);
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleCameraUpdate);
    this.scene.removeEventListener(SetCamera, this.handleSetCamera);
  }

  private handleSetCamera = (event: SetCameraEvent): void => {
    const { actorId } = event;
    const newCamera = this.actorCollection.getById(actorId);

    if (!newCamera) {
      throw new Error(`Could not set camera with id ${actorId} for the scene`);
    }

    this.setCamera(newCamera);
  };

  private handleCameraUpdate = (): void => {
    const width = this.window.innerWidth || this.window.clientWidth;
    const height = this.window.innerHeight || this.window.clientHeight;

    this.updateCameraWindowSize(width, height);
    this.updateScreenScale(width, height);
  };

  private updateCameraWindowSize(width: number, height: number): void {
    const camera = this.cameraService.getCurrentCamera();

    const cameraComponent = camera.getComponent(Camera);
    const { windowSizeX, windowSizeY } = cameraComponent;

    if (width !== windowSizeX || height !== windowSizeY) {
      cameraComponent.windowSizeX = width;
      cameraComponent.windowSizeY = height;
    }
  }

  private updateScreenScale(width: number, height: number): void {
    const screenSize = Math.sqrt(width ** 2 + height ** 2);
    const avaragingValue = 1 - this.scaleSensitivity;
    const normalizedSize = screenSize - ((screenSize - STD_SCREEN_SIZE) * avaragingValue);

    const camera = this.cameraService.getCurrentCamera();
    const cameraComponent = camera.getComponent(Camera);

    cameraComponent.screenScale = normalizedSize / STD_SCREEN_SIZE;
  }

  private setCamera(camera: Actor): void {
    this.cameraService.setCurrentCamera(camera);
    this.handleCameraUpdate();
  }
}

CameraSystem.systemName = 'CameraSystem';
