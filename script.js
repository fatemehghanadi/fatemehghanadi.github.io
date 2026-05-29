/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-update copyright year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Initialize UI subsystems
    initThemeSwitcher();
    initMobileNav();
    initTypewriter();
    initCanvasBackground();
    initResearchFilters();
    initClipboardCopiers();
    initScrollTracker();
    
    // Immersive CS elements
    initInteractiveTerminal();
    initIDEWorkspace();
});

/* ==========================================================================
   THEME SWITCHING (LIGHT / DARK)
   ========================================================================== */

let currentTheme = 'dark';

function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });
}

function setTheme(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
        themeToggleBtn.style.color = 'var(--accent-purple)';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
        themeToggleBtn.style.color = 'var(--accent-teal)';
    }
    
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */

function initMobileNav() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   TYPEWRITER EFFECT FOR HERO TITLE
   ========================================================================== */

function initTypewriter() {
    const typedTextSpan = document.getElementById('typed-text');
    if (!typedTextSpan) return;
    
    const textArray = [
        "AI & Robotics Researcher",
        "Deep Learning Scientist",
        "Computer Scientist",
        "Medical Signal/Image Expert",
        "LLM & Generative AI Specialist"
    ];
    
    const typingSpeed = 85;
    const erasingSpeed = 40;
    const newTextDelay = 2200; 
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 400);
        }
    }
    
    setTimeout(type, 1200);
}

/* ==========================================================================
   INTERACTIVE CANVAS (NEURAL NETWORK PARTICLES)
   ========================================================================== */

