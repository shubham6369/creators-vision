/**
 * Creators Vision Agency Core Scripts
 * Dynamic Navbar, Portfolio Filters, Testimonial Carousel, Cost Estimator, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Navigation & Hamburger Menu
  // ==========================================
  const header = document.querySelector('.app-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Change navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation overlay
  const toggleMobileMenu = () => {
    const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    document.body.style.overflow = isExpanded ? '' : 'hidden'; // Lock background scroll
  };

  menuToggleBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile navigation when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });


  // ==========================================
  // 2. Interactive Project Cost Estimator
  // ==========================================
  const estimatorForm = document.getElementById('estimator-form');
  const priceDisplay = document.getElementById('price-display');
  const timelineDisplay = document.getElementById('timeline-display');
  const estimatorProgress = document.getElementById('estimator-progress');
  const applyBlueprintBtn = document.getElementById('apply-blueprint-btn');

  // Interactive Estimator Variables (Blended Hardware + Software Setup rates)
  const platformRates = {
    web: 1200,      // App & Web System
    mobile: 1800,   // Class & Studio Setup
    both: 2800      // Complete Ecosystem (Both)
  };

  const scaleRates = {
    basic: 500,        // Essential Tiers
    professional: 1500, // Pro Standards
    enterprise: 3000    // Enterprise Custom
  };

  const featureRates = {
    auth: 1100,      // Interactive Touch Flat Panel
    payment: 600,     // PTZ Camera & Recording Hardware
    cms: 1200,        // Custom White-Labeled App
    inventory: 700,   // Soundproofing & Acoustic Panels
    chat: 500         // YouTube Video Editing Bundle
  };

  const timelineMultipliers = [0.9, 1.0, 1.25]; // index 0: Flexible, 1: Standard, 2: Fast-Track

  // Custom visual toggle handler for calculator inputs
  const setupCalculatorToggles = () => {
    const options = estimatorForm.querySelectorAll('.calc-option');
    const checkboxes = estimatorForm.querySelectorAll('.calc-checkbox-card');

    options.forEach(option => {
      const input = option.querySelector('input');
      option.addEventListener('click', () => {
        // Find siblings in the same group and deactivate
        const group = input.getAttribute('name');
        estimatorForm.querySelectorAll(`input[name="${group}"]`).forEach(sibling => {
          sibling.parentElement.classList.remove('active');
        });

        input.checked = true;
        option.classList.add('active');
        calculateEstimate();
      });
    });

    checkboxes.forEach(card => {
      const input = card.querySelector('input');
      card.addEventListener('click', (e) => {
        // Prevent event double-firing when clicking label wrapper
        if (e.target.tagName === 'INPUT') return;
        input.checked = !input.checked;
        card.classList.toggle('active', input.checked);
        calculateEstimate();
      });

      // Synchronize keypress accessibility
      input.addEventListener('change', () => {
        card.classList.toggle('active', input.checked);
        calculateEstimate();
      });
    });

    const slider = document.getElementById('timeline-slider');
    slider.addEventListener('input', () => {
      const labels = document.querySelectorAll('.range-slider-labels span');
      labels.forEach((label, idx) => {
        label.classList.toggle('active-label', idx === (parseInt(slider.value) - 1));
      });
      calculateEstimate();
    });
  };

  // summation calculation function
  const calculateEstimate = () => {
    const formData = new FormData(estimatorForm);
    
    const selectedPlatform = formData.get('platform');
    const selectedScale = formData.get('scale');
    const selectedFeatures = formData.getAll('feature');
    const selectedTimelineIndex = parseInt(formData.get('timeline')) - 1;

    // Sum base pricing
    let subtotal = 0;
    subtotal += platformRates[selectedPlatform] || 0;
    subtotal += scaleRates[selectedScale] || 0;

    selectedFeatures.forEach(feat => {
      subtotal += featureRates[feat] || 0;
    });

    // Apply timeline adjustments
    const multiplier = timelineMultipliers[selectedTimelineIndex];
    let total = Math.round(subtotal * multiplier);

    // Format display output
    priceDisplay.textContent = `$${total.toLocaleString()}`;

    // Dynamic timeline estimate text matching
    let timelineWeeks = "4–5 weeks";
    if (selectedPlatform === 'web') {
      if (selectedScale === 'basic') timelineWeeks = selectedTimelineIndex === 2 ? '1–2 weeks' : '2–3 weeks';
      else if (selectedScale === 'professional') timelineWeeks = selectedTimelineIndex === 2 ? '3–4 weeks' : '4–5 weeks';
      else timelineWeeks = selectedTimelineIndex === 2 ? '5–7 weeks' : '6–8 weeks';
    } else if (selectedPlatform === 'mobile') {
      if (selectedScale === 'basic') timelineWeeks = selectedTimelineIndex === 2 ? '1–2 weeks' : '2–3 weeks';
      else if (selectedScale === 'professional') timelineWeeks = selectedTimelineIndex === 2 ? '3–4 weeks' : '4–5 weeks';
      else timelineWeeks = selectedTimelineIndex === 2 ? '5–6 weeks' : '6–8 weeks';
    } else {
      if (selectedScale === 'basic') timelineWeeks = selectedTimelineIndex === 2 ? '3–4 weeks' : '4–5 weeks';
      else if (selectedScale === 'professional') timelineWeeks = selectedTimelineIndex === 2 ? '5–7 weeks' : '6–8 weeks';
      else timelineWeeks = selectedTimelineIndex === 2 ? '8–10 weeks' : '10–12 weeks';
    }
    timelineDisplay.textContent = timelineWeeks;

    // Scope Complexity progress bar
    const maxPossibleSubtotal = platformRates.both + scaleRates.enterprise + Object.values(featureRates).reduce((a, b) => a + b, 0);
    const progressPercent = Math.min(Math.round((subtotal / maxPossibleSubtotal) * 100), 100);
    estimatorProgress.style.width = `${progressPercent}%`;
  };

  // Map estimator inputs directly down to contact form inputs
  const applyEstimateToForm = () => {
    const formData = new FormData(estimatorForm);
    const selectedPlatform = formData.get('platform');
    const selectedScale = formData.get('scale');
    const selectedFeatures = formData.getAll('feature');
    const selectedTimelineIndex = parseInt(formData.get('timeline')) - 1;

    // 1. Map business type dropdown based on features
    const businessTypeSelect = document.getElementById('business-type');
    if (selectedFeatures.includes('cms')) {
      businessTypeSelect.value = 'coaching';
    } else if (selectedFeatures.includes('chat') || selectedFeatures.includes('payment')) {
      businessTypeSelect.value = 'creators';
    } else if (selectedPlatform === 'mobile' || selectedFeatures.includes('auth')) {
      businessTypeSelect.value = 'creators'; // Teachers/Creators setup
    } else {
      businessTypeSelect.value = 'vendor';
    }

    // 2. Map budget dropdown matching calculated value
    const calculatedPrice = parseInt(priceDisplay.textContent.replace(/[$,]/g, ''));
    const budgetSelect = document.getElementById('project-budget');
    if (calculatedPrice <= 2000) {
      budgetSelect.value = 'starter';
    } else if (calculatedPrice <= 5500) {
      budgetSelect.value = 'growth';
    } else if (calculatedPrice <= 10000) {
      budgetSelect.value = 'enterprise';
    } else {
      budgetSelect.value = 'custom';
    }

    // 3. Assemble description blueprint outline
    const featuresReadable = {
      auth: 'Interactive Touch Flat Panel',
      payment: 'PTZ Camera & Audio Gear',
      cms: 'Custom Student mobile App',
      inventory: 'Soundproofing & Acoustic Panels',
      chat: 'YouTube Video Editing Bundle'
    };

    const timelinesReadable = ['Flexible Timeline', 'Standard Delivery', 'Fast-Track / Urgent'];
    const scaleReadable = { basic: 'Essential Setup', professional: 'Pro Standard Tiers', enterprise: 'Enterprise Custom Build' };
    const platformReadable = { web: 'App & Web System', mobile: 'Classroom & Studio Hardware', both: 'Complete Unified Ecosystem' };

    const selectedFeaturesText = selectedFeatures.map(f => featuresReadable[f]).join(', ');
    const descTextarea = document.getElementById('project-desc');
    
    descTextarea.value = `We are blueprinting a project with the following requirements:
- Platform Model: ${platformReadable[selectedPlatform]}
- Scope Tier: ${scaleReadable[selectedScale]}
- Selected Add-ons: ${selectedFeaturesText || 'Standard Setup'}
- Urgency: ${timelinesReadable[selectedTimelineIndex]}
- Calculated Budget Value: ${priceDisplay.textContent}`;

    // Clean inline errors that might have been triggered on these select/textarea elements
    const errorsToClear = ['error-business-type', 'error-budget', 'error-desc'];
    errorsToClear.forEach(id => {
      const msg = document.getElementById(id);
      msg.textContent = '';
      msg.previousElementSibling?.querySelector('input, select, textarea')?.classList.remove('invalid-field');
      const selectOrTextArea = document.getElementById(id.replace('error-', ''));
      if (selectOrTextArea) selectOrTextArea.classList.remove('invalid-field');
    });

    // Smooth scroll down to contact section
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ behavior: 'smooth' });

    // Focus the description textarea for user edits
    setTimeout(() => {
      descTextarea.focus();
    }, 800);
  };

  // Wire event handlers
  setupCalculatorToggles();
  calculateEstimate(); // initial call
  applyBlueprintBtn.addEventListener('click', applyEstimateToForm);


  // ==========================================
  // 3. Portfolio Filters
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      // Filter portfolio items
      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal) {
          item.classList.remove('hidden');
          // Trigger CSS reflow for smooth scale fade-in animations
          item.style.animation = 'none';
          item.offsetHeight; // reflow
          item.style.animation = 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ==========================================
  // 4. Testimonials Slider Carousel
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const indicators = document.querySelectorAll('#slider-indicators .indicator');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    // Wrap-around bounds checker
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startAutoplay = () => {
    slideInterval = setInterval(nextSlide, 7000); // cycle slides every 7s
  };

  const stopAutoplay = () => {
    clearInterval(slideInterval);
  };

  // Wire buttons
  prevBtn.addEventListener('click', () => {
    stopAutoplay();
    showSlide(currentSlide - 1);
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoplay();
    showSlide(currentSlide + 1);
    startAutoplay();
  });

  // Wire indicator dots
  indicators.forEach(ind => {
    ind.addEventListener('click', () => {
      stopAutoplay();
      const slideIndex = parseInt(ind.getAttribute('data-slide'));
      showSlide(slideIndex);
      startAutoplay();
    });
  });

  // Slide autoplay hooks
  const sliderContainer = document.querySelector('.testimonials-slider-container');
  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);

  // Initialize
  startAutoplay();


  // ==========================================
  // 5. Contact Form intake & Validation
  // ==========================================
  const intakeForm = document.getElementById('intake-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-btn-text');
  const submitSpinner = document.getElementById('submit-btn-spinner');

  const fields = {
    name: {
      input: document.getElementById('client-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length > 0 ? '' : 'Full name is required.'
    },
    email: {
      input: document.getElementById('client-email'),
      error: document.getElementById('error-email'),
      validate: (val) => {
        if (!val.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) ? '' : 'Please enter a valid email address.';
      }
    },
    business_type: {
      input: document.getElementById('business-type'),
      error: document.getElementById('error-business-type'),
      validate: (val) => val ? '' : 'Please select your industry focus.'
    },
    budget: {
      input: document.getElementById('project-budget'),
      error: document.getElementById('error-budget'),
      validate: (val) => val ? '' : 'Please select your estimated budget.'
    },
    details: {
      input: document.getElementById('project-desc'),
      error: document.getElementById('error-desc'),
      validate: (val) => val.trim().length >= 15 ? '' : 'Please share some detail about your project features (minimum 15 characters).'
    }
  };

  // Perform inline validation on single input field
  const validateField = (fieldKey) => {
    const field = fields[fieldKey];
    const errorMsg = field.validate(field.input.value);
    
    field.error.textContent = errorMsg;
    if (errorMsg) {
      field.input.classList.add('invalid-field');
      return false;
    } else {
      field.input.classList.remove('invalid-field');
      return true;
    }
  };

  // Bind blur event validation for individual fields
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    field.input.addEventListener('blur', () => {
      validateField(key);
    });

    // Clear error inline as user starts correcting typings
    field.input.addEventListener('input', () => {
      if (field.input.value.trim() !== '') {
        field.error.textContent = '';
        field.input.classList.remove('invalid-field');
      }
    });
  });

  // Handle Project Intake Form Submit
  intakeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstErrorField = null;

    // Validate all fields
    Object.keys(fields).forEach(key => {
      const isValid = validateField(key);
      if (!isValid) {
        isFormValid = false;
        if (!firstErrorField) {
          firstErrorField = fields[key].input;
        }
      }
    });

    if (!isFormValid) {
      // Focus first erroneous input to assist navigation
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // Submit Action Simulation
    // 1. Enter sending state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending Proposal Request…';
    submitSpinner.classList.remove('hidden');

    // 2. Perform mock request with 1.5s delay
    setTimeout(() => {
      // Transition out of sending state
      submitBtn.disabled = false;
      submitText.textContent = 'Submit Proposal Request';
      submitSpinner.classList.add('hidden');

      // Hide intake form layout and show success state
      intakeForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      
      // Auto scroll success card into view on small screens
      document.getElementById('contact-form-container').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  });

  // Reset form back to editing
  resetFormBtn.addEventListener('click', () => {
    intakeForm.reset();
    formSuccess.classList.add('hidden');
    intakeForm.classList.remove('hidden');

    // Clear all field classes
    Object.keys(fields).forEach(key => {
      fields[key].input.classList.remove('invalid-field');
      fields[key].error.textContent = '';
    });
  });

  // ==========================================
  // 6. Cart Drawer Interactive Handlers
  // ==========================================
  const cartNavBtn = document.getElementById('cart-nav-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');

  if (cartNavBtn && cartDrawerOverlay) {
    cartNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawerOverlay.classList.add('open');
      cartDrawerOverlay.setAttribute('aria-hidden', 'false');
    });
  }

  if (cartCloseBtn && cartDrawerOverlay) {
    cartCloseBtn.addEventListener('click', () => {
      cartDrawerOverlay.classList.remove('open');
      cartDrawerOverlay.setAttribute('aria-hidden', 'true');
    });

    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) {
        cartDrawerOverlay.classList.remove('open');
        cartDrawerOverlay.setAttribute('aria-hidden', 'true');
      }
    });
  }

});
