/* app.js - Interactive Logic for Teacher Han Yoon-ji's Profile Website */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 1. Navigation & Scroll Effects
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navLinksList = document.querySelectorAll('.nav-links a');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');

  // Compact navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    mobileMenuBtn.textContent = navLinksContainer.classList.contains('active') ? '✕' : '☰';
  });

  // Close mobile menu when a link is clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      mobileMenuBtn.textContent = '☰';
    });
  });

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to keep observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Active Section Navigation Indicator
  const sections = document.querySelectorAll('section');
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksList.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(sec => activeSectionObserver.observe(sec));


  // =========================================================================
  // 2. Classroom Activities Detail Modal
  // =========================================================================
  const modal = document.getElementById('activity-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalBannerSvg = document.getElementById('modal-banner-svg');

  const activitiesData = {
    'project-learning': {
      tag: '탐구 중심 교육',
      title: '프로젝트 중심 수업 (PBL)',
      text: `프로젝트 중심 수업(PBL, Project-Based Learning)은 학생들이 실제 생활에서 접할 수 있는 흥미로운 주제나 문제를 스스로 정의하고 협력하여 해결하는 탐구형 수업 방식입니다.

우리 반에서는 다음과 같은 과정으로 함께합니다:
1. 주제 탐색: 생활 속 의문이나 지역사회 소식에서 호기심 있는 연구 주제 발견하기
2. 모둠 토의: 서로 다른 시각을 나누고 해결할 질문 구체화하기
3. 정보 탐구 및 인터뷰: 교과서, 도서, 인터넷 및 현장 관찰을 통한 자료 수집
4. 결과물 제작: 친구들과 함께 포스터, 신문, 모형, 연극 등 다양한 매체로 해결책 구체화하기
5. 배움 나눔: 교실 또는 학교 내에서 발표회를 갖고 소감 나누기

이를 통해 지식을 단순 암기하는 수준을 넘어, 논리적이고 비판적인 사고력, 모둠원 간 협동 및 조율 능력, 발표 능력까지 종합적인 미래 역량을 함양할 수 있습니다.`,
      bannerSvgContent: `
        <rect width="100%" height="100%" fill="var(--color-primary-light)" />
        <circle cx="300" cy="125" r="90" fill="rgba(77, 124, 96, 0.15)" />
        <text x="300" y="145" font-size="70" text-anchor="middle">💡</text>
        <circle cx="210" cy="80" r="15" fill="var(--color-secondary)" opacity="0.8"/>
        <circle cx="390" cy="170" r="10" fill="var(--color-accent)" opacity="0.8"/>
      `
    },
    'circle-time': {
      tag: '관계 및 공동체 교육',
      title: '평화로운 아침 서클타임',
      text: `아침 서클타임은 본격적인 교과 수업에 앞서 매일 아침 15분간 학급 전원이 둥글게 둘러앉아 정서적 연대감을 나누는 평화 교육 활동입니다.

주요 활동 단계:
1. 체크인 (Check-in): '오늘 나의 감정 온도' 또는 마음에 쏙 드는 날씨 단어로 아침 상태를 가볍게 말합니다.
2. 경청과 토킹스틱: '이야기 막대(Talking Stick)'를 쥔 한 사람만 목소리를 내고, 나머지 친구들은 집중해서 경청합니다. 말하고 싶지 않을 때는 편안하게 패스할 권리도 존중됩니다.
3. 공동체 놀이: 서클 속에서 눈빛을 교환하고 가벼운 신체 놀이(박수 게임, 이름 부르기)를 통해 공동체의 소속감을 다집니다.
4. 갈등 예방 및 해결: 교실에 규칙이 필요하거나 친구 간 갈등이 생겼을 때, 잘잘못을 따지기 전에 각자의 마음을 서클에서 진솔하게 이야기하여 민주적이고 평화적인 약속을 직접 도출합니다.

아이들은 매일 아침 서클타임을 통해 환영받는 존재라는 안전함을 느끼고, 타인을 이해하는 성숙한 공감력을 매일 훈련하게 됩니다.`,
      bannerSvgContent: `
        <rect width="100%" height="100%" fill="var(--color-secondary-light)" />
        <circle cx="300" cy="125" r="80" fill="none" stroke="var(--color-secondary)" stroke-width="4" stroke-dasharray="12 6" />
        <text x="300" y="145" font-size="70" text-anchor="middle">❤️</text>
        <circle cx="220" cy="125" r="12" fill="var(--color-primary)" />
        <circle cx="380" cy="125" r="12" fill="var(--color-accent)" />
      `
    },
    'reading-activity': {
      tag: '감성 및 문해력 교육',
      title: '한 학기 한 권 온책 읽기',
      text: `온책 읽기는 단편적인 단원 위주의 독서 지도를 넘어서, 문학성이 뛰어난 어린이 책 한 권을 처음부터 끝까지 완전하게 감상하며 교감하는 통합 예술 교육 과정입니다.

어떻게 이루어지나요?
1. 온전히 읽기: 발췌 독서가 아닌 한 권의 책을 차근차근 다 함께 정독합니다.
2. 역할극과 인물 대화: 등장인물이 되어 가상의 가상 핫시트(Hot seat) 인터뷰나 역할극을 실행해 감정을 깊이 이입해 봅니다.
3. 깊이 있는 독서 대화: '만약 주인공이 다른 결정을 내렸다면?' 같은 답이 정해지지 않은 삶의 열린 질문들로 자유롭게 이야기 나눕니다.
4. 오감 기반 독후 표현: 독서 골든벨, 주인공에게 보낼 나만의 공예 책갈피 만들기, 책 속 장면을 그림책 삽화처럼 표현하기 등 신체, 시각, 언어를 융합한 즐거운 활동을 진행합니다.

평생 함께할 올바른 독서 흥미를 유발하고, 책 속에 펼쳐진 세상과 공감하며 깊은 문해력과 인성적 소양을 풍성하게 만듭니다.`,
      bannerSvgContent: `
        <rect width="100%" height="100%" fill="var(--color-accent-light)" />
        <text x="300" y="145" font-size="70" text-anchor="middle">📖</text>
        <path d="M 250 160 Q 300 120, 350 160" stroke="var(--color-primary)" stroke-width="4" fill="none" />
      `
    }
  };

  // Open modal
  document.querySelectorAll('.classroom-card').forEach(card => {
    card.addEventListener('click', () => {
      const activityId = card.getAttribute('data-activity');
      const data = activitiesData[activityId];
      if (data) {
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalText.textContent = data.text;
        modalBannerSvg.innerHTML = data.bannerSvgContent;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
      }
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });


  // =========================================================================
  // 3. Interactive Guestbook Board
  // =========================================================================
  const guestbookForm = document.getElementById('guestbook-form');
  const writerInput = document.getElementById('writer');
  const messageInput = document.getElementById('message');
  const colorOptions = document.querySelectorAll('.color-option');
  const postitGrid = document.getElementById('postit-grid');
  const boardEmptyState = document.getElementById('board-empty-state');

  let selectedColor = 'coral';
  let guestbookData = JSON.parse(localStorage.getItem('yoonji_class_messages')) || [];

  // Color picker selection
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedColor = option.getAttribute('data-color');
    });
  });

  // Render a single postit card
  const renderPostit = (note) => {
    const postit = document.createElement('div');
    postit.className = `postit color-${note.color}`;
    
    // Apply random slight rotation to look like a real chalkboard board
    const randomRotation = (Math.random() * 8 - 4).toFixed(2); // -4deg to 4deg
    postit.style.transform = `rotate(${randomRotation}deg)`;

    postit.innerHTML = `
      <div class="postit-content">${escapeHtml(note.message)}</div>
      <div class="postit-footer">
        <span class="postit-writer">By. ${escapeHtml(note.writer)}</span>
        <button class="postit-delete" title="지우기" aria-label="메시지 삭제">✕</button>
      </div>
    `;

    // Handle note deletion
    const deleteBtn = postit.querySelector('.postit-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Delete animation
      postit.style.transform = 'scale(0.3) rotate(15deg)';
      postit.style.opacity = '0';
      postit.style.transition = 'all 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
      
      setTimeout(() => {
        guestbookData = guestbookData.filter(item => item.id !== note.id);
        localStorage.setItem('yoonji_class_messages', JSON.stringify(guestbookData));
        postit.remove();
        checkEmptyState();
      }, 300);
    });

    postitGrid.appendChild(postit);
  };

  // Check board empty state
  const checkEmptyState = () => {
    if (postitGrid.children.length === 0) {
      boardEmptyState.style.display = 'flex';
    } else {
      boardEmptyState.style.display = 'none';
    }
  };

  // Load and display all messages
  const loadMessages = () => {
    postitGrid.innerHTML = '';
    guestbookData.forEach(note => {
      renderPostit(note);
    });
    checkEmptyState();
  };

  // Add new message on form submit
  guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const writerVal = writerInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!writerVal || !messageVal) return;

    const newNote = {
      id: Date.now().toString(),
      writer: writerVal,
      message: messageVal,
      color: selectedColor,
      date: new Date().toLocaleDateString()
    };

    // Save
    guestbookData.push(newNote);
    localStorage.setItem('yoonji_class_messages', JSON.stringify(guestbookData));

    // Render & Clean Up
    renderPostit(newNote);
    checkEmptyState();

    // Reset form
    writerInput.value = '';
    messageInput.value = '';
    
    // Smooth scroll down the board to view the new note
    const boardContainer = document.querySelector('.guestbook-board-container');
    setTimeout(() => {
      boardContainer.scrollTo({
        top: boardContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  });

  // Utility to prevent XSS (injection)
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  };

  // Initial Load
  loadMessages();

});
