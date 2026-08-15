function createSectionHeadingMarquees() {
  document.querySelectorAll(".section-heading").forEach((heading) => {
    const title = heading.querySelector("h2");

    if (!title || heading.querySelector(".section-heading-marquee")) {
      return;
    }

    const titleText = title.textContent.trim();

    if (!titleText) {
      return;
    }

    const repeatedText = Array(4).fill(titleText).join(" ");
    const marquee = document.createElement("div");
    const track = document.createElement("div");

    marquee.className = "section-heading-marquee";
    marquee.setAttribute("aria-hidden", "true");
    track.className = "section-heading-marquee-track";

    for (let index = 0; index < 2; index += 1) {
      const copy = document.createElement("span");
      copy.className = "section-heading-marquee-copy";
      copy.textContent = repeatedText;
      track.append(copy);
    }

    marquee.append(track);
    heading.prepend(marquee);
  });
}

document.addEventListener("trackday:rendered", createSectionHeadingMarquees, {
  once: true
});
