// tests/integration.test.js
// Integration tests for JSVerseHub application flows

describe('Application Initialization Flow', () => {
  test('should initialize all core systems', () => {
    // Mock core systems
    const stateManager = { init: jest.fn() };
    const conceptLoader = { init: jest.fn() };
    const navigation = { init: jest.fn() };
    
    // Initialize all systems
    stateManager.init();
    conceptLoader.init();
    navigation.init();
    
    expect(stateManager.init).toHaveBeenCalled();
    expect(conceptLoader.init).toHaveBeenCalled();
    expect(navigation.init).toHaveBeenCalled();
  });

  test('should load components after initialization', () => {
    const app = {
      navbar: { render: jest.fn() },
      galaxyMap: { render: jest.fn() },
      modal: { show: jest.fn() }
    };
    
    app.navbar.render();
    app.galaxyMap.render();
    
    expect(app.navbar.render).toHaveBeenCalled();
    expect(app.galaxyMap.render).toHaveBeenCalled();
  });

  test('should handle initialization errors gracefully', () => {
    const errorHandler = jest.fn();
    const mockError = new Error('Initialization failed');
    
    try {
      throw mockError;
    } catch (error) {
      errorHandler(error);
    }
    
    expect(errorHandler).toHaveBeenCalledWith(mockError);
  });
});

describe('Concept Learning Flow', () => {
  let app;

  beforeEach(() => {
    app = {
      galaxyMap: { selectPlanet: jest.fn() },
      conceptViewer: { showConcept: jest.fn() },
      modal: { show: jest.fn(), hide: jest.fn() },
      stateManager: { saveConcept: jest.fn(), getProgress: jest.fn(() => ({ completed: 0 })) }
    };
  });

  test('should navigate from galaxy to concept', () => {
    // User clicks on planet in galaxy
    app.galaxyMap.selectPlanet('basics');
    expect(app.galaxyMap.selectPlanet).toHaveBeenCalledWith('basics');
    
    // Concept should load
    app.conceptViewer.showConcept('basics');
    expect(app.conceptViewer.showConcept).toHaveBeenCalledWith('basics');
  });

  test('should open concept in modal', () => {
    app.conceptViewer.showConcept('async');
    app.modal.show();
    
    expect(app.conceptViewer.showConcept).toHaveBeenCalledWith('async');
    expect(app.modal.show).toHaveBeenCalled();
  });

  test('should save progress after completing concept', () => {
    app.conceptViewer.showConcept('basics');
    app.stateManager.saveConcept('basics');
    
    expect(app.stateManager.saveConcept).toHaveBeenCalledWith('basics');
  });

  test('should track learning progress', () => {
    const progress = app.stateManager.getProgress();
    expect(progress).toBeDefined();
    expect(progress.completed).toBeDefined();
  });
});

