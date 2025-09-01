// src/engine/conceptLoader.js - Dynamic Concept Content Management

/**
 * ConceptLoader - Manages loading and caching of concept content
 * Handles dynamic loading of tutorials, exercises, and quizzes
 */

class ConceptLoader {
  constructor() {
    this.conceptCache = new Map();
    this.loadingPromises = new Map();
    this.isInitialized = false;

    // Concept structure definitions
    this.conceptStructure = {
      basics: {
        sections: ["variables", "functions", "loops", "conditionals", "scope"],
        exercises: 8,
        quiz: { questions: 10, timeLimit: 600 },
      },
      dom: {
        sections: ["selection", "manipulation", "creation", "events"],
        exercises: 6,
        quiz: { questions: 8, timeLimit: 480 },
      },
      async: {
        sections: ["callbacks", "promises", "asyncAwait"],
        exercises: 5,
        quiz: { questions: 7, timeLimit: 420 },
      },
      es6: {
        sections: ["arrowFunctions", "destructuring", "modules", "classes"],
        exercises: 7,
        quiz: { questions: 9, timeLimit: 540 },
      },
      oop: {
        sections: ["classes", "inheritance", "polymorphism"],
        exercises: 6,
        quiz: { questions: 8, timeLimit: 480 },
      },
      functional: {
        sections: ["pureFunctions", "higherOrder", "immutability"],
        exercises: 5,
        quiz: { questions: 7, timeLimit: 420 },
      },
      patterns: {
        sections: ["module", "singleton", "observer"],
        exercises: 4,
        quiz: { questions: 6, timeLimit: 360 },
      },
      storage: {
        sections: ["localStorage", "sessionStorage", "indexedDB"],
        exercises: 4,
        quiz: { questions: 6, timeLimit: 360 },
      },
      events: {
        sections: ["eventHandling", "delegation"],
        exercises: 3,
        quiz: { questions: 5, timeLimit: 300 },
      },
      testing: {
        sections: ["unitTesting", "integration", "mocking"],
        exercises: 5,
        quiz: { questions: 7, timeLimit: 420 },
      },
      security: {
        sections: ["xss", "csrf", "validation"],
        exercises: 4,
        quiz: { questions: 6, timeLimit: 360 },
      },
      algorithms: {
        sections: ["sorting", "searching", "dataStructures", "complexity"],
        exercises: 8,
        quiz: { questions: 12, timeLimit: 720 },
      },
      canvas: {
        sections: ["drawing", "animation", "interaction"],
        exercises: 6,
        quiz: { questions: 8, timeLimit: 480 },
      },
      api: {
        sections: ["fetch", "restAPIs", "graphQL"],
        exercises: 5,
        quiz: { questions: 7, timeLimit: 420 },
      },
    };
  }

  /**
   * Initialize the concept loader
   */
  async init() {
    // Pre-load critical concepts
    await this.preloadCriticalConcepts();
    this.isInitialized = true;
    JSVLogger.info("📚 Concept Loader initialized");
  }

  /**
   * Pre-load the most important concepts to reduce loading time
   */
  async preloadCriticalConcepts() {
    const criticalConcepts = ["basics", "dom"];
    const loadPromises = criticalConcepts.map((conceptId) =>
      this.loadConcept(conceptId).catch((error) => {
        JSVLogger.warn(`⚠️ Failed to preload ${conceptId}:`, error);
      })
    );

    await Promise.all(loadPromises);
    JSVLogger.info("📚 Critical concepts preloaded");
  }

  /**
   * Load complete concept data
   */
  async loadConcept(conceptId) {
    if (this.conceptCache.has(conceptId)) {
      return this.conceptCache.get(conceptId);
    }

    if (this.loadingPromises.has(conceptId)) {
      return this.loadingPromises.get(conceptId);
    }

    const loadPromise = this.fetchConceptData(conceptId);
    this.loadingPromises.set(conceptId, loadPromise);

    try {
      const conceptData = await loadPromise;
      this.conceptCache.set(conceptId, conceptData);
      this.loadingPromises.delete(conceptId);
      return conceptData;
    } catch (error) {
      this.loadingPromises.delete(conceptId);
      throw error;
    }
  }

