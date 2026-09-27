/**
 * Unit tests for the real StateManager (src/engine/stateManager.js).
 * The legacy navigation/conceptLoader suites exercise jest mocks; this suite
 * imports the actual module so regressions in progression logic are caught.
 */
const logger = { info: jest.fn(), success: jest.fn(), warn: jest.fn(), debug: jest.fn(), error: jest.fn() };

describe('StateManager (real module)', () => {
  let StateManager;
  let getItem;
  let setItem;

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    global.JSVLogger = logger;
    window.JSVLogger = logger;
    getItem = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    require('../../src/engine/stateManager.js');
    StateManager = window.StateManager;
    StateManager.resetProgress();
  });

  test('publishes a singleton on window with sensible defaults', () => {
    expect(StateManager).toBeDefined();
    expect(StateManager.getProgress()).toMatchObject({
      unlockedPlanets: ['basics'],
      completedConcepts: [],
      overallProgress: 0
    });
    expect(StateManager.getStats().conceptsCompleted).toBe(0);
  });

  test('init loads persisted state and merges it over defaults', () => {
    getItem.mockReturnValue(JSON.stringify({ user: { name: 'Ada', level: 3, totalXP: 2500 } }));
    StateManager.init();
    expect(StateManager.getState().user).toMatchObject({ name: 'Ada', level: 3, totalXP: 2500 });
    expect(StateManager.getProgress().unlockedPlanets).toEqual(['basics']);
  });

  test('tolerates corrupted persisted state', () => {
    getItem.mockReturnValue('{not json');
    expect(() => StateManager.init()).not.toThrow();
    expect(logger.warn).toHaveBeenCalled();
  });

  test('completeConcept awards XP, updates progress and notifies listeners once', () => {
    const events = [];
    const off = StateManager.addListener(event => events.push(event));
    StateManager.completeConcept('basics-variables');
    StateManager.completeConcept('basics-variables');
    off();
    expect(StateManager.getProgress().completedConcepts).toEqual(['basics-variables']);
    expect(StateManager.getStats().conceptsCompleted).toBe(1);
    // 100 XP for the concept + 50 XP for each of the two planets (dom, es6) it unlocks
    expect(StateManager.getState().user.totalXP).toBe(200);
    expect(events.filter(e => e === 'conceptCompleted')).toHaveLength(1);
    expect(setItem).toHaveBeenCalledWith('jsversehub-state', expect.any(String));
  });

  test('completing a prerequisite unlocks dependent planets and grants achievements', () => {
    StateManager.completeConcept('basics-1');
    const progress = StateManager.getProgress();
    expect(progress.unlockedPlanets).toEqual(expect.arrayContaining(['basics', 'dom', 'es6']));
    expect(progress.unlockedPlanets).not.toContain('async');
    expect(StateManager.getAchievements().map(a => a.id)).toEqual(expect.arrayContaining(['planet-dom', 'planet-es6']));

    StateManager.completeConcept('dom-1');
    expect(StateManager.getProgress().unlockedPlanets).toEqual(expect.arrayContaining(['async', 'events']));
  });

  test('overall progress is a rounded percentage of the concept total', () => {
    const total = StateManager.getTotalConceptCount();
    StateManager.completeConcept('a');
    StateManager.completeConcept('b');
    expect(StateManager.getProgress().overallProgress).toBe(Math.round((2 / total) * 100));
  });

  test('addXP levels up every 1000 XP and emits levelUp', () => {
    const events = [];
    StateManager.addListener((event, data) => events.push([event, data]));
    StateManager.addXP(999);
    expect(StateManager.getState().user.level).toBe(1);
    StateManager.addXP(1);
    expect(StateManager.getState().user.level).toBe(2);
    expect(events).toContainEqual(['levelUp', 2]);
    expect(StateManager.getAchievements().some(a => a.id === 'level-2')).toBe(true);
  });

  test('completeQuiz counts quizzes, completes the concept at >= 80% and rewards perfect scores', () => {
    StateManager.completeQuiz('dom', 3, 5); // 60%
    expect(StateManager.getProgress().completedConcepts).toEqual([]);
    StateManager.completeQuiz('dom', 4, 5); // 80%
    expect(StateManager.getProgress().completedConcepts).toContain('dom-quiz');
    StateManager.completeQuiz('es6', 5, 5); // 100%
    expect(StateManager.getAchievements().some(a => a.id === 'perfect-es6')).toBe(true);
    expect(StateManager.getStats().quizzesCompleted).toBe(3);
  });

  test('listener errors are isolated', () => {
    StateManager.addListener(() => {
      throw new Error('boom');
    });
    expect(() => StateManager.updateSettings({ theme: 'dark' })).not.toThrow();
    expect(logger.error).toHaveBeenCalled();
    expect(StateManager.getState().settings.theme).toBe('dark');
  });

  test('exportUserData triggers a JSON download of the full state', () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:state');
    global.URL.revokeObjectURL = jest.fn();
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    StateManager.completeConcept('basics-1');
    expect(() => StateManager.exportUserData()).not.toThrow();
    expect(click).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:state');
  });

  test('importUserData restores a previously serialised state', () => {
    StateManager.completeConcept('basics-1');
    const json = JSON.stringify(StateManager.getState());
    StateManager.resetProgress();
    expect(StateManager.getProgress().completedConcepts).toEqual([]);
    expect(StateManager.importUserData(json)).toBe(true);
    expect(StateManager.getProgress().completedConcepts).toEqual(['basics-1']);
  });

  test('importUserData rejects garbage without corrupting state', () => {
    StateManager.completeConcept('basics-1');
    expect(StateManager.importUserData('garbage')).toBe(false);
    expect(StateManager.getProgress().completedConcepts).toEqual(['basics-1']);
  });
});