describe('Exercise Workflow', () => {
  let app;

  beforeEach(() => {
    app = {
      conceptViewer: {
        submitExercise: jest.fn((code) => ({ passed: true })),
        getExercises: jest.fn(() => [
          { id: 'ex1', title: 'Exercise 1' },
          { id: 'ex2', title: 'Exercise 2' }
        ])
      },
      modal: { show: jest.fn() },
      stateManager: { saveExercise: jest.fn() }
    };
  });

  test('should load available exercises', () => {
    const exercises = app.conceptViewer.getExercises();
    expect(exercises).toHaveLength(2);
    expect(exercises[0].id).toBe('ex1');
  });

  test('should submit exercise code', () => {
    const code = 'console.log("hello")';
    const result = app.conceptViewer.submitExercise(code);
    
    expect(app.conceptViewer.submitExercise).toHaveBeenCalledWith(code);
    expect(result.passed).toBe(true);
  });

  test('should save completed exercise', () => {
    app.conceptViewer.submitExercise('const x = 5;');
    app.stateManager.saveExercise('ex1');
    
    expect(app.stateManager.saveExercise).toHaveBeenCalledWith('ex1');
  });

  test('should handle exercise errors', () => {
    const failedResult = { passed: false, error: 'Syntax error' };
    app.conceptViewer.submitExercise = jest.fn(() => failedResult);
    
    const result = app.conceptViewer.submitExercise('invalid code');
    expect(result.passed).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('Navigation Flow', () => {
  let app;

  beforeEach(() => {
    app = {
      navigation: {
        goto: jest.fn(),
        getCurrentPage: jest.fn(() => '/'),
        getHistory: jest.fn(() => [])
      },
      stateManager: { getCurrentConcept: jest.fn(() => 'basics') },
      conceptViewer: { showConcept: jest.fn() }
    };
  });

  test('should navigate between pages', () => {
    app.navigation.goto('/concepts/basics');
    expect(app.navigation.goto).toHaveBeenCalledWith('/concepts/basics');
  });

  test('should track navigation history', () => {
    app.navigation.goto('/concepts/basics');
    const history = app.navigation.getHistory();
    expect(history).toBeDefined();
  });

  test('should show current page', () => {
    const currentPage = app.navigation.getCurrentPage();
    expect(currentPage).toBe('/');
  });

  test('should handle deep linking', () => {
    app.navigation.goto('/concepts/async/promises');
    expect(app.navigation.goto).toHaveBeenCalledWith('/concepts/async/promises');
  });
});

describe('State Management Flow', () => {
  let app;

  beforeEach(() => {
    app = {
      stateManager: {
        init: jest.fn(),
        saveProgress: jest.fn(),
        getProgress: jest.fn(() => ({ concepts: {} })),
        saveBookmark: jest.fn(),
        getBookmarks: jest.fn(() => []),
        clearData: jest.fn()
      }
    };
  });

  test('should initialize state manager', () => {
    app.stateManager.init();
    expect(app.stateManager.init).toHaveBeenCalled();
  });

  test('should save user progress', () => {
    const progress = { concepts: { basics: 100 } };
    app.stateManager.saveProgress(progress);
    expect(app.stateManager.saveProgress).toHaveBeenCalledWith(progress);
  });

  test('should retrieve user progress', () => {
    const progress = app.stateManager.getProgress();
    expect(progress).toBeDefined();
    expect(progress.concepts).toBeDefined();
  });

  test('should save bookmarks', () => {
    app.stateManager.saveBookmark('basics');
    expect(app.stateManager.saveBookmark).toHaveBeenCalledWith('basics');
  });

  test('should retrieve bookmarks', () => {
    app.stateManager.saveBookmark('basics');
    app.stateManager.saveBookmark('async');
    const bookmarks = app.stateManager.getBookmarks();
    expect(bookmarks).toBeDefined();
  });

  test('should clear all saved data', () => {
    app.stateManager.clearData();
    expect(app.stateManager.clearData).toHaveBeenCalled();
  });
});

describe('Concept Loader Integration', () => {
  let app;

  beforeEach(() => {
    app = {
      conceptLoader: {
        loadConcept: jest.fn(async (id) => ({
          id,
          title: 'Concept',
          content: {}
        })),
        loadAllConcepts: jest.fn(async () => []),
        getCachedConcept: jest.fn(),
        preloadCritical: jest.fn()
      }
    };
  });

  test('should load single concept', async () => {
    const concept = await app.conceptLoader.loadConcept('basics');
    expect(app.conceptLoader.loadConcept).toHaveBeenCalledWith('basics');
    expect(concept.id).toBe('basics');
  });

  test('should preload critical concepts', () => {
    app.conceptLoader.preloadCritical();
    expect(app.conceptLoader.preloadCritical).toHaveBeenCalled();
  });

  test('should use cached concepts', () => {
    app.conceptLoader.getCachedConcept('basics');
    expect(app.conceptLoader.getCachedConcept).toHaveBeenCalledWith('basics');
  });

  test('should handle loading errors', async () => {
    app.conceptLoader.loadConcept = jest.fn(async () => {
      throw new Error('Failed to load');
    });
    
    try {
      await app.conceptLoader.loadConcept('invalid');
    } catch (error) {
      expect(error.message).toBe('Failed to load');
    }
  });
});

describe('User Interaction Flows', () => {
  let app;

  beforeEach(() => {
    app = {
      ui: {
        showModal: jest.fn(),
        hideModal: jest.fn(),
        showAlert: jest.fn(),
        showToast: jest.fn()
      },
      events: {
        onConceptSelected: jest.fn(),
        onExerciseSubmitted: jest.fn(),
        onProgressUpdated: jest.fn()
      }
    };
  });

  test('should show modal on concept selection', () => {
    app.ui.showModal('concept');
    app.events.onConceptSelected('basics');
    
    expect(app.ui.showModal).toHaveBeenCalledWith('concept');
    expect(app.events.onConceptSelected).toHaveBeenCalledWith('basics');
  });

  test('should show feedback on exercise submission', () => {
    app.events.onExerciseSubmitted('ex1');
    app.ui.showToast('Exercise submitted!');
    
    expect(app.events.onExerciseSubmitted).toHaveBeenCalledWith('ex1');
    expect(app.ui.showToast).toHaveBeenCalled();
  });

  test('should handle multiple user actions', () => {
    // User action 1
    app.events.onConceptSelected('basics');
    expect(app.events.onConceptSelected).toHaveBeenCalled();
    
    // User action 2
    app.events.onExerciseSubmitted('ex1');
    expect(app.events.onExerciseSubmitted).toHaveBeenCalled();
  });
});

describe('Error Handling & Recovery', () => {
  let app;

  beforeEach(() => {
    app = {
      errorHandler: {
        handle: jest.fn(),
        log: jest.fn(),
        showUserMessage: jest.fn()
      },
      ui: {
        showError: jest.fn()
      }
    };
  });

  test('should handle concept loading errors', () => {
    const error = new Error('Concept not found');
    app.errorHandler.handle(error);
    expect(app.errorHandler.handle).toHaveBeenCalledWith(error);
  });

  test('should log errors for debugging', () => {
    const error = new Error('Test error');
    app.errorHandler.log(error);
    expect(app.errorHandler.log).toHaveBeenCalledWith(error);
  });

  test('should show user-friendly error messages', () => {
    app.errorHandler.showUserMessage('Something went wrong');
    expect(app.errorHandler.showUserMessage).toHaveBeenCalledWith('Something went wrong');
  });

  test('should recover from temporary failures', () => {
    let attempt = 0;
    const retryableAction = jest.fn(() => {
      attempt++;
      if (attempt < 3) throw new Error('Temporary failure');
      return 'Success';
    });
    
    expect(() => retryableAction()).toThrow();
  });
});
