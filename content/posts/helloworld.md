+++
title = "Why I Switched to a 60% Keyboard and Never Looked Back"
date = 2026-05-22
draft = false
tags = ["tooling", "hardware", "meta"]
+++

Three months ago I swapped my full-size mechanical keyboard for a 60% layout. My coworkers thought I was being contrarian. My wrists think otherwise.

## What even is a 60% keyboard?

A 60% drops everything past the `B` key row — no function row, no arrow keys, no numpad, no home/end cluster. What's left is the core 61 keys you actually type with.

Everything you lose gets remapped to a function layer. Arrow keys are `Fn + WASD`. `F1–F12` live on the number row. It sounds painful. It isn't.

## The real reason to switch

It's not aesthetics (though the desk space is nice). It's **travel distance**.

With a full-size board, reaching for arrows, backspace, or escape means your hand leaves home row. Over a day of coding that's thousands of micro-movements. A 60% with good layers keeps your hands planted.

> "The best keyboard is the one that gets out of the way."
> — something I definitely didn't make up

## My current layout

I'm running [QMK firmware](https://qmk.fm) on a KBD67 Lite. My base layer is standard QWERTY, with one key change: **caps lock is now escape/ctrl**.

Tap it → `Escape`. Hold it → `Ctrl`. This single remap is worth the price of the whole keyboard if you use Vim or any terminal.

```c
// QMK: tap for Esc, hold for Ctrl
[0] = LAYOUT(
  MT(MOD_LCTL, KC_ESC), KC_Q, KC_W, ...
)
```

My function layer handles the rest:

| Key combo | Output |
|---|---|
| `Fn + WASD` | Arrow keys |
| `Fn + Q` | F1 |
| `Fn + 1–0` | F1–F10 |
| `Fn + Tab` | Caps Lock |

## What I miss

Honestly? Almost nothing. The one real annoyance is **pair programming** — someone sits down to type and immediately hits a wall when arrows don't work. I keep a cheat sheet taped to my monitor.

## Should you switch?

If you spend most of your day in a terminal or editor: yes, try it. The muscle memory takes about two weeks to rebuild. After that it's hard to go back to hunting for keys at the edges of a full-size board.

If you do a lot of number entry or live in spreadsheets: probably not worth it. Keep your numpad.

---

The keyboard I'm using: KBD67 Lite R4, Gateron Yellow switches, lubed with Krytox 205g0. Total cost was around $120 — cheaper than most "productivity" software subscriptions.