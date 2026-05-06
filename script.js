const confirmTexts = [
  "정말 탈퇴하시겠습니까?",
  "정말로 탈퇴하시겠습니까?",
  "탈퇴하셔도 괜찮으신가요?",
  "탈퇴 후 후회하지 않으시겠습니까?",
  "정말 탈퇴를 원하시나요?",
  "계속 진행하시겠습니까?",
  "잠시 후 다시 시도해주세요",
  "정말 탈퇴하시겠습니까?",
  "정말로 탈퇴하시겠습니까?",
  "탈퇴 의사를 다시 한번 확인해주세요",
  "지금 탈퇴하지 않으셔도 됩니다",
  "탈퇴는 언제든지 가능합니다",
  "탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요",
  "정말 마지막으로 확인합니다",
  "탈퇴 요청이 접수되었습니다. 계속하시겠습니까?",
  "탈퇴 시 모든 데이터가 삭제됩니다. 동의하십니까?",
  "정말로 계속 진행하시겠습니까?",
  "마지막으로 한 번 더 확인합니다",
  "탈퇴를 완료하시겠습니까?",
  "최종 확인입니다"
];

let confirmStep = 0;
let startTime = null;
let secondPopupDone = false;

// 작업표시줄 시계
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('taskbar-clock');
  if (el) el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 1000);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startFlow() {
  startTime = Date.now();
  showScreen('screen-confirm');
}

function exit() {
  showScreen('screen-intro');
  confirmStep = 0;
  secondPopupDone = false;

  const text = document.getElementById('confirm-text');
  const buttonsEl = document.getElementById('buttons');
  const popup = document.getElementById('confirm-popup');

  text.textContent = '정말 탈퇴하시겠습니까?';
  popup.style.left = '';
  popup.style.top = '';
  popup.style.transform = '';
  popup.style.animation = '';
  popup.classList.remove('shake');

  buttonsEl.innerHTML = `
    <button id="yes-btn" onclick="nextConfirm()">예</button>
    <button id="no-btn" onclick="exit()">아니오</button>
  `;

  document.querySelectorAll('[id^="extra-popup"]').forEach(el => el.remove());
  document.querySelectorAll('#floating-yes, #floating-yes2').forEach(el => el.remove());
}