function initCanvasBackground() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let starsArray = [];
    let shootingStars = [];
    let animationId;
    
    let numberOfStars = 120;
    const connectionDistance = 125;
    
    let mouse = {
        x: null,
        y: null,
        radius: 180
    };
    
    let starColor = 'rgba(255, 255, 255, 0.8)';
    let constellationColor = 'rgba(20, 184, 166, 0.08)'; // Teal-blue nebula lines
    
    function setColorsByTheme(theme) {
        if (theme === 'light') {
            starColor = 'rgba(15, 23, 42, 0.6)';
            constellationColor = 'rgba(37, 99, 235, 0.04)';
        } else {
            starColor = 'rgba(255, 255, 255, 0.8)';
            constellationColor = 'rgba(20, 184, 166, 0.08)';
        }
    }
    
    setColorsByTheme(currentTheme);
    
    window.addEventListener('theme-changed', (e) => {
        setColorsByTheme(e.detail.theme);
    });
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (window.innerWidth < 768) {
            numberOfStars = 45;
        } else {
            numberOfStars = 120;
        }
        initStars();
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 200);
    });
    
    class Star {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            // Twinkling variables
            this.twinkleSpeed = 0.01 + Math.random() * 0.03;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.baseOpacity = 0.3 + Math.random() * 0.5;
        }
        
        draw(renderX, renderY) {
            this.twinklePhase += this.twinkleSpeed;
            // Calculate twinkling opacity using sine wave
            const opacity = this.baseOpacity * (Math.sin(this.twinklePhase) * 0.35 + 0.65);
            
            ctx.beginPath();
            ctx.arc(renderX, renderY, this.size, 0, Math.PI * 2, false);
            
            if (currentTheme === 'dark') {
                ctx.fillStyle = `rgba(248, 250, 252, ${opacity})`;
            } else {
                ctx.fillStyle = `rgba(15, 23, 42, ${opacity})`;
            }
            ctx.fill();
            
            // Add subtle outer cosmic glow on brighter/larger stars in dark mode
            if (currentTheme === 'dark' && this.size > 1.8 && opacity > 0.6) {
                ctx.beginPath();
                ctx.arc(renderX, renderY, this.size * 2.5, 0, Math.PI * 2, false);
                ctx.fillStyle = `rgba(20, 184, 166, ${opacity * 0.15})`;
                ctx.fill();
            }
        }
        
        update() {
            // Screen boundaries wrap-around
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            
            this.x += this.dx;
            this.y += this.dy;
            
            // Gravitational distortion calculation (Warp Vector)
            let renderX = this.x;
            let renderY = this.y;
            
            if (mouse.x && mouse.y) {
                let dxMouse = mouse.x - this.x;
                let dyMouse = mouse.y - this.y;
                let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                if (distanceMouse < mouse.radius) {
                    // Pull stars gently towards the mouse (cosmic gravity warp)
                    let pullForce = (1 - (distanceMouse / mouse.radius)) * 14; // max 14px displacement
                    let angle = Math.atan2(dyMouse, dxMouse);
                    renderX += Math.cos(angle) * pullForce;
                    renderY += Math.sin(angle) * pullForce;
                }
            }
            
            this.draw(renderX, renderY);
        }
    }
    
    class ShootingStar {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * (canvas.height * 0.6); // Start in upper half
            this.length = 80 + Math.random() * 100;
            this.speed = 10 + Math.random() * 15;
            this.angle = Math.PI / 6 + (Math.random() * Math.PI / 12); // Diagonal down-right
            this.opacity = 1.0;
            this.active = false;
        }
        
        draw() {
            if (!this.active) return;
            
            ctx.beginPath();
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            
            if (currentTheme === 'dark') {
                grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                grad.addColorStop(0.1, `rgba(20, 184, 166, ${this.opacity * 0.8})`);
                grad.addColorStop(0.6, `rgba(168, 85, 247, ${this.opacity * 0.3})`);
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                grad.addColorStop(0, `rgba(37, 99, 235, ${this.opacity})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.stroke();
        }
        
        update() {
            if (!this.active) {
                // 0.08% chance of firing per frame
                if (Math.random() < 0.0008) {
                    this.reset();
                    this.active = true;
                }
                return;
            }
            
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.018; // Fade trail
            
            if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
                this.active = false;
            }
            
            this.draw();
        }
    }
    
    function initStars() {
        starsArray = [];
        for (let i = 0; i < numberOfStars; i++) {
            let size = (Math.random() * 2) + 0.6;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            // Drifts slowly (stellar motion)
            let dx = (Math.random() * 0.08) - 0.04;
            let dy = (Math.random() * 0.08) - 0.04;
            starsArray.push(new Star(x, y, dx, dy, size));
        }
        
        // Setup a few shooting star buffers
        shootingStars = [new ShootingStar(), new ShootingStar()];
    }
    
    function drawConstellations() {
        for (let a = 0; a < starsArray.length; a++) {
            // Find current coordinates including gravity warping displacement
            let starA_X = starsArray[a].x;
            let starA_Y = starsArray[a].y;
            
            if (mouse.x && mouse.y) {
                let dxMouse = mouse.x - starsArray[a].x;
                let dyMouse = mouse.y - starsArray[a].y;
                let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distanceMouse < mouse.radius) {
                    let pullForce = (1 - (distanceMouse / mouse.radius)) * 14;
                    let angle = Math.atan2(dyMouse, dxMouse);
                    starA_X += Math.cos(angle) * pullForce;
                    starA_Y += Math.sin(angle) * pullForce;
                }
            }
            
            for (let b = a + 1; b < starsArray.length; b++) {
                let starB_X = starsArray[b].x;
                let starB_Y = starsArray[b].y;
                
                if (mouse.x && mouse.y) {
                    let dxMouse = mouse.x - starsArray[b].x;
                    let dyMouse = mouse.y - starsArray[b].y;
                    let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                    if (distanceMouse < mouse.radius) {
                        let pullForce = (1 - (distanceMouse / mouse.radius)) * 14;
                        let angle = Math.atan2(dyMouse, dxMouse);
                        starB_X += Math.cos(angle) * pullForce;
                        starB_Y += Math.sin(angle) * pullForce;
                    }
                }
                
                let dx = starA_X - starB_X;
                let dy = starA_Y - starB_Y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(starA_X, starA_Y);
                    ctx.lineTo(starB_X, starB_Y);
                    let opacity = (1 - (distance / connectionDistance)) * 0.07;
                    
                    if (currentTheme === 'dark') {
                        // Blend neon teal/blue constellation glow
                        ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
                    } else {
                        ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    }
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Draw drifting stars
        for (let i = 0; i < starsArray.length; i++) {
            starsArray[i].update();
        }
        
        // 2. Draw connecting constellation lines
        drawConstellations();
        
        // 3. Draw and update active shooting stars
        for (let j = 0; j < shootingStars.length; j++) {
            shootingStars[j].update();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    animate();
}

/* ==========================================================================
   INTERACTIVE BASH TERMINAL ENGINE
   ========================================================================== */

function initInteractiveTerminal() {
    const hiddenInput = document.getElementById('terminal-hidden-input');
    const inputBuffer = document.getElementById('terminal-input-buffer');
    const historyContainer = document.getElementById('terminal-history');
    const terminalWindow = document.querySelector('.terminal-window');
    
    if (!hiddenInput || !inputBuffer || !historyContainer) return;
    
    // Automatically focus terminal on window clicks
    terminalWindow.addEventListener('click', () => {
        hiddenInput.focus();
    });
    
    // Focus by default on load
    hiddenInput.focus();
    
    hiddenInput.addEventListener('input', (e) => {
        inputBuffer.textContent = e.target.value;
    });
    
    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = hiddenInput.value.trim();
            executeTerminalCommand(command);
            hiddenInput.value = '';
            inputBuffer.textContent = '';
        }
    });
    
    function executeTerminalCommand(cmdString) {
        // Render command line typed
        const userLine = document.createElement('div');
        userLine.className = 'terminal-line';
        userLine.innerHTML = `<span class="terminal-accent">fgl@portfolio:~$</span> ${escapeHTML(cmdString)}`;
        historyContainer.appendChild(userLine);
        
        if (cmdString === '') {
            scrollTerminalToBottom();
            return;
        }
        
        const args = cmdString.split(' ');
        const mainCmd = args[0].toLowerCase();
        
        const outputNode = document.createElement('div');
        outputNode.className = 'terminal-output';
        
        switch (mainCmd) {
            case 'help':
                outputNode.innerHTML = `
                    Available terminal prompt operations:<br>
                    - <span class="text-accent">about</span>    : Display biographical summary details.<br>
                    - <span class="text-accent">skills</span>   : Draw coding/framework expertise metrics.<br>
                    - <span class="text-accent">papers</span>   : List research published and submitted papers.<br>
                    - <span class="text-accent">git log</span>  : Display chronological career commit logs.<br>
                    - <span class="text-accent">theme</span>    : Swap visual page themes (Light &lt;-&gt; Dark).<br>
                    - <span class="text-accent">clear</span>    : Clear terminal buffer outputs.<br>
                    - <span class="text-accent">help</span>     : Render active list of commands.
                `;
                break;
                
            case 'about':
                outputNode.innerHTML = `
                    AI Researcher and Computer Scientist residing in Odense, Denmark.<br>
                    Expertise focused in machine learning and medical diagnostics, utilizing state space architectures (Mamba), Graph Neural Networks (GNNs), and Kolmogorov-Arnold Networks (KAN).<br>
                    Email: fladani@health.sdu.dk | Github: @fatemehghanadi
                `;
                break;
                
            case 'skills':
                outputNode.innerHTML = `
                    Python Programming        [====================] 98%<br>
                    PyTorch / PyG Geometric   [===================-] 95%<br>
                    Mamba & KAN Deep Learning [===================-] 92%<br>
                    LLM Supervised Tuning     [==================--] 90%<br>
                    Docker & DevOps Platforms [===============-----] 78%
                `;
                break;
                
            case 'papers':
                outputNode.innerHTML = `
                    [1] "Using fMRI Time Series and Functional Connectivity..." (EMBC 2025)<br>
                    [2] "Autism Spectrum Disorder Classification Using KAN-GNN..." (Submitted 2026)<br>
                    [3] "Wavelet Based fMRI Analysis for Autism..." (AIIoT 2024)<br>
                    [4] "A Review of Large Language Models for Energy Systems..." (IEEE Access 2025)<br>
                    [5] "Consequence-Aware Prescriptive Maintenance..." (IEEE Trans. Smart Grid 2025)
                `;
                break;
                
            case 'git':
                if (args[1] && args[1].toLowerCase() === 'log') {
                    outputNode.innerHTML = `
                        * commit b58f4a1 - Sep 2025 - Data Scientist SDU LCA Group<br>
                        * commit d2ef7a2 - Jan 2025 - M.Sc. graduation 20/20 Thesis (IUT)<br>
                        * commit e61b2a9 - Dec 2021 - AI Developer AIMedic Intern<br>
                        * commit a18e3d5 - Sep 2022 - B.Sc. graduation UI Computer Eng.
                    `;
                } else {
                    outputNode.innerHTML = `Usage: <span class="text-accent">git log</span>`;
                }
                break;
                
            case 'theme':
                if (currentTheme === 'dark') {
                    setTheme('light');
                    outputNode.textContent = 'Switched to LIGHT visual theme.';
                } else {
                    setTheme('dark');
                    outputNode.textContent = 'Switched to DARK visual theme.';
                }
                break;
                
            case 'clear':
                historyContainer.innerHTML = '';
                scrollTerminalToBottom();
                return;
                
            default:
                outputNode.innerHTML = `bash: command not found: ${escapeHTML(mainCmd)}. Type <span class="text-accent">'help'</span> for instructions.`;
        }
        
        historyContainer.appendChild(outputNode);
        scrollTerminalToBottom();
    }
    
    function scrollTerminalToBottom() {
        const body = historyContainer.parentElement;
        body.scrollTop = body.scrollHeight;
    }
    
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}

/* ==========================================================================
   RESEARCH & PUBLICATIONS SEARCH & FILTERS
   ========================================================================== */

function initResearchFilters() {
    const searchInput = document.getElementById('paper-search');
    const filterBtns = document.querySelectorAll('#paper-filters .filter-btn');
    const paperCards = document.querySelectorAll('.paper-card');
    
    if (!searchInput || filterBtns.length === 0) return;
    
    let activeFilter = 'all';
    let searchQuery = '';
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilter();
        });
    });
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilter();
    });
    
    function applyFilter() {
        paperCards.forEach(card => {
            const type = card.dataset.type;
            const keywords = card.dataset.keywords;
            const title = card.querySelector('.paper-title').textContent.toLowerCase();
            const authors = card.querySelector('.paper-authors').textContent.toLowerCase();
            const journal = card.querySelector('.paper-journal').textContent.toLowerCase();
            
            const matchTab = (activeFilter === 'all' || type === activeFilter);
            const matchSearch = (
                searchQuery === '' ||
                title.includes(searchQuery) ||
                authors.includes(searchQuery) ||
                journal.includes(searchQuery) ||
                keywords.includes(searchQuery)
            );
            
            if (matchTab && matchSearch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

/* ==========================================================================
   VS CODE IDE WORKSPACE SIMULATOR
   ========================================================================== */

const mockFilesData = {
    llm_app: {
        filename: 'fullstack_llm.py',
        repo: 'https://github.com/fatemehghanadi/LLM-Application',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Full-Stack RAG Conversational AI Application</span>
<span class="code-comment">Engine: Qwen-2.5, vLLM High-Performance Backend, FastAPI</span>
<span class="code-comment">"""</span>

<span class="code-keyword">from</span> fastapi <span class="code-keyword">import</span> FastAPI, Depends
<span class="code-keyword">from</span> agentic_framework <span class="code-keyword">import</span> ReActAgent, RAGVectorIndex

app = FastAPI(title=<span class="code-string">"Full-Stack LLM Agent API"</span>)

<span class="code-comment"># Define workspace configuration parameters</span>
config = {
    <span class="code-string">"llm_engine"</span>: <span class="code-string">"vllm"</span>,
    <span class="code-string">"base_model"</span>: <span class="code-string">"Qwen/Qwen2.5-7B-Instruct"</span>,
    <span class="code-string">"temperature"</span>: <span class="code-num">0.1</span>,
    <span class="code-string">"retrieval_strategy"</span>: <span class="code-string">"DenseEmbeddingRAG"</span>,
    <span class="code-string">"agent_loop"</span>: <span class="code-string">"ReAct"</span>
}

<span class="code-keyword">def</span> <span class="code-func">initialize_conversational_core</span>():
    vector_db = RAGVectorIndex(storage_path=<span class="code-string">"./vector_index"</span>)
    agent = ReActAgent(
        model=config[<span class="code-string">"base_model"</span>],
        memory_limit=<span class="code-num">20</span>,
        tools=[vector_db.as_query_tool()]
    )
    <span class="code-keyword">return</span> agent

agent_core = initialize_conversational_core()

@app.post(<span class="code-string">"/v1/agent/chat"</span>)
<span class="code-keyword">def</span> <span class="code-func">agentic_chat_loop</span>(query: <span class="code-var">str</span>):
    <span class="code-comment"># Executes continuous ReAct chain-of-thought steps</span>
    response = agent_core.execute(query)
    <span class="code-keyword">return</span> {<span class="code-string">"status"</span>: <span class="code-string">"success"</span>, <span class="code-string">"response"</span>: response}`
    },
    
    llm_platform: {
        filename: 'sft_platform.py',
        repo: 'https://github.com/fatemehghanadi/LLM-Application',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: End-to-End LLM Adaptation and Supervised Fine-Tuning</span>
<span class="code-comment">Process: Synthetic Dataset Generation & PEFT Parameter Adapting</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> torch
<span class="code-keyword">from</span> transformers <span class="code-keyword">import</span> AutoModelForCausalLM, AutoTokenizer, PeftConfig
<span class="code-keyword">from</span> dataset_synthesizer <span class="code-keyword">import</span> DomainSpecificGenerator

<span class="code-keyword">class</span> <span class="code-func">LLMTuningPlatform</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, model_id: <span class="code-var">str</span>):
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.generator = DomainSpecificGenerator()
        self.device = <span class="code-string">"cuda"</span> <span class="code-keyword">if</span> torch.cuda.is_available() <span class="code-keyword">else</span> <span class="code-string">"cpu"</span>
        
    <span class="code-keyword">def</span> <span class="code-func">generate_and_tune</span>(self, seed_files: <span class="code-var">list</span>):
        <span class="code-comment"># 1. Synthesize targeted high-fidelity training data</span>
        training_samples = self.generator.synthesize(seed_files)
        
        <span class="code-comment"># 2. Config PEFT Lora Parameters</span>
        peft_config = PeftConfig(
            r=<span class="code-num">16</span>,
            lora_alpha=<span class="code-num">32</span>,
            target_modules=[<span class="code-string">"q_proj"</span>, <span class="code-string">"v_proj"</span>],
            lora_dropout=<span class="code-num">0.05</span>
        )
        
        <span class="code-comment"># 3. Apply adaptation and launch supervised learning</span>
        print(f<span class="code-string">"Adapting model on {self.device} for {len(training_samples)} tokens."</span>)
        <span class="code-keyword">return</span> <span class="code-string">"fine_tuned_weights_saved"</span>`
    },
    
    asd_gnn: {
        filename: 'asd_gnn_model.py',
        repo: 'https://github.com/fatemehghanadi/Autism-Classification',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Autism Spectrum Disorder Connectome Classification</span>
<span class="code-comment">GNN Pipeline using fMRI Correlation Matrices</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> torch
<span class="code-keyword">import</span> torch.nn <span class="code-keyword">as</span> nn
<span class="code-keyword">from</span> torch_geometric.nn <span class="code-keyword">import</span> GCNConv, global_mean_pool

<span class="code-keyword">class</span> <span class="code-func">AutismGNN</span>(nn.Module):
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, num_node_features, num_classes=<span class="code-num">2</span>):
        super(AutismGNN, self).__init__()
        <span class="code-comment"># First Graph Convolutional Layer</span>
        self.conv1 = GCNConv(num_node_features, <span class="code-num">64</span>)
        <span class="code-comment"># Second Graph Convolutional Layer</span>
        self.conv2 = GCNConv(<span class="code-num">64</span>, <span class="code-num">128</span>)
        <span class="code-comment"># Linear Classifier</span>
        self.fc = nn.Linear(<span class="code-num">128</span>, num_classes)
        
    <span class="code-keyword">def</span> <span class="code-func">forward</span>(self, data):
        x, edge_index, batch = data.x, data.edge_index, data.batch
        
        <span class="code-comment"># Layer 1 Convolution + ReLU</span>
        x = self.conv1(x, edge_index).relu()
        <span class="code-comment"># Layer 2 Convolution + ReLU</span>
        x = self.conv2(x, edge_index).relu()
        
        <span class="code-comment"># Global Graph Pooling to obtain static vector representation</span>
        x = global_mean_pool(x, batch)
        
        <span class="code-comment"># Final Class Probabilities output</span>
        logits = self.fc(x)
        <span class="code-keyword">return</span> torch.softmax(logits, dim=-<span class="code-num">1</span>)`
    },
    
    mamba_kan: {
        filename: 'mamba_kan_fmri.py',
        repo: 'https://github.com/fatemehghanadi/fMRI-Based-Autism-Classification-Mamba-KAN-with-DANN',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Domain-Invariant Autism fMRI Classification</span>
<span class="code-comment">Architecture: Mamba sequence model + Kolmogorov-Arnold Networks (KAN)</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> torch
<span class="code-keyword">import</span> torch.nn <span class="code-keyword">as</span> nn
<span class="code-keyword">from</span> mamba_ssm <span class="code-keyword">import</span> Mamba
<span class="code-keyword">from</span> efficient_kan <span class="code-keyword">import</span> KAN

<span class="code-keyword">class</span> <span class="code-func">DomainAdversarialMambaKAN</span>(nn.Module):
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, seq_len, d_model):
        super().__init__()
        <span class="code-comment"># Mamba sequence extraction for fMRI timeseries</span>
        self.mamba = Mamba(d_model=d_model, d_state=<span class="code-num">16</span>, d_conv=<span class="code-num">4</span>, expand=<span class="code-num">2</span>)
        
        <span class="code-comment"># Kolmogorov-Arnold Network for highly explainable classification</span>
        self.classifier_kan = KAN([d_model, <span class="code-num">32</span>, <span class="code-num">2</span>])
        
        <span class="code-comment"># Gradient Reversal Layer for domain alignment</span>
        self.grl = GradientReversalLayer()
        self.domain_classifier = KAN([d_model, <span class="code-num">16</span>, <span class="code-num">5</span>]) <span class="code-comment"># multisite</span>

    <span class="code-keyword">def</span> <span class="code-func">forward</span>(self, fmri_seq):
        seq_features = self.mamba(fmri_seq)
        mean_pooling = seq_features.mean(dim=<span class="code-num">1</span>)
        
        <span class="code-comment"># Core autism diagnostic logits</span>
        diagnosis = self.classifier_kan(mean_pooling)
        
        <span class="code-comment"># Domain invariant adversarial loss</span>
        reversed_features = self.grl(mean_pooling)
        domain = self.domain_classifier(reversed_features)
        
        <span class="code-keyword">return</span> diagnosis, domain`
    },
    
    wavelet_asd: {
        filename: 'wavelet_asd.py',
        repo: 'https://github.com/fatemehghanadi/Autism-Classification',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Wavelet-Decomposed fMRI Signal Classification</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> pywt
<span class="code-keyword">import</span> numpy <span class="code-keyword">as</span> np
<span class="code-keyword">from</span> sklearn.feature_selection <span class="code-keyword">import</span> SelectKBest, f_classif
<span class="code-keyword">from</span> sklearn.linear_model <span class="code-keyword">import</span> RidgeClassifier

<span class="code-keyword">def</span> <span class="code-func">extract_wavelet_subbands</span>(timeseries, wavelet_name=<span class="code-string">"db4"</span>, level=<span class="code-num">3</span>):
    <span class="code-comment"># 1. Discrete Wavelet Decomposition of BOLD signals</span>
    coeffs = pywt.wavedec(timeseries, wavelet_name, level=level)
    
    <span class="code-comment"># 2. Reconstruct high and low frequency coefficients</span>
    subband_features = np.concatenate([np.mean(c, axis=-<span class="code-num">1</span>) <span class="code-keyword">for</span> c <span class="code-keyword">in</span> coeffs])
    <span class="code-keyword">return</span> subband_features

<span class="code-keyword">def</span> <span class="code-func">fit_ridge_pipeline</span>(X_train, y_train):
    <span class="code-comment"># 3. K-Best feature selection</span>
    selector = SelectKBest(score_func=f_classif, k=<span class="code-num">100</span>)
    X_selected = selector.fit_transform(X_train, y_train)
    
    <span class="code-comment"># 4. Classify using Ridge Model</span>
    model = RidgeClassifier(alpha=<span class="code-num">1.0</span>)
    model.fit(X_selected, y_train)
    <span class="code-keyword">return</span> selector, model`
    },
    
    scrna_seq: {
        filename: 'scrna_seq_cluster.py',
        repo: 'https://github.com/fatemehghanadi/RNA-Seq-Clustering',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Single-Cell RNA Sequencing Clustering Pipeline</span>
<span class="code-comment">Tool: Scanpy Library benchmark</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> scanpy <span class="code-keyword">as</span> sc

<span class="code-keyword">def</span> <span class="code-func">execute_bio_clustering_pipeline</span>(adata_file_path):
    <span class="code-comment"># 1. Read single cell count matrices</span>
    adata = sc.read_h5ad(adata_file_path)
    
    <span class="code-comment"># 2. Filter highly variable genes</span>
    sc.pp.filter_cells(adata, min_genes=<span class="code-num">200</span>)
    sc.pp.filter_genes(adata, min_cells=<span class="code-num">3</span>)
    sc.pp.normalize_total(adata, target_sum=<span class="code-num">1e4</span>)
    sc.pp.log1p(adata)
    
    <span class="code-comment"># 3. PCA + Neighborhood Graph Generation</span>
    sc.pp.highly_variable_genes(adata, min_mean=<span class="code-num">0.0125</span>, max_mean=<span class="code-num">3</span>)
    sc.tl.pca(adata, svd_solver=<span class="code-string">"arpack"</span>)
    sc.pp.neighbors(adata, n_neighbors=<span class="code-num">10</span>, n_pcs=<span class="code-num">40</span>)
    
    <span class="code-comment"># 4. Leiden & UMAP clustering</span>
    sc.tl.leiden(adata, resolution=<span class="code-num">0.5</span>)
    sc.tl.umap(adata)
    <span class="code-keyword">return</span> adata.obs[<span class="code-string">"leiden"</span>]`
    },
    
    pneumonia_pso: {
        filename: 'pneumonia_pso.py',
        repo: 'https://github.com/fatemehghanadi/XORPSO',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Pneumonia Detection on X-Ray Chest Scans</span>
<span class="code-comment">Vision Pipeline: RegNet deep extraction + XOR Particle Swarm optimization</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> numpy <span class="code-keyword">as</span> np
<span class="code-keyword">from</span> torchvision.models <span class="code-keyword">import</span> regnet_y_1_6gf

<span class="code-keyword">class</span> <span class="code-func">XORParticleSwarmOpt</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, num_particles, num_features):
        self.num_particles = num_particles
        <span class="code-comment"># Binary particle positions representing selected features</span>
        self.positions = np.random.randint(<span class="code-num">2</span>, size=(num_particles, num_features))
        self.velocities = np.random.uniform(-<span class="code-num">1</span>, <span class="code-num">1</span>, size=(num_particles, num_features))
        self.pbest = self.positions.copy()
        self.gbest = self.positions[<span class="code-num">0</span>]
        
    <span class="code-keyword">def</span> <span class="code-func">optimize_feature_mask</span>(self, fitness_evaluator):
        <span class="code-comment"># Custom XOR particle displacement update rule</span>
        <span class="code-keyword">for</span> t <span class="code-keyword">in</span> <span class="code-var">range</span>(<span class="code-num">100</span>):
            <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-var">range</span>(self.num_particles):
                fitness = fitness_evaluator(self.positions[i])
                <span class="code-comment"># XOR local best updates</span>
                displacement = np.logical_xor(self.pbest[i], self.gbest)
                self.positions[i] = np.logical_xor(self.positions[i], displacement)
        <span class="code-keyword">return</span> self.gbest`
    },
    
    capsule_drl: {
        filename: 'capsule_drl_agent.py',
        repo: 'https://github.com/fatemehghanadi',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: 3D MRI Anatomical Landmark Detection</span>
<span class="code-comment">Architecture: Deep Q-Learning Agent + Capsule Neural Network layers</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> torch
<span class="code-keyword">import</span> torch.nn <span class="code-keyword">as</span> nn

<span class="code-keyword">class</span> <span class="code-func">CapsuleQNetwork</span>(nn.Module):
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self):
        super().__init__()
        <span class="code-comment"># Primary Capsules to capture spatial orientation vectors</span>
        self.primary_capsules = PrimaryCapsuleLayer()
        <span class="code-comment"># Routing capsules mapping structures to actions</span>
        self.routing_capsules = RoutingCapsuleLayer()
        
    <span class="code-keyword">def</span> <span class="code-func">forward</span>(self, vol_mri_3d):
        caps_features = self.primary_capsules(vol_mri_3d)
        vector_states = self.routing_capsules(caps_features)
        
        <span class="code-comment"># Q-value vector over spatial movement actions (x, y, z steps)</span>
        q_values = torch.norm(vector_states, dim=-<span class="code-num">1</span>)
        <span class="code-keyword">return</span> q_values`
    },
    
    alzheimer_3d: {
        filename: 'alzheimer_3dcnn.py',
        repo: 'https://github.com/fatemehghanadi',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Alzheimer's Classification on 3D Structural Brain MRI</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> keras
<span class="code-keyword">from</span> keras.layers <span class="code-keyword">import</span> Conv3D, MaxPool3D, Dense, Flatten

<span class="code-keyword">def</span> <span class="code-func">construct_3d_cnn_model</span>(input_shape=(<span class="code-num">128</span>, <span class="code-num">128</span>, <span class="code-num">128</span>, <span class="code-num">1</span>)):
    model = keras.Sequential([
        <span class="code-comment"># 3D Convolution captures structural spatial correlations</span>
        Conv3D(<span class="code-num">32</span>, kernel_size=(<span class="code-num">3</span>, <span class="code-num">3</span>, <span class="code-num">3</span>), activation=<span class="code-string">"relu"</span>, input_shape=input_shape),
        MaxPool3D(pool_size=(<span class="code-num">2</span>, <span class="code-num">2</span>, <span class="code-num">2</span>)),
        
        Conv3D(<span class="code-num">64</span>, kernel_size=(<span class="code-num">3</span>, <span class="code-num">3</span>, <span class="code-num">3</span>), activation=<span class="code-string">"relu"</span>),
        MaxPool3D(pool_size=(<span class="code-num">2</span>, <span class="code-num">2</span>, <span class="code-num">2</span>)),
        
        Flatten(),
        Dense(<span class="code-num">128</span>, activation=<span class="code-string">"relu"</span>),
        <span class="code-comment"># Sigmoid classification: (Normal Cognitive vs Alzheimer)</span>
        Dense(<span class="code-num">1</span>, activation=<span class="code-string">"sigmoid"</span>)
    ])
    <span class="code-keyword">return</span> model`
    },
    
    energy_nlp: {
        filename: 'energy_nlp_kan.py',
        repo: 'https://github.com/fatemehghanadi/NLP-for-Energy-System',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: KAN & LLM-Based Fault Diagnostics for Grid Energy Systems</span>
<span class="code-comment">"""</span>

<span class="code-keyword">from</span> transformers <span class="code-keyword">import</span> pipeline
<span class="code-keyword">from</span> efficient_kan <span class="code-keyword">import</span> KAN

<span class="code-keyword">class</span> <span class="code-func">EnergyFaultAnalyzer</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self):
        <span class="code-comment"># Load textual pipeline to analyze diagnostic logs</span>
        self.nlp_pipeline = pipeline(<span class="code-string">"feature-extraction"</span>, model=<span class="code-string">"bert-base-uncased"</span>)
        <span class="code-comment"># KAN maps language representations to grid fault states</span>
        self.kan_diagnostic = KAN([<span class="code-num">768</span>, <span class="code-num">64</span>, <span class="code-num">3</span>])
        
    <span class="code-keyword">def</span> <span class="code-func">analyze_logs</span>(self, error_log: <span class="code-var">str</span>):
        nlp_embeddings = self.nlp_pipeline(error_log)[<span class="code-num">0</span>][<span class="code-num">0</span>]
        fault_probabilities = self.kan_diagnostic(nlp_embeddings)
        <span class="code-keyword">return</span> fault_probabilities`
    },
    
    lca_pipeline: {
        filename: 'modular_lca.py',
        repo: 'https://github.com/fatemehghanadi',
        code: `<span class="code-comment"># -*- coding: utf-8 -*-</span>
<span class="code-comment">"""</span>
<span class="code-comment">Project: Modular Life Cycle Assessment (LCA) Pipeline</span>
<span class="code-comment">"""</span>

<span class="code-keyword">import</span> pandas <span class="code-keyword">as</span> pd

<span class="code-keyword">class</span> <span class="code-func">ModularLCAPipeline</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, emisson_factor_db: <span class="code-var">str</span>):
        self.ef_db = pd.read_csv(emisson_factor_db)
        
    <span class="code-keyword">def</span> <span class="code-func">calculate_impacts</span>(self, facility_inputs_csv: <span class="code-var">str</span>):
        inputs = pd.read_csv(facility_inputs_csv)
        <span class="code-comment"># Dynamic join on raw materials to assess greenhouse factors</span>
        merged = pd.merge(inputs, self.ef_db, on=<span class="code-string">"material_id"</span>)
        merged[<span class="code-string">"co2_impact"</span>] = merged[<span class="code-string">"quantity"</span>] * merged[<span class="code-string">"ghg_factor"</span>]
        
        aggregated_metrics = merged.groupby(<span class="code-string">"process_stage"</span>)[<span class="code-string">"co2_impact"</span>].sum()
        <span class="code-keyword">return</span> aggregated_metrics`
    }
};

function initIDEWorkspace() {
    const fileElements = document.querySelectorAll('.tree-file');
    const tabsContainer = document.getElementById('ide-tabs-container');
    const codeContainer = document.getElementById('editor-code-container');
    const gutterLines = document.getElementById('gutter-lines');
    const runBtn = document.getElementById('ide-run-btn');
    
    if (fileElements.length === 0 || !codeContainer || !gutterLines) return;
    
    let activeFileKey = 'llm_app';
    
    // File tree selection
    fileElements.forEach(el => {
        el.addEventListener('click', () => {
            fileElements.forEach(f => f.classList.remove('active'));
            el.classList.add('active');
            
            const fileKey = el.dataset.file;
            activeFileKey = fileKey;
            
            openIDEFile(fileKey);
        });
    });
    
    // Folder directories collapse/expand toggler
    const folders = document.querySelectorAll('.folder-title');
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            const contents = folder.nextElementSibling;
            const icon = folder.querySelector('.fa-chevron-down, .fa-chevron-right');
            
            contents.classList.toggle('open');
            if (contents.classList.contains('open')) {
                contents.style.display = 'block';
                icon.className = 'fa-solid fa-chevron-down';
            } else {
                contents.style.display = 'none';
                icon.className = 'fa-solid fa-chevron-right';
            }
        });
    });

    // Run application triggers GitHub redirect
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            const fileMeta = mockFilesData[activeFileKey];
            if (fileMeta && fileMeta.repo) {
                window.open(fileMeta.repo, '_blank');
            }
        });
    }

    function openIDEFile(fileKey) {
        const fileData = mockFilesData[fileKey];
        if (!fileData) return;
        
        // 1. Update tabs container
        tabsContainer.innerHTML = `
            <div class="ide-tab active" data-tab="${fileKey}">
                <i class="fa-brands fa-python text-accent-blue"></i>
                <span>${fileData.filename}</span>
                <span class="tab-close"><i class="fa-solid fa-xmark"></i></span>
            </div>
        `;
        
        // 2. Inject code content
        codeContainer.innerHTML = fileData.code;
        
        // 3. Render line numbers gutter
        // Count line breaks in the code content
        const numLines = fileData.code.split('\\n').length;
        let lineNumbersHTML = '';
        for (let i = 1; i <= numLines; i++) {
            lineNumbersHTML += `<span class="code-editor-line">${i}</span>`;
        }
        gutterLines.innerHTML = lineNumbersHTML;
    }
    
    // Load default tab
    openIDEFile(activeFileKey);
}

/* ==========================================================================
   CLIPBOARD COPIERS & TOAST OVERLAYS
   ========================================================================== */

function initClipboardCopiers() {
    const copyCiteBtns = document.querySelectorAll('.copy-cite-btn');
    copyCiteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const citationText = btn.dataset.citation;
            copyToClipboard(citationText, 'Citation copied to clipboard!');
        });
    });
    
    const copyContactBtns = document.querySelectorAll('.copy-contact-btn');
    copyContactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const copyText = btn.dataset.copy;
            copyToClipboard(copyText, `${copyText} copied to clipboard!`);
        });
    });
}

function copyToClipboard(text, message) {
    if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(message);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textarea);
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showToast(message);
    }).catch(err => {
        console.error('Async: Could not copy text: ', err);
    });
}

function showToast(message) {
    const existingToast = document.querySelector('.toast-msg');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toast-out 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2800);
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes toast-out {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(50px) scale(0.8); opacity: 0; }
}
@keyframes fadeIn {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);

/* ==========================================================================
   SCROLL POSITION TRACKER (ACTIVE NAVBAR HIGHLIGHT & STICKY NAV)
   ========================================================================== */

function initScrollTracker() {
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
