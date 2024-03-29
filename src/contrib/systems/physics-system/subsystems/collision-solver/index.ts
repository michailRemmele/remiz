import { Vector2 } from '../../../../../engine/mathLib';
import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import type { PhysicsSystemOptions } from '../../types';
import { Collision, AddForce, StopMovement } from '../../../../events';
import type { CollisionEvent } from '../../../../events';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  private scene: Scene;
  private gravitationalAcceleration: number;

  constructor(options: SystemOptions) {
    const { scene, gravitationalAcceleration } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.gravitationalAcceleration = gravitationalAcceleration;
  }

  mount(): void {
    this.scene.addEventListener(Collision, this.handleCollision);
  }

  unmount(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const { actor1, actor2, mtv1 } = event;

    if (!this.validateCollision(actor1, actor2)) {
      return;
    }

    this.addReactionForce(actor1, mtv1);
  };

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  private addReactionForce(actor: Actor, mtv: Vector2): void {
    const rigidBody = actor.getComponent(RigidBody);
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this.gravitationalAcceleration);

      actor.dispatchEvent(AddForce, {
        value: reactionForce,
      });
      actor.dispatchEvent(StopMovement);
    }
  }
}
