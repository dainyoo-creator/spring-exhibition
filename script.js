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
    var articlePages = ['page-sample'];
    var pick = articlePages[Math.floor(Math.random() * articlePages.length)];
    showPage(pick);
  });
}
