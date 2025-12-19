/**
 * Canvas Graphics Concept
 * Learn HTML5 Canvas API for drawing, animations, and interactive graphics
 * 
 * Topics Covered:
 * 1. Canvas Basics - Setup and 2D context
 * 2. Drawing Shapes - Rectangles, circles, lines, polygons
 * 3. Paths and Complex Shapes - Bezier curves, arcs, advanced paths
 * 4. Transformations - Translate, rotate, scale, matrices
 * 5. Text and Styling - Font rendering, colors, gradients, patterns
 * 6. Images and Pixels - Drawing images, pixel manipulation
 * 7. Animations - Animation loops, timing, performance
 * 8. Interactive Graphics - Mouse handling, user input, game fundamentals
 */

// ============================================================================
// 1. CANVAS BASICS & SETUP
// ============================================================================

/**
 * Canvas Fundamentals - Understanding the canvas element and 2D context
 */
const canvasBasics = {
  /**
   * Setting up a canvas element
   * @param {string} elementId - ID of canvas element
   * @param {number} width - Canvas width in pixels
   * @param {number} height - Canvas height in pixels
   * @returns {CanvasRenderingContext2D} The 2D drawing context
   */
  getContext(elementId, width, height) {
    const canvas = document.getElementById(elementId);
    if (!canvas) throw new Error(`Canvas element with id "${elementId}" not found`);
    
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context from canvas');
    
    return ctx;
  },

  /**
   * Getting canvas dimensions
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @returns {Object} Object with width and height properties
   */
  getDimensions(canvas) {
    return {
      width: canvas.width,
      height: canvas.height,
      aspectRatio: canvas.width / canvas.height
    };
  },

  /**
   * Setting canvas to fill entire container
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {number} dpr - Device pixel ratio (default: window.devicePixelRatio)
   */
  fillWindow(canvas, dpr = window.devicePixelRatio) {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    return ctx;
  },

  /**
   * Clearing entire canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  clearCanvas(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

// ============================================================================
// 2. DRAWING SHAPES
// ============================================================================

/**
 * Drawing basic geometric shapes
 */
const drawingShapes = {
  /**
   * Draw a rectangle (filled or stroked)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Rectangle width
   * @param {number} height - Rectangle height
   * @param {Object} options - Drawing options
   */
  rectangle(ctx, x, y, width, height, options = {}) {
    const {
      fill = true,
      stroke = false,
      fillColor = '#000',
      strokeColor = '#000',
      lineWidth = 1
    } = options;

    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, width, height);
    }

    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(x, y, width, height);
    }
  },

  /**
   * Draw a circle (filled or stroked)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} radius - Circle radius
   * @param {Object} options - Drawing options
   */
  circle(ctx, x, y, radius, options = {}) {
    const {
      fill = true,
      stroke = false,
      fillColor = '#000',
      strokeColor = '#000',
      lineWidth = 1
    } = options;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  /**
   * Draw a line
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x1 - Start X coordinate
   * @param {number} y1 - Start Y coordinate
   * @param {number} x2 - End X coordinate
   * @param {number} y2 - End Y coordinate
   * @param {Object} options - Line options
   */
  line(ctx, x1, y1, x2, y2, options = {}) {
    const {
      strokeColor = '#000',
      lineWidth = 1,
      lineCap = 'round',
      lineJoin = 'round'
    } = options;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  },

  /**
   * Draw a polygon (n-sided shape)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} sides - Number of sides
   * @param {number} radius - Polygon radius
   * @param {Object} options - Drawing options
   */
  polygon(ctx, x, y, sides, radius, options = {}) {
    const {
      fill = true,
      stroke = false,
      fillColor = '#000',
      strokeColor = '#000',
      lineWidth = 1,
      rotation = 0
    } = options;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides + rotation;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  },

  /**
   * Draw a star shape
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {number} points - Number of star points
   * @param {number} outerRadius - Outer radius
   * @param {number} innerRadius - Inner radius
   * @param {Object} options - Drawing options
   */
  star(ctx, x, y, points, outerRadius, innerRadius, options = {}) {
    const { fill = true, fillColor = '#FFD700' } = options;

    ctx.beginPath();
    let angle = -Math.PI / 2;
    const angleStep = Math.PI / points;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      angle += angleStep;
    }

    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    } else {
      ctx.stroke();
    }
  }
};

