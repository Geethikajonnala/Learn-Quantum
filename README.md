# Learn Quantum

A standalone interactive-book style learning experience for quantum computing. Built with semantic HTML, CSS, and vanilla JavaScript so it can later be integrated into the SIA LMS Portal without bringing along a framework dependency.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

- `index.html` - accessible application shell and layout regions
- `styles.css` - responsive visual system and interactive component styles
- `app.js` - curriculum data, routing, interactive demos, quiz, search, and local progress tracking
