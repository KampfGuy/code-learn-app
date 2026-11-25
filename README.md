# CodeLearn - Interactive Coding Learning App

A simple, beautiful web app to learn the basics of HTML, CSS, and JavaScript through interactive lessons.

## Features

- 5 progressive lessons covering HTML structure, CSS styling, JS variables, functions, and DOM manipulation
- Live code editor with preview (for HTML/CSS) and console output (for JavaScript)
- Progress tracking saved in your browser
- Mobile-friendly design
- Completely client-side — no server needed

## How to Use

1. Open `index.html` in any modern web browser
2. Select a lesson from the sidebar
3. Edit the code in the editor
4. Click **Run Code** to see the result
5. Complete the challenge to mark the lesson done
6. Use **Next Lesson** to continue

## Deploying to GitHub Pages

1. Go to your repository Settings → Pages
2. Set Source to **Deploy from a branch**
3. Select the `main` branch and `/ (root)` folder
4. Save — your app will be live at `https://kampfguy.github.io/code-learn-app/`

## Lessons Included

1. **HTML Basics** — Structure with headings and paragraphs
2. **CSS Styling** — Colors and font sizes
3. **JavaScript Variables** — Storing and logging data
4. **JavaScript Functions** — Reusable code blocks
5. **DOM Manipulation** — Changing page content with clicks

## Extending the App

Add more lessons by editing the `lessons` array in `script.js`. Each lesson has:
- `content`: HTML explanation
- `starter`: Starting code
- `type`: `"html"` or `"js"`
- `check`: Function that returns true when the challenge is complete

## License

MIT License — Feel free to use, modify, and share!

---

Made with ❤️ for learning to code.