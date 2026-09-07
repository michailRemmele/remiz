---
title: "Glossary"
description: "Short definitions of the terms used throughout this documentation."
---

Dacha borrows vocabulary from entity-component-system architectures but does not use it
identically. Each term below is defined as Dacha uses it.

### Actor

The main object in a scene: a container of components with an id, a name and optional
children. Every actor is created with a `Transform`. Where a classic ECS says *entity*,
Dacha says *actor*. See [actors](/concepts/actors/).

### ActorQuery

A live set of the actors in a scene matching a filter — either a list of components or a
predicate. It keeps itself up to date as actors and components come and go, so a system
does not have to track them by hand. `ActorCollection` is the same idea with a
components-only filter. See [systems](/concepts/systems/).

### Asset

A named piece of project data: either a reference to a media file with its metadata — a
texture, an audio clip, a bitmap font — or plain data described by the schema of its kind.
Assets are listed in the configuration, and the classes for the kinds you use are passed to
the engine. See [the configuration](/concepts/configuration/).

### Behavior

A logic unit attached to one actor, with its own `update` and `fixedUpdate`. A system is a
single instance acting on many actors; a behavior is one instance per actor. Behaviors are
attached through the `Behaviors` component and run by the behavior system. See
[writing a behavior](/writing-game-code/behaviors/).

### Component

Plain data attached to an actor — a position, a sprite, a collider. Components hold no
logic; systems and behaviors read and write them. Every component class carries a static
`componentName`, which is the string the configuration refers to it by. See
[writing a component](/writing-game-code/components/).

### Configuration

The description of the whole game: scenes, templates, systems, assets, global options and
the start scene. It is one JSON file, written by the editor and read by the engine at
startup. See [the configuration](/concepts/configuration/).

### Entity

The base class that Actor, Scene and World share. It provides the id, the name, the
parent/child hierarchy and the ability to send and receive events. You rarely refer to it
directly. See [ECS in Dacha](/concepts/ecs/).

### Fixed update

The simulation phase of the loop. `fixedUpdate` runs at a fixed rate that does not follow
the frame rate — several times in one frame, once, or not at all — so that a game behaves
the same whatever the display does. Its counterpart, `update`, runs once per rendered
frame. See [the game loop](/concepts/game-loop/).

### Global options

Settings that apply to the whole game rather than to a single system: sorting layers,
performance settings, physics and audio defaults. They live under `globalOptions` in the
configuration, and under **Project settings** in the editor. See
[the configuration](/concepts/configuration/).

### Scene

A level, a menu, or any other distinct game state, and the container the actors in it live
in. One scene is active at a time, and scene systems are created and destroyed along with
it. See [scenes and the world](/concepts/scenes-and-world/).

### Sorting layer

A named layer deciding what is drawn in front of what. Every drawable component names one,
and the list of layers is a global option. See [rendering](/systems/rendering/).

### Start scene

The scene the engine opens with — `startSceneId` in the configuration, **Start Scene** in
the editor's Project settings. `play()` refuses to start without one. See
[the configuration](/concepts/configuration/).

### System

A logic unit that runs on every frame, in `update`, in `fixedUpdate`, or in both. There are
two kinds. A **scene system** is created and destroyed with the scene it belongs to, and
holds game logic. A **world system** outlives scene changes, and is what rendering, input
and audio are built as. Every system class carries a static `systemName`. See
[systems](/concepts/systems/).

### System API

A typed handle that one system publishes on the world so other systems and behaviors can
call into it — physics queries, camera lookups, interpolation. Retrieved with
`world.systemApi.get(…)`. See [systems](/concepts/systems/).

### Template

A reusable actor blueprint, including its children and their components. An actor placed
from a template keeps a link back to it, and a template can be spawned at runtime with
`actorSpawner.spawn(templateId)`. See [templates](/editor/templates/).

### World

The root container for every scene. It also carries the system API registry and the
world-wide events. There is one per running engine. See
[scenes and the world](/concepts/scenes-and-world/).
