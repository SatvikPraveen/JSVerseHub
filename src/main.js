// src/main.js - Application Entry Point

/**
 * JSVerseHub - Main Application Controller
 * Initializes the galaxy-based JavaScript learning platform
 */

class JSVerseHubApp {
  constructor() {
    this.isInitialized = false;
    this.currentTheme = "galaxy";
    this.components = {};

    // Initialize app when DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      JSVLogger.info("🚀 Initializing JSVerseHub...");

      // Show loading overlay
      this.showLoadingOverlay();

      // Initialize core systems
      await this.initializeCoreSystem();

      // Initialize components
      await this.initializeComponents();

      // Setup event listeners
      this.setupGlobalEventListeners();

      // Initialize galaxy
      await this.initializeGalaxy();

      // Setup theme system
      this.initializeThemeSystem();

      // Hide loading overlay and show welcome
      this.hideLoadingOverlay();
      this.showWelcomeModal();

      this.isInitialized = true;
      JSVLogger.success("✅ JSVerseHub initialized successfully!");
    } catch (error) {
      JSVLogger.error("❌ Failed to initialize JSVerseHub:", error);
      this.showErrorState(error);
    }
  }

  /**
   * Initialize core systems
   */
  async initializeCoreSystem() {
    // Initialize state manager
    if (typeof StateManager !== "undefined") {
      StateManager.init();
      JSVLogger.info("📊 State Manager initialized");
    }

    // Initialize concept loader
    if (typeof ConceptLoader !== "undefined") {
      await ConceptLoader.init();
      JSVLogger.info("📚 Concept Loader initialized");
    }

    // Initialize navigation system
    if (typeof Navigation !== "undefined") {
      Navigation.init();
      JSVLogger.info("🧭 Navigation system initialized");
    }

    // Create star field background
    this.initializeStarField();
  }

  /**
   * Initialize UI components
   */
  async initializeComponents() {
    const componentClasses = {
      navbar: "Navbar",
      modal: "Modal",
      galaxyMap: "GalaxyMap",
      planetCard: "PlanetCard",
      conceptViewer: "ConceptViewer",
    };

    for (const [name, className] of Object.entries(componentClasses)) {
      try {
        if (typeof window[className] !== "undefined") {
          this.components[name] = new window[className]();
          JSVLogger.info(`🔧 ${className} component initialized`);
        }
      } catch (error) {
        JSVLogger.warn(`⚠️ Failed to initialize ${className}:`, error);
      }
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Welcome modal buttons
    const startJourney = document.getElementById("start-journey");
    const skipIntro = document.getElementById("skip-intro");

    if (startJourney) {
      startJourney.addEventListener("click", () => this.startJourney());
    }

    if (skipIntro) {
      skipIntro.addEventListener("click", () => this.hideWelcomeModal());
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) =>
      this.handleKeyboardShortcuts(e)
    );

    // Window resize handler
    window.addEventListener(
      "resize",
      debounce(() => this.handleResize(), 250)
    );

    // Prevent right-click context menu on planets (optional)
    document.addEventListener("contextmenu", (e) => {
      if (e.target.classList.contains("planet")) {
        e.preventDefault();
      }
    });
  }

  /**
   * Initialize the galaxy visualization
   */
  async initializeGalaxy() {
    if (typeof GalaxyRenderer !== "undefined") {
      await GalaxyRenderer.init();
      GalaxyRenderer.renderGalaxy();
      JSVLogger.info("🌌 Galaxy rendered");
    }
  }

  /**
   * Initialize star field background
   */
  initializeStarField() {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 10000);

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random(),
        });
      }
    };

    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Animate opacity for twinkling effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
      });

      animationId = requestAnimationFrame(animateStars);
    };

    resizeCanvas();
    animateStars();

    // Store cleanup function
    this.cleanupStarField = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };

    window.addEventListener("resize", resizeCanvas);
  }

  /**
   * Initialize theme system
   */
  initializeThemeSystem() {
    // Load saved theme
    const savedTheme = localStorage.getItem("jsversehub-theme") || "galaxy";
    this.setTheme(savedTheme);
  }

  /**
   * Toggle between themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === "galaxy" ? "cosmic" : "galaxy";
    this.setTheme(newTheme);
    this.playClickSound();
  }

  /**
   * Set application theme
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.body.className = `${theme}-theme`;
    localStorage.setItem("jsversehub-theme", theme);

    // Update theme toggle button
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.setAttribute("data-theme", theme);
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // ESC key - close modals
    if (e.key === "Escape") {
      this.closeAllModals();
    }

    // Space key - toggle theme
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault();
      this.toggleTheme();
    }

    // Arrow keys - navigate planets
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      if (this.components.galaxyMap) {
        this.components.galaxyMap.handleKeyNavigation(e.key);
      }
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (this.components.galaxyMap) {
      this.components.galaxyMap.handleResize();
    }
  }

  /**
   * Show loading overlay
   */
  showLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.remove("hidden");
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.classList.add("hidden");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
    }
  }

  /**
   * Show welcome modal
   */
  showWelcomeModal() {
    const modal = document.getElementById("welcome-modal");
    if (modal && !StateManager.getProgress().hasSeenWelcome) {
      modal.classList.add("show");
    }
  }

  /**
   * Hide welcome modal
   */
  hideWelcomeModal() {
    const modal = document.getElementById("welcome-modal");
    if (modal) {
      modal.classList.remove("show");
      StateManager.updateProgress({ hasSeenWelcome: true });
    }
  }

  /**
   * Start the learning journey
   */
  startJourney() {
    this.hideWelcomeModal();
    this.playClickSound();

    // Highlight the first available planet
    if (this.components.galaxyMap) {
      this.components.galaxyMap.highlightFirstPlanet();
    }

    // Show achievement for starting
    this.showAchievement(
      "🚀 Journey Begins!",
      "Welcome to the JavaScript universe"
    );
  }

  /**
   * Close all open modals
   */
  closeAllModals() {
    const modals = document.querySelectorAll(".modal.show");
    modals.forEach((modal) => {
      modal.classList.remove("show");
    });
  }

  /**
   * Play click sound effect
   */
  playClickSound() {
    const audio = document.getElementById("click-sound");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore audio play errors (browser restrictions)
      });
    }
  }

  /**
   * Show achievement notification
   */
  showAchievement(title, description) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-title">${title}</div>
                <div class="achievement-description">${description}</div>
            </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 4000);
  }

  /**
   * Show error state
   */
  showErrorState(error) {
    const errorHTML = `
            <div class="error-state">
                <h2>🚫 Oops! Something went wrong</h2>
                <p>We encountered an error while loading JSVerseHub:</p>
                <pre>${error.message}</pre>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    🔄 Reload Application
                </button>
            </div>
        `;

    document.body.innerHTML = errorHTML;
  }

  /**
   * Get application instance
   */
  static getInstance() {
    if (!JSVerseHubApp.instance) {
      JSVerseHubApp.instance = new JSVerseHubApp();
    }
    return JSVerseHubApp.instance;
  }
}

// Initialize the application
const app = JSVerseHubApp.getInstance();

// Export for external access
if (typeof window !== "undefined") {
  window.JSVerseHub = app;
}

// Service Worker registration (if available)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      JSVLogger.info("🔧 Service Worker registered successfully");
    })
    .catch((error) => {
      JSVLogger.warn("⚠️ Service Worker registration failed:", error);
    });
}
