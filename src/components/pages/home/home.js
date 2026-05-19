import "./home.scss"
import slot01 from "../../../assets/img/slot/01.png"
import slot02 from "../../../assets/img/slot/02.png"
import slot03 from "../../../assets/img/slot/03.png"
import slot04 from "../../../assets/img/slot/04.png"
import slot05 from "../../../assets/img/slot/05.png"
import slot06 from "../../../assets/img/slot/06.png"
import slot07 from "../../../assets/img/slot/07.png"
const slot = document.querySelector(".slot")

if (slot) {
  const tracks = slot.querySelectorAll(".slot__track")
  const spinButton = document.querySelector("#spinButton")
  const spinCounter = document.querySelector("#spinCounter")
  const slotMessage = slot.querySelector("#slotMessage")
  const slotMessageText = slot.querySelector("#slotMessageText")

  const symbols = [
    {
      id: "red-envelope",
      src: slot01,
      alt: "Red envelope",
    },
    {
      id: "wild-tiger",
      src: slot02,
      alt: "Wild tiger",
    },
    {
      id: "orange",
      src: slot03,
      alt: "Orange",
    },
    {
      id: "firecrackers",
      src: slot04,
      alt: "Firecrackers",
    },
    {
      id: "gold-pot",
      src: slot05,
      alt: "Gold pot",
    },
    {
      id: "drum",
      src: slot06,
      alt: "Drum",
    },
    {
      id: "bear",
      src: slot07,
      alt: "Bear",
    },
  ]
  const totalSpins = 4
  const itemsPerReel = 13

  let currentSpin = 0
  let isAutoSpinning = false

  const spinMessages = [
    "You won 4 free spins",
    "You won no-cash bonus",
    "You won more free spins",
    "You won cashback",
  ]

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length)
    return symbols[randomIndex]
  }

  function createSlotItem(symbol) {
    return `
      <div class="slot__item">
        <img src="${symbol.src}" alt="${symbol.alt}">
      </div>
    `
  }

  function fillTracksRandom() {
    tracks.forEach((track) => {
      let html = ""

      for (let i = 0; i < itemsPerReel; i++) {
        html += createSlotItem(getRandomSymbol())
      }

      track.innerHTML = html
      track.style.transition = "none"
      track.style.transform = "translateY(0)"
    })
  }

  function fillTracksWithWinSymbol(winSymbol) {
    const stopIndex = itemsPerReel - 3

    tracks.forEach((track) => {
      let html = ""

      for (let i = 0; i < itemsPerReel; i++) {
        const symbol = i === stopIndex ? winSymbol : getRandomSymbol()

        html += createSlotItem(symbol)
      }

      track.innerHTML = html
      track.style.transition = "none"
      track.style.transform = "translateY(0)"
    })
  }

  function spinReel(track, reelIndex) {
    return new Promise((resolve) => {
      const firstItem = track.querySelector(".slot__item")

      if (!firstItem) {
        resolve()
        return
      }

      const realItemHeight = firstItem.offsetHeight
      const stopIndex = itemsPerReel - 3
      const offset = stopIndex * realItemHeight
      const duration = 1.1 + reelIndex * 0.25

      track.style.transition = "none"
      track.style.transform = "translateY(0)"

      track.offsetHeight

      requestAnimationFrame(() => {
        track.style.transition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`
        track.style.transform = `translateY(-${offset}px)`
      })

      setTimeout(
        () => {
          resolve()
        },
        duration * 1000 + 150,
      )
    })
  }

  function updateCounter() {
    const spinsLeft = totalSpins - currentSpin
    spinCounter.textContent = `${spinsLeft}/4`
  }

  function showSlotMessage(text) {
    slotMessageText.textContent = text
    slotMessage.classList.add("is-active")
  }

  function hideSlotMessage() {
    slotMessage.classList.remove("is-active")
  }
  function openRegistrationPopup() {
    if (!window.flsPopup) return

    window.flsPopup.open("popup")
  }

  async function runOneSpin() {
    hideSlotMessage()

    const winSymbol = getRandomSymbol()

    fillTracksWithWinSymbol(winSymbol)

    await new Promise((resolve) => requestAnimationFrame(resolve))

    currentSpin += 1
    updateCounter()

    await Promise.all([...tracks].map((track, index) => spinReel(track, index)))

    showSlotMessage(spinMessages[currentSpin - 1])

    await wait(1200)
  }

  async function runAutoSpins() {
    if (isAutoSpinning) return

    isAutoSpinning = true
    spinButton.disabled = true

    currentSpin = 0
    updateCounter()

    for (let i = 0; i < totalSpins; i++) {
      await runOneSpin()
    }

    await wait(500)

    openRegistrationPopup()

    isAutoSpinning = false
  }

  spinButton.addEventListener("click", runAutoSpins)

  fillTracksRandom()
  updateCounter()
}
// Form connection=================================
import { initPasswordToggle } from "./password-toggle.js"
import { initFormValidation } from "./form-validation.js"
import { initPhoneMask } from "./phone-select.js"
document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggle()
  initFormValidation()
  initPhoneMask()
})