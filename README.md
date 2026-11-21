# Spot the Difference — Sunny Park Hunt

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/AhmadTurki182/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/AhmadTurki182/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A complete, original spot-the-difference game for [make.fun's best spot the difference game bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451). Two near-identical pictures side by side, seven sneaky changes per level, green rings on the differences you find, a counter of how many are still hiding, a ticking clock, hints, and a score that rewards sharp eyes.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with any static server). No network request, no build step, no borrowed art — every picture is drawn in code on a canvas.

- **Mouse:** click a difference on either picture. A green ring and tick mark it; a red cross marks a wrong guess (-25 points, -5 seconds).
- **Keyboard:** arrow keys move the crosshair, Enter / Space checks a spot, H asks for a hint, N goes to the next level, R restarts, M toggles sound.
- **Goal:** find all 7 differences before the 3-minute timer runs out. Each find scores 100 + seconds left; finishing early adds a time bonus.

## Three levels

1. **Sunny Park** — a missing apple, a vanished cloud, a flower that changed colour, and more.
2. **Sandy Beach** — the sun in sunglasses, a teal sail, a castle flag that disappeared.
3. **Cozy Kitchen** — curtains that changed colour, a clock that lost a hand, a cat that lost its tail.

Each level is drawn procedurally in `game/src/scenes.js` (canvas shapes only), and the right-hand picture applies that level's seven changes. Sounds are small WebAudio beeps, generated at runtime — no audio files.

## Files

- `game/index.html` — page, HUD, title / win / time-up overlays.
- `game/style.css` — layout and look.
- `game/src/scenes.js` — the three original scenes and their seven differences each.
- `game/src/main.js` — rounds, timer, score, hints, mouse + keyboard input, markers, sounds.
- `main.ts` — the hand-in program (Node 22, standard library only): copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the kit's `vendor/makefun-game.ts`.
- `screenshots/` — real renders of the game itself, taken in a browser.

## Run it / hand it in

```sh
# play: open game/index.html in desktop Chrome
# hand in:
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/dossier.json
```

---

<sub>Entered on [make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
