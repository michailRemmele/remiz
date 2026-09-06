import {
  Engine,
  Renderer,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  UIBridge,
  Animator,
  Transform,
  Sprite,
  Shape,
  Camera,
  KeyboardControl,
  Texture,
  Animatable,
} from 'dacha';
import type { SystemConstructor, ComponentConstructor } from 'dacha';

import { importAll } from './import-all';

import config from '../data/data.json';

const gameComponents = importAll(
  import.meta.glob('./**/*.component.ts', { eager: true }),
) as ComponentConstructor[];
const gameSystems = importAll(
  import.meta.glob('./**/*.system.ts', { eager: true }),
) as SystemConstructor[];

const engine = new Engine({
  config,
  systems: [
    Renderer,
    CameraSystem,
    KeyboardInputSystem,
    KeyboardControlSystem,
    UIBridge,
    Animator,
    ...gameSystems,
  ],
  components: [
    Transform,
    Sprite,
    Shape,
    Camera,
    KeyboardControl,
    Animatable,
    ...gameComponents,
  ],
  assets: [Texture],
  resources: {
    [UIBridge.systemName]: {
      loadUI: () => import('./ui'),
    },
  },
});

void engine.play();
