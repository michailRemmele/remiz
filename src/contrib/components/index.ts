import Camera from './camera/camera';
import KeyboardControl from './keyboardControl/keyboardControl';
import ColliderContainer from './colliderContainer/colliderContainer';
import { RigidBody } from './rigid-body';
import Animatable from './animatable/animatable';
import Renderable from './renderable/renderable';
import { Transform } from './transform';
import { MouseControl } from './mouse-control';
import { Script } from './script';

export default {
  camera: Camera,
  keyboardControl: KeyboardControl,
  colliderContainer: ColliderContainer,
  rigidBody: RigidBody,
  animatable: Animatable,
  renderable: Renderable,
  transform: Transform,
  mouseControl: MouseControl,
  script: Script,
};