  /**
   * Fetch concept data from multiple sources
   */
  async fetchConceptData(conceptId) {
    const structure = this.conceptStructure[conceptId];
    if (!structure) {
      throw new Error(`Unknown concept: ${conceptId}`);
    }

    try {
      // Load concept content in parallel
      const [overview, sections, exercises, quiz] = await Promise.all([
        this.loadConceptOverview(conceptId),
        this.loadConceptSections(conceptId, structure.sections),
        this.loadConceptExercises(conceptId, structure.exercises),
        this.loadConceptQuiz(conceptId, structure.quiz),
      ]);

      return {
        id: conceptId,
        overview,
        sections,
        exercises,
        quiz,
        structure,
        loadedAt: new Date().toISOString(),
      };
    } catch (error) {
      JSVLogger.error(`❌ Failed to load concept ${conceptId}:`, error);
      throw new Error(`Failed to load concept: ${conceptId}`);
    }
  }

  /**
   * Load concept overview information
   */
  async loadConceptOverview(conceptId) {
    // Generate overview based on concept ID
    const overviews = {
      basics: {
        title: "JavaScript Basics",
        description:
          "Master the fundamental building blocks of JavaScript programming",
        learningObjectives: [
          "Understand variables and data types",
          "Write and call functions effectively",
          "Use loops and conditional statements",
          "Grasp scope and hoisting concepts",
        ],
        prerequisites: [],
        estimatedTime: "2-3 hours",
        difficulty: "Beginner",
      },
      dom: {
        title: "Document Object Model (DOM)",
        description:
          "Learn to manipulate web pages dynamically using JavaScript",
        learningObjectives: [
          "Select and modify DOM elements",
          "Handle user events effectively",
          "Create dynamic content",
          "Understand event bubbling and capturing",
        ],
        prerequisites: ["JavaScript Basics"],
        estimatedTime: "3-4 hours",
        difficulty: "Beginner",
      },
      async: {
        title: "Asynchronous JavaScript",
        description:
          "Master promises, async/await, and asynchronous programming patterns",
        learningObjectives: [
          "Understand callback functions and their limitations",
          "Work with Promises and Promise chains",
          "Use async/await syntax effectively",
          "Handle errors in asynchronous code",
        ],
        prerequisites: ["JavaScript Basics"],
        estimatedTime: "4-5 hours",
        difficulty: "Intermediate",
      },
      es6: {
        title: "Modern JavaScript (ES6+)",
        description:
          "Explore the latest JavaScript features and syntax improvements",
        learningObjectives: [
          "Use arrow functions and template literals",
          "Master destructuring and spread syntax",
          "Work with modules and classes",
          "Understand symbols and iterators",
        ],
        prerequisites: ["JavaScript Basics"],
        estimatedTime: "3-4 hours",
        difficulty: "Intermediate",
      },
      oop: {
        title: "Object-Oriented Programming",
        description: "Learn OOP principles and patterns in JavaScript",
        learningObjectives: [
          "Create and use classes effectively",
          "Implement inheritance and polymorphism",
          "Understand encapsulation principles",
          "Apply design patterns",
        ],
        prerequisites: ["JavaScript Basics", "ES6+"],
        estimatedTime: "5-6 hours",
        difficulty: "Intermediate",
      },
      functional: {
        title: "Functional Programming",
        description: "Master functional programming concepts and techniques",
        learningObjectives: [
          "Write pure functions",
          "Use higher-order functions",
          "Understand immutability",
          "Apply functional composition",
        ],
        prerequisites: ["JavaScript Basics", "ES6+"],
        estimatedTime: "4-5 hours",
        difficulty: "Intermediate",
      },
      patterns: {
        title: "Design Patterns",
        description: "Learn common programming patterns and their applications",
        learningObjectives: [
          "Implement module pattern",
          "Use singleton and factory patterns",
          "Apply observer pattern",
          "Understand when to use each pattern",
        ],
        prerequisites: ["OOP", "Functional Programming"],
        estimatedTime: "6-7 hours",
        difficulty: "Advanced",
      },
      storage: {
        title: "Data Storage",
        description: "Master client-side data persistence techniques",
        learningObjectives: [
          "Use localStorage and sessionStorage",
          "Work with IndexedDB",
          "Understand storage limitations",
          "Implement data synchronization",
        ],
        prerequisites: ["DOM", "Async JavaScript"],
        estimatedTime: "3-4 hours",
        difficulty: "Intermediate",
      },
      events: {
        title: "Event Handling",
        description: "Master event-driven programming in JavaScript",
        learningObjectives: [
          "Handle various types of events",
          "Implement event delegation",
          "Understand event phases",
          "Create custom events",
        ],
        prerequisites: ["DOM"],
        estimatedTime: "2-3 hours",
        difficulty: "Beginner",
      },
      testing: {
        title: "Testing JavaScript",
        description:
          "Learn to write effective tests for JavaScript applications",
        learningObjectives: [
          "Write unit tests",
          "Implement integration testing",
          "Use mocking and stubbing",
          "Apply test-driven development",
        ],
        prerequisites: ["OOP", "Functional Programming"],
        estimatedTime: "5-6 hours",
        difficulty: "Advanced",
      },
      security: {
        title: "Web Security",
        description:
          "Understand and prevent common web security vulnerabilities",
        learningObjectives: [
          "Prevent XSS attacks",
          "Understand CSRF protection",
          "Implement input validation",
          "Secure authentication flows",
        ],
        prerequisites: ["Async JavaScript", "Data Storage"],
        estimatedTime: "4-5 hours",
        difficulty: "Advanced",
      },
      algorithms: {
        title: "Algorithms & Data Structures",
        description: "Master fundamental algorithms and data structures",
        learningObjectives: [
          "Implement sorting algorithms",
          "Use various data structures",
          "Analyze time complexity",
          "Solve algorithmic problems",
        ],
        prerequisites: ["OOP", "Functional Programming"],
        estimatedTime: "8-10 hours",
        difficulty: "Advanced",
      },
      canvas: {
        title: "Canvas & Graphics",
        description: "Create interactive graphics and animations",
        learningObjectives: [
          "Draw shapes and paths",
          "Create animations",
          "Handle canvas interactions",
          "Optimize graphics performance",
        ],
        prerequisites: ["DOM", "Events"],
        estimatedTime: "6-7 hours",
        difficulty: "Advanced",
      },
      api: {
        title: "Web APIs",
        description: "Interact with external services and APIs",
        learningObjectives: [
          "Make HTTP requests",
          "Work with REST APIs",
          "Understand GraphQL basics",
          "Handle API authentication",
        ],
        prerequisites: ["Async JavaScript", "Data Storage"],
        estimatedTime: "4-5 hours",
        difficulty: "Intermediate",
      },
    };

    return (
      overviews[conceptId] || {
        title: conceptId.charAt(0).toUpperCase() + conceptId.slice(1),
        description: "Learn advanced JavaScript concepts",
        learningObjectives: [],
        prerequisites: [],
        estimatedTime: "3-4 hours",
        difficulty: "Intermediate",
      }
    );
  }

