const lessons = [
    { id: 1, title: "HTML Basics", content: `<h2>HTML Basics</h2><p>HTML is the structure of web pages. Tags like <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> create elements.</p><p><strong>Try it:</strong> Create a heading and a paragraph that says "Hello, CodeLearn!"</p>`, starter: `<h1>My First Page</h1>\n<p>Hello, CodeLearn!</p>`, type: "html", check: (c) => c.includes("<h1") && c.includes("<p") && c.toLowerCase().includes("hello") },
    { id: 2, title: "CSS Styling", content: `<h2>CSS Styling</h2><p>CSS makes things look good. Change colors and sizes.</p><p><strong>Try it:</strong> Make the heading blue and the paragraph larger.</p>`, starter: `<style>\nh1 { color: blue; }\np { font-size: 24px; }\n</style>\n<h1>Styled Heading</h1>\n<p>This text is bigger!</p>`, type: "html", check: (c) => c.includes("color") && c.includes("font-size") },
    { id: 3, title: "JavaScript Variables", content: `<h2>JavaScript Variables</h2><p>Variables store data. Use <code>let</code> or <code>const</code>.</p><p><strong>Try it:</strong> Create a variable and log a greeting.</p>`, starter: `let name = "Kampf";\nconsole.log("Hello " + name);`, type: "js", check: (c) => c.includes("let") || c.includes("const") },
    { id: 4, title: "JavaScript Functions", content: `<h2>JavaScript Functions</h2><p>Functions are reusable blocks of code.</p><p><strong>Try it:</strong> Write a function that adds two numbers.</p>`, starter: `function add(a, b) {\n  console.log(a + b);\n}\nadd(10, 20);`, type: "js", check: (c) => c.includes("function") && c.includes("console.log") },
    { id: 5, title: "DOM Manipulation", content: `<h2>Changing the Page with JS</h2><p>JavaScript can change HTML elements on click.</p><p><strong>Try it:</strong> Make a button that changes text.</p>`, starter: `<button id="btn">Click Me</button>\n<p id="msg">Waiting...</p>\n<script>\ndocument.getElementById("btn").onclick = function() {\n  document.getElementById("msg").innerText = "You clicked!";\n};\n</script>`, type: "html", check: (c) => c.includes("getElementById") && c.includes("onclick") },
    { id: 6, title: "Make a Simple Game", content: `<h2>Make a Simple Game</h2><p>Use a canvas and JavaScript to make a clicker game!</p><p><strong>Try it:</strong> Click the canvas to increase the score.</p>`, starter: `<canvas id="game" width="400" height="300" style="border:2px solid #667eea;"></canvas>\n<p>Score: <span id="score">0</span></p>\n<script>\nconst canvas = document.getElementById("game");\nconst ctx = canvas.getContext("2d");\nlet score = 0;\nfunction draw() {\n  ctx.fillStyle = "#667eea";\n  ctx.fillRect(0,0,400,300);\n  ctx.fillStyle = "white";\n  ctx.font = "30px Arial";\n  ctx.fillText("Click me!", 120, 160);\n}\ncanvas.onclick = () => {\n  score++;\n  document.getElementById("score").innerText = score;\n  draw();\n};\ndraw();\n</script>`, type: "html", check: (c) => c.includes("canvas") && c.includes("onclick") && c.includes("score") },
    { id: 7, title: "Intro to 3D Games", content: `<h2>Intro to 3D Games</h2><p>3D games in the browser often use libraries like Three.js.</p><p><strong>Try it:</strong> This shows a spinning cube. (Internet required.)</p>`, starter: `<div id="3d" style="width:400px;height:300px;"></div>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(400, 300);\ndocument.getElementById("3d").appendChild(renderer.domElement);\nconst geometry = new THREE.BoxGeometry();\nconst material = new THREE.MeshBasicMaterial({color: 0x667eea});\nconst cube = new THREE.Mesh(geometry, material);\nscene.add(cube);\ncamera.position.z = 5;\nfunction animate() {\n  requestAnimationFrame(animate);\n  cube.rotation.x += 0.01;\n  cube.rotation.y += 0.01;\n  renderer.render(scene, camera);\n}\nanimate();\n</script>`, type: "html", check: (c) => c.includes("THREE") && c.includes("Scene") }
];

let currentLesson = null;
let completed = JSON.parse(localStorage.getItem("codelearn-completed") || "[]");
let sharedCodes = JSON.parse(localStorage.getItem("codelearn-shared") || "[]");
let workspace = null;

