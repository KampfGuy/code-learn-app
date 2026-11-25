const lessons = [
    {
        id: 1,
        title: "HTML Basics",
        content: `<h2>HTML Basics</h2>
<p>HTML is the structure of web pages. Tags like <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;button&gt;</code> create elements.</p>
<p><strong>Try it:</strong> Create a heading and a paragraph that says "Hello, CodeLearn!"</p>
<ul>
<li>Use &lt;h1&gt; for the heading</li>
<li>Use &lt;p&gt; for the paragraph</li>
</ul>`,
        starter: `<h1>My First Page</h1>
<p>Hello, CodeLearn!</p>`,
        type: "html",
        check: (code) => code.includes("<h1") && code.includes("<p") && code.toLowerCase().includes("hello")
    },
    {
        id: 2,
        title: "CSS Styling",
        content: `<h2>CSS Styling</h2>
<p>CSS makes things look good. You can change colors, fonts, and layout.</p>
<p><strong>Try it:</strong> Style the heading to be blue and the paragraph to be larger.</p>
<p>Add a &lt;style&gt; tag with CSS rules.</p>`,
        starter: `<style>
h1 {
  color: blue;
}
p {
  font-size: 24px;
}
</style>
<h1>Styled Heading</h1>
<p>This text is bigger!</p>`,
        type: "html",
        check: (code) => code.includes("color") && code.includes("font-size")
    },
    {
        id: 3,
        title: "JavaScript Variables",
        content: `<h2>JavaScript Variables</h2>
<p>Variables store data. Use <code>let</code> or <code>const</code>.</p>
<p><strong>Try it:</strong> Create a variable called <code>name</code> with your name, then use <code>console.log</code> to print a greeting.</p>
<p>Example: <code>let name = "Kampf"; console.log("Hello " + name);</code></p>`,
        starter: `let name = "Kampf";
console.log("Hello " + name);`,
        type: "js",
        check: (code) => code.includes("let") || code.includes("const") || code.includes("var")
    },
    {
        id: 4,
        title: "JavaScript Functions",
        content: `<h2>JavaScript Functions</h2>
<p>Functions are reusable blocks of code.</p>
<p><strong>Try it:</strong> Write a function that adds two numbers and logs the result.</p>
<p>Example: <code>function add(a, b) { console.log(a + b); } add(5, 3);</code></p>`,
        starter: `function add(a, b) {
  console.log(a + b);
}
add(10, 20);`,
        type: "js",
        check: (code) => code.includes("function") && code.includes("console.log")
    },
    {
        id: 5,
        title: "DOM Manipulation",
        content: `<h2>Changing the Page with JS</h2>
<p>JavaScript can change HTML elements.</p>
<p><strong>Try it:</strong> Create a button that changes text when clicked.</p>
<p>Use <code>document.getElementById</code> and <code>onclick</code>.</p>`,
        starter: `<button id="btn">Click Me</button>
<p id="msg">Waiting...</p>
<script>
document.getElementById("btn").onclick = function() {
  document.getElementById("msg").innerText = "You clicked the button!";
};
</script>`,
        type: "html",
        check: (code) => code.includes("getElementById") && code.includes("onclick")
    }
];

let currentLesson = null;
let completed = JSON.parse(localStorage.getItem("codelearn-completed") || "[]");

function init() {
    const list = document.getElementById("lesson-list");
    lessons.forEach(lesson => {
        const li = document.createElement("li");
        li.textContent = lesson.title;
        li.dataset.id = lesson.id;
        if (completed.includes(lesson.id)) li.classList.add("completed");
        li.onclick = () => loadLesson(lesson.id);
        list.appendChild(li);
    });
    updateProgress();
}

function loadLesson(id) {
    currentLesson = lessons.find(l => l.id === id);
    document.querySelectorAll("#lesson-list li").forEach(li => li.classList.remove("active"));
    document.querySelector(`[data-id="${id}"]`).classList.add("active");
    
    document.getElementById("lesson-content").innerHTML = currentLesson.content;
    document.getElementById("editor-section").style.display = "block";
    document.getElementById("preview-section").style.display = "block";
    document.getElementById("code-editor").value = currentLesson.starter;
    document.getElementById("console-output").textContent = "";
    document.getElementById("preview").srcdoc = "";
}

function runCode() {
    const code = document.getElementById("code-editor").value;
    const preview = document.getElementById("preview");
    const consoleOut = document.getElementById("console-output");
    
    if (currentLesson.type === "html") {
        preview.srcdoc = code;
        consoleOut.textContent = "HTML preview updated.";
    } else if (currentLesson.type === "js") {
        consoleOut.textContent = "";
        const originalLog = console.log;
        console.log = (...args) => {
            consoleOut.textContent += args.join(" ") + "\n";
            originalLog.apply(console, args);
        };
        try {
            eval(code);
            consoleOut.textContent += "\n\u2705 Code ran successfully!";
        } catch (e) {
            consoleOut.textContent += "\n\u274c Error: " + e.message;
        }
        console.log = originalLog;
    }
    
    // Check if completed
    if (currentLesson.check && currentLesson.check(code)) {
        if (!completed.includes(currentLesson.id)) {
            completed.push(currentLesson.id);
            localStorage.setItem("codelearn-completed", JSON.stringify(completed));
            document.querySelector(`[data-id="${currentLesson.id}"]`).classList.add("completed");
            updateProgress();
            consoleOut.textContent += "\n\ud83c\udf89 Lesson completed!";
        }
    }
}

function resetCode() {
    if (currentLesson) {
        document.getElementById("code-editor").value = currentLesson.starter;
    }
}

function nextLesson() {
    if (!currentLesson) return;
    const next = lessons.find(l => l.id === currentLesson.id + 1);
    if (next) loadLesson(next.id);
    else alert("You've completed all lessons! Great job!");
}

function updateProgress() {
    const percent = Math.round((completed.length / lessons.length) * 100);
    document.getElementById("progress-bar").style.setProperty("--progress", percent + "%");
    // Actually set the width via style
    const bar = document.querySelector(".progress-bar");
    bar.style.width = "100%"; // container
    // Better: inject style
    document.getElementById("progress-text").textContent = percent + "% complete";
    // Simple visual: change background via inline or class
    const after = document.querySelector(".progress-bar");
    after.innerHTML = `<div style="width:${percent}%;height:100%;background:#28a745;"></div>`;
}

document.getElementById("run-btn").onclick = runCode;
document.getElementById("reset-btn").onclick = resetCode;
document.getElementById("next-btn").onclick = nextLesson;

init();