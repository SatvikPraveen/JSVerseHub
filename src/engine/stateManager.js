// src/engine/stateManager.js - User Progress and State Management

/**
 * StateManager - Handles all user progress, achievements, and application state
 * Uses in-memory storage for the current session
 */

class StateManager {
  constructor() {
    this.state = {
      user: {
        name: "Space Explorer",
        level: 1,
        totalXP: 0,
        joinDate: new Date().toISOString(),
      },
      progress: {
        hasSeenWelcome: false,
        unlockedPlanets: ["basics"], // Start with basics unlocked
        completedConcepts: [],
        currentPlanet: "basics",
        overallProgress: 0,
      },
      achievements: [],
      settings: {
        theme: "galaxy",
        soundEnabled: true,
        animationsEnabled: true,
        difficulty: "normal",
      },
      stats: {
        planetsExplored: 0,
        conceptsCompleted: 0,
        quizzesCompleted: 0,
        totalTimeSpent: 0,
        streakDays: 0,
        lastVisit: new Date().toISOString(),
      },
      quiz: {
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        timeSpent: 0,
      },
    };

    this.listeners = [];
    this.storageKey = "jsversehub-state";
    this.isInitialized = false;
  }

  /**
   * Initialize state manager
   */
  init() {
    this.loadState();
    this.isInitialized = true;
    JSVLogger.info("📊 StateManager initialized");
    return this;
  }

  /**
   * Load state from localStorage (fallback to in-memory)
   */
  loadState() {
    try {
      const savedState = localStorage.getItem(this.storageKey);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.state = { ...this.state, ...parsedState };
        JSVLogger.info("💾 State loaded from localStorage");
      }
    } catch (error) {
      JSVLogger.warn(
        "⚠️ Failed to load state from localStorage, using defaults"
      );
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      JSVLogger.debug("💾 State saved to localStorage");
    } catch (error) {
      JSVLogger.warn("⚠️ Failed to save state to localStorage");
    }
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Get user progress
   */
  getProgress() {
    return { ...this.state.progress };
  }

  /**
   * Get user stats
   */
  getStats() {
    return { ...this.state.stats };
  }

  /**
   * Get user achievements
   */
  getAchievements() {
    return [...this.state.achievements];
  }

  /**
   * Update progress
   */
  updateProgress(updates) {
    this.state.progress = { ...this.state.progress, ...updates };
    this.calculateOverallProgress();
    this.saveState();
    this.notifyListeners("progress", this.state.progress);
  }

  /**
   * Complete a concept
   */
  completeConcept(conceptId) {
    if (!this.state.progress.completedConcepts.includes(conceptId)) {
      this.state.progress.completedConcepts.push(conceptId);
      this.state.stats.conceptsCompleted++;
      this.addXP(100);

      // Check for new planet unlocks
      this.checkPlanetUnlocks(conceptId);

      this.calculateOverallProgress();
      this.saveState();
      this.notifyListeners("conceptCompleted", conceptId);

      JSVLogger.success(`🎯 Concept completed: ${conceptId}`);
    }
  }

  /**
   * Unlock a planet
   */
  unlockPlanet(planetId) {
    if (!this.state.progress.unlockedPlanets.includes(planetId)) {
      this.state.progress.unlockedPlanets.push(planetId);
      this.state.stats.planetsExplored++;
      this.addXP(50);

      // Add achievement
      this.addAchievement({
        id: `planet-${planetId}`,
        title: `🪐 ${
          planetId.charAt(0).toUpperCase() + planetId.slice(1)
        } Explorer`,
        description: `Unlocked the ${planetId} planet`,
        timestamp: new Date().toISOString(),
        xpReward: 50,
      });

      this.saveState();
      this.notifyListeners("planetUnlocked", planetId);

      JSVLogger.success(`🪐 Planet unlocked: ${planetId}`);
    }
  }

  /**
   * Set current planet
   */
  setCurrentPlanet(planetId) {
    this.state.progress.currentPlanet = planetId;
    this.saveState();
    this.notifyListeners("currentPlanetChanged", planetId);
  }

  /**
   * Add XP to user
   */
  addXP(amount) {
    this.state.user.totalXP += amount;
    const newLevel = Math.floor(this.state.user.totalXP / 1000) + 1;

    if (newLevel > this.state.user.level) {
      this.state.user.level = newLevel;
      this.addAchievement({
        id: `level-${newLevel}`,
        title: `⭐ Level ${newLevel}`,
        description: `Reached level ${newLevel}`,
        timestamp: new Date().toISOString(),
        xpReward: 0,
      });
      this.notifyListeners("levelUp", newLevel);
    }

    this.saveState();
    this.notifyListeners("xpGained", amount);
  }