  /**
   * Load concept sections (tutorials/content)
   */
  async loadConceptSections(conceptId, sectionIds) {
    const sections = await Promise.all(
      sectionIds.map((sectionId) => this.loadSection(conceptId, sectionId))
    );
    return sections;
  }

  /**
   * Load individual section content
   */
  async loadSection(conceptId, sectionId) {
    // Simulate loading section content
    // In a real app, this would fetch from files or an API
    const sectionContent = this.generateSectionContent(conceptId, sectionId);

    return {
      id: sectionId,
      title: this.formatSectionTitle(sectionId),
      content: sectionContent,
      codeExamples: this.generateCodeExamples(conceptId, sectionId),
      keyPoints: this.generateKeyPoints(conceptId, sectionId),
    };
  }

  /**
   * Generate section content based on concept and section
   */
  generateSectionContent(conceptId, sectionId) {
    const contentTemplates = {
      basics: {
        variables: {
          content:
            "Variables are containers for storing data values. In JavaScript, you can declare variables using var, let, or const keywords.",
          examples: [
            'let name = "John";',
            "const age = 30;",
            "var isActive = true;",
          ],
        },
        functions: {
          content:
            "Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.",
          examples: [
            "function greet(name) {\n  return `Hello, ${name}!`;\n}",
            "const add = (a, b) => a + b;",
          ],
        },
        loops: {
          content:
            "Loops allow you to repeat code multiple times. JavaScript provides several types of loops including for, while, and for...of.",
          examples: [
            "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}",
            "while (condition) {\n  // code\n}",
          ],
        },
      },
      dom: {
        selection: {
          content:
            "DOM selection allows you to find and reference HTML elements in your JavaScript code.",
          examples: [
            'document.getElementById("myId")',
            'document.querySelector(".myClass")',
            'document.querySelectorAll("div")',
          ],
        },
        manipulation: {
          content:
            "Once you have selected elements, you can modify their content, attributes, and styles.",
          examples: [
            'element.textContent = "New text"',
            'element.style.color = "red"',
            'element.setAttribute("class", "newClass")',
          ],
        },
      },
    };

    const conceptContent = contentTemplates[conceptId];
    const sectionContent = conceptContent?.[sectionId];

    return {
      description:
        sectionContent?.content || `Learn about ${sectionId} in ${conceptId}`,
      examples: sectionContent?.examples || [
        `// ${sectionId} example\nconsole.log('${sectionId}');`,
      ],
      explanation: `This section covers the important aspects of ${sectionId}. You'll learn practical techniques and best practices.`,
    };
  }

