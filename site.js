(() => {
  /* ---------- image skeleton loading ---------- */
  const markImage = (image, state) => {
    image.classList.remove("is-loading");
    image.classList.add(state);
    image.parentElement?.removeAttribute("aria-busy");
  };

  const prepareImage = (image) => {
    if (image.dataset.skeletonReady) return;
    image.dataset.skeletonReady = "true";
    image.classList.add("skeleton-target", "is-loading");
    image.parentElement?.setAttribute("aria-busy", "true");
    image.addEventListener("load", () => markImage(image, "is-loaded"), { once: true });
    image.addEventListener("error", () => markImage(image, "is-error"), { once: true });

    if (image.complete) {
      requestAnimationFrame(() => markImage(image, image.naturalWidth ? "is-loaded" : "is-error"));
    }
  };

  document.querySelectorAll("img").forEach(prepareImage);

  /* watch for any images added after initial load (e.g. future dynamic content) */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === "IMG") prepareImage(node);
        node.querySelectorAll?.("img").forEach(prepareImage);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /* ---------- dark mode toggle ---------- */
  const root = document.documentElement;
  const STORAGE_KEY = "fbz-theme";

  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  };

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  };

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
      btn.setAttribute("aria-pressed", String(!isDark));
    });
    btn.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
  });
})();

(() => {
  const y = new Date().getFullYear();
  document.querySelectorAll(".year").forEach((el) => { el.textContent = y; });
})();