// ============================================================================
// 3. TRANSFORMATIONS
// ============================================================================

/**
 * Canvas transformation matrix operations
 */
const transformations = {
  /**
   * Translate (move) the canvas origin
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X translation
   * @param {number} y - Y translation
   */
  translate(ctx, x, y) {
    ctx.translate(x, y);
  },

  /**
   * Rotate the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} angle - Angle in radians
   */
  rotate(ctx, angle) {
    ctx.rotate(angle);
  },

  /**
   * Scale the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} sx - Scale X
   * @param {number} sy - Scale Y
   */
  scale(ctx, sx, sy = sx) {
    ctx.scale(sx, sy);
  },

  /**
   * Save the current canvas state
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @returns {Object} State object (for reference)
   */
  save(ctx) {
    ctx.save();
    return { saved: true };
  },

  /**
   * Restore the previous canvas state
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  restore(ctx) {
    ctx.restore();
  },

  /**
   * Apply transformation and automatically restore
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Function} fn - Function to execute with transformations
   * @param {Object} transforms - Transformation object
   */
  withTransform(ctx, fn, transforms = {}) {
    ctx.save();

    if (transforms.translate) {
      ctx.translate(transforms.translate.x, transforms.translate.y);
    }
    if (transforms.rotate) {
      ctx.rotate(transforms.rotate);
    }
    if (transforms.scale) {
      const { x = 1, y = 1 } = transforms.scale;
      ctx.scale(x, y);
    }

    fn(ctx);
    ctx.restore();
  }
};

// ============================================================================
// 4. COLORS, GRADIENTS & PATTERNS
// ============================================================================

/**
 * Advanced color and styling capabilities
 */
const styling = {
  /**
   * Create a linear gradient
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {Array} colorStops - Array of [offset, color] pairs
   * @returns {CanvasGradient} Gradient object
   */
  linearGradient(ctx, x1, y1, x2, y2, colorStops) {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    colorStops.forEach(([offset, color]) => {
      gradient.addColorStop(offset, color);
    });
    return gradient;
  },

  /**
   * Create a radial gradient
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} r1 - Start radius
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {number} r2 - End radius
   * @param {Array} colorStops - Array of [offset, color] pairs
   * @returns {CanvasGradient} Gradient object
   */
  radialGradient(ctx, x1, y1, r1, x2, y2, r2, colorStops) {
    const gradient = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    colorStops.forEach(([offset, color]) => {
      gradient.addColorStop(offset, color);
    });
    return gradient;
  },

  /**
   * Create a pattern from an image
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLImageElement} image - Image element
   * @param {string} repetition - 'repeat', 'repeat-x', 'repeat-y', 'no-repeat'
   * @returns {CanvasPattern} Pattern object
   */
  pattern(ctx, image, repetition = 'repeat') {
    return ctx.createPattern(image, repetition);
  },

  /**
   * Set shadow properties
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} options - Shadow options
   */
  shadow(ctx, options = {}) {
    const {
      offsetX = 2,
      offsetY = 2,
      blur = 4,
      color = 'rgba(0, 0, 0, 0.3)'
    } = options;

    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
  },

  /**
   * Clear shadow
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  clearShadow(ctx) {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }
};

// ============================================================================
// 5. TEXT RENDERING
// ============================================================================

/**
 * Text drawing and styling
 */
const textRendering = {
  /**
   * Draw text on canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to draw
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} options - Text options
   */
  drawText(ctx, text, x, y, options = {}) {
    const {
      fill = true,
      stroke = false,
      fillColor = '#000',
      strokeColor = '#000',
      font = '16px Arial',
      align = 'left',
      baseline = 'alphabetic',
      lineWidth = 1
    } = options;

    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;

    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fillText(text, x, y);
    }

    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeText(text, x, y);
    }
  },

  /**
   * Measure text dimensions
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {string} font - Font specification
   * @returns {Object} Text metrics object
   */
  measureText(ctx, text, font = '16px Arial') {
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return {
      width: metrics.width,
      actualBoundingBoxLeft: metrics.actualBoundingBoxLeft,
      actualBoundingBoxRight: metrics.actualBoundingBoxRight,
      actualBoundingBoxAscent: metrics.actualBoundingBoxAscent,
      actualBoundingBoxDescent: metrics.actualBoundingBoxDescent
    };
  },

  /**
   * Draw multiline text
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text with newlines
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} lineHeight - Height between lines
   * @param {Object} options - Text options
   */
  drawMultiline(ctx, text, x, y, lineHeight, options = {}) {
    const lines = text.split('\n');
    let currentY = y;

    lines.forEach((line) => {
      this.drawText(ctx, line, x, currentY, options);
      currentY += lineHeight;
    });
  }
};

