import type { Entity } from '../../../../engine/entity';
import type { Renderable } from '../../../components/renderable';
import { RENDERABLE_COMPONENT_NAME } from '../consts';

import type { SortFn } from './types';

export const sortByFit: SortFn = (a: Entity, b: Entity): number => {
  const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
  const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

  if (aRenderable.fit > bRenderable.fit) {
    return 1;
  }

  if (aRenderable.fit < bRenderable.fit) {
    return -1;
  }

  return 0;
};