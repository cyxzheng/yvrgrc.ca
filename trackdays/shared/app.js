let scheduleRefreshTimerId = null;

function getStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    return;
  }
}

function updateTopChromeHeight() {
  const root = document.documentElement;
  const siteHeader = document.querySelector(".site-header");

  if (!root || !siteHeader) {
    return;
  }

  root.style.setProperty("--top-chrome-height", `${Math.ceil(siteHeader.offsetHeight)}px`);
}

function setupViewportOffsets() {
  updateTopChromeHeight();
  window.addEventListener("resize", updateTopChromeHeight);
}

function setActiveSectionNavLink(activeId) {
  const navLinks = document.querySelectorAll(".section-nav a");

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
      return;
    }

    link.removeAttribute("aria-current");
  });
}

function setupSectionNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll(".section-nav a"));

  if (!navLinks.length) {
    return;
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  let activeSectionId = sections[0].id;
  let suppressObserver = false;
  let resumeObserverTimerId = null;
  let scrollTicking = false;

  setActiveSectionNavLink(activeSectionId);

  function getCssPixelValue(name) {
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(name);
    const parsedValue = Number.parseFloat(value);

    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  function updateActiveSectionFromScroll() {
    scrollTicking = false;

    if (suppressObserver) {
      return;
    }

    const topChromeHeight = getCssPixelValue("--top-chrome-height");
    const bottomNavHeight = getCssPixelValue("--bottom-nav-height");
    const viewportHeight = window.innerHeight;
    const anchorY = topChromeHeight + Math.max(24, (viewportHeight - topChromeHeight - bottomNavHeight) * 0.33);

    let nextActiveSection = sections[0];

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      if (rect.top <= anchorY) {
        nextActiveSection = section;
      }
    });

    if (nextActiveSection.id === activeSectionId) {
      return;
    }

    activeSectionId = nextActiveSection.id;
    setActiveSectionNavLink(activeSectionId);
  }

  function queueActiveSectionUpdate() {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;
    window.requestAnimationFrame(updateActiveSectionFromScroll);
  }

  window.addEventListener("scroll", queueActiveSectionUpdate, { passive: true });
  window.addEventListener("resize", queueActiveSectionUpdate);
  queueActiveSectionUpdate();

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href")?.slice(1);

      if (!targetId) {
        return;
      }

      suppressObserver = true;
      window.clearTimeout(resumeObserverTimerId);
      resumeObserverTimerId = window.setTimeout(() => {
        suppressObserver = false;
        queueActiveSectionUpdate();
      }, 700);
      activeSectionId = targetId;
      setActiveSectionNavLink(activeSectionId);
    });
  });
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function setLink(id, href) {
  const element = document.getElementById(id);

  if (element) {
    element.href = href;
  }
}

function setImage(id, image) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  if (!image?.src) {
    element.removeAttribute("src");
    element.alt = image?.alt || "";
    return;
  }

  element.src = image.src;
  element.alt = image.alt || "";
}

function renderHeroBorderText(text) {
  const tracks = document.querySelectorAll(".hero-marquee-track");
  const normalizedText = String(text || "").trim();

  if (!tracks.length || !normalizedText) {
    return;
  }

  const repeatedText = Array(3).fill(normalizedText).join(" ");
  const copy = `<span class="hero-marquee-copy">${escapeHtml(repeatedText)}</span>`;

  tracks.forEach((track) => {
    track.innerHTML = `${copy}${copy}`;
  });
}

function renderPromoLink(promoLink) {
  const container = document.getElementById("event-promo");

  if (!container) {
    return;
  }

  if (!promoLink?.label || !promoLink?.url) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  container.innerHTML = `<a target="_blank" rel="noreferrer" href="${escapeHtml(promoLink.url)}">${escapeHtml(promoLink.label)}</a>`;
}

