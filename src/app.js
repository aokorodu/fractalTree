import Perlin from 'perlin.js';

export class App {
  constructor() {
    this.tau = Math.PI * 2;
    this.w;
    this.h;
    this.branchCount = 0;
    this.angles = [];
    this.numAngles = 10000;
    this.angleIndex = 0;
    this.canvas;
    this.c;
    this.breezeAngleMax = this.tau / 200;
    this.breezeAngle = 0;
    this.sineAngle = 0;
    this.startLength;
    this.perlinTracker = 0;
  }

  init() {
    this.initProps();
    this.initCanvas();
    this.initNoise();
    this.generateAngles(this.numAngles);
  }

  initNoise(){
    Perlin.seed(Math.random());
  }

  initProps() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.startLength = this.h / 4;
  }

  initCanvas() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = this.w*2;
    this.canvas.height = this.h*2;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.c = this.canvas.getContext('2d');
    this.c.scale(2,2);
    this.c.strokeStyle = 'rgba(220, 220, 220, 0.6)';
  }

  generateAngles(num) {
    for (let i = 0; i < num; i++) {
      this.angles.push((Math.random() * this.tau / 5) - this.tau / 10);
    }
  }

  getAngle() {
    const angle = this.angles[this.angleIndex++];
    if (this.angleIndex >= this.numAngles) this.angleIndex = 0;
    this.breezeAngle = this.getMaxAngle() * Math.sin(this.sineAngle);
    this.sineAngle += 0.00001;
    this.getMaxAngle();
    return angle + this.breezeAngle;
  }

  getMaxAngle(){
    let val = Perlin.simplex2(1, this.perlinTracker);
    this.perlinTracker += .0000001;

    return this.breezeAngleMax * val;
  }

  drawCircle(x, y, r) {
    this.c.save();
    this.c.lineWidth = 2;
    this.c.translate(x, y);
    this.c.beginPath();
    this.c.arc(0, 0, r, 0, this.tau);
    this.c.stroke();
    this.c.restore();
  }

  drawCircles(num) {
    for (let i = 0; i < num; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      this.drawCircle(x, y, Math.random() * 5 + 1);
    }
  }

  drawBranch(l) {
    const factor = .72;//.5 + Math.random() * .3;
    if (l < 10) return;
    this.branchCount++;
    this.c.beginPath();
    this.c.lineCap = "round";
    this.c.lineWidth = l / 40;
    this.c.moveTo(0, 0);
    this.c.lineTo(0, -l);
    this.c.stroke();
    this.c.translate(0, -l);
    this.c.save();
    this.c.rotate(this.getAngle());
    this.drawBranch(l * factor);
    this.c.restore();
    this.c.save();
    this.c.rotate(this.getAngle());
    this.drawBranch(l * factor);
    this.c.restore();
    this.c.save();
    this.c.rotate(this.getAngle());
    this.drawBranch(l * factor / 2);
    this.c.restore();
  }

  draw() {
    this.c.clearRect(0, 0, this.w, this.h);
    this.angleIndex = 0;
    this.drawTree(this.w / 2, this.h, this.startLength);
    this.drawTree(this.w / 2, this.h, this.startLength/4);
    requestAnimationFrame(() => {
      this.draw()
    });
  }

  drawTree(x, y, l){
    this.c.save();
    this.c.translate(x, y);
    this.drawBranch(l);
    this.c.restore();
  }
}