function nextConfirm() {
  const popup = document.getElementById('confirm-popup');
  const text = document.getElementById('confirm-text');
  const buttonsEl = document.getElementById('buttons');
  let yesBtn = document.getElementById('yes-btn');
  let noBtn = document.getElementById('no-btn');

  // 버튼 잠깐 비활성화
  if (yesBtn) yesBtn.disabled = true;
  if (noBtn) noBtn.disabled = true;
  const delay = Math.min(600 + confirmStep * 150, 3000);
  setTimeout(() => {
    const y = document.getElementById('yes-btn');
    const n = document.getElementById('no-btn');
    if (y) y.disabled = false;
    if (n) n.disabled = false;
  }, delay);

  confirmStep++;

  if (confirmStep < confirmTexts.length) {
    text.textContent = confirmTexts[confirmStep];
  }

  // 2단계 — 예 버튼 살짝 작아짐
  if (confirmStep === 2) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) yesBtn.style.fontSize = '0.9rem';
  }

  // 3단계 — 버튼 위치 바뀜
  if (confirmStep >= 3 && confirmStep < 6) {
    buttonsEl.style.flexDirection = confirmStep % 2 === 0 ? 'row' : 'row-reverse';
  }

  // 4단계 — 창 흔들림
  if (confirmStep === 4 || confirmStep === 8 || confirmStep === 13) {
    popup.classList.remove('shake');
    void popup.offsetWidth;
    popup.classList.add('shake');
  }

  // 5단계 — 예 버튼 도망치기 1차
  if (confirmStep === 5) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) yesBtn.addEventListener('mouseover', escapeButton);
  }

   // 6단계 — 아니오 두 개, hover하면 예로 바뀜
  if (confirmStep === 6) {
    buttonsEl.innerHTML = '';

    const no1 = document.createElement('button');
    no1.textContent = '아니오';
    no1.onclick = exit;
    no1.onmouseover = () => {
      no1.textContent = '예';
      no1.onclick = () => {
        confirmStep = 7;
        text.textContent = confirmTexts[7];
        buttonsEl.innerHTML = `
          <button id="yes-btn" onclick="nextConfirm()">예</button>
          <button id="no-btn" onclick="exit()">아니오</button>
        `;
      };
    };
    no1.onmouseout = () => {
      no1.textContent = '아니오';
      no1.onclick = exit;
    };

    const no2 = document.createElement('button');
    no2.textContent = '아니오';
    no2.onclick = exit;

    buttonsEl.appendChild(no1);
    buttonsEl.appendChild(no2);
    return;
  }

  // 7단계 — 예 버튼 흐릿하게
  if (confirmStep === 7) {
    buttonsEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'yes-btn';
    btn.textContent = '예';
    btn.style.opacity = '0.3';
    btn.style.fontSize = '0.8rem';
    btn.onclick = nextConfirm;
    const no = document.createElement('button');
    no.id = 'no-btn';
    no.textContent = '아니오';
    no.onclick = exit;
    buttonsEl.appendChild(btn);
    buttonsEl.appendChild(no);
  }

  // 8단계 — 창 더 크게 흔들림
  if (confirmStep === 8) {
    popup.style.animation = 'shake 0.2s ease infinite';
    setTimeout(() => { popup.style.animation = ''; }, 2000);
  }

  // 9단계 — 예 버튼 도망치기 2차
  if (confirmStep === 9) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.removeEventListener('mouseover', escapeButton);
      yesBtn.addEventListener('mouseover', escapeButtonFast);
    }
  }

  // 10단계 — 팝업 여러 개
  if (confirmStep === 10 && !secondPopupDone) {
    secondPopupDone = true;
    const positions = [
      { left: 'calc(50% + 60px)', top: 'calc(50% + 50px)' },
      { left: 'calc(50% - 200px)', top: 'calc(50% + 70px)' },
      { left: 'calc(50% + 120px)', top: 'calc(50% - 90px)' },
    ];
    positions.forEach((pos, i) => {
      const ep = document.createElement('div');
      ep.className = 'window';
      ep.id = `extra-popup-${i}`;
      ep.style.position = 'absolute';
      ep.style.left = pos.left;
      ep.style.top = pos.top;
      ep.style.transform = 'translate(-50%, -50%)';
      ep.style.zIndex = 100 + i;
      ep.innerHTML = `
        <div class="window-titlebar">
          <span class="titlebar-icon">❓</span>
          <span class="titlebar-title">확인 필요</span>
          <div class="window-titlebar-buttons">
            <button class="titlebar-btn">_</button>
            <button class="titlebar-btn">□</button>
            <button class="titlebar-btn">✕</button>
          </div>
        </div>
        <hr class="window-divider">
        <div class="window-content">
          <div class="window-icon">❓</div>
          <p>탈퇴 의사를 다시 한번 확인해주세요</p>
          <div class="buttons">
            <button onclick="removeOnePopup(${i})">예</button>
            <button onclick="exit()">아니오</button>
          </div>
        </div>
      `;
      document.getElementById('app').appendChild(ep);
    });
    confirmStep--;
    return;
  }

   // 11단계 — 아니오 두 개, hover하면 예로 바뀜
  if (confirmStep === 11) {
    buttonsEl.innerHTML = '';

    const no1 = document.createElement('button');
    no1.textContent = '아니오';
    no1.onclick = exit;

    const no2 = document.createElement('button');
    no2.textContent = '아니오';
    no2.onclick = exit;
    no2.onmouseover = () => {
      no2.textContent = '예';
      no2.onclick = () => {
        confirmStep = 12;
        text.textContent = confirmTexts[12];
        buttonsEl.innerHTML = '';
        const btn = document.createElement('button');
        btn.id = 'yes-btn';
        btn.textContent = '예';
        btn.disabled = true;
        const no = document.createElement('button');
        no.id = 'no-btn';
        no.textContent = '아니오';
        no.disabled = true;
        no.onclick = exit;
        buttonsEl.appendChild(btn);
        buttonsEl.appendChild(no);
        setTimeout(() => {
          btn.disabled = false;
          no.disabled = false;
          btn.onclick = nextConfirm;
        }, 4000);
      };
    };
    no2.onmouseout = () => {
      no2.textContent = '아니오';
      no2.onclick = exit;
    };

    buttonsEl.appendChild(no1);
    buttonsEl.appendChild(no2);
    return;
  }

  // 12단계 — 버튼 지연
  if (confirmStep === 12) {
    buttonsEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.id = 'yes-btn';
    btn.textContent = '예';
    btn.disabled = true;
    const no = document.createElement('button');
    no.id = 'no-btn';
    no.textContent = '아니오';
    no.disabled = true;
    no.onclick = exit;
    buttonsEl.appendChild(btn);
    buttonsEl.appendChild(no);
    setTimeout(() => {
      btn.disabled = false;
      no.disabled = false;
      btn.onclick = nextConfirm;
    }, 4000);
  }

  // 13단계 — 창 흔들림 + 예 버튼 도망
  if (confirmStep === 13) {
    popup.classList.remove('shake');
    void popup.offsetWidth;
    popup.classList.add('shake');
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) yesBtn.addEventListener('mouseover', escapeButtonFast);
  }

   // 14단계 — 예 버튼 흐릿하게
  if (confirmStep === 14) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.style.opacity = '0.35';
      yesBtn.style.fontSize = '0.85rem';
    }
  }

  // 15단계 — 버튼 위치 다시 바뀜
  if (confirmStep === 15) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.style.opacity = '1';
      yesBtn.style.fontSize = '0.9rem';
    }
    buttonsEl.style.flexDirection = 'row-reverse';
  }

  // 16단계 — 창 흔들림 + 버튼 지연
  if (confirmStep === 16) {
    popup.classList.remove('shake');
    void popup.offsetWidth;
    popup.classList.add('shake');
    yesBtn = document.getElementById('yes-btn');
    noBtn = document.getElementById('no-btn');
    if (yesBtn) yesBtn.disabled = true;
    if (noBtn) noBtn.disabled = true;
    setTimeout(() => {
      const y = document.getElementById('yes-btn');
      const n = document.getElementById('no-btn');
      if (y) { y.disabled = false; y.onclick = nextConfirm; }
      if (n) { n.disabled = false; n.onclick = exit; }
    }, 3000);
  }

  // 17단계 — 예 버튼 도망치기 3차
  if (confirmStep === 17) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) yesBtn.addEventListener('mouseover', escapeButtonFast);
  }

  // 18단계 — 예 버튼 매우 작고 흐릿
  if (confirmStep === 18) {
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.style.opacity = '0.2';
      yesBtn.style.fontSize = '0.5rem';
      yesBtn.style.minWidth = '40px';
      yesBtn.style.padding = '4px 8px';
    }
  }

  // 19단계 — 창 흔들림 + 예 버튼 도망
  if (confirmStep === 19) {
    popup.classList.remove('shake');
    void popup.offsetWidth;
    popup.classList.add('shake');
    yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
      yesBtn.style.opacity = '1';
      yesBtn.style.fontSize = '0.9rem';
      yesBtn.style.minWidth = '90px';
      yesBtn.style.padding = '6px 28px';
      yesBtn.addEventListener('mouseover', escapeButtonFast);
    }
  }

  // 랜덤 위치 이동
  if (confirmStep >= 4 && confirmStep !== 6 && confirmStep !== 11) {
    const x = Math.random() * 160 - 80;
    const y = Math.random() * 80 - 40;
    popup.style.left = `calc(50% + ${x}px)`;
    popup.style.top = `calc(50% + ${y}px)`;
    popup.style.transform = 'translate(-50%, -50%)';
  }

  // 마지막 단계 — 로딩으로
  if (confirmStep >= confirmTexts.length) {
    setTimeout(() => { startLoading(); }, 600);
  }
}