// ============================================================================
// 6. ANIMATIONS & TIMING
// ============================================================================

/**
 * Animation framework and utilities
 */
const animations = {
  /**
   * Animation controller class
   */
  AnimationController: class {
    constructor() {
      this.animations = [];
      this.isRunning = false;
      this.frameCount = 0;
    }

    /**
     * Add animation to controller
     * @param {Function} drawFn - Function called each frame
     * @param {number} duration - Duration in milliseconds (null for infinite)
     * @param {Function} onComplete - Callback when animation completes
     */
    add(drawFn, duration = null, onComplete = null) {
      this.animations.push({
        draw: drawFn,
        duration,
        onComplete,
        startTime: Date.now(),
        isComplete: false
      });
    }

    /**
     * Start animation loop
     * @param {Function} clearFn - Function to clear canvas before each frame
     */
    start(clearFn) {
      if (this.isRunning) return;
      this.isRunning = true;

      const loop = () => {
        clearFn();
        this.frameCount++;

        const now = Date.now();
        this.animations = this.animations.filter((anim) => {
          if (anim.isComplete) return false;

          const elapsed = now - anim.startTime;
          const progress = anim.duration ? elapsed / anim.duration : elapsed;

          anim.draw(Math.min(progress, 1), elapsed);

          if (anim.duration && elapsed >= anim.duration) {
            if (anim.onComplete) anim.onComplete();
            anim.isComplete = true;
            return false;
          }

          return true;
        });

        if (this.animations.length > 0) {
          requestAnimationFrame(loop);
        } else {
          this.isRunning = false;
        }
      };

      requestAnimationFrame(loop);
    }

    /**
     * Stop all animations
     */
    stop() {
      this.isRunning = false;
      this.animations = [];
    }

    /**
     * Pause animations
     */
    pause() {
      this.isRunning = false;
    }

    /**
     * Resume animations
     */
    resume() {
      if (!this.isRunning && this.animations.length > 0) {
        this.start(() => {});
      }
    }
  },

  /**
   * Easing functions for smooth animations
   */
  easing: {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (t - 1) * (t - 1) * (t - 1) + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutElastic: (t) => {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
    },
    easeOutBounce: (t) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

// ============================================================================
// 7. INTERACTIVE GRAPHICS & INPUT HANDLING
// ============================================================================

/**
 * Interactive graphics and input handling
 */
const interactive = {
  /**
   * Mouse position tracker
   */
  MouseTracker: class {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = 0;
      this.y = 0;
      this.isPressed = false;
      this.lastX = 0;
      this.lastY = 0;

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;
      });

      canvas.addEventListener('mousedown', () => {
        this.isPressed = true;
      });

      canvas.addEventListener('mouseup', () => {
        this.isPressed = false;
      });
    }

    /**
     * Get current mouse position
     * @returns {Object} Position object {x, y}
     */
    getPosition() {
      return { x: this.x, y: this.y };
    }

    /**
     * Get distance from point
     * @param {number} px - Point X
     * @param {number} py - Point Y
     * @returns {number} Distance
     */
    distanceTo(px, py) {
      const dx = this.x - px;
      const dy = this.y - py;
      return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if mouse is in rectangle
     * @param {number} x - Rectangle X
     * @param {number} y - Rectangle Y
     * @param {number} w - Rectangle width
     * @param {number} h - Rectangle height
     * @returns {boolean} Whether mouse is in rectangle
     */
    isInRect(x, y, w, h) {
      return this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h;
    }

    /**
     * Check if mouse is in circle
     * @param {number} cx - Circle center X
     * @param {number} cy - Circle center Y
     * @param {number} radius - Circle radius
     * @returns {boolean} Whether mouse is in circle
     */
    isInCircle(cx, cy, radius) {
      return this.distanceTo(cx, cy) <= radius;
    }
  },

  /**
   * Collision detection utilities
   */
  collision: {
    /**
     * Rectangle-rectangle collision
     * @param {Object} rect1 - First rectangle {x, y, width, height}
     * @param {Object} rect2 - Second rectangle
     * @returns {boolean} Whether rectangles collide
     */
    rectToRect(rect1, rect2) {
      return !(rect1.x + rect1.width < rect2.x ||
               rect2.x + rect2.width < rect1.x ||
               rect1.y + rect1.height < rect2.y ||
               rect2.y + rect2.height < rect1.y);
    },

    /**
     * Circle-circle collision
     * @param {Object} circle1 - First circle {x, y, radius}
     * @param {Object} circle2 - Second circle
     * @returns {boolean} Whether circles collide
     */
    circleToCircle(circle1, circle2) {
      const dx = circle1.x - circle2.x;
      const dy = circle1.y - circle2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < circle1.radius + circle2.radius;
    },

    /**
     * Point in rectangle
     * @param {number} x - Point X
     * @param {number} y - Point Y
     * @param {Object} rect - Rectangle {x, y, width, height}
     * @returns {boolean} Whether point is in rectangle
     */
    pointInRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.width &&
             y >= rect.y && y <= rect.y + rect.height;
    },

    /**
     * Point in circle
     * @param {number} x - Point X
     * @param {number} y - Point Y
     * @param {Object} circle - Circle {x, y, radius}
     * @returns {boolean} Whether point is in circle
     */
    pointInCircle(x, y, circle) {
      const dx = x - circle.x;
      const dy = y - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= circle.radius;
    }
  }
};

