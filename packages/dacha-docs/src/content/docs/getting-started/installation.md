---
title: "Installation & setup"
description: "Scaffold a dacha project, run it, and open the editor."
---

The fastest way to start is the project scaffolder. It writes a complete project — a
playable scene, an entry point, a bundler and the editor configuration — and then gets out
of the way. Nothing from the scaffolder remains in your project afterwards.

## Prerequisites

Node 22.12 or newer.

## Create a project

```bash
npm create dacha@latest my-game
cd my-game
npm install
npm run dev
```

The same works with any package manager: `yarn create dacha`, `pnpm create dacha`,
`bun create dacha`.

What you get is a running game: a sprite you move with WASD, a camera following it, and an
HTML overlay with a restart button. Roughly a hundred lines of your own code, four
dependencies.

:::note
If `npm run dev` fails to start, run `npm approve-scripts esbuild`. npm 11 withholds
package install scripts by default, and Vite needs esbuild's.
:::

## What was generated

| Path | What it is |
| --- | --- |
| `data/data.json` | The game: scenes, actors, systems. Written by the editor |
| `data/assets/` | Textures, audio and fonts — also Vite's `publicDir` |
| `src/index.ts` | Collects your classes and starts the engine |
| `src/game/` | Your components and systems |
| `src/ui/` | The HTML overlay |
| `dacha-workbench.config.cjs` | Tells the editor where the above lives |

[Project structure](/getting-started/project-structure/) goes through this in full.

## Open the editor

```bash
npm run editor
```

The editor opens against `data/data.json`, so the scene you just played is there to take
apart. Run it alongside `npm run dev` and edit the game while it runs.

## Adding dacha to an existing project

The scaffolder is a convenience, not a requirement. dacha is two ordinary npm packages:

```bash
npm i dacha dacha-workbench
```

`dacha` is the engine your game imports. `dacha-workbench` provides both the editor
application and the decorators your project uses to describe its classes to that editor.

Installing `dacha-workbench` runs a `postinstall` step that packages the Electron
application. If you only need the library exports — in a CI job that just typechecks, for
instance — skip it:

```bash
DACHA_SKIP_APP_BUILD=1 npm i dacha dacha-workbench
```

Then create the two things the editor needs: a `data/data.json` holding your configuration,
and a `dacha-workbench.config.js` pointing at it.

:::caution
The editor loads that file with `require`, so it must be CommonJS. In a project whose
`package.json` declares `"type": "module"` — which the generated project does, and most
Vite projects do — a `.js` file is an ES module, `module.exports` silently produces an
empty object, and **the editor fails to open with no error message**. Name the file
`dacha-workbench.config.cjs` there and point the editor at it:

```bash
npx dacha-workbench --config dacha-workbench.config.cjs
```

That is what the generated project's `npm run editor` script does.
:::

```js
module.exports = {
  projectConfig: 'data/data.json',
  assetsRoot: 'data/assets',
  autoSave: true,
};
```

The editor looks for that file in the directory you run it from. If it lives elsewhere,
point at it:

```bash
npx dacha-workbench --config ./config/workbench.config.js
```

Without a configuration file the command exits with an error naming that flag. See the
[configuration reference](/editor/config-reference/) for every key the file accepts.

You will also need a bundler. dacha is distributed as ESM with no CommonJS build, so it is
consumed by a bundler rather than by Node directly. The generated project uses Vite; the
[auto-registration convention](/writing-game-code/auto-registration/) works with any
bundler that can glob a directory.

## Serving the game

The engine relies on browser APIs that are only available in a
[secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).
Your game must be served over HTTPS or from `localhost`. Opening the built `index.html`
directly from the filesystem will not work.

## Next

- [Your first scene](/getting-started/first-scene/) builds a scene of your own in the editor.
- [Project structure](/getting-started/project-structure/) explains the layout and the
  conventions that go with it.
