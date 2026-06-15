const lessonMotionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

function setupLessonCardTilt(card) {
  if (card.dataset.tiltReady === "true") {
    return;
  }

  card.dataset.tiltReady = "true";
  let activePointerId = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isDragging = false;

  const resetTilt = () => {
    card.classList.remove("is-lesson-tilting");
    card.style.setProperty("--lesson-rotate-x", "0deg");
    card.style.setProperty("--lesson-rotate-y", "0deg");
  };

  const updateTilt = (clientX, clientY) => {
    if (lessonMotionPreference.matches) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const horizontalPosition = ((clientX - bounds.left) / bounds.width) * 2 - 1;
    const verticalPosition = ((clientY - bounds.top) / bounds.height) * 2 - 1;
    const clampedX = Math.max(-1, Math.min(1, horizontalPosition));
    const clampedY = Math.max(-1, Math.min(1, verticalPosition));

    card.style.setProperty("--lesson-rotate-x", `${clampedY * -3}deg`);
    card.style.setProperty("--lesson-rotate-y", `${clampedX * 3}deg`);
    card.classList.add("is-lesson-tilting");
  };

  card.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || lessonMotionPreference.matches) {
      return;
    }

    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    isDragging = false;
  });

  card.addEventListener("pointermove", (event) => {
    if (lessonMotionPreference.matches) {
      return;
    }

    if (event.pointerType === "mouse") {
      updateTilt(event.clientX, event.clientY);
      return;
    }

    if (event.pointerId !== activePointerId) {
      return;
    }

    const horizontalDistance = event.clientX - pointerStartX;
    const verticalDistance = event.clientY - pointerStartY;

    if (!isDragging) {
      if (Math.abs(horizontalDistance) < 8) {
        return;
      }

      if (Math.abs(verticalDistance) > Math.abs(horizontalDistance)) {
        activePointerId = null;
        return;
      }

      isDragging = true;
      card.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    updateTilt(event.clientX, event.clientY);
  });

  const finishDrag = (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    if (card.hasPointerCapture(event.pointerId)) {
      card.releasePointerCapture(event.pointerId);
    }

    activePointerId = null;
    isDragging = false;
    resetTilt();
  };

  card.addEventListener("pointerup", finishDrag);
  card.addEventListener("pointercancel", finishDrag);
  card.addEventListener("pointerleave", () => {
    if (activePointerId === null) {
      resetTilt();
    }
  });
}

function setupLessonCards() {
  document.querySelectorAll(".lesson-card").forEach(setupLessonCardTilt);
}

setupLessonCards();
document.addEventListener("trackday:rendered", setupLessonCards);
