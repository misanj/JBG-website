
document.addEventListener("DOMContentLoaded", function () {
  // ==================== NAVBAR SCROLL EFFECT ====================
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
  }
  
  // ==================== BOOTSTRAP TOOLTIPS ====================
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  if (tooltipTriggerList.length) {
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  
  // ==================== LAZY LOAD IMAGES ====================
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (lazyImages.length) {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      lazyImages.forEach((img) => (img.src = img.dataset.src));
    }
  }
  
  // ==================== APPLICATION MODAL ====================
  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      const modalEl = document.getElementById("applicationModal");
      if (modalEl) new bootstrap.Modal(modalEl).show();
    });
  }
  
  // ==================== HERO CAROUSEL ====================
  const heroCarousel = document.getElementById("heroCarousel");
  if (heroCarousel) {
    new bootstrap.Carousel(heroCarousel, {
      interval: 5000,
      ride: "carousel",
    });
  }
  
  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      let isValid = true;
      const firstInvalid = contactForm.querySelector("[required]:invalid");
      
      if (firstInvalid) {
        isValid = false;
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      
      if (isValid) {
        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        
        fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        })
        .then((response) => {
          if (response.ok) {
            window.location.href = "/thank-you.html?form=contact";
            contactForm.reset();
          } else {
            throw new Error();
          }
        })
        .catch(() => alert("Error: Please try again later"))
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send";
        });
      }
    });
  }
  
  // ==================== APPLICATION FORM ====================
  const applicationForm = document.getElementById("applicationForm");
  const resumeInput = document.getElementById("resume");
  
  if (applicationForm) {
    // File Validation
    if (resumeInput) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const ALLOWED_TYPES = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      
      resumeInput.addEventListener("change", function () {
        const file = this.files[0];
        const fileError = document.getElementById("fileError");
        
        if (file) {
          if (file.size > MAX_SIZE || !ALLOWED_TYPES.includes(file.type)) {
            this.classList.add("is-invalid");
            if (fileError)
              fileError.textContent =
            file.size > MAX_SIZE
            ? "File exceeds 5MB limit"
            : "Invalid file type";
          } else {
            this.classList.remove("is-invalid");
            if (fileError) fileError.textContent = "";
          }
        }
      });
    }
    
    // Form Submission
    applicationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }
      
      const submitBtn = this.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        const spinner = submitBtn.querySelector(".spinner-border");
        if (spinner) spinner.classList.remove("d-none");
      }
      
      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: new FormData(this),
          headers: { Accept: "application/json" },
        });
        
        const messageEl = this.querySelector("#applicationMessage");
        if (messageEl) {
          messageEl.classList.remove("d-none", "alert-danger");
          
          if (response.ok) {
            window.location.href ="/thank-you.html?form=application";
            this.reset();
            this.classList.remove("was-validated");
          } else {
            throw new Error();
          }
        }
      } catch {
        const messageEl = this.querySelector("#applicationMessage");
        if (messageEl) {
          messageEl.textContent =
          "Error submitting application. Please try again.";
          messageEl.classList.add("alert-danger");
          messageEl.classList.remove("d-none");
        }
      } finally {
        const submitBtn = this.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          const spinner = submitBtn.querySelector(".spinner-border");
          if (spinner) spinner.classList.add("d-none");
        }
      }
    });
  }
  
  // ==================== NEWSLETTER FORM ====================
  const newsletterForm = document.getElementById("newsletterForm");
  if (!newsletterForm) return;

  const emailInput = document.getElementById("newsletterEmail");
  const submitBtn = document.getElementById("newsletterSubmit");
  const replyToField = document.getElementById("replyToField");
  const submitText = submitBtn?.querySelector(".submit-text");

  if (!emailInput || !submitBtn || !replyToField) return;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time validation
  emailInput.addEventListener("input", function () {
    validateEmail();
  });

  // Form submission
  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateEmail()) return;

    // Update reply-to field
    replyToField.value = emailInput.value;

    // UI Loading state
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = "Sending...";
    const spinner = submitBtn.querySelector(".spinner-border");
    if (spinner) spinner.classList.remove("d-none");

    try {
      // Create form data
      const formData = new FormData(newsletterForm);

      const response = await fetch(newsletterForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        showSuccess();
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Submission error:", error);
      showError();
    } finally {
      resetButton();
    }
  });

  // Helper functions
  function validateEmail() {
    const isValid = emailRegex.test(emailInput.value);
    emailInput.classList.toggle("is-valid", isValid);
    emailInput.classList.toggle("is-invalid", !isValid);

    const errorEl = document.getElementById("emailError");
    if (errorEl) errorEl.style.display = isValid ? "none" : "block";

    return isValid;
  }

  function showSuccess() {
    const successEl = document.getElementById("formSuccess");
    if (successEl) {
      successEl.textContent = "Thank you for subscribing!";
      successEl.classList.remove("d-none");
    }
    // Clear fields
    emailInput.value = "";
    emailInput.classList.remove("is-valid", "is-invalid");
    // Redirect
    window.location.href ="/thank-you.html?form=newsletter";
  }

  function showError() {
    const messageEl = document.getElementById("newsletterMessage");
    if (messageEl) {
      messageEl.textContent = "Subscription failed. Please try again.";
      messageEl.classList.remove("d-none");
    }
  }

  function resetButton() {
    submitBtn.disabled = false;
    if (submitText) submitText.textContent = "Subscribe";
    const spinner = submitBtn.querySelector(".spinner-border");
    if (spinner) spinner.classList.add("d-none");
  }
});