// ============================================================================
// 8. ADVANCED TECHNIQUES
// ============================================================================

/**
 * Advanced canvas techniques
 */
const advanced = {
  /**
   * Particle system for effects
   */
  ParticleSystem: class {
    constructor(canvas) {
      this.canvas = canvas;
      this.particles = [];
    }

    /**
     * Add particle to system
     * @param {Object} options - Particle options
     */
    addParticle(options = {}) {
      const {
        x = 0,
        y = 0,
        vx = 0,
        vy = 0,
        size = 5,
        color = '#000',
        life = 1000,
        decay = true
      } = options;

      this.particles.push({
        x, y, vx, vy, size, color, life, maxLife: life, decay
      });
    }

    /**
     * Add burst of particles
     * @param {number} x - Center X
     * @param {number} y - Center Y
     * @param {number} count - Number of particles
     * @param {Object} options - Particle options
     */
    burst(x, y, count, options = {}) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        this.addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ...options
        });
      }
    }

    /**
     * Update and draw particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    update(ctx) {
      this.particles = this.particles.filter(p => p.life > 0);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity

        if (p.decay) {
          p.life -= 16;
          p.color = p.color.replace(/[\d.]+\)$/g, `${p.life / p.maxLife})`);
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },

  /**
   * Image pixel manipulation
   */
  pixelOps: {
    /**
     * Get image pixel data
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Width
     * @param {number} height - Height
     * @returns {ImageData} Pixel data
     */
    getPixelData(ctx, x, y, width, height) {
      return ctx.getImageData(x, y, width, height);
    },

    /**
     * Put pixel data to canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {ImageData} imageData - Pixel data
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    putPixelData(ctx, imageData, x, y) {
      ctx.putImageData(imageData, x, y);
    },

    /**
     * Apply grayscale filter
     * @param {ImageData} imageData - Pixel data
     * @returns {ImageData} Modified pixel data
     */
    grayscale(imageData) {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      return imageData;
    },

    /**
     * Apply brightness adjustment
     * @param {ImageData} imageData - Pixel data
     * @param {number} factor - Brightness factor (-1 to 1)
     * @returns {ImageData} Modified pixel data
     */
    brightness(imageData, factor) {
      const data = imageData.data;
      const change = Math.round(255 * factor);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, data[i] + change));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + change));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + change));
      }
      return imageData;
    }
  }
};

