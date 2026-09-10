---
title: "Interface tour"
description: "What each panel of the editor does."
---

The editor is laid out around a viewport, with an explorer for the project tree, an
inspector for the selected object, a toolbar for the editing tools, and a bottom bar for
status and playback.

## What this page will cover

- The viewport and the editing tools
- The explorer and the project tree
- The inspector and the selected object
- The toolbar
- The bottom bar
- Settings, and what is stored per project

## The viewport is the real engine

The editing surface is not a preview drawn by the editor. It is a Dacha world. It runs the
engine's own `Renderer` and `CameraSystem` over your scene's actors, and the editor adds the
pointer, hand, zoom and selection tools as ordinary systems and components.

That is why a sprite is positioned, layered, tinted and blended exactly as it will be in the
game. Sorting layers, camera zoom, opacity, blending modes and shaders all resolve the same
way, because none of it is reimplemented.

What that world does not run is your code. It never constructs `MovementSystem`. No behavior
ticks, no collision is resolved, and there is no play button. The line is deliberate: the
editor edits, the browser runs.

This has a practical consequence. A component with no visual representation is invisible in
the viewport by design. You place it and set its fields, then find out what it does in the tab
where the game is [running](/editor/running-and-debugging/).
