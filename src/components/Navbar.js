// src/components/Navbar.js - Navigation Bar Component

/**
 * Navbar - Main navigation component for JSVerseHub
 * Handles navigation, progress display, and user controls
 */

class Navbar {
  constructor() {
    this.navbar = null;
    this.progressValue = null;
    this.themeToggle = null;
    this.userStats = {
      planetsExplored: 0,
      conceptsCompleted: 0,
      badgesEarned: 0,
    };
    this.isInitialized = false;

    this.init();
  }

  /**
   * Initialize the navbar component
   */
  init() {
    this.findElements();
    this.setupEventListeners();
    this.updateProgressDisplay();
    this.isInitialized = true;

    // Listen for state changes
    StateManager.addListener((event, data) => {
      this.handleStateChange(event, data);
    });

    JSVLogger.info("🧭 Navbar component initialized");
  }

  /**
   * Find and cache DOM elements
   */
  findElements() {
    this.navbar = document.getElementById("navbar");
    this.progressValue = document.getElementById("progress-value");
    this.themeToggle = document.getElementById("theme-toggle");
    this.planetsExplored = document.getElementById("planets-explored");
    this.conceptsCompleted = document.getElementById("concepts-mastered");
    this.badgesEarned = document.getElementById("badges-earned");

    if (!this.navbar) {
      JSVLogger.warn("⚠️ Navbar element not found");
      return;
    }
  }