// ============================================================================
// EXERCISES & QUIZZES
// ============================================================================

const exercises = [
  {
    id: 'canvas-draw-scene',
    title: 'Draw a Scene',
    description: 'Create a scene with at least 5 different shapes (rectangles, circles, lines, polygons). Use different colors and transformations.',
    difficulty: 'beginner',
    hints: [
      'Use drawingShapes module for drawing shapes',
      'Try transformations to rotate or scale elements',
      'Use different colors with fillColor and strokeColor options'
    ]
  },
  {
    id: 'canvas-animation-loop',
    title: 'Simple Animation Loop',
    description: 'Create an animation of a moving circle that bounces around the canvas edges.',
    difficulty: 'intermediate',
    hints: [
      'Use AnimationController for animation loop',
      'Track circle position and velocity',
      'Detect canvas edges and reverse velocity'
    ]
  },
  {
    id: 'canvas-interactive',
    title: 'Interactive Drawing',
    description: 'Create a simple drawing application where users can draw circles with their mouse by clicking.',
    difficulty: 'intermediate',
    hints: [
      'Use MouseTracker to get mouse position',
      'Listen for mouse events or check isPressed property',
      'Draw circles at mouse positions'
    ]
  }
];

const quiz = [
  {
    id: 'q1',
    question: 'What method is used to get the 2D drawing context from a canvas element?',
    options: [
      'canvas.draw2D()',
      'canvas.getContext("2d")',
      'canvas.createContext("2d")',
      'canvas.render2D()'
    ],
    correct: 1
  },
  {
    id: 'q2',
    question: 'Which easing function provides the smoothest acceleration?',
    options: [
      'linear',
      'easeInCubic',
      'easeOutBounce',
      'easeInOutQuad'
    ],
    correct: 1
  },
  {
    id: 'q3',
    question: 'What does ctx.save() do?',
    options: [
      'Saves the canvas to a file',
      'Saves the current state of the context',
      'Saves the canvas as an image',
      'Clears the canvas'
    ],
    correct: 1
  },
  {
    id: 'q4',
    question: 'How do you create a linear gradient?',
    options: [
      'ctx.gradient(x1, y1, x2, y2)',
      'ctx.createLinearGradient(x1, y1, x2, y2)',
      'ctx.linearGradient(color1, color2)',
      'ctx.gradient("linear", x1, y1, x2, y2)'
    ],
    correct: 1
  },
  {
    id: 'q5',
    question: 'Which method is best for detecting collision between two circles?',
    options: [
      'collision.rectToRect()',
      'collision.circleToCircle()',
      'collision.pointInCircle()',
      'collision.distanceTo()'
    ],
    correct: 1
  }
];

// ============================================================================
// EXPORT CONCEPT CONFIG
// ============================================================================

const conceptConfig = {
  id: 'canvas',
  title: 'Canvas Graphics',
  description: 'Master HTML5 Canvas API for drawing, animations, and interactive graphics. Learn to create games, visualizations, and dynamic content.',
  icon: 'palette',
  level: 'advanced',
  estimatedTime: '6-8 hours',
  prerequisites: ['basics', 'dom', 'es6'],
  topics: {
    basics: canvasBasics,
    shapes: drawingShapes,
    transformations,
    styling,
    text: textRendering,
    animations,
    interactive,
    advanced
  },
  exercises,
  quiz,
  resources: [
    {
      title: 'Canvas Tutorial',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'
    },
    {
      title: 'Canvas Reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D'
    },
    {
      title: 'Game Development Patterns',
      url: 'https://developer.mozilla.org/en-US/docs/Games'
    }
  ]
};

module.exports = {
  conceptConfig,
  canvasBasics,
  drawingShapes,
  transformations,
  styling,
  textRendering,
  animations,
  interactive,
  advanced
};
