// src/engine/galaxyRenderer.js - Galaxy Visualization and Planet Positioning

/**
 * GalaxyRenderer - Manages the visual galaxy layout and planet positioning
 * Creates an interactive 3D-like galaxy experience
 */

class GalaxyRenderer {
  constructor() {
    this.container = null;
    this.planets = [];
    this.connections = [];
    this.isInitialized = false;

    // Galaxy configuration
    this.config = {
      centerX: 0,
      centerY: 0,
      spiralArms: 3,
      armSpread: 120, // degrees
      maxRadius: 400,
      minRadius: 150,
      planetSpacing: 80,
      animationSpeed: 0.5,
    };

    // Planet definitions with positions and dependencies
    this.planetDefinitions = {
      basics: {
        id: "basics",
        title: "Basics",
        subtitle: "Variables, Functions, Loops",
        description: "Master JavaScript fundamentals",
        difficulty: "beginner",
        estimatedTime: "2-3 hours",
        concepts: 5,
        position: { angle: 0, radius: 150 },
        dependencies: [],
        color: "#ff6b6b",
      },
      dom: {
        id: "dom",
        title: "DOM",
        subtitle: "Document Object Model",
        description: "Manipulate web pages dynamically",
        difficulty: "beginner",
        estimatedTime: "3-4 hours",
        concepts: 4,
        position: { angle: 30, radius: 200 },
        dependencies: ["basics"],
        color: "#4ecdc4",
      },
      async: {
        id: "async",
        title: "Async",
        subtitle: "Promises, Async/Await",
        description: "Handle asynchronous operations",
        difficulty: "intermediate",
        estimatedTime: "4-5 hours",
        concepts: 3,
        position: { angle: 90, radius: 250 },
        dependencies: ["basics"],
        color: "#ffe66d",
      },
      es6: {
        id: "es6",
        title: "ES6+",
        subtitle: "Modern JavaScript",
        description: "Latest JavaScript features",
        difficulty: "intermediate",
        estimatedTime: "3-4 hours",
        concepts: 4,
        position: { angle: 150, radius: 220 },
        dependencies: ["basics"],
        color: "#a29bfe",
      },
      oop: {
        id: "oop",
        title: "OOP",
        subtitle: "Object-Oriented Programming",
        description: "Classes, inheritance, and design patterns",
        difficulty: "intermediate",
        estimatedTime: "5-6 hours",
        concepts: 3,
        position: { angle: 210, radius: 280 },
        dependencies: ["basics", "es6"],
        color: "#fd79a8",
      },
      functional: {
        id: "functional",
        title: "Functional",
        subtitle: "Functional Programming",
        description: "Pure functions and immutability",
        difficulty: "intermediate",
        estimatedTime: "4-5 hours",
        concepts: 3,
        position: { angle: 270, radius: 260 },
        dependencies: ["basics", "es6"],
        color: "#00d4ff",
      },
      patterns: {
        id: "patterns",
        title: "Patterns",
        subtitle: "Design Patterns",
        description: "Common programming patterns",
        difficulty: "advanced",
        estimatedTime: "6-7 hours",
        concepts: 3,
        position: { angle: 330, radius: 320 },
        dependencies: ["oop", "functional"],
        color: "#ffeaa7",
      },
      storage: {
        id: "storage",
        title: "Storage",
        subtitle: "Data Persistence",
        description: "Local storage and databases",
        difficulty: "intermediate",
        estimatedTime: "3-4 hours",
        concepts: 3,
        position: { angle: 60, radius: 300 },
        dependencies: ["dom", "async"],
        color: "#fab1a0",
      },
      events: {
        id: "events",
        title: "Events",
        subtitle: "Event Handling",
        description: "User interactions and events",
        difficulty: "beginner",
        estimatedTime: "2-3 hours",
        concepts: 2,
        position: { angle: 120, radius: 180 },
        dependencies: ["dom"],
        color: "#74b9ff",
      },
      testing: {
        id: "testing",
        title: "Testing",
        subtitle: "Unit & Integration Testing",
        description: "Test-driven development",
        difficulty: "advanced",
        estimatedTime: "5-6 hours",
        concepts: 3,
        position: { angle: 180, radius: 350 },
        dependencies: ["oop", "functional"],
        color: "#55a3ff",
      },
      security: {
        id: "security",
        title: "Security",
        subtitle: "Web Security",
        description: "Secure coding practices",
        difficulty: "advanced",
        estimatedTime: "4-5 hours",
        concepts: 3,
        position: { angle: 240, radius: 340 },
        dependencies: ["async", "storage"],
        color: "#fd79a8",
      },
      algorithms: {
        id: "algorithms",
        title: "Algorithms",
        subtitle: "Data Structures & Algorithms",
        description: "Problem-solving techniques",
        difficulty: "advanced",
        estimatedTime: "8-10 hours",
        concepts: 4,
        position: { angle: 300, radius: 380 },
        dependencies: ["oop", "functional"],
        color: "#fdcb6e",
      },
      canvas: {
        id: "canvas",
        title: "Canvas",
        subtitle: "Graphics & Animation",
        description: "2D graphics and animations",
        difficulty: "advanced",
        estimatedTime: "6-7 hours",
        concepts: 3,
        position: { angle: 360, radius: 300 },
        dependencies: ["dom", "events"],
        color: "#00b894",
      },
      api: {
        id: "api",
        title: "APIs",
        subtitle: "Web APIs & HTTP",
        description: "Interact with external services",
        difficulty: "intermediate",
        estimatedTime: "4-5 hours",
        concepts: 3,
        position: { angle: 45, radius: 330 },
        dependencies: ["async", "storage"],
        color: "#6c5ce7",
      },
    };
  }

