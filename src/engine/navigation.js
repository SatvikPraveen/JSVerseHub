// src/engine/navigation.js - App Navigation and Routing System

/**
 * Navigation - Handles routing and navigation within the JSVerseHub application
 * Manages URL state, browser history, and deep linking capabilities
 */

class Navigation {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.history = [];
    this.isInitialized = false;
    this.navigationListeners = [];

    // Route definitions
    this.defineRoutes();
  }

  /**
   * Initialize navigation system
   */
  init() {
    this.setupEventListeners();
    this.handleInitialRoute();
    this.isInitialized = true;
    JSVLogger.info("🧭 Navigation system initialized");
  }

  /**
   * Define application routes
   */
  defineRoutes() {
    // Main routes
    this.routes.set("/", {
      name: "galaxy",
      title: "Galaxy Map",
      handler: this.showGalaxyMap.bind(this),
      requiresAuth: false,
    });

    this.routes.set("/planet/:planetId", {
      name: "planet",
      title: "Planet View",
      handler: this.showPlanet.bind(this),
      requiresAuth: false,
      params: ["planetId"],
    });

    this.routes.set("/concept/:conceptId", {
      name: "concept",
      title: "Concept Details",
      handler: this.showConcept.bind(this),
      requiresAuth: false,
      params: ["conceptId"],
    });

    this.routes.set("/exercise/:conceptId/:exerciseId", {
      name: "exercise",
      title: "Exercise",
      handler: this.showExercise.bind(this),
      requiresAuth: false,
      params: ["conceptId", "exerciseId"],
    });

    this.routes.set("/quiz/:conceptId", {
      name: "quiz",
      title: "Quiz",
      handler: this.showQuiz.bind(this),
      requiresAuth: false,
      params: ["conceptId"],
    });

    this.routes.set("/progress", {
      name: "progress",
      title: "Progress Dashboard",
      handler: this.showProgress.bind(this),
      requiresAuth: false,
    });

    this.routes.set("/achievements", {
      name: "achievements",
      title: "Achievements",
      handler: this.showAchievements.bind(this),
      requiresAuth: false,
    });

    this.routes.set("/settings", {
      name: "settings",
      title: "Settings",
      handler: this.showSettings.bind(this),
      requiresAuth: false,
    });

    // 404 route
    this.routes.set("/404", {
      name: "notFound",
      title: "Page Not Found",
      handler: this.show404.bind(this),
      requiresAuth: false,
    });
  }

  /**
   * Setup event listeners for navigation
   */
  setupEventListeners() {
    // Handle browser back/forward buttons
    window.addEventListener("popstate", (e) => {
      this.handlePopState(e);
    });

    // Handle link clicks
    document.addEventListener("click", (e) => {
      this.handleLinkClick(e);
    });

    // Handle keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  /**
   * Handle initial route when app loads
   */
  handleInitialRoute() {
    const currentPath = window.location.pathname + window.location.search;
    this.navigateTo(currentPath, false);
  }

  /**
   * Navigate to a specific route
   */
  navigateTo(path, addToHistory = true) {
    try {
      const route = this.matchRoute(path);
      if (!route) {
        this.navigateTo("/404");
        return false;
      }

      // Check authentication if required
      if (route.config.requiresAuth && !this.isAuthenticated()) {
        JSVLogger.warn("🔐 Route requires authentication");
        return false;
      }

      // Add to browser history
      if (addToHistory) {
        window.history.pushState(
          { path, timestamp: Date.now() },
          route.config.title,
          path
        );
      }

      // Update current route
      this.currentRoute = {
        path,
        config: route.config,
        params: route.params,
        query: route.query,
      };

      // Add to internal history
      this.history.push({
        path,
        timestamp: Date.now(),
        title: route.config.title,
      });

      // Update document title
      document.title = `${route.config.title} - JSVerseHub`;

      // Call route handler
      route.config.handler(route.params, route.query);

      // Notify listeners
      this.notifyNavigationListeners("navigate", this.currentRoute);

      JSVLogger.info(`🧭 Navigated to: ${path}`);
      return true;
    } catch (error) {
      JSVLogger.error("❌ Navigation error:", error);
      this.navigateTo("/404");
      return false;
    }
  }

  /**
   * Match current path against defined routes
   */
  matchRoute(path) {
    const [pathname, search] = path.split("?");
    const query = this.parseQueryString(search || "");

    for (const [pattern, config] of this.routes) {
      const match = this.matchPattern(pathname, pattern);
      if (match) {
        return {
          config,
          params: match.params,
          query,
        };
      }
    }

    return null;
  }

  /**
   * Match path against route pattern
   */
  matchPattern(path, pattern) {
    if (pattern === path) {
      return { params: {} };
    }

    const patternParts = pattern.split("/");
    const pathParts = path.split("/");

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(":")) {
        // Parameter
        const paramName = patternPart.slice(1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (patternPart !== pathPart) {
        // Literal doesn't match
        return null;
      }
    }

    return { params };
  }

  /**
   * Parse query string into object
   */
  parseQueryString(queryString) {
    const params = {};
    const pairs = queryString.split("&");

    pairs.forEach((pair) => {
      if (pair.trim()) {
        const [key, value] = pair.split("=");
        if (key) {
          params[decodeURIComponent(key)] = value
            ? decodeURIComponent(value.replace(/\+/g, " "))
            : "";
        }
      }
    });

    return params;
  }

  /**
   * Handle browser back/forward navigation
   */
  handlePopState(event) {
    const path = window.location.pathname + window.location.search;
    this.navigateTo(path, false);
  }

  /**
   * Handle clicks on navigation links
   */
  handleLinkClick(event) {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");

    // Skip external links and special protocols
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return;
    }

    // Skip links with target="_blank" or download attribute
    if (link.target === "_blank" || link.hasAttribute("download")) {
      return;
    }

    // Skip if modifier keys are pressed
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    event.preventDefault();
    this.navigateTo(href);
  }

  /**
   * Handle keyboard navigation shortcuts
   */
  handleKeyboardNavigation(event) {
    // Alt + Arrow keys for navigation
    if (event.altKey) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          this.goBack();
          break;
        case "ArrowRight":
          event.preventDefault();
          this.goForward();
          break;
        case "Home":
          event.preventDefault();
          this.navigateTo("/");
          break;
      }
    }

    // Number keys for quick navigation
    if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
      const planetIndex = parseInt(event.key) - 1;
      const planets = StateManager.getProgress().unlockedPlanets;
      if (planets[planetIndex]) {
        event.preventDefault();
        this.navigateTo(`/planet/${planets[planetIndex]}`);
      }
    }
  }

  /**
   * Go back in navigation history
   */
  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo("/");
    }
  }

  /**
   * Go forward in navigation history
   */
  goForward() {
    window.history.forward();
  }

  /**
   * Route handlers
   */
  showGalaxyMap(params, query) {
    this.setActiveView("galaxy-map");

    // Close any open modals
    this.closeAllModals();

    // Focus on specific planet if specified
    if (query.focus) {
      setTimeout(() => {
        this.focusOnPlanet(query.focus);
      }, 500);
    }
  }

  showPlanet(params, query) {
    const { planetId } = params;

    // Verify planet exists and is unlocked
    const progress = StateManager.getProgress();
    if (!progress.unlockedPlanets.includes(planetId)) {
      JSVLogger.warn(`🔒 Planet ${planetId} is locked`);
      this.navigateTo("/");
      return;
    }

    // Set as current planet
    StateManager.setCurrentPlanet(planetId);

    // Show planet details
    this.showPlanetDetails(planetId);
  }

  showConcept(params, query) {
    const { conceptId } = params;

    // Load and display concept
    if (window.ConceptViewer) {
      window.ConceptViewer.showConcept(conceptId);
    }
  }

  showExercise(params, query) {
    const { conceptId, exerciseId } = params;

    // Load and display exercise
    if (window.ConceptViewer) {
      window.ConceptViewer.showExercise(conceptId, exerciseId);
    }
  }

  showQuiz(params, query) {
    const { conceptId } = params;

    // Load and display quiz
    if (window.ConceptViewer) {
      window.ConceptViewer.showQuiz(conceptId);
    }
  }

  showProgress(params, query) {
    this.setActiveView("progress");
    // Implementation would show progress dashboard
  }

  showAchievements(params, query) {
    this.setActiveView("achievements");
    // Implementation would show achievements page
  }

  showSettings(params, query) {
    this.setActiveView("settings");
    // Implementation would show settings page
  }

  show404(params, query) {
    this.setActiveView("404");
    this.showNotFoundMessage();
  }

  /**
   * Set active view in the interface
   */
  setActiveView(viewName) {
    // Hide all views
    document.querySelectorAll("[data-view]").forEach((view) => {
      view.classList.add("hidden");
    });

    // Show target view
    const targetView = document.querySelector(`[data-view="${viewName}"]`);
    if (targetView) {
      targetView.classList.remove("hidden");
    }

    // Update navigation state
    this.updateNavigationUI(viewName);
  }

  /**
   * Update navigation UI elements
   */
  updateNavigationUI(activeView) {
    // Update navigation highlights
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    const activeNavItem = document.querySelector(`[data-nav="${activeView}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add("active");
    }
  }

  /**
   * Close all open modals
   */
  closeAllModals() {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show");
    });
  }

  /**
   * Focus on specific planet in galaxy view
   */
  focusOnPlanet(planetId) {
    const planet = document.querySelector(`[data-planet-id="${planetId}"]`);
    if (planet) {
      planet.scrollIntoView({ behavior: "smooth", block: "center" });
      planet.classList.add("highlighted");

      setTimeout(() => {
        planet.classList.remove("highlighted");
      }, 2000);
    }
  }

  /**
   * Show planet details modal
   */
  showPlanetDetails(planetId) {
    if (window.ConceptViewer) {
      window.ConceptViewer.showConcept(planetId);
    }
  }

  /**
   * Show 404 not found message
   */
  showNotFoundMessage() {
    // Create or show 404 message
    let notFoundElement = document.getElementById("not-found-message");

    if (!notFoundElement) {
      notFoundElement = document.createElement("div");
      notFoundElement.id = "not-found-message";
      notFoundElement.className = "not-found-container";
      notFoundElement.innerHTML = `
                <div class="not-found-content">
                    <h2>🌌 Lost in Space?</h2>
                    <p>The page you're looking for doesn't exist in our galaxy.</p>
                    <button class="btn btn-primary" onclick="Navigation.navigateTo('/')">
                        🏠 Return to Galaxy
                    </button>
                </div>
            `;
      document.body.appendChild(notFoundElement);
    }

    notFoundElement.classList.remove("hidden");
  }

  /**
   * Generate URL for route with parameters
   */
  generateUrl(routeName, params = {}, query = {}) {
    let pattern = null;

    // Find route pattern by name
    for (const [routePattern, config] of this.routes) {
      if (config.name === routeName) {
        pattern = routePattern;
        break;
      }
    }

    if (!pattern) {
      JSVLogger.warn(`🔍 Route not found: ${routeName}`);
      return "/";
    }

    // Replace parameters in pattern
    let url = pattern;
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    // Add query string
    const queryString = Object.entries(query)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Check if user is authenticated (placeholder)
   */
  isAuthenticated() {
    // In a real app, this would check authentication status
    return true;
  }

  /**
   * Get current route information
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Get navigation history
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Add navigation listener
   */
  addNavigationListener(callback) {
    this.navigationListeners.push(callback);
    return () => {
      this.navigationListeners = this.navigationListeners.filter(
        (l) => l !== callback
      );
    };
  }

  /**
   * Notify navigation listeners
   */
  notifyNavigationListeners(event, data) {
    this.navigationListeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        JSVLogger.error("❌ Navigation listener error:", error);
      }
    });
  }

  /**
   * Clear navigation history
   */
  clearHistory() {
    this.history = [];
    JSVLogger.info("🗑️ Navigation history cleared");
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!Navigation.instance) {
      Navigation.instance = new Navigation();
    }
    return Navigation.instance;
  }
}

// Create singleton instance
const Navigation = Navigation.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.Navigation = Navigation;
}

// Add CSS for navigation elements
const navigationStyles = document.createElement("style");
navigationStyles.textContent = `
    .not-found-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .not-found-content {
        text-align: center;
        padding: 2rem;
        background: var(--secondary-bg);
        border-radius: var(--border-radius);
        border: 1px solid rgba(0, 212, 255, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }

    .not-found-content h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--accent-color);
    }

    .not-found-content p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: var(--text-secondary);
    }

    .nav-item.active {
        background: rgba(0, 212, 255, 0.2);
        border-radius: 8px;
    }

    .planet.highlighted {
        animation: planetHighlight 2s ease-in-out;
    }

    @keyframes planetHighlight {
        0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 40px rgba(0, 212, 255, 0.5);
        }
        50% { 
            transform: scale(1.15);
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.8);
        }
    }

    [data-view].hidden {
        display: none;
    }
`;
document.head.appendChild(navigationStyles);