  /**
   * Setup event listeners for navbar interactions
   */
  setupEventListeners() {
    if (!this.navbar) return;

    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleThemeToggle();
      });
    }

    // Logo click - navigate home
    const logo = this.navbar.querySelector(".logo");
    if (logo) {
      logo.addEventListener("click", (e) => {
        e.preventDefault();
        Navigation.navigateTo("/");
      });
    }

    // Progress click - show detailed progress
    if (this.progressValue) {
      this.progressValue.addEventListener("click", (e) => {
        e.preventDefault();
        this.showProgressModal();
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Scroll effects
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.handleScroll();
      }, 16)
    );

    // Window resize
    window.addEventListener(
      "resize",
      debounce(() => {
        this.handleResize();
      }, 250)
    );
  }

  /**
   * Handle theme toggle
   */
  handleThemeToggle() {
    if (window.JSVerseHub) {
      window.JSVerseHub.toggleTheme();
    }

    // Add visual feedback
    this.animateThemeToggle();
  }

  /**
   * Animate theme toggle button
   */
  animateThemeToggle() {
    if (this.themeToggle) {
      this.themeToggle.style.transform = "scale(0.9) rotate(180deg)";

      setTimeout(() => {
        this.themeToggle.style.transform = "scale(1) rotate(0deg)";
      }, 200);
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(event) {
    // Alt + H - Go home
    if (event.altKey && event.key.toLowerCase() === "h") {
      event.preventDefault();
      Navigation.navigateTo("/");
    }

    // Alt + T - Toggle theme
    if (event.altKey && event.key.toLowerCase() === "t") {
      event.preventDefault();
      this.handleThemeToggle();
    }

    // Alt + P - Show progress
    if (event.altKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      this.showProgressModal();
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    if (!this.navbar) return;

    const scrollY = window.scrollY;
    const scrollThreshold = 50;

    // Add/remove scrolled class for styling
    if (scrollY > scrollThreshold) {
      this.navbar.classList.add("scrolled");
    } else {
      this.navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll (optional)
    if (scrollY > this.lastScrollY && scrollY > 200) {
      this.navbar.classList.add("nav-hidden");
    } else {
      this.navbar.classList.remove("nav-hidden");
    }

    this.lastScrollY = scrollY;
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Adjust navbar layout for mobile
    if (window.innerWidth <= 768) {
      this.navbar.classList.add("mobile");
    } else {
      this.navbar.classList.remove("mobile");
    }
  }

  /**
   * Handle state changes from StateManager
   */
  handleStateChange(event, data, state) {
    switch (event) {
      case "progress":
        this.updateProgressDisplay();
        break;
      case "planetUnlocked":
        this.updateUserStats();
        this.showAchievementToast(`🪐 ${data} Planet Unlocked!`);
        break;
      case "conceptCompleted":
        this.updateUserStats();
        this.updateProgressDisplay();
        break;
      case "achievementEarned":
        this.updateUserStats();
        this.showAchievementToast(`🏆 ${data.title}`);
        break;
      case "levelUp":
        this.showAchievementToast(`⭐ Level ${data} Reached!`);
        break;
    }
  }

  /**
   * Update progress display in navbar
   */
  updateProgressDisplay() {
    const progress = StateManager.getProgress();

    if (this.progressValue) {
      const percentage = progress.overallProgress || 0;
      this.progressValue.textContent = `${percentage}%`;

      // Add visual feedback for progress milestones
      if (percentage >= 100) {
        this.progressValue.classList.add("completed");
      } else if (percentage >= 75) {
        this.progressValue.classList.add("high-progress");
      } else if (percentage >= 50) {
        this.progressValue.classList.add("medium-progress");
      }
    }

    // Update title with progress info
    this.updatePageTitle();
  }

  /**
   * Update user statistics in floating panels
   */
  updateUserStats() {
    const stats = StateManager.getStats();
    const achievements = StateManager.getAchievements();

    this.userStats = {
      planetsExplored: stats.planetsExplored,
      conceptsCompleted: stats.conceptsCompleted,
      badgesEarned: achievements.length,
    };

    // Update display elements
    if (this.planetsExplored) {
      this.planetsExplored.textContent = this.userStats.planetsExplored;
    }
    if (this.conceptsCompleted) {
      this.conceptsCompleted.textContent = this.userStats.conceptsCompleted;
    }
    if (this.badgesEarned) {
      this.badgesEarned.textContent = this.userStats.badgesEarned;
    }
  }

  /**
   * Update page title with progress info
   */
  updatePageTitle() {
    const progress = StateManager.getProgress();
    const baseTitle = "JSVerseHub - Master JavaScript in a Galaxy";

    if (progress.overallProgress > 0) {
      document.title = `${baseTitle} (${progress.overallProgress}%)`;
    } else {
      document.title = baseTitle;
    }
  }

  /**
   * Show achievement toast notification
   */
  showAchievementToast(message) {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Style the toast
    toast.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: linear-gradient(135deg, #4ecdc4, #00d4ff);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
            z-index: 1001;
            transform: translateX(400px);
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            font-size: 0.9rem;
        `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 500);
    }, 4000);
  }

  /**
   * Show detailed progress modal
   */
  showProgressModal() {
    const progress = StateManager.getProgress();
    const stats = StateManager.getStats();
    const achievements = StateManager.getAchievements();

    // Create modal content
    const modalContent = `
            <div class="progress-modal">
                <h2>🎯 Your Learning Journey</h2>
                
                <div class="progress-overview">
                    <div class="overall-progress">
                        <h3>Overall Progress</h3>
                        <div class="progress-ring">
                            <div class="progress-circle" data-progress="${
                              progress.overallProgress
                            }">
                                <span class="progress-text">${
                                  progress.overallProgress
                                }%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🪐</div>
                        <div class="stat-value">${stats.planetsExplored}</div>
                        <div class="stat-label">Planets Explored</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${stats.conceptsCompleted}</div>
                        <div class="stat-label">Concepts Mastered</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-value">${achievements.length}</div>
                        <div class="stat-label">Achievements</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-value">${stats.quizzesCompleted}</div>
                        <div class="stat-label">Quizzes Completed</div>
                    </div>
                </div>

                <div class="recent-achievements">
                    <h3>Recent Achievements</h3>
                    <div class="achievements-list">
                        ${achievements
                          .slice(0, 3)
                          .map(
                            (achievement) => `
                            <div class="achievement-item">
                                <div class="achievement-icon">🏆</div>
                                <div class="achievement-text">
                                    <div class="achievement-title">${achievement.title}</div>
                                    <div class="achievement-desc">${achievement.description}</div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').classList.remove('show')">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="Navigation.navigateTo('/progress')">
                        View Full Progress
                    </button>
                </div>
            </div>
        `;

    this.showModal(modalContent);
  }

  /**
   * Show modal with custom content
   */
  showModal(content) {
    // Create modal backdrop
    const modal = document.createElement("div");
    modal.className = "modal progress-modal-container";
    modal.innerHTML = `
            <div class="modal-content">
                ${content}
            </div>
        `;

    // Add modal styles
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(() => {
      modal.style.opacity = "1";
      modal.classList.add("show");
    }, 10);

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    // Close on Escape key
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        this.closeModal(modal);
        document.removeEventListener("keydown", closeOnEscape);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
  }

  /**
   * Close modal with animation
   */
  closeModal(modal) {
    modal.style.opacity = "0";
    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }, 300);
  }

  /**
   * Update navbar theme
   */
  updateTheme(theme) {
    if (this.navbar) {
      this.navbar.classList.remove("galaxy-theme", "cosmic-theme");
      this.navbar.classList.add(`${theme}-theme`);
    }
  }

  /**
   * Show/hide navbar
   */
  setVisible(visible) {
    if (!this.navbar) return;

    if (visible) {
      this.navbar.classList.remove("hidden");
    } else {
      this.navbar.classList.add("hidden");
    }
  }

  /**
   * Add custom navbar item
   */
  addNavItem(item) {
    if (!this.navbar) return false;

    const navRight = this.navbar.querySelector(".nav-right");
    if (navRight) {
      const navItem = document.createElement("div");
      navItem.className = "nav-item";
      navItem.innerHTML = item.html;

      if (item.handler) {
        navItem.addEventListener("click", item.handler);
      }

      navRight.insertBefore(navItem, navRight.lastElementChild);
      return true;
    }

    return false;
  }

  /**
   * Get current navbar state
   */
  getState() {
    return {
      isVisible: !this.navbar?.classList.contains("hidden"),
      isScrolled: this.navbar?.classList.contains("scrolled"),
      currentProgress: this.progressValue?.textContent,
      userStats: this.userStats,
    };
  }

  /**
   * Destroy navbar component
   */
  destroy() {
    // Remove event listeners
    if (this.themeToggle) {
      this.themeToggle.removeEventListener("click", this.handleThemeToggle);
    }

    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    this.isInitialized = false;
    JSVLogger.info("🗑️ Navbar component destroyed");
  }
}

// CSS styles for navbar enhancements
const navbarStyles = document.createElement("style");
navbarStyles.textContent = `
    .navbar.scrolled {
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(15px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }

    .navbar.nav-hidden {
        transform: translateY(-100%);
    }

    .progress-value.completed {
        color: #4ecdc4 !important;
        font-weight: 700;
    }

    .progress-value.high-progress {
        color: #ffe66d;
    }

    .progress-value.medium-progress {
        color: #a29bfe;
    }

    .achievement-toast {
        font-family: 'SpaceMono', monospace;
    }

    .toast-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.3s ease;
    }

    .toast-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .progress-modal {
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        padding: 2rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
    }

    .stat-card {
        text-align: center;
        padding: 1.5rem 1rem;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 12px;
        border: 1px solid rgba(0, 212, 255, 0.2);
        transition: all 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 212, 255, 0.2);
    }

    .stat-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .stat-value {
        font-size: 2rem;
        font-weight: 600;
        color: var(--accent-color);
        margin: 0.5rem 0;
    }

    .stat-label {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .progress-ring {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }

    .progress-circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: conic-gradient(var(--accent-color) 0deg, var(--accent-color) calc(var(--progress) * 3.6deg), rgba(255, 255, 255, 0.1) calc(var(--progress) * 3.6deg));
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .progress-circle::before {
        content: '';
        position: absolute;
        width: 80%;
        height: 80%;
        border-radius: 50%;
        background: var(--secondary-bg);
    }

    .progress-text {
        position: relative;
        z-index: 1;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--accent-color);
    }

    @media (max-width: 768px) {
        .navbar.mobile .nav-container {
            padding: 0 1rem;
        }

        .navbar.mobile .nav-title {
            font-size: 1.4rem;
        }

        .navbar.mobile .user-progress {
            font-size: 0.8rem;
        }
    }
`;
document.head.appendChild(navbarStyles);

// Export for use in other modules
if (typeof window !== "undefined") {
  window.Navbar = Navbar;
}
