/**
 * Canvas Graphics Concept Tests
 * Comprehensive test suite for canvas drawing, animations, and interactions
 */

const {
  canvasBasics,
  drawingShapes,
  transformations,
  styling,
  textRendering,
  animations,
  interactive,
  advanced
} = require('../src/concepts/canvas/index.js');

describe('Canvas Graphics Concept', () => {
  let canvas, ctx;

  beforeEach(() => {
    // Mock canvas element
    canvas = {
      width: 800,
      height: 600,
      getContext: jest.fn((type) => {
        if (type !== '2d') throw new Error('Invalid context type');
        return {
          clearRect: jest.fn(),
          fillRect: jest.fn(),
          strokeRect: jest.fn(),
          beginPath: jest.fn(),
          arc: jest.fn(),
          moveTo: jest.fn(),
          lineTo: jest.fn(),
          stroke: jest.fn(),
          fill: jest.fn(),
          closePath: jest.fn(),
          save: jest.fn(),
          restore: jest.fn(),
          translate: jest.fn(),
          rotate: jest.fn(),
          scale: jest.fn(),
          fillText: jest.fn(),
          strokeText: jest.fn(),
          measureText: jest.fn(() => ({ width: 100 })),
          createLinearGradient: jest.fn(() => ({
            addColorStop: jest.fn()
          })),
          createRadialGradient: jest.fn(() => ({
            addColorStop: jest.fn()
          })),
          createPattern: jest.fn(),
          getImageData: jest.fn(() => ({
            data: new Uint8ClampedArray(100 * 4)
          })),
          putImageData: jest.fn(),
          fillStyle: '#000',
          strokeStyle: '#000',
          lineWidth: 1,
          font: '16px Arial',
          textAlign: 'left',
          textBaseline: 'alphabetic',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 0,
          shadowColor: 'transparent'
        };
      })
    };
    ctx = canvas.getContext('2d');
  });

  // ========================================================================
  // Canvas Basics Tests
  // ========================================================================

  describe('Canvas Basics', () => {
    test('should throw error when canvas element not found', () => {
      document.getElementById = jest.fn(() => null);
      expect(() => canvasBasics.getContext('nonexistent', 800, 600)).toThrow();
    });

    test('should set canvas dimensions correctly', () => {
      document.getElementById = jest.fn(() => canvas);
      const result = canvasBasics.getContext('myCanvas', 800, 600);
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
      expect(result).toBeTruthy();
    });

    test('should get canvas dimensions', () => {
      const dimensions = canvasBasics.getDimensions(canvas);
      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
      expect(dimensions.aspectRatio).toBe(800 / 600);
    });

    test('should clear entire canvas', () => {
      canvasBasics.clearCanvas(ctx, canvas);
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    test('should throw error when context not available', () => {
      canvas.getContext = jest.fn(() => null);
      document.getElementById = jest.fn(() => canvas);
      expect(() => canvasBasics.getContext('myCanvas', 800, 600)).toThrow();
    });
  });

  // ========================================================================
  // Drawing Shapes Tests
  // ========================================================================

  describe('Drawing Shapes', () => {
    test('should draw filled rectangle', () => {
      drawingShapes.rectangle(ctx, 10, 20, 100, 50, {
        fill: true,
        fillColor: '#FF0000'
      });
      expect(ctx.fillStyle).toBe('#FF0000');
      expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
    });

    test('should draw stroked rectangle', () => {
      drawingShapes.rectangle(ctx, 10, 20, 100, 50, {
        fill: false,
        stroke: true,
        strokeColor: '#0000FF',
        lineWidth: 2
      });
      expect(ctx.strokeStyle).toBe('#0000FF');
      expect(ctx.lineWidth).toBe(2);
      expect(ctx.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
    });

    test('should draw filled circle', () => {
      drawingShapes.circle(ctx, 100, 100, 50, {
        fill: true,
        fillColor: '#00FF00'
      });
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalledWith(100, 100, 50, 0, Math.PI * 2);
      expect(ctx.fillStyle).toBe('#00FF00');
      expect(ctx.fill).toHaveBeenCalled();
    });

    test('should draw stroked circle', () => {
      drawingShapes.circle(ctx, 100, 100, 50, {
        fill: false,
        stroke: true,
        strokeColor: '#FF0000',
        lineWidth: 3
      });
      expect(ctx.strokeStyle).toBe('#FF0000');
      expect(ctx.lineWidth).toBe(3);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    test('should draw line with options', () => {
      drawingShapes.line(ctx, 0, 0, 100, 100, {
        strokeColor: '#000000',
        lineWidth: 2,
        lineCap: 'round'
      });
      expect(ctx.strokeStyle).toBe('#000000');
      expect(ctx.lineWidth).toBe(2);
      expect(ctx.lineCap).toBe('round');
      expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 100);
    });

    test('should draw polygon with specified sides', () => {
      drawingShapes.polygon(ctx, 50, 50, 6, 30, { fill: true });
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    test('should draw star with correct properties', () => {
      drawingShapes.star(ctx, 100, 100, 5, 50, 25, {
        fill: true,
        fillColor: '#FFD700'
      });
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.closePath).toHaveBeenCalled();
      expect(ctx.fillStyle).toBe('#FFD700');
    });
  });

  // ========================================================================
  // Transformations Tests
  // ========================================================================

  describe('Transformations', () => {
    test('should translate canvas', () => {
      transformations.translate(ctx, 50, 100);
      expect(ctx.translate).toHaveBeenCalledWith(50, 100);
    });

    test('should rotate canvas', () => {
      const angle = Math.PI / 4;
      transformations.rotate(ctx, angle);
      expect(ctx.rotate).toHaveBeenCalledWith(angle);
    });

    test('should scale canvas uniformly', () => {
      transformations.scale(ctx, 2);
      expect(ctx.scale).toHaveBeenCalledWith(2, 2);
    });

    test('should scale canvas non-uniformly', () => {
      transformations.scale(ctx, 2, 3);
      expect(ctx.scale).toHaveBeenCalledWith(2, 3);
    });

    test('should save canvas state', () => {
      transformations.save(ctx);
      expect(ctx.save).toHaveBeenCalled();
    });

    test('should restore canvas state', () => {
      transformations.restore(ctx);
      expect(ctx.restore).toHaveBeenCalled();
    });

    test('should apply transformations and restore', () => {
      const mockDraw = jest.fn();
      transformations.withTransform(ctx, mockDraw, {
        translate: { x: 50, y: 50 },
        rotate: Math.PI / 4,
        scale: { x: 2, y: 2 }
      });
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.translate).toHaveBeenCalledWith(50, 50);
      expect(ctx.rotate).toHaveBeenCalled();
      expect(ctx.scale).toHaveBeenCalledWith(2, 2);
      expect(mockDraw).toHaveBeenCalledWith(ctx);
      expect(ctx.restore).toHaveBeenCalled();
    });
  });

  // ========================================================================
  // Styling Tests
  // ========================================================================

  describe('Styling (Colors, Gradients, Patterns)', () => {
    test('should create linear gradient', () => {
      const gradient = styling.linearGradient(ctx, 0, 0, 100, 100, [
        [0, '#FF0000'],
        [1, '#0000FF']
      ]);
      expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 100, 100);
      expect(gradient.addColorStop).toHaveBeenCalledTimes(2);
    });

    test('should create radial gradient', () => {
      const gradient = styling.radialGradient(ctx, 50, 50, 0, 50, 50, 100, [
        [0, '#FFFFFF'],
        [1, '#000000']
      ]);
      expect(ctx.createRadialGradient).toHaveBeenCalledWith(50, 50, 0, 50, 50, 100);
      expect(gradient.addColorStop).toHaveBeenCalledTimes(2);
    });

    test('should create pattern from image', () => {
      const mockImage = {};
      styling.pattern(ctx, mockImage, 'repeat');
      expect(ctx.createPattern).toHaveBeenCalledWith(mockImage, 'repeat');
    });

    test('should set shadow properties', () => {
      styling.shadow(ctx, {
        offsetX: 5,
        offsetY: 5,
        blur: 10,
        color: 'rgba(0, 0, 0, 0.5)'
      });
      expect(ctx.shadowOffsetX).toBe(5);
      expect(ctx.shadowOffsetY).toBe(5);
      expect(ctx.shadowBlur).toBe(10);
      expect(ctx.shadowColor).toBe('rgba(0, 0, 0, 0.5)');
    });

    test('should clear shadow', () => {
      styling.clearShadow(ctx);
      expect(ctx.shadowOffsetX).toBe(0);
      expect(ctx.shadowOffsetY).toBe(0);
      expect(ctx.shadowBlur).toBe(0);
      expect(ctx.shadowColor).toBe('transparent');
    });
  });

  // ========================================================================
  // Text Rendering Tests
  // ========================================================================

  describe('Text Rendering', () => {
    test('should draw text with fill', () => {
      textRendering.drawText(ctx, 'Hello Canvas', 50, 50, {
        fill: true,
        fillColor: '#000000',
        font: '20px Arial'
      });
      expect(ctx.font).toBe('20px Arial');
      expect(ctx.fillStyle).toBe('#000000');
      expect(ctx.fillText).toHaveBeenCalledWith('Hello Canvas', 50, 50);
    });

    test('should draw text with stroke', () => {
      textRendering.drawText(ctx, 'Canvas Text', 100, 100, {
        fill: false,
        stroke: true,
        strokeColor: '#FF0000',
        lineWidth: 2
      });
      expect(ctx.strokeStyle).toBe('#FF0000');
      expect(ctx.lineWidth).toBe(2);
      expect(ctx.strokeText).toHaveBeenCalledWith('Canvas Text', 100, 100);
    });

    test('should measure text dimensions', () => {
      const metrics = textRendering.measureText(ctx, 'Test Text', '16px Arial');
      expect(ctx.font).toBe('16px Arial');
      expect(ctx.measureText).toHaveBeenCalledWith('Test Text');
      expect(metrics.width).toBe(100);
    });

    test('should draw multiline text', () => {
      textRendering.drawMultiline(ctx, 'Line 1\nLine 2\nLine 3', 50, 50, 20);
      expect(ctx.fillText).toHaveBeenCalledTimes(3);
    });
  });

  // ========================================================================
  // Animations Tests
  // ========================================================================

  describe('Animations', () => {
    test('should create animation controller', () => {
      const controller = new animations.AnimationController();
      expect(controller.animations).toEqual([]);
      expect(controller.isRunning).toBe(false);
      expect(controller.frameCount).toBe(0);
    });

    test('should add animation to controller', () => {
      const controller = new animations.AnimationController();
      const drawFn = jest.fn();
      controller.add(drawFn, 1000);
      expect(controller.animations.length).toBe(1);
      expect(controller.animations[0].draw).toBe(drawFn);
      expect(controller.animations[0].duration).toBe(1000);
    });

    test('should have linear easing function', () => {
      const eased = animations.easing.linear(0.5);
      expect(eased).toBe(0.5);
    });

    test('should have easeInQuad easing function', () => {
      const eased = animations.easing.easeInQuad(0.5);
      expect(eased).toBe(0.25);
    });

    test('should have easeOutQuad easing function', () => {
      const eased = animations.easing.easeOutQuad(0.5);
      expect(eased).toBe(0.75);
    });

    test('should have easeInCubic easing function', () => {
      const eased = animations.easing.easeInCubic(0.5);
      expect(eased).toBe(0.125);
    });

    test('should have easeOutCubic easing function', () => {
      const eased = animations.easing.easeOutCubic(0.5);
      expect(eased).toBeCloseTo(0.875, 3);
    });

    test('should have easeOutBounce easing function', () => {
      const eased = animations.easing.easeOutBounce(0.5);
      expect(eased).toBeGreaterThan(0);
      expect(eased).toBeLessThan(1);
    });

    test('should have easeOutElastic easing function', () => {
      const eased = animations.easing.easeOutElastic(0.5);
      expect(eased).toBeGreaterThan(0);
      expect(eased).toBeLessThan(2);
    });
  });

  // ========================================================================
  // Interactive Graphics Tests
  // ========================================================================

  describe('Interactive Graphics - Mouse Tracking', () => {
    test('should create mouse tracker', () => {
      const mockCanvas = {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
      };
      const tracker = new interactive.MouseTracker(mockCanvas);
      expect(tracker.x).toBe(0);
      expect(tracker.y).toBe(0);
      expect(tracker.isPressed).toBe(false);
    });

    test('should get mouse position', () => {
      const mockCanvas = {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
      };
      const tracker = new interactive.MouseTracker(mockCanvas);
      tracker.x = 100;
      tracker.y = 200;
      const pos = tracker.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });

    test('should calculate distance to point', () => {
      const mockCanvas = {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
      };
      const tracker = new interactive.MouseTracker(mockCanvas);
      tracker.x = 0;
      tracker.y = 0;
      const distance = tracker.distanceTo(3, 4);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    test('should detect if mouse is in rectangle', () => {
      const mockCanvas = {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
      };
      const tracker = new interactive.MouseTracker(mockCanvas);
      tracker.x = 50;
      tracker.y = 50;
      expect(tracker.isInRect(0, 0, 100, 100)).toBe(true);
      expect(tracker.isInRect(100, 100, 50, 50)).toBe(false);
    });

    test('should detect if mouse is in circle', () => {
      const mockCanvas = {
        addEventListener: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({ left: 0, top: 0 }))
      };
      const tracker = new interactive.MouseTracker(mockCanvas);
      tracker.x = 100;
      tracker.y = 100;
      expect(tracker.isInCircle(100, 100, 50)).toBe(true);
      expect(tracker.isInCircle(200, 200, 50)).toBe(false);
    });
  });

  // ========================================================================
  // Collision Detection Tests
  // ========================================================================

  describe('Collision Detection', () => {
    test('should detect rectangle-rectangle collision', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 25, y: 25, width: 50, height: 50 };
      expect(interactive.collision.rectToRect(rect1, rect2)).toBe(true);

      const rect3 = { x: 100, y: 100, width: 50, height: 50 };
      expect(interactive.collision.rectToRect(rect1, rect3)).toBe(false);
    });

    test('should detect circle-circle collision', () => {
      const circle1 = { x: 0, y: 0, radius: 50 };
      const circle2 = { x: 60, y: 0, radius: 50 };
      expect(interactive.collision.circleToCircle(circle1, circle2)).toBe(true);

      const circle3 = { x: 150, y: 0, radius: 50 };
      expect(interactive.collision.circleToCircle(circle1, circle3)).toBe(false);
    });

    test('should detect point in rectangle', () => {
      const rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(interactive.collision.pointInRect(50, 50, rect)).toBe(true);
      expect(interactive.collision.pointInRect(150, 150, rect)).toBe(false);
    });

    test('should detect point in circle', () => {
      const circle = { x: 100, y: 100, radius: 50 };
      expect(interactive.collision.pointInCircle(100, 100, circle)).toBe(true);
      expect(interactive.collision.pointInCircle(160, 100, circle)).toBe(false);
    });
  });

  // ========================================================================
  // Advanced Techniques Tests
  // ========================================================================

  describe('Advanced Techniques - Particle System', () => {
    test('should create particle system', () => {
      const mockCanvas = {};
      const system = new advanced.ParticleSystem(mockCanvas);
      expect(system.particles).toEqual([]);
      expect(system.canvas).toBe(mockCanvas);
    });

    test('should add particle to system', () => {
      const mockCanvas = {};
      const system = new advanced.ParticleSystem(mockCanvas);
      system.addParticle({ x: 100, y: 100, size: 5 });
      expect(system.particles.length).toBe(1);
      expect(system.particles[0].x).toBe(100);
      expect(system.particles[0].y).toBe(100);
    });

    test('should create particle burst', () => {
      const mockCanvas = {};
      const system = new advanced.ParticleSystem(mockCanvas);
      system.burst(100, 100, 8);
      expect(system.particles.length).toBe(8);
    });

    test('should filter dead particles on update', () => {
      const mockCanvas = {};
      const system = new advanced.ParticleSystem(mockCanvas);
      system.particles = [
        { x: 100, y: 100, vx: 0, vy: 0, size: 5, color: 'rgba(0,0,0,1)', life: 0, maxLife: 100, decay: true },
        { x: 200, y: 200, vx: 0, vy: 0, size: 5, color: 'rgba(0,0,0,1)', life: 100, maxLife: 100, decay: true }
      ];
      system.update(ctx);
      expect(system.particles.length).toBe(1);
    });
  });

  // ========================================================================
  // Pixel Operations Tests
  // ========================================================================

  describe('Advanced Techniques - Pixel Operations', () => {
    test('should get pixel data', () => {
      const imageData = advanced.pixelOps.getPixelData(ctx, 0, 0, 100, 100);
      expect(ctx.getImageData).toHaveBeenCalledWith(0, 0, 100, 100);
      expect(imageData).toBeTruthy();
    });

    test('should put pixel data', () => {
      const imageData = { data: new Uint8ClampedArray(100 * 4) };
      advanced.pixelOps.putPixelData(ctx, imageData, 10, 20);
      expect(ctx.putImageData).toHaveBeenCalledWith(imageData, 10, 20);
    });

    test('should apply grayscale filter', () => {
      const imageData = {
        data: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255])
      };
      const result = advanced.pixelOps.grayscale(imageData);
      expect(result.data[0]).toBe(result.data[1]);
      expect(result.data[1]).toBe(result.data[2]);
    });

    test('should apply brightness adjustment', () => {
      const imageData = {
        data: new Uint8ClampedArray([100, 100, 100, 255])
      };
      const result = advanced.pixelOps.brightness(imageData, 0.1);
      expect(result.data[0]).toBeGreaterThan(100);
    });
  });

  // ========================================================================
  // Quiz Questions Tests
  // ========================================================================

  describe('Quiz Questions', () => {
    test('should have 5 quiz questions', () => {
      const { quiz } = require('../src/concepts/canvas/index.js').conceptConfig;
      expect(quiz.length).toBe(5);
    });

    test('should have correct quiz structure', () => {
      const { quiz } = require('../src/concepts/canvas/index.js').conceptConfig;
      quiz.forEach(q => {
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(4);
        expect(typeof q.correct).toBe('number');
      });
    });
  });

  // ========================================================================
  // Exercises Tests
  // ========================================================================

  describe('Exercises', () => {
    test('should have 3 exercises', () => {
      const { exercises } = require('../src/concepts/canvas/index.js').conceptConfig;
      expect(exercises.length).toBe(3);
    });

    test('should have exercise structure', () => {
      const { exercises } = require('../src/concepts/canvas/index.js').conceptConfig;
      exercises.forEach(ex => {
        expect(ex.id).toBeTruthy();
        expect(ex.title).toBeTruthy();
        expect(ex.description).toBeTruthy();
        expect(ex.difficulty).toBeTruthy();
        expect(Array.isArray(ex.hints)).toBe(true);
      });
    });
  });
});
