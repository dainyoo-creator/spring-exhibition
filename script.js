const confirmTexts = [
  "정말 탈퇴하시겠습니까?",
  "정말로 탈퇴하시겠습니까?",
  "탈퇴하셔도 괜찮으신가요?",
  "탈퇴 후 후회하지 않으시겠습니까?"
];

let confirmStep = 0;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function startFlow() {
  showScreen('screen-confirm');
}

function exit() {
  alert("아니오를 선택하셨습니다.");
}

function nextConfirm() {
  confirmStep++;

  const popup = document.getElementById('confirm-popup');
  const text = document.getElementById('confirm-text');
  const yesBtn = document.getElementById('yes-btn');

  if (confirmStep < confirmTexts.length) {
    text.textContent = confirmTexts[confirmStep];
  }

  const currentSize = 40 + confirmStep * 20;
  popup.style.padding = currentSize + 'px';

  const currentFontSize = Math.max(0.5, 1 - confirmStep * 0.15);
  yesBtn.style.fontSize = currentFontSize + 'rem';

  const buttons = document.querySelector('.buttons');
  if (confirmStep % 2 === 0) {
    buttons.style.flexDirection = 'row';
  } else {
    buttons.style.flexDirection = 'row-reverse';
  }

  if (confirmStep >= confirmTexts.length - 1) {
    yesBtn.addEventListener('mouseover', escapeButton);
  }

  if (confirmStep >= 4) {
    showScreen('screen-ending');
  }
}

function escapeButton() {
  const btn = document.getElementById('yes-btn');
  const x = Math.random() * 60 - 30;
  const y = Math.random() * 60 - 30;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

