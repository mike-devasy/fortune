import "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
const slot = document.querySelector(".slot");
if (slot) {
  let wait = function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }, getRandomSymbol = function() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  }, createSlotItem = function(symbol) {
    return `
      <div class="slot__item">
        <img src="${symbol.src}" alt="${symbol.alt}">
      </div>
    `;
  }, fillTracksRandom = function() {
    tracks.forEach((track) => {
      let html = "";
      for (let i = 0; i < itemsPerReel; i++) {
        html += createSlotItem(getRandomSymbol());
      }
      track.innerHTML = html;
      track.style.transition = "none";
      track.style.transform = "translateY(0)";
    });
  }, fillTracksWithWinSymbol = function(winSymbol) {
    const stopIndex = itemsPerReel - 3;
    tracks.forEach((track) => {
      let html = "";
      for (let i = 0; i < itemsPerReel; i++) {
        const symbol = i === stopIndex ? winSymbol : getRandomSymbol();
        html += createSlotItem(symbol);
      }
      track.innerHTML = html;
      track.style.transition = "none";
      track.style.transform = "translateY(0)";
    });
  }, spinReel = function(track, reelIndex) {
    return new Promise((resolve) => {
      const firstItem = track.querySelector(".slot__item");
      if (!firstItem) {
        resolve();
        return;
      }
      const realItemHeight = firstItem.offsetHeight;
      const stopIndex = itemsPerReel - 3;
      const offset = stopIndex * realItemHeight;
      const duration = 1.1 + reelIndex * 0.25;
      track.style.transition = "none";
      track.style.transform = "translateY(0)";
      track.offsetHeight;
      requestAnimationFrame(() => {
        track.style.transition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
        track.style.transform = `translateY(-${offset}px)`;
      });
      setTimeout(
        () => {
          resolve();
        },
        duration * 1e3 + 150
      );
    });
  }, updateCounter = function() {
    const spinsLeft = totalSpins - currentSpin;
    spinCounter.textContent = `${spinsLeft}/4`;
  }, showSlotMessage = function(text) {
    slotMessageText.textContent = text;
    slotMessage.classList.add("is-active");
  }, hideSlotMessage = function() {
    slotMessage.classList.remove("is-active");
  }, openRegistrationPopup = function() {
    const popup = document.querySelector("#registrationPopup");
    if (!popup) return;
    popup.classList.add("is-active");
    document.body.style.overflow = "hidden";
  };
  const tracks = slot.querySelectorAll(".slot__track");
  const spinButton = document.querySelector("#spinButton");
  const spinCounter = document.querySelector("#spinCounter");
  const slotMessage = slot.querySelector("#slotMessage");
  const slotMessageText = slot.querySelector("#slotMessageText");
  const symbols = [
    {
      id: "red-envelope",
      src: "./img/slot/01.png",
      alt: "Red envelope"
    },
    {
      id: "wild-tiger",
      src: "./img/slot/02.png",
      alt: "Wild tiger"
    },
    {
      id: "orange",
      src: "./img/slot/03.png",
      alt: "Orange"
    },
    {
      id: "firecrackers",
      src: "./img/slot/04.png",
      alt: "Firecrackers"
    },
    {
      id: "gold-pot",
      src: "./img/slot/05.png",
      alt: "Gold pot"
    },
    {
      id: "drum",
      src: "./img/slot/06.png",
      alt: "Drum"
    },
    {
      id: "bear",
      src: "./img/slot/07.png",
      alt: "Bear"
    }
  ];
  const totalSpins = 4;
  const itemsPerReel = 13;
  let currentSpin = 0;
  let isAutoSpinning = false;
  const spinMessages = [
    "You won 4 free spins",
    "You won no-cash bonus",
    "You won more free spins",
    "You won cashback"
  ];
  async function runOneSpin() {
    hideSlotMessage();
    const winSymbol = getRandomSymbol();
    fillTracksWithWinSymbol(winSymbol);
    await new Promise((resolve) => requestAnimationFrame(resolve));
    currentSpin += 1;
    updateCounter();
    await Promise.all([...tracks].map((track, index) => spinReel(track, index)));
    showSlotMessage(spinMessages[currentSpin - 1]);
    await wait(1200);
  }
  async function runAutoSpins() {
    if (isAutoSpinning) return;
    isAutoSpinning = true;
    spinButton.disabled = true;
    currentSpin = 0;
    updateCounter();
    for (let i = 0; i < totalSpins; i++) {
      await runOneSpin();
    }
    await wait(500);
    openRegistrationPopup();
    isAutoSpinning = false;
  }
  spinButton.addEventListener("click", runAutoSpins);
  fillTracksRandom();
  updateCounter();
}
