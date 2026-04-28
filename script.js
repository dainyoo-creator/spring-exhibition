const confirmTexts = [
  "정말 탈퇴하시겠습니까?",
  "정말로 탈퇴하시겠습니까?",
  "탈퇴하셔도 괜찮으신가요?",
  "탈퇴 후 후회하지 않으시겠습니까?",
  "지금 탈퇴하지 않으셔도 됩니다",
  "탈퇴는 언제든지 가능합니다",
  "정말 마지막으로 확인합니다"
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
  const popup = document.getElementById('confirm-popup');
  const text = document.getElementById('confirm-text');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');

  // 잠깐 기다리게 만들기
  yesBtn.disabled = true;
  noBtn.disabled = true;
  setTimeout(() => {
    yesBtn.disabled = false;
    noBtn.disabled = false;
  }, 800 + confirmStep * 200);

  confirmStep++;

  // 문구 변경
  if (confirmStep < confirmTexts.length) {
    text.textContent = confirmTexts[confirmStep];
  }

  // 팝업 점점 커짐
  const currentPadding = 40 + confirmStep * 15;
  popup.style.padding = currentPadding + 'px';

  // 예 버튼 점점 흐려지고 작아짐
  const opacity = Math.max(0.2, 1 - confirmStep * 0.1);
  const fontSize = Math.max(0.5, 1 - confirmStep * 0.08);
  yesBtn.style.opacity = opacity;
  yesBtn.style.fontSize = fontSize + 'rem';

  // 아니오 버튼 점점 커지고 강조됨
  const noBtnSize = Math.min(1.4, 0.95 + confirmStep * 0.08);
  noBtn.style.fontSize = noBtnSize + 'rem';
  noBtn.style.backgroundColor = `rgba(0, 0, 0, ${Math.min(0.9, confirmStep * 0.12)})`;
  noBtn.style.color = '#fff';

  // 버튼 위치 바뀜
  const buttons = document.querySelector('.buttons');
  if (confirmStep % 2 === 0) {
    buttons.style.flexDirection = 'row';
  } else {
    buttons.style.flexDirection = 'row-reverse';
  }

  // 배경 점점 어두워짐
  const bgValue = Math.max(200, 245 - confirmStep * 8);
  document.body.style.backgroundColor = `rgb(${bgValue}, ${bgValue}, ${bgValue + 2})`;

  // 팝업 흔들림
  popup.classList.remove('shake');
  void popup.offsetWidth;
  popup.classList.add('shake');

  // 팝업 위치 랜덤하게 이동
  if (confirmStep >= 3) {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 100 - 50;
    popup.style.left = `calc(50% + ${x}px)`;
    popup.style.top = `calc(50% + ${y}px)`;
    popup.style.transform = 'translate(-50%, -50%)';
  }

  // 예 버튼 커서 피하기
  if (confirmStep >= 4) {
    yesBtn.addEventListener('mouseover', escapeButton);
  }

  // 마지막 단계에서 엔딩으로
  if (confirmStep >= confirmTexts.length) {
    setTimeout(() => {
      showScreen('screen-ending');
    }, 600);
  }
}

function escapeButton() {
  const btn = document.getElementById('yes-btn');
  const x = Math.random() * 80 - 40;
  const y = Math.random() * 80 - 40;
  btn.style.transform = `translate(${x}px, ${y}px)`;
}

