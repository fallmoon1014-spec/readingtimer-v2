document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Navigation Menu
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.className = 'bx bx-x';
    } else {
      icon.className = 'bx bx-menu';
    }
  });

  // Close mobile menu when clicking a link
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.querySelector('i').className = 'bx bx-menu';
      
      // Update active link styling
      navLinksItems.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });


  // ==========================================
  // 2. Scroll Reveal Animations
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const checkReveal = () => {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', checkReveal);
  checkReveal(); // Trigger initially


  // ==========================================
  // 3. FAQ Accordion
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  // ==========================================
  // 4. Simulator Tab Switcher
  // ==========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  const switchTab = (tabId) => {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });


  // ==========================================
  // 5. Vibe Console Simulator Engine
  // ==========================================
  const terminalLog = document.getElementById('terminal-log');
  const editorFileName = document.getElementById('editor-file-name');
  const editorCodeText = document.getElementById('editor-code-text');
  const previewViewport = document.getElementById('preview-viewport');
  const previewUrl = document.getElementById('preview-url');
  const previewRefreshBtn = document.getElementById('preview-refresh');
  const promptBtns = document.querySelectorAll('.prompt-btn');
  
  const customPromptInput = document.getElementById('custom-prompt-input');
  const customPromptSubmit = document.getElementById('custom-prompt-submit');

  let simulatorTimeoutIds = [];
  let isSimulating = false;
  let activeProject = 'game';

  // Projects Configuration Data
  const projectsData = {
    game: {
      fileName: 'space-shooter.js',
      url: 'localhost:3000/space-shooter',
      commands: [
        { type: 'cmd', text: 'antigravity create-app --template space-shooter' },
        { type: 'info', text: '[VibeAgent] 분석 중: "우주 슈팅 게임을 HTML5 Canvas로 네온 효과를 살려 만들어줘."' },
        { type: 'success', text: '[create] index.html (canvas 컨테이너 생성 완료)' },
        { type: 'success', text: '[create] style.css (다크 블루 및 레트로 글리치 스타일링)' },
        { type: 'success', text: '[create] space-shooter.js (게임 루프, 충돌 및 이동 로직 작성)' },
        { type: 'info', text: '[VibeAgent] 컴파일 검증 및 번들링...' },
        { type: 'cmd', text: 'npm run dev' },
        { type: 'success', text: '[VibeServer] 개발 서버 기동: http://localhost:3000/space-shooter' },
        { type: 'success', text: '[VibeServer] 웹소켓 핫리로드 연결 완료.' }
      ],
      code: `// Space Shooter Game Canvas Engine
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameOver = false;

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 40,
  width: 30,
  height: 20,
  speed: 5
};

// 장애물(운석) 관리
const obstacles = [];
function spawnObstacle() {
  obstacles.push({
    x: Math.random() * (canvas.width - 20),
    y: -20,
    width: 20,
    height: 20,
    speed: 2 + Math.random() * 3
  });
}

// 레이저 발사 관리
const lasers = [];
function shootLaser() {
  lasers.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 10,
    speed: 7
  });
}`
    },
    chat: {
      fileName: 'ai-chatbot.js',
      url: 'localhost:3000/ai-chatbot',
      commands: [
        { type: 'cmd', text: 'antigravity create-app --template ai-chatbot' },
        { type: 'info', text: '[VibeAgent] 분석 중: "메시지를 주고받을 수 있는 귀여운 인공지능 챗봇 웹앱 만들어줘."' },
        { type: 'success', text: '[create] index.html (채팅 화면 레이아웃)' },
        { type: 'success', text: '[create] style.css (메시지 말풍선, 네온 아바타 효과)' },
        { type: 'success', text: '[create] ai-chatbot.js (메시지 추가 및 가상 에이전트 답변 매핑)' },
        { type: 'cmd', text: 'npm run dev' },
        { type: 'success', text: '[VibeServer] 개발 서버 기동: http://localhost:3000/ai-chatbot' }
      ],
      code: `// AI Chatbot Interface App
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input-area input');
const sendBtn = document.querySelector('.chat-input-area button');

const replies = [
  "바이브가 가득 느껴지는 메시지네요! 👍",
  "버그 2개를 발견하고 몰래 고쳤습니다. 커피 드세요!",
  "당신은 구상만 하세요. 타이핑은 제가 다 하겠습니다. ⚡",
  "코딩 참 쉽죠? 기분 좋은 바이브를 느껴보세요.",
  "어떤 기능을 더 구현해 볼까요?"
];

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = \`chat-msg \${sender}\`;
  msg.innerText = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}`
    },
    crypto: {
      fileName: 'crypto-dashboard.js',
      url: 'localhost:3000/crypto-dashboard',
      commands: [
        { type: 'cmd', text: 'antigravity create-app --template crypto-dashboard' },
        { type: 'info', text: '[VibeAgent] 분석 중: "실시간 비트코인, 이더리움, 바이브코인 시세 및 차트 대시보드 화면을 구현해줘."' },
        { type: 'success', text: '[create] index.html (대시보드 그리드 그리드 컨테이너)' },
        { type: 'success', text: '[create] style.css (유리 질감 카드, 네온 그린 업 앤 다운 인디케이터)' },
        { type: 'success', text: '[create] crypto-dashboard.js (실시간 시세 흔들림 함수 & SVG 그래프 드로잉)' },
        { type: 'cmd', text: 'npm run dev' },
        { type: 'success', text: '[VibeServer] 개발 서버 기동: http://localhost:3000/crypto-dashboard' }
      ],
      code: `// Live Crypto Currency Prices & Charts Dashboard
const prices = {
  btc: 68450.00,
  eth: 3520.50,
  vibe: 12.85
};

function updatePrices() {
  // 시세 랜덤 변동 로직
  prices.btc += (Math.random() - 0.5) * 100;
  prices.eth += (Math.random() - 0.5) * 15;
  prices.vibe += (Math.random() - 0.5) * 0.5;
  
  document.getElementById('btc-price').innerText = 
    \`$\${prices.btc.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}\`;
  // 이더리움 및 바이브 코인도 시세 업데이트
}`
    },
    todo: {
      fileName: 'todo-app.js',
      url: 'localhost:3000/custom-todo',
      commands: [
        { type: 'cmd', text: 'antigravity create-app --custom' },
        { type: 'info', text: '[VibeAgent] 사용자 커스텀 프롬프트 분석 중...' },
        { type: 'success', text: '[create] index.html (투두 리스트 컨테이너)' },
        { type: 'success', text: '[create] todo-app.js (할 일 추가, 완료 체크 및 삭제 로직)' },
        { type: 'cmd', text: 'npm run dev' },
        { type: 'success', text: '[VibeServer] 개발 서버 기동: http://localhost:3000/custom-todo' }
      ],
      code: `// Custom Interactive Todo Application
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function addTodo(text) {
  const li = document.createElement('li');
  li.innerHTML = \`
    <input type="checkbox" class="todo-check">
    <span class="todo-text">\${text}</span>
    <button class="todo-delete"><i class="bx bx-trash"></i></button>
  \`;
  
  // 이벤트 바인딩 및 애니메이션 효과
  todoList.appendChild(li);
}`
    }
  };

  // Helper to clear running simulator tasks
  const clearSimulation = () => {
    simulatorTimeoutIds.forEach(id => clearTimeout(id));
    simulatorTimeoutIds = [];
    isSimulating = false;
  };

  // Run Simulation for a selected project
  const runSimulation = (projId, customPromptText = '') => {
    clearSimulation();
    isSimulating = true;
    activeProject = projId;

    const proj = projectsData[projId];
    
    // Reset Views
    terminalLog.innerHTML = '';
    editorFileName.innerText = proj.fileName;
    editorCodeText.innerText = '// AI 에이전트가 코드를 코딩하고 있습니다...';
    previewViewport.innerHTML = `
      <div class="preview-idle">
        <i class="bx bx-loader-alt bx-spin"></i>
        <p>AI 에이전트가 소스 코드를 생성하는 중...</p>
      </div>
    `;
    previewUrl.innerText = 'localhost:3000/...';

    // Switch to Terminal Tab first
    switchTab('terminal');

    // Run typing script
    let delay = 300;

    // Custom prompt override log
    const projectCommands = [...proj.commands];
    if (projId === 'todo' && customPromptText) {
      projectCommands[1] = { 
        type: 'info', 
        text: `[VibeAgent] 분석 중: "${customPromptText}"` 
      };
    }

    projectCommands.forEach((cmd, idx) => {
      const tid = setTimeout(() => {
        // Append log line
        const line = document.createElement('div');
        line.className = 'log-line';
        
        if (cmd.type === 'cmd') {
          line.innerHTML = `<span class="log-prompt">$</span> <span class="log-cmd">${cmd.text}</span>`;
        } else if (cmd.type === 'info') {
          line.innerHTML = `<span class="log-info">${cmd.text}</span>`;
        } else if (cmd.type === 'success') {
          line.innerHTML = `<span class="log-success">${cmd.text}</span>`;
        } else {
          line.innerHTML = `<span>${cmd.text}</span>`;
        }
        
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;

        // If it reaches code file creation, start typing code in editor tab
        if (cmd.text.includes('[create]') || idx === 3) {
          editorCodeText.innerText = proj.code;
        }

        // Final step: server running
        if (idx === projectCommands.length - 1) {
          previewUrl.innerText = proj.url;
          
          // Switch to Live Preview tab after server runs
          setTimeout(() => {
            if (activeProject === projId) {
              switchTab('preview');
              renderPreviewApp(projId, customPromptText);
            }
          }, 800);
        }
      }, delay);
      
      simulatorTimeoutIds.push(tid);
      delay += (cmd.type === 'cmd' ? 1200 : 700);
    });
  };

  // Render actual interactive application inside mock browser
  const renderPreviewApp = (projId, customPromptText = '') => {
    previewViewport.innerHTML = ''; // Clear loading state

    if (projId === 'game') {
      // 1. SPACE SHOOTER CANVAS MOCK APP
      const gameContainer = document.createElement('div');
      gameContainer.className = 'mock-app-game';
      gameContainer.innerHTML = `
        <h4 style="margin-bottom:8px; font-size:0.9rem; color:var(--color-primary); display:flex; justify-content:space-between;">
          <span>🌌 Retro Space Vibe Shooter</span>
          <span>Score: <span id="game-score">0</span></span>
        </h4>
        <canvas id="gameCanvas" width="360" height="230"></canvas>
        <div class="game-controls-overlay">
          <span>좌우 방향키/A,D: 이동</span>
          <button id="game-play-btn" style="background:var(--color-primary); border:none; padding:2px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer; color:#000;">다시 시작</button>
        </div>
      `;
      previewViewport.appendChild(gameContainer);
      initSpaceShooterGame();

    } else if (projId === 'chat') {
      // 2. INTERACTIVE AI CHAT BOT MOCK APP
      const chatContainer = document.createElement('div');
      chatContainer.className = 'mock-app-chat';
      chatContainer.innerHTML = `
        <div class="chat-app-header">
          <div class="chat-avatar">⚡</div>
          <div class="chat-user-info">
            <span class="chat-username">VibeAI Agent</span>
            <span class="chat-status">● online</span>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages-container">
          <div class="chat-msg received">안녕하세요! 무엇을 느낌으로 코딩해 드릴까요? 프롬프트를 쳐보세요!</div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chat-msg-input" placeholder="여기에 대화 내용을 적어보세요..." autocomplete="off">
          <button id="chat-send-btn"><i class="bx bx-paper-plane"></i></button>
        </div>
      `;
      previewViewport.appendChild(chatContainer);
      initChatbotApp();

    } else if (projId === 'crypto') {
      // 3. CRYPTO DASHBOARD MOCK APP
      const cryptoContainer = document.createElement('div');
      cryptoContainer.className = 'mock-app-crypto';
      cryptoContainer.innerHTML = `
        <div class="crypto-header">
          <span class="crypto-title"><i class="bx bx-bar-chart-alt-2" style="color:var(--color-primary);"></i> VIBE Live Finance</span>
          <span style="font-size:0.7rem; color:var(--color-text-sub);">실시간 갱신 중</span>
        </div>
        <div class="crypto-grid">
          <div class="crypto-card">
            <span class="crypto-name">Bitcoin (BTC)</span>
            <span class="crypto-price" id="c-btc">$68,450.00</span>
            <span class="crypto-change up" id="c-btc-ch">+1.24%</span>
          </div>
          <div class="crypto-card">
            <span class="crypto-name">VIBE Coin (VIBE)</span>
            <span class="crypto-price" id="c-vibe">$12.85</span>
            <span class="crypto-change up" id="c-vibe-ch">+22.40%</span>
          </div>
        </div>
        <div class="crypto-chart">
          <span style="font-size:0.75rem; font-weight:600; margin-bottom:8px;">VIBE Coin 24h Trend</span>
          <svg viewBox="0 0 320 80" width="100%" height="100%" style="overflow:visible;">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(0, 242, 254, 0.4)"/>
                <stop offset="100%" stop-color="rgba(0, 242, 254, 0)"/>
              </linearGradient>
            </defs>
            <path d="M 0 60 Q 40 40, 80 50 T 160 30 T 240 20 T 320 10 L 320 80 L 0 80 Z" fill="url(#chart-glow)"/>
            <path d="M 0 60 Q 40 40, 80 50 T 160 30 T 240 20 T 320 10" fill="none" stroke="var(--color-primary)" stroke-width="2" id="crypto-svg-line"/>
            <circle cx="320" cy="10" r="4" fill="var(--color-primary)"/>
          </svg>
        </div>
      `;
      previewViewport.appendChild(cryptoContainer);
      initCryptoDashboard();

    } else if (projId === 'todo') {
      // 4. CUSTOM TODO LIST MOCK APP
      const todoContainer = document.createElement('div');
      todoContainer.className = 'mock-app-chat'; // Reuse flex structure
      todoContainer.style.background = '#0d101d';
      todoContainer.innerHTML = `
        <div class="chat-app-header" style="background:#16192b;">
          <span style="font-weight:700; color:#fff; font-size:0.85rem;"><i class="bx bx-check-square"></i> ${customPromptText ? customPromptText : '할일 목록 앱'}</span>
        </div>
        <div class="chat-messages" id="todo-list-container" style="padding:12px; gap:8px;">
          <!-- Items will render here -->
        </div>
        <div class="chat-input-area" style="border-top:1px solid rgba(255,255,255,0.05);">
          <input type="text" id="todo-item-input" placeholder="새로운 할 일을 추가해보세요..." autocomplete="off">
          <button id="todo-add-btn" style="background:var(--color-secondary); color:#fff;"><i class="bx bx-plus"></i></button>
        </div>
      `;
      previewViewport.appendChild(todoContainer);
      initTodoApp();
    }
  };


  // ==========================================
  // 5A. Space Shooter Game Logic
  // ==========================================
  const initSpaceShooterGame = () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const playBtn = document.getElementById('game-play-btn');
    const scoreVal = document.getElementById('game-score');

    let animationFrameId;
    let score = 0;
    let gameOver = false;

    const player = {
      x: canvas.width / 2 - 15,
      y: canvas.height - 35,
      w: 30,
      h: 20,
      speed: 4,
      color: '#00f2fe'
    };

    let enemies = [];
    let lasers = [];
    let keys = {};

    const spawnEnemy = () => {
      if (gameOver) return;
      enemies.push({
        x: Math.random() * (canvas.width - 20),
        y: -20,
        w: 16,
        h: 16,
        speed: 1.5 + Math.random() * 2,
        color: '#9d4edd'
      });
      setTimeout(spawnEnemy, 1200);
    };

    const handleKeyDown = (e) => {
      keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        shootLaser();
      }
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const shootLaser = () => {
      if (gameOver) return;
      lasers.push({
        x: player.x + player.w / 2 - 2,
        y: player.y - 8,
        w: 4,
        h: 8,
        speed: 5
      });
    };

    const update = () => {
      if (gameOver) return;

      // Player Movement
      if (keys['ArrowLeft'] || keys['a']) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.x = Math.min(canvas.width - player.w, player.x + player.speed);
      }

      // Lasers Update
      lasers.forEach((laser, index) => {
        laser.y -= laser.speed;
        if (laser.y < 0) lasers.splice(index, 1);
      });

      // Enemies Update
      enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        
        // Player Collision
        if (
          enemy.x < player.x + player.w &&
          enemy.x + enemy.w > player.x &&
          enemy.y < player.y + player.h &&
          enemy.y + enemy.h > player.y
        ) {
          gameOver = true;
        }

        if (enemy.y > canvas.height) {
          enemies.splice(index, 1);
        }
      });

      // Laser - Enemy Collision
      lasers.forEach((laser, lIdx) => {
        enemies.forEach((enemy, eIdx) => {
          if (
            laser.x < enemy.x + enemy.w &&
            laser.x + laser.w > enemy.x &&
            laser.y < enemy.y + enemy.h &&
            laser.y + laser.h > enemy.y
          ) {
            // Explode enemy
            enemies.splice(eIdx, 1);
            lasers.splice(lIdx, 1);
            score += 10;
            scoreVal.innerText = score;
          }
        });
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars background
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect((i * 19) % canvas.width, (i * 37 + Date.now() / 50) % canvas.height, 1, 1);
      }

      // Player
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.moveTo(player.x + player.w / 2, player.y);
      ctx.lineTo(player.x, player.y + player.h);
      ctx.lineTo(player.x + player.w, player.y + player.h);
      ctx.closePath();
      ctx.fill();

      // Glow effect for lasers
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f2fe';
      ctx.fillStyle = '#00f2fe';
      lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, laser.w, laser.h);
      });

      // Enemies
      ctx.shadowColor = '#9d4edd';
      ctx.fillStyle = '#9d4edd';
      enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
      });

      ctx.shadowBlur = 0; // reset

      // Game Over Message
      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff1744';
        ctx.font = 'bold 20px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px Inter';
        ctx.fillText('우측 하단의 [다시 시작] 버튼을 누르세요.', canvas.width / 2, canvas.height / 2 + 15);
      }
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    playBtn.addEventListener('click', () => {
      score = 0;
      scoreVal.innerText = score;
      gameOver = false;
      enemies = [];
      lasers = [];
      player.x = canvas.width / 2 - 15;
    });

    // Start
    spawnEnemy();
    loop();

    // Cleanup when DOM structure changes
    const checkCleanup = setInterval(() => {
      if (!document.getElementById('gameCanvas')) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        cancelAnimationFrame(animationFrameId);
        clearInterval(checkCleanup);
      }
    }, 1000);
  };


  // ==========================================
  // 5B. Interactive Chatbot App Logic
  // ==========================================
  const initChatbotApp = () => {
    const chatFeed = document.getElementById('chat-messages-container');
    const chatInput = document.getElementById('chat-msg-input');
    const sendBtn = document.getElementById('chat-send-btn');

    if (!chatInput) return;

    const replies = [
      "바이브 코딩으로 앱 기획을 단 10초 만에 완수했어요! 😊",
      "말씀하신 디자인 버그를 수정했습니다. 새로고침해 보세요!",
      "완벽한 논리 흐름이네요. 제가 바로 코드로 변환해 드릴게요. ⚡",
      "느낌이 참 좋습니다. 더 지시할 내용이 있으신가요?",
      "코딩은 제가 할게요. 당신은 디자인 가이드와 커피 한 잔의 여유를 즐기세요! ☕",
      "버그 12개를 분석하여 깔끔하게 제거했습니다."
    ];

    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      // Append user msg
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg sent';
      userMsg.innerText = text;
      chatFeed.appendChild(userMsg);
      chatFeed.scrollTop = chatFeed.scrollHeight;

      chatInput.value = '';

      // Mock AI response
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-msg received';
      loadingMsg.innerHTML = '<i class="bx bx-dots-horizontal-rounded bx-flashing"></i> AI가 생각 중...';
      setTimeout(() => {
        chatFeed.appendChild(loadingMsg);
        chatFeed.scrollTop = chatFeed.scrollHeight;
      }, 400);

      setTimeout(() => {
        loadingMsg.remove();
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-msg received';
        aiMsg.innerText = randomReply;
        chatFeed.appendChild(aiMsg);
        chatFeed.scrollTop = chatFeed.scrollHeight;
      }, 1400);
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  };


  // ==========================================
  // 5C. Crypto Dashboard Fluctuations Logic
  // ==========================================
  const initCryptoDashboard = () => {
    const btcVal = document.getElementById('c-btc');
    const btcChg = document.getElementById('c-btc-ch');
    const vibeVal = document.getElementById('c-vibe');
    const vibeChg = document.getElementById('c-vibe-ch');
    const chartLine = document.getElementById('crypto-svg-line');

    if (!btcVal) return;

    let btcPrice = 68450.00;
    let vibePrice = 12.85;
    let tickCount = 0;

    const cryptoInterval = setInterval(() => {
      if (!document.getElementById('c-btc')) {
        clearInterval(cryptoInterval);
        return;
      }

      // Fluctuations
      const btcDiff = (Math.random() - 0.48) * 80;
      const vibeDiff = (Math.random() - 0.45) * 0.15;

      btcPrice += btcDiff;
      vibePrice += vibeDiff;

      btcVal.innerText = `$${btcPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      vibeVal.innerText = `$${vibePrice.toFixed(2)}`;

      // Update percent text
      const btcPct = ((btcDiff > 0 ? '+' : '') + (btcDiff / 680).toFixed(2)) + '%';
      const vibePct = ((vibeDiff > 0 ? '+' : '') + (vibeDiff / 0.12).toFixed(2)) + '%';

      btcChg.innerText = btcPct;
      btcChg.className = btcDiff >= 0 ? 'crypto-change up' : 'crypto-change down';

      vibeChg.innerText = vibePct;
      vibeChg.className = vibeDiff >= 0 ? 'crypto-change up' : 'crypto-change down';

      // Live SVG graph morphing
      tickCount++;
      if (chartLine) {
        // Generate random points for the path
        const p1 = 40 + Math.sin(tickCount) * 15;
        const p2 = 50 - Math.cos(tickCount) * 20;
        const p3 = 30 + Math.sin(tickCount * 1.5) * 12;
        const p4 = 20 - Math.sin(tickCount) * 10;
        const p5 = 10 + (Math.random() - 0.5) * 8;
        
        chartLine.setAttribute('d', `M 0 60 Q 40 ${p1}, 80 ${p2} T 160 ${p3} T 240 ${p4} T 320 ${p5}`);
      }

    }, 2000);
  };


  // ==========================================
  // 5D. Custom Todo App Logic
  // ==========================================
  const initTodoApp = () => {
    const listContainer = document.getElementById('todo-list-container');
    const input = document.getElementById('todo-item-input');
    const addBtn = document.getElementById('todo-add-btn');

    if (!input) return;

    // Default placeholder todos
    const defaultTodos = [
      { text: '인공지능 코딩 에이전트 연결', checked: true },
      { text: '자연어로 디자인 개선안 작성', checked: false },
      { text: '커피 마시면서 바이브 확인하기', checked: false }
    ];

    const createTodoElement = (text, checked = false) => {
      const todoEl = document.createElement('div');
      todoEl.className = 'chat-msg received'; // reuse style classes
      todoEl.style.display = 'flex';
      todoEl.style.alignItems = 'center';
      todoEl.style.justifyContent = 'space-between';
      todoEl.style.width = '100%';
      todoEl.style.maxWidth = '100%';
      todoEl.style.padding = '8px 12px';
      todoEl.style.background = 'rgba(255, 255, 255, 0.03)';
      todoEl.style.border = '1px solid rgba(255,255,255,0.05)';
      todoEl.style.borderRadius = '8px';

      const contentSpan = document.createElement('span');
      contentSpan.innerText = text;
      contentSpan.style.flex = '1';
      contentSpan.style.fontSize = '0.8rem';
      if (checked) {
        contentSpan.style.textDecoration = 'line-through';
        contentSpan.style.opacity = '0.5';
      }

      const checkBtn = document.createElement('button');
      checkBtn.innerHTML = checked ? '<i class="bx bx-check-square"></i>' : '<i class="bx bx-square"></i>';
      checkBtn.style.background = 'none';
      checkBtn.style.border = 'none';
      checkBtn.style.color = checked ? 'var(--color-success)' : 'var(--color-text-sub)';
      checkBtn.style.fontSize = '1.1rem';
      checkBtn.style.cursor = 'pointer';
      checkBtn.style.marginRight = '8px';
      
      checkBtn.addEventListener('click', () => {
        checked = !checked;
        if (checked) {
          contentSpan.style.textDecoration = 'line-through';
          contentSpan.style.opacity = '0.5';
          checkBtn.innerHTML = '<i class="bx bx-check-square"></i>';
          checkBtn.style.color = 'var(--color-success)';
        } else {
          contentSpan.style.textDecoration = 'none';
          contentSpan.style.opacity = '1';
          checkBtn.innerHTML = '<i class="bx bx-square"></i>';
          checkBtn.style.color = 'var(--color-text-sub)';
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="bx bx-trash"></i>';
      deleteBtn.style.background = 'none';
      deleteBtn.style.border = 'none';
      deleteBtn.style.color = 'var(--color-danger)';
      deleteBtn.style.cursor = 'pointer';

      deleteBtn.addEventListener('click', () => {
        todoEl.remove();
      });

      todoEl.appendChild(checkBtn);
      todoEl.appendChild(contentSpan);
      todoEl.appendChild(deleteBtn);

      listContainer.appendChild(todoEl);
    };

    // Render defaults
    defaultTodos.forEach(t => createTodoElement(t.text, t.checked));

    const handleAdd = () => {
      const text = input.value.trim();
      if (!text) return;
      createTodoElement(text);
      input.value = '';
      listContainer.scrollTop = listContainer.scrollHeight;
    };

    addBtn.addEventListener('click', handleAdd);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
    });
  };

  // Wire up prompt button clicks
  promptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isSimulating && btn.getAttribute('data-project') === activeProject) return;
      
      // Update UI active state
      promptBtns.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const projId = btn.getAttribute('data-project');
      runSimulation(projId);
    });
  });

  // Custom Prompt Form Submission
  const submitCustomPrompt = () => {
    const text = customPromptInput.value.trim();
    if (!text) return;
    
    promptBtns.forEach(p => p.classList.remove('active'));
    runSimulation('todo', text);
    customPromptInput.value = '';
  };

  customPromptSubmit.addEventListener('click', submitCustomPrompt);
  customPromptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submitCustomPrompt();
    }
  });

  // Refresh current simulation preview
  previewRefreshBtn.addEventListener('click', () => {
    renderPreviewApp(activeProject);
  });

  // Run initial simulation on load
  runSimulation('game');

});