// Starter shared examples if empty
if (sharedCodes.length === 0) {
    sharedCodes = [
        { title: "Rainbow Background", code: `<!DOCTYPE html><html><body style="margin:0;background:linear-gradient(45deg,#ff0000,#ff7f00,#ffff00,#00ff00,#0000ff,#4b0082,#9400d3);height:100vh;display:flex;align-items:center;justify-content:center;"><h1 style="color:white;font-family:Arial;">Rainbow!</h1></body></html>` },
        { title: "Simple Counter", code: `<button onclick="this.innerText = parseInt(this.innerText||0)+1">0</button>` }
    ];
    localStorage.setItem("codelearn-shared", JSON.stringify(sharedCodes));
}

function init() {
    renderLessons();
    renderSharedCodes();
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
    };
    document.getElementById("playground-example").onclick = loadPlaygroundExample;

    document.getElementById("add-shared-btn").onclick = addSharedCode;

    document.getElementById("generate-blocks-btn").onclick = generateFromBlocks;
    document.getElementById("clear-blocks-btn").onclick = () => { if (workspace) workspace.clear(); };

    initBlockly();
}

function renderLessons() {
    const list = document.getElementById("lesson-list");
    list.innerHTML = "";
    lessons.forEach(lesson => {
        const li = document.createElement("li");
        li.textContent = lesson.title;
        li.dataset.id = lesson.id;
        if (completed.includes(lesson.id)) li.classList.add("completed");
        li.onclick = () => loadLesson(lesson.id);
        list.appendChild(li);
    });
}

function renderSharedCodes() {
    const list = document.getElementById("shared-code-list");
    list.innerHTML = "";
    sharedCodes.forEach((item, index) => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.style.padding = "8px";
        li.style.marginBottom = "6px";
        li.style.background = "#fff";
        li.style.borderRadius = "6px";
        li.style.borderLeft = "3px solid #28a745";
        li.innerHTML = `<strong>${item.title}</strong><br><small>Click to copy code</small>`;
        li.onclick = () => {
            navigator.clipboard.writeText(item.code).then(() => {
                alert("Code copied! Paste it into the Free Playground.");
            }).catch(() => {
                // Fallback
                const ta = document.createElement("textarea");
                ta.value = item.code;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                alert("Code copied! Paste it into the Free Playground.");
            });
        };
        list.appendChild(li);
    });
}

function addSharedCode() {
    const code = document.getElementById("playground-editor").value.trim();
    if (!code) {
        alert("Go to Free Playground, write some code, then come back and click this button.");
        switchMode("playground");
        return;
    }
    const title = prompt("Give this shared code a short name:", "My Cool Code") || "Untitled";
    sharedCodes.push({ title, code });
    localStorage.setItem("codelearn-shared", JSON.stringify(sharedCodes));
    renderSharedCodes();
    alert("Saved to SharedCode! Others on this browser can copy it.");
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
        try { eval(code); consoleOut.textContent = "\u2705 Code ran successfully!"; }
        catch (e) { consoleOut.textContent = "\u274c Error: " + e.message; }
    }
    if (currentLesson.check && currentLesson.check(code) && !completed.includes(currentLesson.id)) {
        completed.push(currentLesson.id);
        localStorage.setItem("codelearn-completed", JSON.stringify(completed));
        document.querySelector(`[data-id="${currentLesson.id}"]`).classList.add("completed");
        updateProgress();
        consoleOut.textContent += "\n\ud83c\udf89 Lesson completed!";
    }
}

function resetCode() { if (currentLesson) document.getElementById("code-editor").value = currentLesson.starter; }
function nextLesson() {
    if (!currentLesson) return;
    const next = lessons.find(l => l.id === currentLesson.id + 1);
    if (next) loadLesson(next.id); else alert("You've completed all lessons!");
}
function updateProgress() {
    const percent = Math.round((completed.length / lessons.length) * 100);
    document.getElementById("progress-fill").style.width = percent + "%";
    document.getElementById("progress-text").textContent = percent + "% complete";
}
function runPlayground() {
    document.getElementById("playground-preview").srcdoc = document.getElementById("playground-editor").value;
    document.getElementById("playground-console").textContent = "Preview updated.";
}
function loadPlaygroundExample() {
    document.getElementById("playground-editor").value = `<!DOCTYPE html>\n<html><body style="text-align:center;padding:40px;background:#667eea;color:white;"><h1>Playground Ready</h1><button onclick="alert('It works!')">Click</button></body></html>`;
    runPlayground();
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
        },
        zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
        trashcan: true,
        media: "https://unpkg.com/blockly/media/"
    });
}

function generateFromBlocks() {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    const html = `<!DOCTYPE html><html><body><h2>Block Result</h2><pre>${code || "(no blocks)"}</pre><script>${code}</script></body></html>`;
    document.getElementById("scratch-preview").srcdoc = html;
}

init();