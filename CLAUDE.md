# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado

Proyecto en fase inicial: el README indica el objetivo (Arkanoid jugable en HTML, CSS y JS, **cero dependencias**) y que aún no se implementa. Solo existen assets; no hay `index.html`, build, linter ni tests. Abrir el juego = abrir el HTML en el navegador (sin bundler ni servidor obligatorio).

## Assets

- `assets/spritesheet-breakout.png`: spritesheet único. `assets/spritesheet.js` define las coordenadas (`sx, sy, sw, sh`) de cada sprite como globals (`SPRITES`, `EXPLOSION_FRAMES`, `EXPLOSION_DURATION = 150` ms), sin módulos ES: cargarlo con `<script>` clásico antes del código del juego.
- API de dibujo (canvas 2D): `loadSpritesheet(cb)` (carga async, copia la imagen a un canvas offscreen; llamar antes de dibujar), `drawSprite(ctx, name, x, y, w, h)` (`name` = `paddle`, `ball` o `block_<color>`) y `drawFrame(ctx, frame, x, y, w, h)` (para frames de explosión). Ambos no hacen nada hasta que cargue. La ruta `assets/spritesheet-breakout.png` es relativa al HTML.
- Bloques y frames de explosión por color: red, cyan, green, magenta, yellow, hotpink, gray. Los frames de `gray` reutilizan los de `red` (mismas coordenadas).
- `assets/sounds/`: `ball-bounce.mp3`, `break-sound.mp3`.

## Skills del proyecto (`.claude/skills/`)

- `engineering/spec` y `engineering/spec-impl`: flujo spec-driven. `/spec` guarda specs en `specs/NN-slug.md`; `/spec-impl NN-slug` implementa una spec `Approved` en la rama `spec-NN-slug`, pausando para revisar diffs, sin commitear. Requieren repo git (el directorio aún no lo es).
- `neko`: voz de gatito kawaii (activar con `/neko`); no aplica a código, commits ni docs.