  /**
   * Initialize the galaxy renderer
   */
  async init() {
    this.container = document.getElementById("galaxy-map");
    if (!this.container) {
      throw new Error("Galaxy map container not found");
    }

    this.updateContainerDimensions();
    this.isInitialized = true;

    // Listen for state changes
    StateManager.addListener((event, data) => {
      this.handleStateChange(event, data);
    });

    JSVLogger.info("🌌 Galaxy Renderer initialized");
  }

  /**
   * Update container dimensions
   */
  updateContainerDimensions() {
    const rect = this.container.getBoundingClientRect();
    this.config.centerX = rect.width / 2;
    this.config.centerY = rect.height / 2;
  }

  /**
   * Render the complete galaxy
   */
  renderGalaxy() {
    if (!this.isInitialized) return;

    this.clearGalaxy();
    this.createGalaxyClusters();
    this.createPlanets();
    this.createConnections();
    this.animateGalaxy();

    JSVLogger.info("🌌 Galaxy rendered successfully");
  }

  /**
   * Clear existing galaxy elements
   */
  clearGalaxy() {
    this.container.innerHTML = "";
    this.planets = [];
    this.connections = [];
  }

  /**
   * Create galaxy cluster backgrounds
   */
  createGalaxyClusters() {
    const clusters = [
      { name: "beginner", radius: 200, planets: ["basics", "dom", "events"] },
      {
        name: "intermediate",
        radius: 280,
        planets: ["async", "es6", "oop", "functional", "storage", "api"],
      },
      {
        name: "advanced",
        radius: 360,
        planets: ["patterns", "testing", "security", "algorithms", "canvas"],
      },
    ];

    clusters.forEach((cluster) => {
      const clusterEl = document.createElement("div");
      clusterEl.className = `galaxy-cluster ${cluster.name}`;
      clusterEl.style.cssText = `
                left: ${this.config.centerX - cluster.radius}px;
                top: ${this.config.centerY - cluster.radius}px;
                width: ${cluster.radius * 2}px;
                height: ${cluster.radius * 2}px;
            `;
      this.container.appendChild(clusterEl);
    });
  }

  /**
   * Create planet elements
   */
  createPlanets() {
    const progress = StateManager.getProgress();

    Object.values(this.planetDefinitions).forEach((planetDef) => {
      const planet = this.createPlanetElement(planetDef, progress);
      this.container.appendChild(planet);
      this.planets.push({
        element: planet,
        definition: planetDef,
      });
    });
  }

