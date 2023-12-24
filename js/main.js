class Bubble {
  constructor(parentNode) {
    this.parentNode = parentNode
    this.getCanvasSize()
    window.addEventListener('resize', () => this.getCanvasSize())
    this.mouseX = 0
    this.mouseY = 0
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    })
    this.randomise()
  }
  getCanvasSize() {
    this.canvasWidth = this.parentNode.clientWidth
    this.canvasHeight = this.parentNode.clientHeight
  }
  generateDecimalBetween(min, max) {
    return (Math.random() * (min - max) + max).toFixed(2)
  }
  update() {
    this.translateX = this.translateX - this.movementX
    this.translateY = this.translateY - this.movementY
    this.posX += ((this.mouseX / (this.staticity / this.magnetism)) - this.posX) / this.smoothFactor
    this.posY += ((this.mouseY / (this.staticity / this.magnetism)) - this.posY) / this.smoothFactor

    if (this.translateY + this.posY < 0 || this.translateX + this.posX < 0 || this.translateX + this.posX > this.canvasWidth) {
      this.randomise()
      this.translateY = this.canvasHeight
    }
  }
  randomise() {
    this.colors = ['255,255,255']
    this.velocity = 30 // Bubble levitation velocity (the higher the slower)
    this.smoothFactor = 50 // The higher, the smoother
    this.staticity = 30 // Increase value to make bubbles move slower on mousemove
    this.magnetism = 0.1 + Math.random() * 4
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    this.alpha = this.generateDecimalBetween(10, 20) / 10
    this.size = this.generateDecimalBetween(1, 4)
    this.posX = 0
    this.posY = 0
    this.movementX = this.generateDecimalBetween(-2, 2) / this.velocity
    this.movementY = this.generateDecimalBetween(1, 20) / this.velocity
    this.translateX = this.generateDecimalBetween(0, this.canvasWidth)
    this.translateY = this.generateDecimalBetween(0, this.canvasHeight)
  }
}





class Background {
  constructor(selector) {
    this.canvas = document.getElementById(selector)
    this.ctx = this.canvas.getContext('2d')
    this.dpr = window.devicePixelRatio
  }
  start() {
    this.canvasSize()
    window.addEventListener('resize', () => this.canvasSize())
    this.bubblesList = []
    this.generateBubbles()
    this.animate()
  }
  canvasSize() {
    this.container = this.canvas.parentNode
    // Determine window width and height
    this.w = this.container.offsetWidth
    this.h = this.container.offsetHeight
    this.wdpi = this.w * this.dpr
    this.hdpi = this.h * this.dpr
    // Set canvas width and height
    this.canvas.width = this.wdpi
    this.canvas.height = this.hdpi
    // Set width and height attributes
    this.canvas.style.width = this.w + 'px'
    this.canvas.style.height = this.h + 'px'
    // Scale down canvas
    this.ctx.scale(this.dpr, this.dpr)
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.bubblesList.forEach((bubble) => {
      bubble.update()
      this.ctx.translate(bubble.translateX, bubble.translateY)
      this.ctx.beginPath()
      this.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'
      this.ctx.fill()
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    })
    /* global requestAnimationFrame */
    requestAnimationFrame(this.animate.bind(this))
  }
  addBubble(bubble) {
    return this.bubblesList.push(bubble)
  }
  generateBubbles() {
    for (let i = 0; i < this.bubbleDensity(); i++) {
      this.addBubble(new Bubble(this.canvas.parentNode))
    }
  }
  bubbleDensity() {
    return 50
  }
}

window.addEventListener('load', () => {
  const heroParticles = new Background('hero-particles')    
  heroParticles.start()
})

window.addEventListener("resize", () => {
  const heroParticles = new Background('hero-particles')
  heroParticles.start()
})