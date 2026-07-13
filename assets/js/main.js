(() => {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");

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
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

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
      const parsed = Number.parseFloat(input.value);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    };

    const updateROI = () => {
      const monthlyVisitors = safeNumber(visitors);
      const leadConversion = safeNumber(leadRate) / 100;
      const customerClose = safeNumber(closeRate) / 100;
      const averageJob = safeNumber(jobValue);

      const customers = monthlyVisitors * leadConversion * customerClose;
      const revenue = customers * averageJob;

      customerOutput.textContent = customers.toFixed(1);
      revenueOutput.textContent = money.format(revenue);
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
        status.textContent = "Demo submission received locally. Connect a real form backend before launch.";
      }

      // Production options:
      // 1. Add action="https://formspree.io/f/YOUR_ID" method="POST" and remove data-demo-form.
      // 2. Submit JSON to your own serverless endpoint.
      // 3. Route through a CRM or automation platform with consent logging.
    });
  });
})();