  /**
   * Create individual planet element
   */
  createPlanetElement(planetDef, progress) {
    const { angle, radius } = planetDef.position;
    const radian = (angle * Math.PI) / 180;
    const x = this.config.centerX + radius * Math.cos(radian);
    const y = this.config.centerY + radius * Math.sin(radian);

    // Determine planet state
    const isUnlocked = progress.unlockedPlanets.includes(planetDef.id);
    const isCompleted = progress.completedConcepts.some((concept) =>
      concept.startsWith(planetDef.id)
    );
    const isCurrent = progress.currentPlanet === planetDef.id;

    const planet = document.createElement("div");
    planet.className = `planet ${planetDef.id} ${this.getPlanetState(
      isUnlocked,
      isCompleted,
      isCurrent
    )}`;
    planet.style.cssText = `
            left: ${x - 60}px;
            top: ${y - 60}px;
            background: radial-gradient(circle at 30% 30%, ${
              planetDef.color
            }, ${this.darkenColor(planetDef.color, 0.3)});
        `;
    planet.setAttribute("data-planet-id", planetDef.id);
    planet.setAttribute("data-difficulty", planetDef.difficulty);

    // Planet content
    planet.innerHTML = `
            <div class="planet-content">
                <img src="images/planets/${planetDef.id}.png" alt="${
      planetDef.title
    }" class="planet-icon">
                <h3 class="planet-title">${planetDef.title}</h3>
                <p class="planet-subtitle">${planetDef.subtitle}</p>
            </div>
            <div class="planet-progress">
                <div class="planet-progress-fill" style="width: ${this.calculatePlanetProgress(
                  planetDef.id
                )}%"></div>
            </div>
            <div class="planet-tooltip">
                <strong>${planetDef.title}</strong><br>
                ${planetDef.description}<br>
                <small>⏱️ ${planetDef.estimatedTime} • 🎯 ${
      planetDef.concepts
    } concepts</small>
            </div>
        `;

    // Add event listeners
    planet.addEventListener("click", (e) =>
      this.handlePlanetClick(e, planetDef)
    );
    planet.addEventListener("mouseenter", (e) =>
      this.handlePlanetHover(e, planetDef, true)
    );
    planet.addEventListener("mouseleave", (e) =>
      this.handlePlanetHover(e, planetDef, false)
    );

    return planet;
  }

  /**
   * Get planet state class
   */
  getPlanetState(isUnlocked, isCompleted, isCurrent) {
    if (isCompleted) return "completed";
    if (isCurrent) return "current";
    if (isUnlocked) return "unlocked";
    return "locked";
  }

  /**
   * Calculate planet progress percentage
   */
  calculatePlanetProgress(planetId) {
    const progress = StateManager.getProgress();
    const planetConcepts = progress.completedConcepts.filter((concept) =>
      concept.startsWith(planetId)
    );
    const totalConcepts = this.planetDefinitions[planetId].concepts;
    return Math.round((planetConcepts.length / totalConcepts) * 100);
  }

  /**
   * Create connections between planets
   */
  createConnections() {
    Object.values(this.planetDefinitions).forEach((planetDef) => {
      if (planetDef.dependencies.length === 0) return;

      planetDef.dependencies.forEach((depId) => {
        const connection = this.createConnection(depId, planetDef.id);
        if (connection) {
          this.container.appendChild(connection);
          this.connections.push(connection);
        }
      });
    });
  }

