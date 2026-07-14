(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  const header = document.querySelector(".site-header");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -35px 0px" }
    );

    revealItems.forEach((element) => revealObserver.observe(element));
  }

  const heroSlider = document.querySelector("[data-hero-slider]");

  if (heroSlider) {
    const slideElements = Array.from(
      heroSlider.querySelectorAll(".hero-slide")
    );
    const dots = Array.from(
      heroSlider.querySelectorAll(".hero-slider-dot")
    );
    const progress = heroSlider.querySelector(".hero-slider-progress");
    const count = heroSlider.querySelector(".hero-slider-count b");

    const imageUrls = [
      "assets/images/picture1.jpg",
      "assets/images/picture2.jpg",
      "assets/images/picture3.jpg"
    ];

    const duration = 6500;
    let activeIndex = 0;
    let timerId = null;
    let paused = false;

    heroSlider.style.setProperty("--hero-slide-duration", `${duration}ms`);

    slideElements.forEach((slide, index) => {
      slide.style.backgroundImage = `url("${imageUrls[index]}")`;
    });

    const restartProgress = () => {
      if (!progress || prefersReducedMotion) return;
      progress.classList.remove("is-running");
      void progress.offsetWidth;
      progress.classList.add("is-running");
    };

    const stopTimer = () => {
      window.clearTimeout(timerId);
      timerId = null;
      progress?.classList.remove("is-running");
    };

    const startTimer = () => {
      stopTimer();

      if (paused || prefersReducedMotion || slideElements.length < 2) return;

      restartProgress();
      timerId = window.setTimeout(() => {
        showSlide(activeIndex + 1);
      }, duration);
    };

    const showSlide = (requestedIndex, restart = true) => {
      const newIndex =
        (requestedIndex + slideElements.length) % slideElements.length;

      slideElements.forEach((slide, index) => {
        const isActive = index === newIndex;
        const isLeaving = index === activeIndex && !isActive;

        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-leaving", isLeaving);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === newIndex);
      });

      activeIndex = newIndex;

      if (count) {
        count.textContent = String(activeIndex + 1).padStart(2, "0");
      }

      if (restart) startTimer();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

    heroSlider.addEventListener("mouseenter", () => {
      paused = true;
      stopTimer();
    });

    heroSlider.addEventListener("mouseleave", () => {
      paused = false;
      startTimer();
    });

    heroSlider.addEventListener("focusin", () => {
      paused = true;
      stopTimer();
    });

    heroSlider.addEventListener("focusout", (event) => {
      if (!heroSlider.contains(event.relatedTarget)) {
        paused = false;
        startTimer();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    showSlide(0, false);
    startTimer();
  }

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const roiCalculator = document.querySelector("#roi-calculator");

  if (roiCalculator) {
    const visitors = roiCalculator.querySelector("#visitors");
    const leadRate = roiCalculator.querySelector("#lead-rate");
    const closeRate = roiCalculator.querySelector("#close-rate");
    const jobValue = roiCalculator.querySelector("#job-value");
    const customerOutput = roiCalculator.querySelector("#estimated-customers");
    const revenueOutput = roiCalculator.querySelector("#estimated-revenue");

    const safeNumber = (input) => {
      const parsed = Number.parseFloat(input?.value ?? "0");
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    };

    const updateROI = () => {
      const customers =
        safeNumber(visitors) *
        (safeNumber(leadRate) / 100) *
        (safeNumber(closeRate) / 100);

      const revenue = customers * safeNumber(jobValue);

      if (customerOutput) customerOutput.textContent = customers.toFixed(1);
      if (revenueOutput) revenueOutput.textContent = money.format(revenue);
    };

    roiCalculator.addEventListener("input", updateROI);
    updateROI();
  }

  document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");

      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = "Complete the required fields.";
        return;
      }

      if (status) {
        status.textContent =
          "Demo submission received locally. Connect a production form endpoint before launch.";
      }
    });
  });
})();