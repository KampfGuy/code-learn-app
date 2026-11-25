const lessons = [
    {
        id: 1,
        title: "HTML Basics",
        content: `<h2>HTML Basics</h2><p>HTML is the structure of web pages. Tags like <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> create elements.</p><p><strong>Try it:</strong> Create a heading and a paragraph that says "Hello, CodeLearn!"</p>`,
        starter: `<h1>My First Page</h1>\n<p>Hello, CodeLearn!</p>`,
        type: "html",
        check: (code) => code.includes("<h1") && code.includes("<p") && code.toLowerCase().includes("hello")
    },
    {
        id: 2,
        title: "CSS Styling",
        content: `<h2>CSS Styling</h2><p>CSS makes things look good. Change colors and sizes.</p><p><strong>Try it:</strong> Make the heading blue and the paragraph larger.</p>`,
        starter: `<style>\nh1 { color: blue; }\np { font-size: 24px; }\n</style>\n<h1>Styled Heading</h1>\n<p>This text is bigger!</p>`,
        type: "html",
        check: (code) => code.includes("color") && code.includes("font-size")
    },
    {
        id: 3,
        title: "JavaScript Variables",
        content: `<h2>JavaScript Variables</h2><p>Variables store data. Use <code>let</code> or <code>const</code>.</p><p><strong>Try it:</strong> Create a variable and log a greeting.</p>`,
        starter: `let name = "Kampf";\nconsole.log("Hello " + name);`,
        type: "js",
        check: (code) => code.includes("let") || code.includes("const")
    },
    {
        id: 4,
        title: "JavaScript Functions",
        content: `<h2>JavaScript Functions</h2><p>Functions are reusable blocks of code.</p><p><strong>Try it:</strong> Write a function that adds two numbers.</p>`,
        starter: `function add(a, b) {\n  console.log(a + b);\n}\nadd(10, 20);`,
        type: "js",
        check: (code) => code.includes("function") && code.includes("console.log")
    },
    {
        id: 5,
        title: "DOM Manipulation",
        content: `<h2>Changing the Page with JS</h2><p>JavaScript can change HTML elements on click.</p><p><strong>Try it:</strong> Make a button that changes text.</p>`,
        starter: `<button id="btn">Click Me</button>\n<p id="msg">Waiting...</p>\n<script>\ndocument.getElementById("btn").onclick = function() {\n  document.getElementById("msg").innerText = "You clicked!";\n};\n</script>`,
        type: "html",
        check: (code) => code.includes("getElementById") && code.includes("onclick")
    },
    {
        id: 6,
        title: "Make a Simple Game",
        content: `<h2>Make a Simple Game</h2><p>Use a canvas and JavaScript to make a clicker game!</p><p><strong>Try it:</strong> Click the canvas to increase the score.</p><p>This is how many browser games start — a canvas + event listeners + a game loop.</p>`,
        starter: `<canvas id="game" width="400" height="300" style="border:2px solid #667eea;"></canvas>\n<p>Score: <span id="score">0</span></p>\n<script>\nconst canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet score = 0;\nfunction draw() {\n  ctx.fillStyle = "#667eea";\n  ctx.fillRect(0,0,400,300);\n  ctx.fillStyle = "white";\n  ctx.font = "30px Arial";\n  ctx.fillText("Click me!", 120, 160);\n}\ncanvas.onclick = () => {\n  score++;\n  document.getElementById("score").innerText = score;\n  draw();\n};\ndraw();\n</script>`,
        type: "html",
        check: (code) => code.includes("canvas") && code.includes("onclick") && code.includes("score")
    },
    {
        id: 7,
        title: "Intro to 3D Games",
        content: `<h2>Intro to 3D Games</h2><p>3D games in the browser often use libraries like Three.js.</p><p><strong>Try it:</strong> This example loads Three.js and shows a spinning cube. (Internet required for the library.)</p><p>You'll learn scene, camera, renderer, and animation loop — the basics of almost every 3D game.</p>`,
        starter: `<div id="3d" style="width:400px;height:300px;"></div>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(400, 300);\ndocument.getElementById("3d").appendChild(renderer.domElement);\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshBasicMaterial({color: 0x667eea});\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\ncamera.position.z = 5;\nfunction animate() {\n  requestAnimationFrame(animate);\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();\n</script>`,
        type: "html",
        check: (code) => code.includes("THREE") && code.includes("Scene")
    }
];