  /**
   * Create connection line between two planets
   */
  createConnection(fromId, toId) {
    const fromPlanet = this.planetDefinitions[fromId];
    const toPlanet = this.planetDefinitions[toId];

    if (!fromPlanet || !toPlanet) return null;

    const fromPos = this.calculatePlanetPosition(fromPlanet.position);
    const toPos = this.calculatePlanetPosition(toPlanet.position);

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    const connection = document.createElement("div");
    connection.className = "planet-path";
    connection.style.cssText = `
            left: ${fromPos.x}px;
            top: ${fromPos.y}px;
            width: ${distance}px;
            transform: rotate(${angle}deg);
            z-index: 1;
        `;

    // Add active class if both planets are unlocked
    const progress = StateManager.getProgress();
    if (
      progress.unlockedPlanets.includes(fromId) &&
      progress.unlockedPlanets.includes(toId)
    ) {
      connection.classList.add("active");
    }

    return connection;
  }

  /**
   * Calculate actual planet position on screen
   */
  calculatePlanetPosition(position) {
    const { angle, radius } = position;
    const radian = (angle * Math.PI) / 180;
    return {
      x: this.config.centerX + radius * Math.cos(radian),
      y: this.config.centerY + radius * Math.sin(radian),
    };
  }

  /**
   * Handle planet click events
   */
  handlePlanetClick(event, planetDef) {
    event.preventDefault();

    const progress = StateManager.getProgress();
    const isUnlocked = progress.unlockedPlanets.includes(planetDef.id);

    if (!isUnlocked) {
      this.showLockedPlanetMessage(planetDef);
      return;
    }

    // Set as current planet
    StateManager.setCurrentPlanet(planetDef.id);

    // Open concept modal
    if (window.ConceptViewer) {
      window.ConceptViewer.showConcept(planetDef.id);
    }

    // Play interaction sound
    this.playInteractionSound();

    JSVLogger.info(`🪐 Planet clicked: ${planetDef.id}`);
  }

  /**
   * Handle planet hover events
   */
  handlePlanetHover(event, planetDef, isEntering) {
    const planet = event.currentTarget;

    if (isEntering) {
      // Show preview panel
      this.showPlanetPreview(planetDef);
    } else {
      // Hide preview panel
      this.hidePlanetPreview();
    }
  }

  /**
   * Show planet preview panel
   */
  showPlanetPreview(planetDef) {
    let preview = document.querySelector(".planet-preview");

    if (!preview) {
      preview = document.createElement("div");
      preview.className = "planet-preview";
      document.body.appendChild(preview);
    }

    const progress = StateManager.getProgress();
    const planetProgress = this.calculatePlanetProgress(planetDef.id);

    preview.innerHTML = `
            <h3 class="preview-title">
                <img src="images/planets/${planetDef.id}.png" alt="${planetDef.title}" style="width: 24px; height: 24px;">
                ${planetDef.title}
            </h3>
            <p class="preview-description">${planetDef.description}</p>
            <div class="preview-stats">
                <div class="preview-stat">
                    <div class="stat-number">${planetDef.concepts}</div>
                    <div class="stat-label">Concepts</div>
                </div>
                <div class="preview-stat">
                    <div class="stat-number">${planetProgress}%</div>
                    <div class="stat-label">Complete</div>
                </div>
                <div class="preview-stat">
                    <div class="stat-number">${planetDef.estimatedTime}</div>
                    <div class="stat-label">Time</div>
                </div>
            </div>
        `;

    preview.classList.add("show");
  }

  /**
   * Hide planet preview panel
   */
  hidePlanetPreview() {
    const preview = document.querySelector(".planet-preview");
    if (preview) {
      preview.classList.remove("show");
    }
  }