function removeOnePopup(index) {
  const el = document.getElementById(`extra-popup-${index}`);
  if (el) el.remove();
  const remaining = document.querySelectorAll('[id^="extra-popup-"]').length;
    if (remaining === 0) {
    secondPopupDone = true;
    showFiveYesButtons();
  }
}

function escapeButton() {
  const btn = document.getElementById('yes-btn');
  if (!btn) return;
  const x = Math.random() * 40 - 20;
  const y = Math.random() * 40 - 20;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

function escapeButtonFast() {
  const btn = document.getElementById('yes-btn');
  if (!btn) return;
  const x = Math.random() * 120 - 60;
  const y = Math.random() * 120 - 60;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

function startLoading() {
  showScreen('screen-loading');
  const bar = document.getElementById('loading-bar');
  const percent = document.getElementById('loading-percent');
  let current = 0;
  const interval = setInterval(() => {
    if (current < 100) {
      current += Math.random() * 2;
      if (current > 100) current = 100;
      bar.style.width = current + '%';
      percent.textContent = Math.floor(current) + '%';
    } else {
      clearInterval(interval);
      setTimeout(() => {
        showScreen('screen-done');
        setTimeout(() => { showEnding(); }, 2000);
      }, 500);
    }
  }, 100);
}

function showEnding() {
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const timeText = minutes > 0
    ? `계정 탈퇴까지 ${minutes}분 ${seconds}초가 걸렸습니다`
    : `계정 탈퇴까지 ${seconds}초가 걸렸습니다`;
  document.getElementById('ending-time').textContent = timeText;
  showScreen('screen-ending');
}

function restart() {
  exit();
  startTime = Date.now();
}

function showFiveYesButtons() {
  const buttonsEl = document.getElementById('buttons');
  const text = document.getElementById('confirm-text');
  text.textContent = '탈퇴를 진행하려면 모든 버튼을 눌러주세요';
  buttonsEl.innerHTML = '';
  buttonsEl.style.flexWrap = 'wrap';
  buttonsEl.style.gap = '8px';
  buttonsEl.style.justifyContent = 'center';

  let clicked = 0;
  const total = 5;

  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.textContent = '예';
    btn.style.minWidth = '60px';
    btn.onclick = () => {
      btn.disabled = true;
      btn.style.opacity = '0.3';
      clicked++;
      if (clicked >= total) {
        setTimeout(() => {
          buttonsEl.style.flexWrap = '';
          confirmStep = 11;
          const t = document.getElementById('confirm-text');
          t.textContent = confirmTexts[11];
          buttonsEl.innerHTML = '';

          const no1 = document.createElement('button');
          no1.textContent = '아니오';
          no1.onclick = exit;

          const no2 = document.createElement('button');
          no2.textContent = '아니오';
          no2.onclick = exit;
          no2.onmouseover = () => {
            no2.textContent = '예';
            no2.onclick = () => {
              confirmStep = 12;
              t.textContent = confirmTexts[12];
              buttonsEl.innerHTML = '';
              const b = document.createElement('button');
              b.id = 'yes-btn';
              b.textContent = '예';
              b.disabled = true;
              const n = document.createElement('button');
              n.id = 'no-btn';
              n.textContent = '아니오';
              n.disabled = true;
              n.onclick = exit;
              buttonsEl.appendChild(b);
              buttonsEl.appendChild(n);
              setTimeout(() => {
                b.disabled = false;
                n.disabled = false;
                b.onclick = nextConfirm;
              }, 4000);
            };
          };
          no2.onmouseout = () => {
            no2.textContent = '아니오';
            no2.onclick = exit;
          };

          buttonsEl.appendChild(no1);
          buttonsEl.appendChild(no2);
        }, 500);
      }
    };
    buttonsEl.appendChild(btn);
  }
}