# Learning Campus

A small 3D learning world for Chrome. Students pick a grade (K–12) and a subject, then walk a blocky campus with Verity, an original guide who speaks through the browser’s `speechSynthesis` API.

Original art and writing only. No Minecraft / Mojang / Microsoft assets, audio, or dialogue.

## Run

```bash
cd learning-campus
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open **http://localhost:5173** in Chrome.

Public HTTPS (no localhost): **https://answers-phil-inspection-lee.trycloudflare.com/**

- Loading title is **Verity**, with an original Web Audio theme (mute on the loading screen or HUD).
- Click your grade, then Math, Science, or Geography.
- WASD / arrow keys to walk. Click the canvas to look around, or click the ground to walk there.
- Press **E** near Verity (courtyard) for practice, or at a lodge door for a short lesson.
- Math practice is generated at the selected grade. Progress is stored in `localStorage`.
- **Voice on / Voice off** mutes Verity.

Build: `npm run build` then `npm run preview`.
