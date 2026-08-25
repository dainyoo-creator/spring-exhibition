// ================== 전역 침식(잠식) 상태 ==================
var totalDistortTargets = document.querySelectorAll('.distort-target').length;
var corruptedCount = 0;

var BASE_INK = '#1f2a24';
var BASE_LINE = '#000000';
var BASE_BG = '#ffffff';
var CORRUPT_INK = '#2b1f4d';   // 텍스트: 어두운 보라 (가독성 유지)
var CORRUPT_LINE = '#4c3a90'; // 테두리/밑줄: 메인 보라
var CORRUPT_BG = '#e4daf5';   // 배경: 옅은 보라 워시

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  var num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function lerpColor(hexA, hexB, t) {
  var a = hexToRgb(hexA), b = hexToRgb(hexB);
  var r = Math.round(a[0] + (b[0] - a[0]) * t);
  var g = Math.round(a[1] + (b[1] - a[1]) * t);
  var bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return 'rgb(' + r + ',' + g + ',' + bl + ')';
}

function updateCorruptionLevel() {
  if (totalDistortTargets === 0) return;
  var t = corruptedCount / totalDistortTargets; // 0 ~ 1
  var tEff = Math.pow(t, 0.75); // 완만한 곡선 — 초반보단 빠르지만 급격하진 않게

  document.documentElement.style.setProperty('--ink', lerpColor(BASE_INK, CORRUPT_INK, tEff));
  document.documentElement.style.setProperty('--line', lerpColor(BASE_LINE, CORRUPT_LINE, tEff));
  document.documentElement.style.setProperty('--bg', lerpColor(BASE_BG, CORRUPT_BG, tEff));

  var overlay = document.getElementById('corruption-overlay');
  if (overlay) overlay.style.opacity = (tEff * 0.28).toFixed(2);

  if (t >= 1) {
    document.body.classList.add('fully-corrupted');
  }
}

// ================== 디스맨을 암시하는 편집자 표기 ==================
// 침식이 진행될수록 편집자 표기가 익명 IP → 모호한 계정명 → 디스맨 그 자체로 드러남
function pickEditorName(t) {
  if (t < 0.34) {
    var ipPrefixes = ['203.0.113.', '198.51.100.', '192.0.2.'];
    return ipPrefixes[Math.floor(Math.random() * ipPrefixes.length)] + Math.floor(Math.random() * 255);
  } else if (t < 0.7) {
    var names = ['익명의 목격자', 'guest_2006', 'unknown_editor', '알 수 없음'];
    return names[Math.floor(Math.random() * names.length)];
  } else {
    var names2 = ['THIS_MAN', '그', '당신을_보고_있음'];
    return names2[Math.floor(Math.random() * names2.length)];
  }
}

function logRevision(pageEl) {
  var revisionList = document.querySelector('#page-recent .revision-list');
  if (!revisionList) return;

  var title = pageEl.dataset.title || pageEl.id;
  var t = totalDistortTargets ? corruptedCount / totalDistortTargets : 0;
  var editor = pickEditorName(t);

  var li = document.createElement('li');
  li.innerHTML = '<span class="date">방금 전</span> 「' + title + '」 문서 — 문장 1건 수정 ' +
                  '<span class="editor-tag corrupt-editor">(' + editor + ')</span>';
  revisionList.insertBefore(li, revisionList.firstChild);
}

// ================== 문서(페이지) 전환 ==================
// data-page="id" 를 가진 링크를 누르면 해당 id의 .page 요소를 보여줍니다.
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(function (el) {
    el.classList.remove('active');
  });
  var target = document.getElementById(pageId.startsWith('page-') ? pageId : 'page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    triggerDistortion(target);
  }
}

document.addEventListener('click', function (e) {
  var link = e.target.closest('[data-page]');
  if (!link) return;
  e.preventDefault();
  var pageId = link.getAttribute('data-page');
  showPage(pageId);
});

// ================== 검색 ==================
// 모든 .page 요소의 data-title 을 대상으로 간단한 부분 일치 검색을 수행합니다.
var searchInput = document.getElementById('searchInput');
var searchResults = document.getElementById('searchResults');

function getAllPages() {
  return Array.prototype.map.call(document.querySelectorAll('.page'), function (el) {
    return { id: el.id, title: el.dataset.title || el.id };
  });
}

