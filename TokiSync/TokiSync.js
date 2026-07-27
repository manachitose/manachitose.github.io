(function () {
  "use strict";

  /* theme toggle: cycles system → dark → light → system */
  var root = document.documentElement;
  var STORAGE_KEY = "tokisync-guide-theme";
  var themeToggle = document.getElementById("themeToggle");
  var themeLabel = document.getElementById("themeLabel");

  function applyTheme(mode) {
    if (mode === "dark" || mode === "light") {
      root.setAttribute("data-theme", mode);
    } else {
      root.removeAttribute("data-theme");
    }
    themeLabel.textContent = mode === "dark" ? "ダーク表示" : mode === "light" ? "ライト表示" : "OSに合わせる";
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  applyTheme(saved || "system");

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme") || "system";
    var next = current === "system" ? "dark" : current === "dark" ? "light" : "system";
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  });

  /* シェアボタン: Web Share API対応環境ではOS標準の共有シート、非対応環境ではX投稿／リンクコピーの簡易メニュー */
  var shareBtn = document.getElementById("shareBtn");
  var shareMenu = document.getElementById("shareMenu");
  var shareTwitter = document.getElementById("shareTwitter");
  var shareCopy = document.getElementById("shareCopy");

  function copyFallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  if (shareBtn) {
    var shareData = {
      title: document.title,
      text: "TokiSync 使い方ガイド",
      url: location.href
    };

    shareTwitter.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareData.text) + "&url=" + encodeURIComponent(shareData.url);

    var closeShareMenu = function () {
      shareMenu.hidden = true;
      shareBtn.setAttribute("aria-expanded", "false");
    };

    shareBtn.addEventListener("click", function () {
      if (navigator.share && location.protocol !== "file:") {
        navigator.share(shareData).catch(function () {});
        return;
      }
      var willOpen = shareMenu.hidden;
      shareMenu.hidden = !willOpen;
      shareBtn.setAttribute("aria-expanded", String(willOpen));
    });

    shareCopy.addEventListener("click", function () {
      var done = function () {
        var original = shareCopy.textContent;
        shareCopy.textContent = "コピーしました！";
        setTimeout(function () {
          shareCopy.textContent = original;
          closeShareMenu();
        }, 1200);
      };
      if (navigator.clipboard && location.protocol !== "file:") {
        navigator.clipboard.writeText(shareData.url).then(done).catch(function () {
          copyFallback(shareData.url);
          done();
        });
      } else {
        copyFallback(shareData.url);
        done();
      }
    });

    document.addEventListener("click", function (e) {
      if (!shareMenu.hidden && !e.target.closest(".share-widget")) {
        closeShareMenu();
      }
    });
  }

  /* mobile sidebar toggle */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("scrim");
  var navToggle = document.getElementById("navToggle");

  function closeSidebar() {
    sidebar.classList.remove("open");
    scrim.classList.remove("open");
    navToggle.classList.remove("is-open");
  }
  navToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    scrim.classList.toggle("open");
    navToggle.classList.toggle("is-open");
  });
  scrim.addEventListener("click", closeSidebar);
  sidebar.querySelectorAll(".nav-link").forEach(function (a) {
    a.addEventListener("click", closeSidebar);
  });

  /* breadcrumb tools dropdown: close on outside click */
  var toolsDropdown = document.getElementById("toolsDropdown");
  if (toolsDropdown) {
    document.addEventListener("click", function (e) {
      if (toolsDropdown.open && !toolsDropdown.contains(e.target)) {
        toolsDropdown.open = false;
      }
    });
  }

  /* scroll progress bar */
  var progress = document.getElementById("progress");
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + "%";
  }

  /* scroll-spy for active chapter link */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = links
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function updateActive() {
    var pos = window.scrollY + 120;
    var activeIndex = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) activeIndex = i;
    }
    links.forEach(function (a) { a.classList.remove("active"); });
    if (links[activeIndex]) links[activeIndex].classList.add("active");
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgress();
  updateActive();
})();
