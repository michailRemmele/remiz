---
title: "The editor's role"
description: "What the editor is to a running game, and what it deliberately leaves alone."
---

The editor is a client of the configuration, not a layer over your game. It reads the file the
engine reads, writes it back, and has no other hold on your project.

[How it works](/introduction/how-it-works/) covers the two programs and the file they meet at.
[Scripts & auto-registration](/writing-game-code/auto-registration/) covers how the editor finds
your classes. This page is about what that arrangement means in practice.

## The viewport is the real engine, and not your game

The editing surface is not a preview drawn by the editor. It is a Dacha world. It runs the
engine's own `Renderer` and `CameraSystem` over your scene's actors. The editor adds the pointer,
hand, zoom and selection tools as ordinary systems and components.

That is why a sprite is positioned, layered, tinted and blended exactly as it will be in the
game. Sorting layers, camera zoom, opacity, blending modes and shaders all resolve the same way,
because none of it is reimplemented.

What that world does not run is your code. It never constructs `MovementSystem`. No behavior
ticks, no collision is resolved, and there is no play button. The line is deliberate: the editor
edits, the browser runs.

This has a practical consequence. A component with no visual representation is invisible in the
viewport by design. You place it and set its fields, then find out what it does in the tab where
the game is [running](/editor/running-and-debugging/).

## What it writes

Two things. The configuration, on save. And script files when you ask it to generate a component,
system, behavior, shader or filter effect. Those land in your source, and the editor then leaves
them alone.

It builds nothing, bundles nothing and transforms nothing. A file dropped in the assets directory
is usable as it is, because that is where the game loads it from too. Your toolchain owns the
build, and the editor never enters it.

## What it costs your game

Nothing at runtime. The decorators are the one part of the editor that a game's own code imports.
Outside the editor they do almost nothing. Each one sets the static name on the class and
returns:

```ts
import { Component } from 'dacha';
import { DefineComponent, DefineField } from 'dacha-workbench/decorators';

interface HealthConfig {
  points: number;
}

@DefineComponent({ name: 'Health' })
export default class Health extends Component {
  @DefineField({ initialValue: 100 })
  points: number;

  constructor(config: HealthConfig) {
    super();

    this.points = config.points;
  }
}
```

In a built game, `@DefineComponent` sets `Health.componentName` and stops. `@DefineField` does
nothing at all. The decorators build field and widget metadata only when the editor is the thing
importing the class, which they detect at runtime.

:::note
This is also why the decorators are planned to move into the `dacha` package. Naming a class is
an engine concern, and a game should not have to depend on the editor to do it. See the
[migration notes](/reference/migration/).
:::

## If you never open it

The game still runs. `data/data.json` is plain JSON with a documented shape, and the engine
neither knows nor cares what produced it. An editor, a script, a level generator or your hands
all work. Nothing in the engine imports the editor, and no runtime behavior depends on one having
been used.

The editor is worth using because arranging a scene is faster when you can see it. That is a job
of judging where a thing looks right, not of calculating where it goes. It is not required.
