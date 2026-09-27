/**
 * Integration tests for the real ConceptLoader + ContentRegistry pipeline.
 * Verifies that authored content from src/concepts reaches the viewer shape
 * and that generated scaffolding only fills the gaps.
 */
const logger = { info: jest.fn(), success: jest.fn(), warn: jest.fn(), debug: jest.fn(), error: jest.fn() };

describe('ConceptLoader (real module) with ContentRegistry', () => {
  let ConceptLoader;

  beforeAll(async () => {
    global.JSVLogger = logger;
    window.JSVLogger = logger;
    await import('../../src/engine/contentRegistry.js');
    require('../../src/engine/conceptLoader.js');
    ConceptLoader = window.ConceptLoader;
    await ConceptLoader.init();
  });

  beforeEach(() => ConceptLoader.clearCache());

  test('serves authored sections, exercises and quiz for a fully authored concept', async () => {
    const data = await ConceptLoader.loadConcept('testing');
    expect(data.source).toEqual({ sections: 'authored', exercises: 'authored', quiz: 'authored' });
    expect(data.sections.length).toBeGreaterThan(3);
    expect(data.sections[0].content.examples[0]).toEqual(
      expect.objectContaining({ title: expect.any(String), code: expect.any(String) })
    );
    expect(data.quiz.questions[0]).toEqual(
      expect.objectContaining({
        question: expect.any(String),
        options: expect.any(Array),
        correctAnswer: expect.any(Number)
      })
    );
    expect(data.quiz.timeLimit).toBe(420);
    expect(data.overview).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        difficulty: expect.any(String),
        learningObjectives: expect.any(Array)
      })
    );
  });

  test('falls back to generated scaffolding only for parts a module lacks', async () => {
    const data = await ConceptLoader.loadConcept('events'); // authored module has no quiz
    expect(data.source.sections).toBe('authored');
    expect(data.source.exercises).toBe('authored');
    expect(data.source.quiz).toBe('generated');
    expect(data.quiz.questions).toHaveLength(5);
  });

  test('every structured concept loads with viewer-compatible data', async () => {
    const ids = Object.keys(ConceptLoader.conceptStructure);
    expect(ids).toHaveLength(15);
    const all = await Promise.all(ids.map(id => ConceptLoader.loadConcept(id)));
    all.forEach(data => {
      expect(data.sections.length).toBeGreaterThan(0);
      expect(data.exercises.length).toBeGreaterThan(0);
      expect(data.quiz.questions.length).toBeGreaterThan(0);
      data.sections.forEach(section => {
        expect(typeof section.title).toBe('string');
        section.content.examples.forEach(example => expect(typeof example.code).toBe('string'));
      });
      data.exercises.forEach(exercise => {
        expect(['easy', 'medium', 'hard']).toContain(exercise.difficulty);
        expect(typeof exercise.starterCode).toBe('string');
        expect(Array.isArray(exercise.hints)).toBe(true);
      });
    });
    const authored = all.filter(d => d.source.sections === 'authored').length;
    expect(authored).toBe(15);
  }, 30000);

  test('caches loaded concepts and de-duplicates concurrent loads', async () => {
    const [a, b] = await Promise.all([ConceptLoader.loadConcept('dom'), ConceptLoader.loadConcept('dom')]);
    expect(a).toBe(b);
    expect(ConceptLoader.isConceptCached('dom')).toBe(true);
    expect(await ConceptLoader.loadConcept('dom')).toBe(a);
  });

  test('rejects unknown concepts', async () => {
    await expect(ConceptLoader.loadConcept('nope')).rejects.toThrow(/Failed to load concept|Unknown concept/);
  });

  test('generated examples are objects the viewer can render', () => {
    const section = ConceptLoader.generateSectionContent('basics', 'variables');
    expect(section.examples[0]).toEqual({ title: 'Example 1', code: expect.any(String) });
  });
});
