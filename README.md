# YVRGRC Website

Static GitHub Pages site for `https://yvrgrc.ca/`.

## This Repo's Role

This repo is the canonical source for the YVRGRC website. It currently hosts a simple root landing page plus standalone static sections:

- `/` - simple YVRGRC landing page
- `/trackdays/` - Track days index
- `/trackdays/2026/jun15/` - Track Day 2026 June 15 event page
- `/trackdays/2026/mar13/` - Track Day 2026 March 13 event page
- `/trackday2026/` - legacy redirect to the March 13, 2026 event page
- `/announcements/` - club announcements

The custom domain is configured by `CNAME` and should remain:

```text
yvrgrc.ca
```

## Structure

The site is intentionally plain HTML, CSS, and vanilla JavaScript with no build step:

```text
index.html
CNAME
trackdays/
  index.html
  shared/
    app.js
    styles.css
    assets/
  2026/
    mar13/
      index.html
      content.js
      assets/
announcements/
  index.html
  say-phin-lim.html
  styles.css
  assets/
```

## Public URLs

- `https://yvrgrc.ca/`
- `https://yvrgrc.ca/trackdays/`
- `https://yvrgrc.ca/trackdays/2026/jun15/`
- `https://yvrgrc.ca/trackdays/2026/mar13/`
- `https://yvrgrc.ca/trackday2026/` - legacy redirect
- `https://yvrgrc.ca/announcements/`
- `https://yvrgrc.ca/announcements/say-phin-lim.html`

## Track Day Content

Track day event pages live under `trackdays/<year>/<short-month><day>/`, using lowercase short month names like `mar13`, `may13`, and `sep7`.

Editable event content stays centralized in each event's `content.js`, inside `window.trackDayEventContent`.

For thumbnail audio, edit `window.trackDayEventContent.overviewAudio`:

- Set `src` to your audio file path inside the event's `assets/` directory (for example `assets/audio/theme.mp3`).
- Keep `src: ""` to hide the unmute button.
- `buttonLabels`, `loop`, and `initialVolume` are optional.

## Announcements Content

The announcements section is a static bundle under `announcements/`. Add new announcement pages beside `say-phin-lim.html`, then link them from `announcements/index.html`.