searchInput.addEventListener('input', function () {
  var q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';

  if (!q) {
    searchResults.classList.remove('show');
    return;
  }

  var matches = getAllPages().filter(function (p) {
    return p.title.toLowerCase().indexOf(q) !== -1;
  });

  if (matches.length === 0) {
    searchResults.innerHTML = '<a href="#" style="color:var(--ink-soft);pointer-events:none;">검색 결과 없음</a>';
  } else {
    matches.forEach(function (p) {
      var a = document.createElement('a');
      a.href = '#';
      a.textContent = p.title;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showPage(p.id);
        searchResults.classList.remove('show');
        searchInput.value = '';
      });
      searchResults.appendChild(a);
    });
  }

  searchResults.classList.add('show');
});

document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-form')) {
    searchResults.classList.remove('show');
  }
});

// ================== 임의 문서 ==================
var randomBtn = document.getElementById('randomBtn');
if (randomBtn) {
  randomBtn.addEventListener('click', function () {
    // 실제 "문서"로 취급할 페이지 id 목록 (특수 페이지 제외)
    var articlePages = ['page-t014', 'page-t031', 'page-t052', 'page-t077', 'page-t009', 'page-t103', 'page-t088', 'page-t005', 'page-t019'];
    var pick = articlePages[Math.floor(Math.random() * articlePages.length)];
    showPage(pick);
  });
}

// ================== 클릭하면 바뀌는 사진 ==================
document.addEventListener('click', function (e) {
  var img = e.target.closest('.clickable-photo');
  if (!img) return;

  var images = img.dataset.images.split(',');
  var currentIndex = parseInt(img.dataset.index, 10);
  var nextIndex = (currentIndex + 1) % images.length;

  img.src = images[nextIndex];
  img.dataset.index = nextIndex;
});

// ================== 실시간 왜곡 (드래그 선택 + 타이핑 효과) ==================
function triggerDistortion(pageEl) {
  var targets = pageEl.querySelectorAll('.distort-target:not(.distorted)');
  if (targets.length === 0) return;

  targets.forEach(function (el) {
    // 문서 진입 후 1.5~5초 사이 무작위 시점에 실행 (항상 발생)
    var delay = 1500 + Math.random() * 3500;

    setTimeout(function () {
      if (!pageEl.classList.contains('active')) return; // 그 사이 다른 문서로 이동했다면 중단
      runTypingDistortion(el, pageEl);
    }, delay);
  });
}

function runTypingDistortion(el, pageEl) {
  // 0) 먼저 텍스트가 드래그로 선택되는 것처럼 보여줌
  simulateSelection(el, function () {
    startErasing(el, pageEl);
  });
}

function simulateSelection(el, onDone) {
  var textNode = el.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    onDone();
    return;
  }

  var len = textNode.textContent.length;
  var range = document.createRange();
  var sel = window.getSelection();
  var current = 0;
  var step = Math.max(1, Math.floor(len / 25)); // 약 25단계로 나눠서 진행

  var selectInterval = setInterval(function () {
    current = Math.min(current + step, len);
    range.setStart(textNode, 0);
    range.setEnd(textNode, current);
    sel.removeAllRanges();
    sel.addRange(range);

    if (current >= len) {
      clearInterval(selectInterval);
      setTimeout(function () {
        sel.removeAllRanges();
        onDone();
      }, 350); // 다 선택된 상태로 잠깐 멈춤
    }
  }, 20);
}

function startErasing(el, pageEl) {
  var original = el.dataset.original;
  var distorted = el.dataset.distorted;
  el.classList.add('distorting');

  var current = original.length;
  var eraseInterval = setInterval(function () {
    current--;
    el.textContent = original.slice(0, Math.max(current, 0));
    if (current <= 0) {
      clearInterval(eraseInterval);
      setTimeout(function () {
        typeNewText(el, distorted, pageEl);
      }, 500);
    }
  }, 35);
}

function typeNewText(el, text, pageEl) {
  var i = 0;
  var typeInterval = setInterval(function () {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typeInterval);
      el.classList.remove('distorting');
      el.classList.add('distorted');
      corruptedCount++;
      updateCorruptionLevel();
      logRevision(pageEl);
    }
  }, 45);
}