  /**
   * Generate code examples for sections
   */
  generateCodeExamples(conceptId, sectionId) {
    const examples = {
      basic: {
        title: `${sectionId} Example`,
        code: `// ${conceptId} - ${sectionId}\nconsole.log('Learning ${sectionId}');`,
        explanation: `Basic example demonstrating ${sectionId}`,
      },
      intermediate: {
        title: `Advanced ${sectionId}`,
        code: `// Advanced ${sectionId} example\nfunction demo${sectionId}() {\n  // Implementation here\n}`,
        explanation: `More complex example of ${sectionId}`,
      },
    };

    return [examples.basic, examples.intermediate];
  }

  /**
   * Generate key points for sections
   */
  generateKeyPoints(conceptId, sectionId) {
    return [
      `${sectionId} is fundamental to ${conceptId}`,
      `Understanding ${sectionId} improves code quality`,
      `Practice ${sectionId} with real examples`,
      `Apply ${sectionId} in practical projects`,
    ];
  }

  /**
   * Load concept exercises
   */
  async loadConceptExercises(conceptId, exerciseCount) {
    const exercises = [];

    for (let i = 1; i <= exerciseCount; i++) {
      exercises.push({
        id: `${conceptId}-exercise-${i}`,
        title: `${
          conceptId.charAt(0).toUpperCase() + conceptId.slice(1)
        } Exercise ${i}`,
        description: `Practice ${conceptId} concepts with this hands-on exercise.`,
        difficulty: this.getExerciseDifficulty(i, exerciseCount),
        instructions: `Complete the ${conceptId} exercise by implementing the required functionality.`,
        starterCode: `// ${conceptId} Exercise ${i}\n// TODO: Implement the solution`,
        solution: `// Solution for ${conceptId} Exercise ${i}\nconsole.log('Exercise completed');`,
        hints: [
          `Remember the key concepts of ${conceptId}`,
          `Break the problem into smaller steps`,
          `Test your solution with different inputs`,
        ],
        testCases: this.generateTestCases(conceptId, i),
      });
    }

    return exercises;
  }

