import { slotText } from "./vendor/slot-text/index.js";

const statusPrimary = document.getElementById("status-primary");
const statusTimer = document.getElementById("status-timer");
const statusStrip = document.querySelector(".status-strip");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let countdownController = null;
let timerController = null;

function renderPlainText(text) {
  if (!statusPrimary) {
    return;
  }

  if (countdownController) {
    countdownController.destroy();
    countdownController = null;
  }

  statusPrimary.removeAttribute("aria-label");
  statusPrimary.textContent = text;
}

window.trackDayCountdownText = {
  render(text, isCountdown) {
    if (!statusPrimary) {
      return;
    }

    if (!isCountdown || reducedMotion.matches) {
      renderPlainText(text);
      return;
    }

    statusPrimary.setAttribute("aria-label", text);

    if (!countdownController) {
      countdownController = slotText(statusPrimary, text, {
        direction: "down",
        stagger: 12,
        duration: 250,
        exitOffset: 24,
        bounce: 0.5,
        skipUnchanged: true,
        interrupt: true
      });
      return;
    }

    countdownController.set(text);
  },
  destroy(text = statusPrimary?.textContent || "") {
    renderPlainText(text);
  }
};

function renderTimer(text) {
  if (!statusTimer) {
    return;
  }

  if (!text) {
    if (timerController) {
      timerController.destroy();
      timerController = null;
    }

    statusTimer.hidden = true;
    statusTimer.removeAttribute("aria-label");
    statusTimer.textContent = "";
    return;
  }

  statusTimer.hidden = false;
  statusTimer.setAttribute("aria-label", `${text} remaining`);

  if (reducedMotion.matches) {
    if (timerController) {
      timerController.destroy();
      timerController = null;
    }

    statusTimer.textContent = text;
    return;
  }

  if (!timerController) {
    timerController = slotText(statusTimer, text, {
      direction: "down",
      stagger: 18,
      duration: 220,
      exitOffset: 28,
      bounce: 0.25,
      skipUnchanged: true,
      interrupt: true
    });
    return;
  }

  timerController.set(text);
}

window.trackDayStatusEnhancement = {
  render(status) {
    renderTimer(status.mode === "live" ? status.timer : "");

    if (!statusStrip || !Number.isFinite(status.progress)) {
      statusStrip?.style.removeProperty("--status-progress");
      statusStrip?.removeAttribute("data-progress");
      return;
    }

    statusStrip.dataset.progress = "true";
    statusStrip.style.setProperty("--status-progress", `${status.progress * 100}%`);
  }
};

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    if (countdownController) {
      renderPlainText(countdownController.value);
    }

    if (timerController) {
      const timerText = timerController.value;
      timerController.destroy();
      timerController = null;
      statusTimer.textContent = timerText;
    }
  }
});

import("/trackdays/shared/app.js?v=20260614-status-timers");
