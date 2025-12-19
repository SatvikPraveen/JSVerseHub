/**
 * Canvas Graphics Patterns & Advanced Techniques
 * Advanced drawing patterns, game development, and specialized techniques
 */

/**
 * Game Development Utilities
 * Basic game loop and entity management
 */
const gameUtils = {
  /**
   * Game loop controller
   */
  GameLoop: class {
    constructor() {
      this.running = false;
      this.lastTime = 0;
      this.deltaTime = 0;
      this.fps = 0;
      this.frameCount = 0;
      this.updates = [];
      this.renders = [];
    }

    /**
     * Register update function
     * @param {Function} updateFn - Function to call each update
     */
    onUpdate(updateFn) {
      this.updates.push(updateFn);
    }

    /**
     * Register render function
     * @param {Function} renderFn - Function to call each render
     */
    onRender(renderFn) {
      this.renders.push(renderFn);
    }

    /**
     * Start game loop
     * @param {Function} clearFn - Function to clear screen
     */
    start(clearFn) {
      this.running = true;
      this.lastTime = performance.now();
      const loop = (currentTime) => {
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.frameCount++;

        // Calculate FPS
        if (this.frameCount % 60 === 0) {
          this.fps = Math.round(1 / this.deltaTime);
        }

        // Update
        this.updates.forEach(fn => fn(this.deltaTime));

        // Render
        clearFn();
        this.renders.forEach(fn => fn(this.deltaTime));

        if (this.running) {
          requestAnimationFrame(loop);
        }
      };

      requestAnimationFrame(loop);
    }

    /**
     * Stop game loop
     */
    stop() {
      this.running = false;
    }

    /**
     * Get current FPS
     * @returns {number} Frames per second
     */
    getFPS() {
      return this.fps;
    }

    /**
     * Get delta time
     * @returns {number} Time since last frame in seconds
     */
    getDeltaTime() {
      return this.deltaTime;
    }
  },

  /**
   * Simple entity/sprite class
   */
  Entity: class {
    constructor(options = {}) {
      const {
        x = 0,
        y = 0,
        width = 50,
        height = 50,
        vx = 0,
        vy = 0,
        color = '#000'
      } = options;

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.rotation = 0;
    }

    /**
     * Update entity position
     * @param {number} dt - Delta time
     */
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }

    /**
     * Draw entity
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }

    /**
     * Get bounds for collision detection
     * @returns {Object} Bounds object
     */
    getBounds() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }
};

/**
 * Drawing Pattern Techniques
 */
const drawingPatterns = {
  /**
   * Draw grid pattern
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cellSize - Size of grid cells
   * @param {Object} options - Grid options
   */
  grid(ctx, cellSize, options = {}) {
    const {
      color = '#ccc',
      lineWidth = 1,
      width = ctx.canvas.width,
      height = ctx.canvas.height
    } = options;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Vertical lines
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  },

  /**
   * Draw checkerboard pattern
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cellSize - Size of cells
   * @param {Object} options - Checkerboard options
   */
  checkerboard(ctx, cellSize, options = {}) {
    const {
      color1 = '#fff',
      color2 = '#000',
      width = ctx.canvas.width,
      height = ctx.canvas.height
    } = options;

    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        ctx.fillStyle = ((x / cellSize + y / cellSize) % 2 === 0) ? color1 : color2;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  },

  /**
   * Draw polar grid (concentric circles and radial lines)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   * @param {number} circles - Number of circles
   * @param {number} radials - Number of radial lines
   * @param {Object} options - Grid options
   */
  polarGrid(ctx, centerX, centerY, circles, radials, options = {}) {
    const {
      maxRadius = 200,
      color = '#ccc',
      lineWidth = 1
    } = options;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    const circleRadius = maxRadius / circles;

    // Draw concentric circles
    for (let i = 1; i <= circles; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw radial lines
    for (let i = 0; i < radials; i++) {
      const angle = (Math.PI * 2 * i) / radials;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  },

  /**
   * Draw rounded rectangle
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {number} radius - Corner radius
   * @param {Object} options - Drawing options
   */
  roundedRect(ctx, x, y, width, height, radius, options = {}) {
    const {
      fill = true,
      stroke = false,
      fillColor = '#000',
      strokeColor = '#000'
    } = options;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();

    if (fill) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }
  },

  /**
   * Draw bezier curve
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Array} points - Array of [x, y] coordinate pairs
   * @param {Object} options - Curve options
   */
  bezierCurve(ctx, points, options = {}) {
    const {
      fill = false,
      stroke = true,
      strokeColor = '#000',
      lineWidth = 2
    } = options;

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length - 2; i++) {
      const cp1x = points[i][0] + (points[i + 1][0] - points[i - 1][0]) / 2 * 0.16;
      const cp1y = points[i][1] + (points[i + 1][1] - points[i - 1][1]) / 2 * 0.16;
      const cp2x = points[i + 1][0] + (points[i + 2][0] - points[i][0]) / 2 * -0.16;
      const cp2y = points[i + 1][1] + (points[i + 2][1] - points[i][1]) / 2 * -0.16;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i + 1][0], points[i + 1][1]);
    }

    if (stroke) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }
};

