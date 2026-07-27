(function () {
  "use strict";

  /* theme toggle: cycles system → dark → light → system */
  var root = document.documentElement;
  var STORAGE_KEY = "profile-theme";
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

  /* ============================================================
     シェアボタン
     - Web Share API対応環境（主にスマホ）ではOS標準の共有シートを開く
     - 非対応環境ではXへの投稿／リンクコピーの簡易メニューを表示する
     ============================================================ */
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
      text: "千歳愛 | VTuber / クリエイター",
      url: location.href
    };

    shareTwitter.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareData.text) + "&url=" + encodeURIComponent(shareData.url);

    function closeShareMenu() {
      shareMenu.hidden = true;
      shareBtn.setAttribute("aria-expanded", "false");
    }

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

  /* ============================================================
     ソーシャルリンク一覧
     - ここに増減・並び替えを反映すれば画面側に自動反映されます
     - icon: assets/icons/ に置いたアイコン画像ファイル名
             （まだ画像を置いていない場合は自動的に頭文字を表示します）
     - url: 各サービスの自分のページURLに書き換えてください
     ============================================================ */
  var SOCIAL_LINKS = [
    { label: "Twitter",       icon: "assets/icons/twitter.svg",       url: "https://x.com/ManaChitose" },
    { label: "YouTube", icon: "assets/icons/youtube.svg", url: "https://www.youtube.com/@ManaChitose" },
    { label: "Wick",    icon: "assets/icons/wick.png",    url: "https://wick-sns.com/sns/profile/eb87d56d-8860-4229-8835-e87f90ad5cba" },
    { label: "つなぐ",   icon: "assets/icons/tsunagu.jpeg", url: "https://tsunagu.cloud/users/ManaChitose" },
    { label: "Booth",   icon: "assets/icons/booth.png",   url: "https://manachitose.booth.pm/" },
    { label: "VRChat",  icon: "assets/icons/vrchat.png",  url: "https://vrchat.com/home/user/usr_51dc2b5f-a380-495c-ae54-d3549e3eb3b3" },
    { label: "Skeb",    icon: "assets/icons/skeb.svg", url: "https://skeb.jp/@ManaChitose" },
    { label: "Gipt",    icon: "assets/icons/gipt.png", url: "https://gi-pt.com/main/wishlist/fan-view/3a101f49-c3c2-0da6-5a9f-eb713f8e2978"}
  ];

  var grid = document.getElementById("socialGrid");
  SOCIAL_LINKS.forEach(function (link) {
    var a = document.createElement("a");
    a.className = "social-link";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener";

    var iconWrap = document.createElement("span");
    iconWrap.className = "icon";

    var img = document.createElement("img");
    img.src = link.icon;
    img.alt = "";
    img.addEventListener("error", function () {
      img.classList.add("is-broken");
    });

    var fallback = document.createElement("span");
    fallback.className = "icon-fallback";
    fallback.textContent = link.label.slice(0, 1);

    iconWrap.appendChild(img);
    iconWrap.appendChild(fallback);

    var text = document.createElement("span");
    text.className = "sr-only";
    text.textContent = link.label;

    a.title = link.label;
    a.setAttribute("aria-label", link.label);

    a.appendChild(iconWrap);
    a.appendChild(text);
    grid.appendChild(a);
  });

  /* ============================================================
     ご依頼価格イメージ（つなぐの出品カード）
     - title/price/desc/image/url を書き換えるだけで反映されます
     - image が読み込めない場合は自動でプレースホルダー表示になります
     ============================================================ */
  var PRICE_LINKS = [
    {
      title: "バストアップイラスト",
      price: "¥8,000〜12,000",
      desc: "SNSアイコンや配信サムネにも使える、その子らしさが伝わる一枚を",
      image: "https://dzora1h54m7yz.cloudfront.net/public/product_images/ysdCttzEciCwSx6UsazWYJUcpDTZCANVaQBO4O1LMvRynXKwH8.png",
      url: "https://tsunagu.cloud/products/113200"
    },
    {
      title: "全身イラスト",
      price: "¥15,000〜25,000",
      desc: "活動で使いやすい、可愛い立ち姿の全身イラストを",
      image: "https://dzora1h54m7yz.cloudfront.net/public/product_images/gfycnA7fhDNzad2Aii7r0BT93WjWRGOQvac7WBVcWOY676V2ib.jpg",
      url: "https://tsunagu.cloud/products/113202"
    },
    {
      title: "Live2Dモーション付きバストアップ動画",
      price: "¥25,000〜",
      desc: "動くカットイン/ないすぱ！/ないめん！etc.",
      image: "https://dzora1h54m7yz.cloudfront.net/public/product_images/X0Lv3qe3LnuvKneow5KCol7DsVJvzDmHOVD04kjWOTWQS9Q2rj.jpg",
      url: "https://tsunagu.cloud/products/56454"
    },
    {
      title: "Live2Dモーション付き全身イラスト",
      price: "¥35,000〜60,000",
      desc: "待機画面・MV・動画にも使える、動く全身イラストを制作",
      image: "https://dzora1h54m7yz.cloudfront.net/public/product_images/F81o5LGkG8WB72RDx3IS2MLa3NofyCHkcP5pPvRDPsFdGH3Mod.jpg",
      url: "https://tsunagu.cloud/products/113210"
    },
    {
      title: "VTuber活動用Live2Dモデル制作",
      price: "¥200,000〜",
      desc: "デザインから活動まで、一緒に作るVTuberモデル",
      image: "https://dzora1h54m7yz.cloudfront.net/public/product_images/HLKUUEK1W785K4OJE8UGScCkiRSvjr9hIIuuy2i8yUHnoW02uT.jpg",
      url: "https://tsunagu.cloud/products/113213"
    }
  ];

  var priceGrid = document.getElementById("priceGrid");
  if (priceGrid) {
    PRICE_LINKS.forEach(function (item) {
      var a = document.createElement("a");
      a.className = "price-card";
      a.href = item.url;
      a.target = "_blank";
      a.rel = "noopener";

      var img = document.createElement("img");
      img.className = "price-card-image";
      img.src = item.image;
      img.alt = item.title;
      img.loading = "lazy";
      img.addEventListener("error", function () {
        img.classList.add("is-broken");
      });

      var body = document.createElement("div");
      body.className = "price-card-body";

      var title = document.createElement("p");
      title.className = "price-card-title";
      title.textContent = item.title;

      var price = document.createElement("p");
      price.className = "price-card-price";
      price.textContent = item.price;

      var desc = document.createElement("p");
      desc.className = "price-card-desc";
      desc.textContent = item.desc;

      body.appendChild(title);
      body.appendChild(price);
      body.appendChild(desc);

      a.appendChild(img);
      a.appendChild(body);
      priceGrid.appendChild(a);
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