  /**
   * Get exercise difficulty based on position
   */
  getExerciseDifficulty(exerciseNumber, totalExercises) {
    const ratio = exerciseNumber / totalExercises;
    if (ratio <= 0.4) return "easy";
    if (ratio <= 0.7) return "medium";
    return "hard";
  }

  /**
   * Generate test cases for exercises
   */
  generateTestCases(conceptId, exerciseNumber) {
    return [
      {
        input: `// Test input ${exerciseNumber}`,
        expected: `// Expected output ${exerciseNumber}`,
        description: `Test case ${exerciseNumber} for ${conceptId}`,
      },
    ];
  }

  /**
   * Load concept quiz
   */
  async loadConceptQuiz(conceptId, quizConfig) {
    const questions = [];

    for (let i = 1; i <= quizConfig.questions; i++) {
      questions.push({
        id: `${conceptId}-q${i}`,
        question: `What is the correct way to ${this.generateQuestionTopic(
          conceptId,
          i
        )}?`,
        type: "multiple-choice",
        options: [
          `Option A for ${conceptId} question ${i}`,
          `Option B for ${conceptId} question ${i}`,
          `Option C for ${conceptId} question ${i}`,
          `Option D for ${conceptId} question ${i}`,
        ],
        correctAnswer: 0,
        explanation: `The correct answer demonstrates proper ${conceptId} usage.`,
        difficulty: this.getQuestionDifficulty(i, quizConfig.questions),
        points: this.getQuestionPoints(i, quizConfig.questions),
      });
    }

    return {
      id: `${conceptId}-quiz`,
      title: `${conceptId.charAt(0).toUpperCase() + conceptId.slice(1)} Quiz`,
      description: `Test your knowledge of ${conceptId} concepts`,
      questions,
      timeLimit: quizConfig.timeLimit,
      passingScore: 80,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
    };
  }

  /**
   * Generate question topic based on concept
   */
  generateQuestionTopic(conceptId, questionNumber) {
    const topics = {
      basics: [
        "declare a variable",
        "write a function",
        "create a loop",
        "use conditional statements",
      ],
      dom: [
        "select elements",
        "modify content",
        "handle events",
        "create elements",
      ],
      async: [
        "use promises",
        "handle async/await",
        "manage callbacks",
        "handle errors",
      ],
    };

    const conceptTopics = topics[conceptId] || ["implement the concept"];
    return conceptTopics[(questionNumber - 1) % conceptTopics.length];
  }

  /**
   * Get question difficulty
   */
  getQuestionDifficulty(questionNumber, totalQuestions) {
    const ratio = questionNumber / totalQuestions;
    if (ratio <= 0.3) return "easy";
    if (ratio <= 0.6) return "medium";
    return "hard";
  }

  /**
   * Get question points based on difficulty
   */
  getQuestionPoints(questionNumber, totalQuestions) {
    const difficulty = this.getQuestionDifficulty(
      questionNumber,
      totalQuestions
    );
    switch (difficulty) {
      case "easy":
        return 5;
      case "medium":
        return 10;
      case "hard":
        return 15;
      default:
        return 10;
    }
  }

