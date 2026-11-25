# CodeLearn - Interactive Coding Learning App

A simple, beautiful web app to learn the basics of HTML, CSS, and JavaScript through interactive lessons **plus a free coding playground**.

**Live app:** [https://kampfguy.github.io/code-learn-app/](https://kampfguy.github.io/code-learn-app/)

## Features

- 5 progressive lessons covering HTML structure, CSS styling, JS variables, functions, and DOM manipulation
- **Free Playground** mode — write any HTML/CSS/JS and see it live
- Live code editor with preview (for HTML/CSS) and console output (for JavaScript)
- Progress tracking saved in your browser
- Fully responsive — works great on Chromebooks, tablets, and phones
- Completely client-side — no server needed

## How to Use

1. Open the live app: [https://kampfguy.github.io/code-learn-app/](https://kampfguy.github.io/code-learn-app/)
2. Use **Lessons** mode to follow guided tutorials
3. Switch to **Free Playground** to experiment with any code you want
4. Edit the code and click **Run Code**

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

Made with ❤️ for learning to code on any device (including Chromebooks).