function setupOverviewAudio(audioConfig) {
  const audioElement = document.getElementById("overview-audio");
  const toggleButton = document.getElementById("overview-audio-toggle");

  if (!audioElement || !toggleButton) {
    return;
  }

  if (!audioConfig?.src) {
    toggleButton.hidden = true;
    audioElement.removeAttribute("src");
    return;
  }

  audioElement.src = audioConfig.src;
  audioElement.preload = "none";
  audioElement.loop = audioConfig.loop !== false;
  audioElement.muted = true;

  if (typeof audioConfig.initialVolume === "number") {
    audioElement.volume = Math.max(0, Math.min(1, audioConfig.initialVolume));
  }

  const mutedLabel = audioConfig.buttonLabels?.muted || "Unmute";
  const playingLabel = audioConfig.buttonLabels?.playing || "Mute";

  const updateToggleState = () => {
    const isAudible = !audioElement.muted && !audioElement.paused;

    toggleButton.textContent = isAudible ? playingLabel : mutedLabel;
    toggleButton.setAttribute("aria-pressed", String(isAudible));
    toggleButton.setAttribute(
      "aria-label",
      isAudible ? `${playingLabel} event audio` : `${mutedLabel} event audio`
    );
  };

  toggleButton.hidden = false;
  updateToggleState();

  toggleButton.addEventListener("click", async () => {
    if (audioElement.paused) {
      audioElement.muted = false;

      try {
        await audioElement.play();
      } catch {
        audioElement.muted = true;
      }

      updateToggleState();
      return;
    }

    audioElement.muted = !audioElement.muted;
    updateToggleState();
  });
}

function getChecklistStorageKey(storagePrefix, section, item) {
  return `${storagePrefix}:bring:${section}:${item}`;
}

function renderChecklist(id, section, items, storagePrefix) {
  const container = document.getElementById(id);

  if (!container) {
    return;
  }

  container.innerHTML = items
    .map((item, index) => {
      const checkboxId = `${section}-item-${index}`;
      const storageKey = getChecklistStorageKey(storagePrefix, section, item);
      const isChecked = getStoredValue(storageKey) === "true";

      return `
        <li class="checklist-item">
          <label class="checklist-label" for="${checkboxId}">
            <input
              class="checklist-checkbox"
              type="checkbox"
              id="${checkboxId}"
              data-storage-key="${storageKey}"
              ${isChecked ? "checked" : ""}
            >
            <span>${item}</span>
          </label>
        </li>
      `;
    })
    .join("");

  container.querySelectorAll(".checklist-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const storageKey = event.currentTarget.dataset.storageKey;
      setStoredValue(storageKey, String(event.currentTarget.checked));
    });
  });
}

function getGroupStyle(groupKey, groupColors) {
  const color = groupColors[groupKey];

  if (!color) {
    return "";
  }

  const sanitizedHex = color.trim().replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(sanitizedHex)) {
    return "";
  }

  const red = Number.parseInt(sanitizedHex.slice(0, 2), 16);
  const green = Number.parseInt(sanitizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(sanitizedHex.slice(4, 6), 16);

  return `style="--group-color: ${color}; --group-color-soft: rgba(${red}, ${green}, ${blue}, 0.16);"`;
}