  /**
   * Format section title for display
   */
  formatSectionTitle(sectionId) {
    return sectionId
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Get cached concept data
   */
  getCachedConcept(conceptId) {
    return this.conceptCache.get(conceptId);
  }

  /**
   * Check if concept is cached
   */
  isConceptCached(conceptId) {
    return this.conceptCache.has(conceptId);
  }

  /**
   * Clear concept cache
   */
  clearCache() {
    this.conceptCache.clear();
    this.loadingPromises.clear();
    JSVLogger.info("🗑️ Concept cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedConcepts: this.conceptCache.size,
      loadingConcepts: this.loadingPromises.size,
      cacheKeys: Array.from(this.conceptCache.keys()),
    };
  }

  /**
   * Validate concept structure
   */
  validateConceptStructure(conceptId, conceptData) {
    const required = ["overview", "sections", "exercises", "quiz"];
    const missing = required.filter((key) => !conceptData[key]);

    if (missing.length > 0) {
      JSVLogger.warn(`⚠️ Concept ${conceptId} missing: ${missing.join(", ")}`);
      return false;
    }

    return true;
  }

  /**
   * Get concept progress requirements
   */
  getConceptRequirements(conceptId) {
    const structure = this.conceptStructure[conceptId];
    if (!structure) return null;

    return {
      sections: structure.sections.length,
      exercises: structure.exercises,
      quizQuestions: structure.quiz.questions,
      estimatedTime: structure.quiz.timeLimit / 60, // Convert to minutes
    };
  }

  /**
   * Search concepts by keyword
   */
  searchConcepts(keyword) {
    const results = [];
    const searchTerm = keyword.toLowerCase();

    Object.keys(this.conceptStructure).forEach((conceptId) => {
      if (conceptId.toLowerCase().includes(searchTerm)) {
        results.push({
          id: conceptId,
          title: this.formatSectionTitle(conceptId),
          type: "concept",
        });
      }

      // Search within sections
      this.conceptStructure[conceptId].sections.forEach((sectionId) => {
        if (sectionId.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `${conceptId}-${sectionId}`,
            title: this.formatSectionTitle(sectionId),
            conceptId,
            type: "section",
          });
        }
      });
    });

    return results;
  }

  /**
   * Get learning path recommendations
   */
  getLearningPath(currentConcept) {
    const dependencies = {
      basics: [],
      dom: ["basics"],
      events: ["dom"],
      async: ["basics"],
      es6: ["basics"],
      oop: ["basics", "es6"],
      functional: ["basics", "es6"],
      patterns: ["oop", "functional"],
      storage: ["dom", "async"],
      testing: ["oop", "functional"],
      security: ["async", "storage"],
      algorithms: ["oop", "functional"],
      canvas: ["dom", "events"],
      api: ["async", "storage"],
    };

    const path = [];
    const visited = new Set();

    const addDependencies = (conceptId) => {
      if (visited.has(conceptId)) return;
      visited.add(conceptId);

      const deps = dependencies[conceptId] || [];
      deps.forEach((dep) => addDependencies(dep));

      if (!path.includes(conceptId)) {
        path.push(conceptId);
      }
    };

    addDependencies(currentConcept);
    return path;
  }

  /**
   * Get next recommended concept
   */
  getNextConcept(completedConcepts) {
    const progress = StateManager.getProgress();
    const unlockedPlanets = progress.unlockedPlanets;

    // Find next logical concept based on learning path
    for (const conceptId of Object.keys(this.conceptStructure)) {
      if (!unlockedPlanets.includes(conceptId)) continue;

      const hasCompletedConcepts = completedConcepts.some((completed) =>
        completed.startsWith(conceptId)
      );

      if (!hasCompletedConcepts) {
        return conceptId;
      }
    }

    return null;
  }

  /**
   * Export concept data for offline use
   */
  async exportConceptData(conceptId) {
    try {
      const conceptData = await this.loadConcept(conceptId);
      const exportData = {
        concept: conceptData,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jsversehub-${conceptId}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      JSVLogger.info(`📥 Concept ${conceptId} exported`);
      return true;
    } catch (error) {
      JSVLogger.error(`❌ Failed to export concept ${conceptId}:`, error);
      return false;
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!ConceptLoader.instance) {
      ConceptLoader.instance = new ConceptLoader();
    }
    return ConceptLoader.instance;
  }
}

// Create singleton instance
const ConceptLoader = ConceptLoader.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.ConceptLoader = ConceptLoader;
}
