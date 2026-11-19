// Small, dismissible guides anchored to the controls they explain.
[
  { selector: "[data-language-toggle]", text: "Change language", above: false },
  { selector: "#ai-agent-btn", text: "Chat with my assistant", above: true }
].forEach(({ selector, text, above }) => {
  const target = document.querySelector(selector);
  if (!target) return;

  const guide = document.createElement("div");
  guide.className = `feature-guide ${above ? "feature-guide-above" : "feature-guide-below"}`;
  const label = document.createElement("span");
  label.textContent = text;
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", `Dismiss ${text.toLowerCase()} guide`);
  guide.append(label, close);
  document.body.appendChild(guide);

  const position = () => {
    const rect = target.getBoundingClientRect();
    guide.hidden = rect.bottom <= 0 || rect.top >= window.innerHeight;
    const center = rect.left + rect.width / 2;
    const left = Math.max(10, Math.min(center - guide.offsetWidth / 2,
      document.documentElement.clientWidth - guide.offsetWidth - 10));
    guide.style.left = `${left}px`;
    guide.style.top = `${above ? rect.top - guide.offsetHeight - 14 : rect.bottom + 14}px`;
    guide.style.setProperty("--guide-arrow", `${Math.max(14, Math.min(center - left, guide.offsetWidth - 14))}px`);
  };
  const dismiss = () => {
    guide.remove();
    window.removeEventListener("resize", position);
    window.removeEventListener("scroll", position);
    close.removeEventListener("click", dismiss);
    target.removeEventListener("click", dismiss);
  };
  close.addEventListener("click", dismiss);
  target.addEventListener("click", dismiss);
  window.addEventListener("resize", position);
  window.addEventListener("scroll", position, { passive: true });
  position();
});