let currentLesson = null;
let completed = JSON.parse(localStorage.getItem("codelearn-completed") || "[]");
let workspace = null;

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

    document.getElementById("lessons-mode-btn").onclick = () => switchMode("lessons");
    document.getElementById("playground-mode-btn").onclick = () => switchMode("playground");
    document.getElementById("scratch-mode-btn").onclick = () => switchMode("scratch");

    document.getElementById("run-btn").onclick = runCode;
    document.getElementById("reset-btn").onclick = resetCode;
    document.getElementById("next-btn").onclick = nextLesson;

    document.getElementById("playground-run").onclick = runPlayground;
    document.getElementById("playground-clear").onclick = () => {
        document.getElementById("playground-editor").value = "";
        document.getElementById("playground-preview").srcdoc = "";
        document.getElementById("playground-console").textContent = "";
        document.getElementById("share-link-box").style.display = "none";
    };
    document.getElementById("playground-example").onclick = loadPlaygroundExample;
    document.getElementById("share-code-btn").onclick = shareCode;
    document.getElementById("copy-link-btn").onclick = () => {
        const input = document.getElementById("share-link");
        input.select();
        document.execCommand("copy");
        alert("Link copied! Share it with anyone.");
    };

    document.getElementById("generate-blocks-btn").onclick = generateFromBlocks;
    document.getElementById("clear-blocks-btn").onclick = () => {
        if (workspace) workspace.clear();
    };

    // Load shared code from URL if present
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("code");
    if (shared) {
        try {
            const decoded = decodeURIComponent(escape(atob(shared)));
            switchMode("playground");
            document.getElementById("playground-editor").value = decoded;
            setTimeout(runPlayground, 300);
        } catch (e) {
            console.error("Could not load shared code");
        }
    }

    initBlockly();
}

function switchMode(mode) {
    document.getElementById("lessons-container").style.display = mode === "lessons" ? "flex" : "none";
    document.getElementById("playground-container").style.display = mode === "playground" ? "block" : "none";
    document.getElementById("scratch-container").style.display = mode === "scratch" ? "block" : "none";

    document.getElementById("lessons-mode-btn").classList.toggle("active", mode === "lessons");
    document.getElementById("playground-mode-btn").classList.toggle("active", mode === "playground");
    document.getElementById("scratch-mode-btn").classList.toggle("active", mode === "scratch");
}

function loadLesson(id) {
    switchMode("lessons");
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
    } else {
        consoleOut.textContent = "";
        try {
            eval(code);
            consoleOut.textContent = "\u2705 Code ran successfully!";
        } catch (e) {
            consoleOut.textContent = "\u274c Error: " + e.message;
        }
    }
    if (currentLesson.check && currentLesson.check(code) && !completed.includes(currentLesson.id)) {
        completed.push(currentLesson.id);
        localStorage.setItem("codelearn-completed", JSON.stringify(completed));
        document.querySelector(`[data-id="${currentLesson.id}"]`).classList.add("completed");
        updateProgress();
        consoleOut.textContent += "\n\ud83c\udf89 Lesson completed!";
    }
}

function resetCode() {
    if (currentLesson) document.getElementById("code-editor").value = currentLesson.starter;
}

function nextLesson() {
    if (!currentLesson) return;
    const next = lessons.find(l => l.id === currentLesson.id + 1);
    if (next) loadLesson(next.id);
    else alert("You've completed all lessons! Great job!");
}

function updateProgress() {
    const percent = Math.round((completed.length / lessons.length) * 100);
    document.getElementById("progress-fill").style.width = percent + "%";
    document.getElementById("progress-text").textContent = percent + "% complete";
}

function runPlayground() {
    const code = document.getElementById("playground-editor").value;
    document.getElementById("playground-preview").srcdoc = code;
    document.getElementById("playground-console").textContent = "Preview updated.";
}

function loadPlaygroundExample() {
    document.getElementById("playground-editor").value = `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial; text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; margin: 0; }\n    button { padding: 12px 24px; margin: 10px; border: none; border-radius: 8px; cursor: pointer; }\n  </style>\n</head>\n<body>\n  <h1>🚀 Free Playground</h1>\n  <button onclick="alert('Shared code works!')">Click Me</button>\n</body>\n</html>`;
    runPlayground();
}

function shareCode() {
    const code = document.getElementById("playground-editor").value;
    if (!code.trim()) {
        alert("Write some code first!");
        return;
    }
    const encoded = btoa(unescape(encodeURIComponent(code)));
    const url = window.location.origin + window.location.pathname + "?code=" + encoded;
    document.getElementById("share-link").value = url;
    document.getElementById("share-link-box").style.display = "block";
}

function initBlockly() {
    workspace = Blockly.inject("blockly-div", {
        toolbox: {
            kind: "flyoutToolbox",
            contents: [
                { kind: "block", type: "controls_if" },
                { kind: "block", type: "logic_compare" },
                { kind: "block", type: "math_number" },
                { kind: "block", type: "text" },
                { kind: "block", type: "text_print" },
                { kind: "block", type: "controls_repeat_ext" },
                { kind: "block", type: "variables_get" },
                { kind: "block", type: "variables_set" }
            ]
        }
    });
}

function generateFromBlocks() {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    const html = `<!DOCTYPE html><html><body><h2>Block Game</h2><p>Your blocks generated this:</p><pre>${code}</pre><script>${code}</script></body></html>`;
    document.getElementById("scratch-preview").srcdoc = html;
}

init();