function parseScheduleTime(eventDate, timeLabel) {
  if (!eventDate || !timeLabel) {
    return null;
  }

  const match = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  const [, hourText, minuteText, meridiem] = match;
  let hours = Number.parseInt(hourText, 10);
  const minutes = Number.parseInt(minuteText, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  if (meridiem.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  const scheduledTime = new Date(eventDate);

  if (Number.isNaN(scheduledTime.getTime())) {
    return null;
  }

  scheduledTime.setHours(hours, minutes, 0, 0);
  return scheduledTime;
}

function getDisplayRange(item) {
  if (item.description) {
    const descriptionRange = item.description.match(
      /(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/i
    );

    if (descriptionRange) {
      return `${descriptionRange[1]} - ${descriptionRange[2]}`;
    }
  }

  return item.time;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getYouTubeEmbedUrl(value) {
  if (!value) {
    return "";
  }

  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return "";
  }

  const directIdMatch = trimmedValue.match(/^[a-zA-Z0-9_-]{11}$/);

  if (directIdMatch) {
    return `https://www.youtube.com/embed/${directIdMatch[0]}`;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    const watchId = parsedUrl.searchParams.get("v");

    if (watchId && /^[a-zA-Z0-9_-]{11}$/.test(watchId)) {
      return `https://www.youtube.com/embed/${watchId}`;
    }

    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const lastSegment = pathSegments.at(-1);

    if (
      (parsedUrl.hostname.includes("youtu.be") || pathSegments.includes("embed")) &&
      lastSegment &&
      /^[a-zA-Z0-9_-]{11}$/.test(lastSegment)
    ) {
      return `https://www.youtube.com/embed/${lastSegment}`;
    }
  } catch {
    return "";
  }

  return "";
}

function createPlaceholderImage(label) {
  const safeLabel = String(label).slice(0, 36);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${safeLabel}">
      <rect width="96" height="96" rx="12" fill="#111111"/>
      <rect x="12" y="16" width="72" height="48" rx="8" fill="#1f1f1f" stroke="#3a3a3a"/>
      <path d="M20 58L37 41L51 53L60 44L76 60" fill="none" stroke="#d0012b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="48" y="80" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" text-anchor="middle">${safeLabel}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function formatPersonSegment(segment) {
  const trimmedSegment = segment.trim();

  if (!trimmedSegment) {
    return "";
  }

  const parts = trimmedSegment.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return `<span class="surname">${escapeHtml(parts[0].toUpperCase())}</span>`;
  }

  const givenNames = parts.slice(0, -1).map((part) => escapeHtml(part)).join(" ");
  const surname = escapeHtml(parts[parts.length - 1].toUpperCase());

  return `${givenNames} <span class="surname">${surname}</span>`;
}

function formatPersonName(name) {
  return name
    .split("/")
    .map((segment) => `<span class="person-name">${formatPersonSegment(segment)}</span>`)
    .join(' <span aria-hidden="true">/</span> ');
}

function getEventStartTime(items, eventDate) {
  const firstScheduleItem = items.find((item) => item.type !== "marker");

  if (!firstScheduleItem) {
    return null;
  }

  return parseScheduleTime(eventDate, firstScheduleItem.time);
}

function getScheduleItemEndTime(item, itemIndex, items, eventDate) {
  const descriptionRange = item.description?.match(
    /(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/i
  );

  if (descriptionRange) {
    return parseScheduleTime(eventDate, descriptionRange[2]);
  }

  for (let index = itemIndex + 1; index < items.length; index += 1) {
    const nextItem = items[index];

    if (nextItem.type === "marker") {
      continue;
    }

    return parseScheduleTime(eventDate, nextItem.time);
  }

  return null;
}

function getTrackState(items, eventDate, now = new Date()) {
  const scheduleItems = items.filter((item) => item.type !== "marker");
  const firstStart = getEventStartTime(items, eventDate);

  let currentIndex = -1;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (item.type === "marker") {
      continue;
    }

    const startTime = parseScheduleTime(eventDate, item.time);
    const endTime = getScheduleItemEndTime(item, index, items, eventDate);

    if (!startTime || !endTime) {
      continue;
    }

    if (now >= startTime && now < endTime) {
      currentIndex = index;
      break;
    }
  }

  let lastMarkerTitle = "Track Cold";

  items.forEach((item) => {
    if (item.type !== "marker") {
      return;
    }

    const markerTime = parseScheduleTime(eventDate, item.time);

    if (markerTime && now >= markerTime) {
      lastMarkerTitle = item.title;
    }
  });

  const finalMarker = [...items].reverse().find((item) => item.type === "marker");
  const finalMarkerTime = finalMarker ? parseScheduleTime(eventDate, finalMarker.time) : null;
  const lastScheduleItem = scheduleItems[scheduleItems.length - 1];
  const fallbackEndTime = lastScheduleItem
    ? getScheduleItemEndTime(lastScheduleItem, items.lastIndexOf(lastScheduleItem), items, eventDate)
    : null;
  const eventEnd = finalMarkerTime || fallbackEndTime;

  if (firstStart && now < firstStart) {
    return {
      mode: "countdown",
      trackState: "upcoming",
      currentIndex: -1,
      nextTime: firstStart
    };
  }

  if (eventEnd && now >= eventEnd) {
    return {
      mode: "complete",
      trackState: "cold",
      currentIndex: -1
    };
  }

  if (currentIndex >= 0) {
    const currentItem = items[currentIndex];
    const currentStartTime = parseScheduleTime(eventDate, currentItem.time);
    const currentEndTime = getScheduleItemEndTime(currentItem, currentIndex, items, eventDate);

    return {
      mode: "live",
      trackState: lastMarkerTitle.toLowerCase().includes("hot") ? "hot" : "cold",
      currentIndex,
      currentItem,
      currentStartTime,
      currentEndTime
    };
  }

  return {
    mode: "between",
    trackState: lastMarkerTitle.toLowerCase().includes("hot") ? "hot" : "cold",
    currentIndex: -1
  };
}

function getRemainingSeconds(targetTime, now = new Date()) {
  const millisecondsRemaining = targetTime.getTime() - now.getTime();

  return Math.max(0, Math.ceil(millisecondsRemaining / 1000));
}

function formatCountdown(targetTime, now = new Date()) {
  const totalSeconds = getRemainingSeconds(targetTime, now);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(days).padStart(2, "0")}D:${String(hours).padStart(2, "0")}H:${String(minutes).padStart(2, "0")}M:${String(seconds).padStart(2, "0")}S`;
}

function formatSessionCountdown(targetTime, now = new Date()) {
  const totalSeconds = getRemainingSeconds(targetTime, now);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const minuteSecondText = `${String(minutes).padStart(2, "0")}M${String(seconds).padStart(2, "0")}S`;

  if (hours < 1) {
    return minuteSecondText;
  }

  return `${hours}H${minuteSecondText}`;
}

function getRemainingRatio(startTime, endTime, now = new Date()) {
  const duration = endTime?.getTime() - startTime?.getTime();

  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  const remaining = endTime.getTime() - now.getTime();
  return Math.max(0, Math.min(1, remaining / duration));
}

function getStatusPresentation(content) {
  const eventStartTime = getEventStartTime(content.schedule, content.date);
  const now = new Date();

  if (eventStartTime && now < eventStartTime) {
    const progressStartTime = new Date(eventStartTime.getTime() - 24 * 60 * 60 * 1000);

    return {
      mode: "countdown",
      pill: "Event Soon",
      pillState: "upcoming",
      primary: formatCountdown(eventStartTime, now),
      secondary: "until event starts",
      progress: getRemainingRatio(progressStartTime, eventStartTime, now)
    };
  }

  const state = getTrackState(content.schedule, content.date, now);

  if (state.mode === "countdown" && state.nextTime) {
    return {
      mode: "countdown",
      pill: "Event Soon",
      pillState: "upcoming",
      primary: formatCountdown(state.nextTime, now),
      secondary: "until event starts",
      progress: getRemainingRatio(
        new Date(state.nextTime.getTime() - 24 * 60 * 60 * 1000),
        state.nextTime,
        now
      )
    };
  }

  if (state.mode === "live" && state.currentItem) {
    return {
      mode: "live",
      pill: state.trackState === "hot" ? "Track Hot" : "Track Cold",
      pillState: state.trackState,
      primary: state.currentItem.title,
      secondary: getDisplayRange(state.currentItem),
      group: state.currentItem.group || "",
      timer: state.currentEndTime ? formatSessionCountdown(state.currentEndTime, now) : "",
      progress:
        state.currentStartTime && state.currentEndTime
          ? getRemainingRatio(state.currentStartTime, state.currentEndTime, now)
          : null
    };
  }

  if (state.mode === "complete") {
    return {
      mode: "complete",
      pill: "Track Cold",
      pillState: "cold",
      primary: "Event Complete",
      secondary: content.time
    };
  }

  const upcomingItem = content.schedule.find((item) => item.type !== "marker");

  return {
    mode: "between",
    pill: state.trackState === "hot" ? "Track Hot" : "Track Cold",
    pillState: state.trackState,
    primary: upcomingItem ? upcomingItem.title : "Awaiting Next Update",
    secondary: upcomingItem ? upcomingItem.time : content.time
  };
}

function renderStatus(content) {
  const status = getStatusPresentation(content);
  const statusPill = document.getElementById("status-pill");
  const statusPrimary = document.getElementById("status-primary");
  const statusSecondary = document.getElementById("status-secondary");
  const statusStrip = document.querySelector(".status-strip");

  if (statusPill) {
    statusPill.textContent = status.pill;
    statusPill.dataset.state = status.pillState;
  }

  if (statusPrimary) {
    const countdownText = window.trackDayCountdownText;

    if (countdownText && typeof countdownText.render === "function") {
      countdownText.render(status.primary, status.mode === "countdown");
    } else {
      statusPrimary.textContent = status.primary;
    }
  }

  if (statusSecondary) {
    statusSecondary.textContent = status.secondary;
  }

  if (!statusStrip) {
    return;
  }

  statusStrip.dataset.mode = status.mode;

  const statusEnhancement = window.trackDayStatusEnhancement;

  if (statusEnhancement && typeof statusEnhancement.render === "function") {
    statusEnhancement.render(status);
  }

  const currentGroup = status.pillState === "hot" && status.group ? status.group : "";

  if (currentGroup) {
    const color = content.groupColors[currentGroup];

    if (color) {
      const sanitizedHex = color.trim().replace("#", "");

      if (/^[0-9a-fA-F]{6}$/.test(sanitizedHex)) {
        const red = Number.parseInt(sanitizedHex.slice(0, 2), 16);
        const green = Number.parseInt(sanitizedHex.slice(2, 4), 16);
        const blue = Number.parseInt(sanitizedHex.slice(4, 6), 16);

        statusStrip.dataset.group = currentGroup;
        statusStrip.style.setProperty("--group-color", color);
        statusStrip.style.setProperty("--group-color-soft", `rgba(${red}, ${green}, ${blue}, 0.16)`);
        statusStrip.style.setProperty("--group-color-quarter", `rgba(${red}, ${green}, ${blue}, 0.25)`);
        statusStrip.style.setProperty("--group-color-tint", `rgba(${red}, ${green}, ${blue}, 0.10)`);
        return;
      }
    }
  }

  delete statusStrip.dataset.group;
  statusStrip.style.removeProperty("--group-color");
  statusStrip.style.removeProperty("--group-color-soft");
  statusStrip.style.removeProperty("--group-color-quarter");
  statusStrip.style.removeProperty("--group-color-tint");
}

function renderSchedule(items, groupColors, eventDate) {
  const container = document.getElementById("schedule-body");

  if (!container) {
    return;
  }

  const currentState = getTrackState(items, eventDate);
  const currentScheduleIndex = currentState.currentIndex;

  container.innerHTML = items
    .map((item, index) => {
      if (item.type === "marker") {
        const markerState = item.title.toLowerCase().includes("hot") ? "hot" : "cold";
        return `
          <article class="schedule-marker" data-state="${markerState}">
            <p class="schedule-marker-label">${item.time}</p>
            <h3 class="schedule-marker-title">${item.title}</h3>
          </article>
        `;
      }

      const groupAttribute = item.group ? ` data-group="${item.group}"` : "";
      const groupStyle = item.group ? ` ${getGroupStyle(item.group, groupColors)}` : "";
      const isCurrent = index === currentScheduleIndex;
      const currentAttribute = isCurrent ? ' data-current="true"' : "";
      const currentBadge = isCurrent ? '<span class="schedule-now-badge">Now</span>' : "";

      return `
        <article class="schedule-item"${groupAttribute}${currentAttribute}${groupStyle}>
          <p class="schedule-time">${item.time}</p>
          <div class="schedule-divider"></div>
          <div class="schedule-frame">
            <div class="schedule-heading">
              <h4 class="schedule-title">${item.title}</h4>
              ${currentBadge}
            </div>
            ${item.description ? `<p class="schedule-description">${item.description}</p>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFaqItems(items) {
  const container = document.getElementById("faq-list");

  if (!container) {
    return;
  }

  container.innerHTML = items
    .map(
      (item, index) => `
        <details class="faq-item"${index === 0 ? " open" : ""}>
          <summary class="faq-summary">
            <h3>${escapeHtml(item.question)}</h3>
            <i data-lucide="chevron-down" class="group-toggle" aria-hidden="true"></i>
          </summary>
          <p class="faq-answer">${escapeHtml(item.answer)}</p>
        </details>
      `
    )
    .join("");
}

function setupScheduleRefresh(content) {
  if (scheduleRefreshTimerId) {
    window.clearInterval(scheduleRefreshTimerId);
  }

  const refreshLiveState = () => {
    renderStatus(content);
    renderSchedule(content.schedule, content.groupColors, content.date);
    updateTopChromeHeight();
  };

  refreshLiveState();
  scheduleRefreshTimerId = window.setInterval(refreshLiveState, 1000);
}

function renderGroups(items, groupColors) {
  const container = document.getElementById("group-list");

  if (!container || !Array.isArray(items)) {
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <details class="group-card" data-group="${item.group}" ${getGroupStyle(item.group, groupColors)}>
          <summary class="group-summary">
            <div class="group-summary-copy">
              <div class="group-summary-title">
                <span class="group-summary-label">Group</span>
                <span class="group-summary-letter">${item.group.toUpperCase()}</span>
                <span class="group-summary-level">${item.level || ""}</span>
              </div>
            </div>
            <i data-lucide="chevron-down" class="group-toggle" aria-hidden="true"></i>
          </summary>
          <ul class="plain-list">
            ${item.people.map((person) => `<li>${formatPersonName(person)}</li>`).join("")}
          </ul>
        </details>
      `
    )
    .join("");
}

function renderLessons(items) {
  const container = document.getElementById("lesson-list");

  if (!container || !Array.isArray(items)) {
    return;
  }

  container.innerHTML = `
    <article class="lesson-card" aria-label="Driving lessons">
      ${items
        .map(
          (item, index) => `
            <div class="lesson-row">
              <div class="lesson-number" aria-hidden="true">${index + 1}</div>
              <div class="lesson-body">
                <img
                  class="lesson-image"
                  src="${escapeHtml(item.imageSrc)}"
                  alt="${escapeHtml(item.imageAlt || "")}"
                />
                <h3 class="lesson-title">${escapeHtml(item.title)}</h3>
              </div>
            </div>
          `
        )
        .join("")}
    </article>
  `;
}

function renderVolunteers(items) {
  const container = document.getElementById("people-list");

  if (!container) {
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
        <article class="volunteer-group">
          <h4 class="volunteer-role">${item.role}</h4>
          <div class="volunteer-names">
            ${item.names.map((name) => `<span>${name}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderTrackInfoMedia(media) {
  if (!media) {
    return "";
  }

  const previewMarkup = media.imageSrc
    ? `
      <div class="track-media-preview">
        <img
          class="track-media-preview-image"
          src="${escapeHtml(media.imageSrc)}"
          alt="${escapeHtml(media.previewLabel || media.title || "PDF preview")}"
        >
      </div>
    `
    : `
      <div class="track-media-preview" aria-hidden="true">
        <div>
          <strong>${escapeHtml(media.previewLabel || media.title || "PDF Preview")}</strong>
          <span>${escapeHtml(media.previewHint || "Preview image goes here.")}</span>
        </div>
      </div>
    `;

  const copyMarkup = media.meta
    ? `
      <p class="track-media-meta">${escapeHtml(media.meta)}</p>
    `
    : "";

  if (media.pdfUrl) {
    return `
      <a class="track-info-visual track-media-link" href="${escapeHtml(media.pdfUrl)}" target="_blank" rel="noreferrer">
        <div class="track-info-visual-frame">
          ${previewMarkup}
        </div>
      </a>
      ${copyMarkup}
    `;
  }

  return `
    <div class="track-media-placeholder" aria-label="${escapeHtml(media.pdfLabel || "PDF placeholder")}">
      <div class="track-info-visual-frame">
        ${previewMarkup}
      </div>
      ${copyMarkup}
      <p class="track-media-meta">${escapeHtml(media.pdfLabel || "Add a PDF URL to enable this link.")}</p>
    </div>
  `;
}

function renderTrackInfoVideos(videos = []) {
  if (!videos.length) {
    return "";
  }

  return `
    <div class="track-video-section">
      <div class="track-video-header">
        <h3 class="track-video-title">First time here?</h3>
        <p class="track-video-intro">Watch some onboards to get familiar with the track before you arrive.</p>
      </div>
      <div class="track-video-list">
        ${videos
      .map((video) => {
        const embedUrl = getYouTubeEmbedUrl(video.youtubeId);
        const videoFrame = embedUrl
          ? `
                <iframe
                  class="track-video-embed"
                  src="${escapeHtml(embedUrl)}"
                  title="${escapeHtml(video.title)}"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              `
          : `
                <div class="track-video-placeholder">
                  <span>${escapeHtml(video.title)}</span>
                </div>
              `;

        return `
              <article class="track-video-card">
                ${videoFrame}
                <p class="track-video-heading">${escapeHtml(video.title)}</p>
                ${video.caption ? `<p class="track-video-caption">${escapeHtml(video.caption)}</p>` : ""}
              </article>
            `;
      })
      .join("")}
      </div>
    </div>
  `;
}

function renderTrackInfoFlags(flags = []) {
  if (!flags.length) {
    return "";
  }

  return `
    <div class="track-flags-list">
      ${flags
      .map((flag) => {
        const imageSrc = flag.imageSrc || createPlaceholderImage(`${flag.name} Flag`);
        const imageAlt = flag.imageSrc
          ? `${flag.name} flag`
          : `${flag.name} flag placeholder`;

        return `
            <article class="track-flag-card">
              <img class="track-flag-image" src="${escapeHtml(imageSrc)}" alt="${escapeHtml(imageAlt)}">
              <div class="track-flag-copy">
                <h4 class="track-flag-name">${escapeHtml(flag.name)}</h4>
                <p class="track-flag-description">${escapeHtml(flag.description || "")}</p>
              </div>
            </article>
          `;
      })
      .join("")}
    </div>
  `;
}

function renderTrackInfoFeatureCard(featureCard) {
  if (!featureCard?.value) {
    return "";
  }

  return `
    <article class="track-info-feature-card" aria-label="${escapeHtml(featureCard.eyebrow || "Track info")}">
      ${featureCard.eyebrow ? `<p class="track-info-feature-eyebrow">${escapeHtml(featureCard.eyebrow)}</p>` : ""}
      <p class="track-info-feature-value">${escapeHtml(featureCard.value)}</p>
    </article>
  `;
}

function renderTrackInfoInfoBox(infoBox) {
  if (!infoBox?.title && !infoBox?.items?.length) {
    return "";
  }

  return `
    <aside class="track-info-callout" aria-label="${escapeHtml(infoBox.title || "Important information")}">
      ${infoBox.title ? `<h3 class="track-info-callout-title">${escapeHtml(infoBox.title)}</h3>` : ""}
      <div class="track-info-callout-items">
        ${(infoBox.items || [])
      .map((item) => `
            <div class="track-info-callout-item">
              ${item.title ? `<h4 class="track-info-callout-question">${escapeHtml(item.title)}</h4>` : ""}
              ${item.body ? `<p class="track-info-callout-answer">${escapeHtml(item.body)}</p>` : ""}
            </div>
          `)
      .join("")}
      </div>
    </aside>
  `;
}

function renderTrackInfoPanel(tab) {
  const sections = [];
  const primaryGroupParts = [];
  const isFlagsOnlyPanel = Boolean(tab.flags?.length) && !tab.featureCard && !tab.media && !tab.infoBox && !tab.videos?.length;

  if (tab.title) {
    primaryGroupParts.push(`<h3 class="track-info-heading">${escapeHtml(tab.title)}</h3>`);
  }

  if (tab.description) {
    primaryGroupParts.push(`<p class="track-info-lead">${escapeHtml(tab.description)}</p>`);
  }

  if (tab.featureCard) {
    primaryGroupParts.push(renderTrackInfoFeatureCard(tab.featureCard));
  }

  if (tab.infoBox) {
    primaryGroupParts.push(renderTrackInfoInfoBox(tab.infoBox));
  }

  if (tab.media) {
    primaryGroupParts.push(renderTrackInfoMedia(tab.media));
  }

  if (tab.videos?.length) {
    sections.push(`
      <div class="track-info-group">
        ${renderTrackInfoVideos(tab.videos)}
      </div>
    `);
  }

  if (tab.flags?.length) {
    if (isFlagsOnlyPanel) {
      primaryGroupParts.push(renderTrackInfoFlags(tab.flags));
    } else {
      sections.push(`
        <div class="track-info-group">
          ${renderTrackInfoFlags(tab.flags)}
        </div>
      `);
    }
  }

  return `
    <section
      id="track-info-panel-${escapeHtml(tab.id)}"
      class="track-info-panel"
      role="tabpanel"
      aria-labelledby="track-info-tab-${escapeHtml(tab.id)}"
      tabindex="0"
      ${tab.isActive ? "" : "hidden"}
    >
      ${primaryGroupParts.length ? `
      <div class="track-info-group">
        ${primaryGroupParts.join("")}
      </div>
      ` : ""}
      ${sections.join("")}
    </section>
  `;
}

function setupTrackInfoTabs() {
  const tablist = document.getElementById("track-info-tablist");
  const tabs = Array.from(document.querySelectorAll(".track-info-tab"));
  const panels = Array.from(document.querySelectorAll(".track-info-panel"));

  if (!tablist || !tabs.length || !panels.length) {
    return;
  }

  const activateTab = (tabId, shouldFocus = false) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabId;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      if (isActive && shouldFocus) {
        tab.focus();
      }

      if (isActive) {
        tab.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      }
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== `track-info-panel-${tabId}`;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab, false));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
        return;
      }

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      activateTab(tabs[nextIndex].dataset.tab, true);
    });
  });
}

function renderTrackInfo(trackInfo) {
  const tablist = document.getElementById("track-info-tablist");
  const panelContainer = document.getElementById("track-info-panels");
  const tabs = trackInfo.tabs || [];

  if (!tablist || !panelContainer || !tabs.length) {
    return;
  }

  tablist.innerHTML = tabs
    .map(
      (tab, index) => `
        <button
          id="track-info-tab-${escapeHtml(tab.id)}"
          class="track-info-tab"
          type="button"
          role="tab"
          aria-selected="${index === 0 ? "true" : "false"}"
          aria-controls="track-info-panel-${escapeHtml(tab.id)}"
          tabindex="${index === 0 ? "0" : "-1"}"
          data-tab="${escapeHtml(tab.id)}"
        >
          ${escapeHtml(tab.label)}
        </button>
      `
    )
    .join("");

  panelContainer.innerHTML = tabs
    .map((tab, index) => renderTrackInfoPanel({ ...tab, isActive: index === 0 }))
    .join("");

  setupTrackInfoTabs();
}

function renderPage(content) {
  const storagePrefix = content.storageKey || content.slug || "trackdays:event";

  setText("brand-title", content.brandTitle);
  setText("event-title", content.title);
  setImage("overview-image", content.overviewImage);
  renderHeroBorderText(content.heroBorderText);
  setText("event-date", content.date);
  setText("event-time", content.time);
  setText("event-location-name", content.locationName);
  setText("track-info-title", content.locationName);
  setText("event-location-address", content.address);
  setLink("event-location-link", content.locationUrl);
  setText("event-summary", content.summary);
  renderPromoLink(content.promoLink);
  setupOverviewAudio(content.overviewAudio);
  renderStatus(content);
  renderTrackInfo(content.trackInfo);
  renderChecklist("required-items", "required", content.requiredItems, storagePrefix);
  renderChecklist("recommended-items", "recommended", content.recommendedItems, storagePrefix);
  renderFaqItems(content.faqItems);
  renderLessons(content.lessons);
  renderGroups(content.groups, content.groupColors);
  renderVolunteers(content.volunteers);
  setupScheduleRefresh(content);

  setupViewportOffsets();
  setupSectionNavHighlight();
  updateTopChromeHeight();
  document.dispatchEvent(new CustomEvent("trackday:rendered"));
}

const eventContent = window.trackDayEventContent;

if (!eventContent) {
  throw new Error("Track day event content was not loaded.");
}

renderPage(eventContent);

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}