  /**
   * Show locked planet message
   */
  showLockedPlanetMessage(planetDef) {
    const dependencies = planetDef.dependencies
      .map((dep) => this.planetDefinitions[dep]?.title || dep)
      .join(", ");

    // Create temporary notification
    const notification = document.createElement("div");
    notification.className = "locked-planet-notification";
    notification.innerHTML = `
            <div class="notification-content">
                <h4>🔒 Planet Locked</h4>
                <p>Complete <strong>${dependencies}</strong> to unlock ${planetDef.title}</p>
            </div>
        `;
    notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            z-index: 2001;
            animation: fadeInScale 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "fadeOutScale 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  /**
   * Animate galaxy elements
   */
  animateGalaxy() {
    const clusters = document.querySelectorAll(".galaxy-cluster");
    clusters.forEach((cluster, index) => {
      const speed = 60 + index * 20; // Different rotation speeds
      cluster.style.animation = `clusterRotate ${speed}s linear infinite`;
    });

    // Add floating animation to planets
    this.planets.forEach((planet, index) => {
      const delay = index * 0.2;
      planet.element.style.animation = `planetFloat 4s ease-in-out infinite ${delay}s`;
    });
  }

  /**
   * Handle state changes from StateManager
   */
  handleStateChange(event, data) {
    switch (event) {
      case "planetUnlocked":
        this.updatePlanetState(data);
        this.updateConnections();
        break;
      case "conceptCompleted":
        this.updatePlanetProgress();
        break;
      case "currentPlanetChanged":
        this.updateCurrentPlanet(data);
        break;
      case "progressReset":
        this.renderGalaxy();
        break;
    }
  }

  /**
   * Update planet visual state
   */
  updatePlanetState(planetId) {
    const planetEl = this.container.querySelector(
      `[data-planet-id="${planetId}"]`
    );
    if (planetEl) {
      planetEl.classList.remove("locked");
      planetEl.classList.add("unlocked");

      // Add unlock animation
      planetEl.style.animation = "planetUnlock 1s ease-out";
      setTimeout(() => {
        planetEl.style.animation = "";
      }, 1000);
    }
  }

  /**
   * Update current planet highlighting
   */
  updateCurrentPlanet(planetId) {
    // Remove current class from all planets
    this.container
      .querySelectorAll(".planet.current")
      .forEach((el) => el.classList.remove("current"));

    // Add current class to selected planet
    const planetEl = this.container.querySelector(
      `[data-planet-id="${planetId}"]`
    );
    if (planetEl) {
      planetEl.classList.add("current");
    }
  }

  /**
   * Update planet progress indicators
   */
  updatePlanetProgress() {
    this.planets.forEach((planet) => {
      const progressEl = planet.element.querySelector(".planet-progress-fill");
      if (progressEl) {
        const progress = this.calculatePlanetProgress(planet.definition.id);
        progressEl.style.width = `${progress}%`;
      }
    });
  }

  /**
   * Update connection states
   */
  updateConnections() {
    this.connections.forEach((connection) => {
      // Update connection active state based on unlocked planets
      // Implementation depends on connection data structure
    });
  }

  /**
   * Play interaction sound
   */
  playInteractionSound() {
    const audio = document.getElementById("click-sound");
    if (audio && StateManager.getState().settings.soundEnabled) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    }
  }

  /**
   * Darken color for gradient effects
   */
  darkenColor(color, amount) {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);

    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
  }

  /**
   * Handle resize events
   */
  handleResize() {
    this.updateContainerDimensions();
    this.renderGalaxy();
  }

  /**
   * Highlight first available planet
   */
  highlightFirstPlanet() {
    const progress = StateManager.getProgress();
    const firstUnlocked = progress.unlockedPlanets[0];

    if (firstUnlocked) {
      const planetEl = this.container.querySelector(
        `[data-planet-id="${firstUnlocked}"]`
      );
      if (planetEl) {
        planetEl.classList.add("highlighted");
        planetEl.scrollIntoView({ behavior: "smooth", block: "center" });

        setTimeout(() => {
          planetEl.classList.remove("highlighted");
        }, 3000);
      }
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!GalaxyRenderer.instance) {
      GalaxyRenderer.instance = new GalaxyRenderer();
    }
    return GalaxyRenderer.instance;
  }
}

// Create singleton instance
const GalaxyRenderer = GalaxyRenderer.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.GalaxyRenderer = GalaxyRenderer;
}

// Add required CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes planetFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes planetUnlock {
        0% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.2); filter: brightness(1.5); }
        100% { transform: scale(1); filter: brightness(1); }
    }
    
    @keyframes fadeInScale {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fadeOutScale {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .planet.highlighted {
        animation: planetGlow 1s ease-in-out 3 !important;
    }
`;
document.head.appendChild(style);