/**
 * Data Visualization Utilities
 */
const visualization = {
  /**
   * Draw bar chart
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Chart width
   * @param {number} height - Chart height
   * @param {Array} data - Data values
   * @param {Object} options - Chart options
   */
  barChart(ctx, x, y, width, height, data, options = {}) {
    const {
      colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      padding = 10,
      maxValue = Math.max(...data)
    } = options;

    const barWidth = (width - padding * (data.length - 1)) / data.length;
    const chartHeight = height;

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const barX = x + index * (barWidth + padding);
      const barY = y + chartHeight - barHeight;

      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(barX, barY, barWidth, barHeight);
    });
  },

  /**
   * Draw pie chart
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} centerX - Center X
   * @param {number} centerY - Center Y
   * @param {number} radius - Chart radius
   * @param {Array} data - Data values
   * @param {Object} options - Chart options
   */
  pieChart(ctx, centerX, centerY, radius, data, options = {}) {
    const {
      colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'],
      labels = []
    } = options;

    const total = data.reduce((a, b) => a + b, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      // Draw label
      if (labels[index]) {
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(labels[index], labelX, labelY);
      }

      currentAngle += sliceAngle;
    });
  },

  /**
   * Draw line chart
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Chart width
   * @param {number} height - Chart height
   * @param {Array} data - Data points
   * @param {Object} options - Chart options
   */
  lineChart(ctx, x, y, width, height, data, options = {}) {
    const {
      color = '#4ecdc4',
      lineWidth = 2,
      showPoints = true,
      pointSize = 4,
      maxValue = Math.max(...data),
      minValue = Math.min(...data)
    } = options;

    const range = maxValue - minValue;
    const pointSpacing = width / (data.length - 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    data.forEach((value, index) => {
      const pointX = x + index * pointSpacing;
      const pointY = y + height - ((value - minValue) / range) * height;

      if (index === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    });

    ctx.stroke();

    // Draw points
    if (showPoints) {
      ctx.fillStyle = color;
      data.forEach((value, index) => {
        const pointX = x + index * pointSpacing;
        const pointY = y + height - ((value - minValue) / range) * height;

        ctx.beginPath();
        ctx.arc(pointX, pointY, pointSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
};

/**
 * Performance Optimization Techniques
 */
const performance = {
  /**
   * Offscreen canvas for rendering and caching
   */
  OffscreenCanvas: class {
    constructor(width, height) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Get context
     * @returns {CanvasRenderingContext2D}
     */
    getContext() {
      return this.ctx;
    }

    /**
     * Draw offscreen canvas to main canvas
     * @param {CanvasRenderingContext2D} ctx - Main canvas context
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    drawTo(ctx, x = 0, y = 0) {
      ctx.drawImage(this.canvas, x, y);
    }

    /**
     * Get canvas as image data
     * @returns {ImageData}
     */
    getImageData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Clear offscreen canvas
     */
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  /**
   * Dirty rectangle optimization
   */
  DirtyRectOptimizer: class {
    constructor() {
      this.dirtyRects = [];
    }

    /**
     * Mark rectangle as dirty (needs redraw)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Width
     * @param {number} height - Height
     */
    mark(x, y, width, height) {
      this.dirtyRects.push({ x, y, width, height });
    }

    /**
     * Merge overlapping rectangles
     * @returns {Array} Merged rectangles
     */
    getMergedRects() {
      if (this.dirtyRects.length === 0) return [];

      let rects = [...this.dirtyRects];
      let merged = true;

      while (merged) {
        merged = false;
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            if (this.rectsOverlap(rects[i], rects[j])) {
              rects[i] = this.mergeRects(rects[i], rects[j]);
              rects.splice(j, 1);
              merged = true;
              break;
            }
          }
          if (merged) break;
        }
      }

      return rects;
    }

    /**
     * Check if rectangles overlap
     * @private
     */
    rectsOverlap(r1, r2) {
      return !(r1.x + r1.width < r2.x ||
               r2.x + r2.width < r1.x ||
               r1.y + r1.height < r2.y ||
               r2.y + r2.height < r1.y);
    }

    /**
     * Merge two rectangles
     * @private
     */
    mergeRects(r1, r2) {
      const x = Math.min(r1.x, r2.x);
      const y = Math.min(r1.y, r2.y);
      const width = Math.max(r1.x + r1.width, r2.x + r2.width) - x;
      const height = Math.max(r1.y + r1.height, r2.y + r2.height) - y;

      return { x, y, width, height };
    }

    /**
     * Clear dirty rectangles
     */
    clear() {
      this.dirtyRects = [];
    }
  }
};

module.exports = {
  gameUtils,
  drawingPatterns,
  visualization,
  performance
};