  /**
   * Add achievement
   */
  addAchievement(achievement) {
    const exists = this.state.achievements.find((a) => a.id === achievement.id);
    if (!exists) {
      this.state.achievements.push(achievement);
      this.saveState();
      this.notifyListeners("achievementEarned", achievement);
      JSVLogger.success(`🏆 Achievement earned: ${achievement.title}`);
    }
  }

  /**
   * Complete quiz
   */
  completeQuiz(planetId, score, totalQuestions) {
    this.state.stats.quizzesCompleted++;
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 80) {
      this.completeConcept(`${planetId}-quiz`);
    }

    // Add quiz-specific achievements
    if (score === totalQuestions) {
      this.addAchievement({
        id: `perfect-${planetId}`,
        title: `💯 Perfect Score`,
        description: `Got 100% on ${planetId} quiz`,
        timestamp: new Date().toISOString(),
        xpReward: 200,
      });
      this.addXP(200);
    }

    this.saveState();
    this.notifyListeners("quizCompleted", { planetId, score, totalQuestions });
  }

  /**
   * Update settings
   */
  updateSettings(updates) {
    this.state.settings = { ...this.state.settings, ...updates };
    this.saveState();
    this.notifyListeners("settingsUpdated", this.state.settings);
  }

  /**
   * Calculate overall progress percentage
   */
  calculateOverallProgress() {
    const totalConcepts = this.getTotalConceptCount();
    const completed = this.state.progress.completedConcepts.length;
    this.state.progress.overallProgress = Math.round(
      (completed / totalConcepts) * 100
    );
  }

  /**
   * Get total concept count across all planets
   */
  getTotalConceptCount() {
    const conceptCounts = {
      basics: 5,
      dom: 4,
      async: 3,
      es6: 4,
      oop: 3,
      functional: 3,
      patterns: 3,
      storage: 3,
      events: 2,
      testing: 3,
      security: 3,
      algorithms: 4,
      canvas: 3,
      api: 3,
    };
    return Object.values(conceptCounts).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Check if new planets should be unlocked based on completed concepts
   */
  checkPlanetUnlocks(completedConceptId) {
    const unlockRules = {
      dom: ["basics"],
      async: ["basics", "dom"],
      es6: ["basics"],
      oop: ["basics", "es6"],
      functional: ["basics", "es6"],
      patterns: ["oop", "functional"],
      storage: ["dom", "async"],
      events: ["dom"],
      testing: ["oop", "functional"],
      security: ["async", "storage"],
      algorithms: ["oop", "functional"],
      canvas: ["dom", "events"],
      api: ["async", "storage"],
    };

    for (const [planet, requirements] of Object.entries(unlockRules)) {
      if (!this.state.progress.unlockedPlanets.includes(planet)) {
        const hasAllRequirements = requirements.every((req) =>
          this.state.progress.completedConcepts.some((concept) =>
            concept.startsWith(req)
          )
        );

        if (hasAllRequirements) {
          this.unlockPlanet(planet);
        }
      }
    }
  }

  /**
   * Reset progress (for development/testing)
   */
  resetProgress() {
    this.state.progress = {
      hasSeenWelcome: false,
      unlockedPlanets: ["basics"],
      completedConcepts: [],
      currentPlanet: "basics",
      overallProgress: 0,
    };
    this.state.stats.planetsExplored = 0;
    this.state.stats.conceptsCompleted = 0;
    this.state.stats.quizzesCompleted = 0;
    this.state.achievements = [];
    this.state.user.totalXP = 0;
    this.state.user.level = 1;

    this.saveState();
    this.notifyListeners("progressReset");
    JSVLogger.info("🔄 Progress reset");
  }

  /**
   * Export user data
   */
  exportUserData() {
    const exportData = {
      ...this.state,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const dataBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jsversehub-progress-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    JSVLogger.info("📥 User data exported");
  }

  /**
   * Import user data
   */
  importUserData(jsonData) {
    try {
      const importedData = JSON.parse(jsonData);

      // Validate imported data structure
      if (importedData.user && importedData.progress && importedData.stats) {
        this.state = { ...this.state, ...importedData };
        this.saveState();
        this.notifyListeners("dataImported");
        JSVLogger.success("📤 User data imported successfully");
        return true;
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      JSVLogger.error("❌ Failed to import user data:", error);
      return false;
    }
  }

  /**
   * Add state change listener
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  notifyListeners(event, data) {
    this.listeners.forEach((callback) => {
      try {
        callback(event, data, this.state);
      } catch (error) {
        JSVLogger.error("❌ Listener error:", error);
      }
    });
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }
}

// Create singleton instance
const StateManager = StateManager.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.StateManager = StateManager;
}
