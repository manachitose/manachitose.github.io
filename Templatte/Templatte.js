(function () {
  var root = document.documentElement;
  var STORAGE_KEY = 'templatte-guide-theme';
  var themeToggle = document.getElementById('themeToggle');
  var themeLabel = document.getElementById('themeLabel');

  function applyTheme(mode) {
    if (mode === 'dark' || mode === 'light') {
      root.setAttribute('data-theme', mode);
    } else {
      root.removeAttribute('data-theme');
    }
    themeLabel.textContent = mode === 'dark' ? 'ダーク表示' : mode === 'light' ? 'ライト表示' : 'OSに合わせる';
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(savedTheme || 'system');

  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || 'system';
    var next = current === 'system' ? 'dark' : current === 'dark' ? 'light' : 'system';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  });

  var shareBtn = document.getElementById('shareBtn');
  var shareMenu = document.getElementById('shareMenu');
  var shareTwitter = document.getElementById('shareTwitter');
  var shareCopy = document.getElementById('shareCopy');

  function copyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  if (shareBtn) {
    var shareData = {
      title: document.title,
      text: 'Templatte 使い方ガイド',
      url: location.href
    };

    shareTwitter.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareData.text) + '&url=' + encodeURIComponent(shareData.url);

    var closeShareMenu = function () {
      shareMenu.hidden = true;
      shareBtn.setAttribute('aria-expanded', 'false');
    };

    shareBtn.addEventListener('click', function () {
      if (navigator.share && location.protocol !== 'file:') {
        navigator.share(shareData).catch(function () {});
        return;
      }
      var willOpen = shareMenu.hidden;
      shareMenu.hidden = !willOpen;
      shareBtn.setAttribute('aria-expanded', String(willOpen));
    });

    shareCopy.addEventListener('click', function () {
      var done = function () {
        var original = shareCopy.textContent;
        shareCopy.textContent = 'コピーしました！';
        setTimeout(function () {
          shareCopy.textContent = original;
          closeShareMenu();
        }, 1200);
      };
      if (navigator.clipboard && location.protocol !== 'file:') {
        navigator.clipboard.writeText(shareData.url).then(done).catch(function () {
          copyFallback(shareData.url);
          done();
        });
      } else {
        copyFallback(shareData.url);
        done();
      }
    });

    document.addEventListener('click', function (e) {
      if (!shareMenu.hidden && !e.target.closest('.share-widget')) {
        closeShareMenu();
      }
    });
  }

  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('scrim');
  var toggle = document.getElementById('navToggle');
  function openNav() { sidebar.classList.add('open'); scrim.classList.add('open'); toggle.classList.add('is-open'); }
  function closeNav() { sidebar.classList.remove('open'); scrim.classList.remove('open'); toggle.classList.remove('is-open'); }
  toggle.addEventListener('click', function () {
    sidebar.classList.contains('open') ? closeNav() : openNav();
  });
  scrim.addEventListener('click', closeNav);
  sidebar.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  var toolsDropdown = document.getElementById('toolsDropdown');
  if (toolsDropdown) {
    document.addEventListener('click', function (e) {
      if (toolsDropdown.open && !toolsDropdown.contains(e.target)) {
        toolsDropdown.open = false;
      }
    });
  }

  var progress = document.getElementById('progress');
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  var sections = Array.prototype.slice.call(document.querySelectorAll('section.chapter'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  function updateActive() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
