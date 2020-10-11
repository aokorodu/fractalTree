import Perlin from 'perlin.js';

export class App {
  constructor() {
    this.tau = Math.PI * 2;
    this.w;
    this.h;
    this.angles = [];
    this.numAngles = 10000;
    this.angleIndex = 0;
    this.canvas;
    this.c;
    this.startLength;

    this.breezeMax = this.tau/40;
    this.breeze = this.breezeMax;
    this.breezeDecrement = .0005;
    this.sinAngle = 0;;
    this.sinAngleIncrement = .05;

    this.greenLeafColor = 'rgba(0, 255, 0, 0.3)';
    this.fruitColor = 'rgba(255, 255, 0, 0.3)';
    this.leafColors = [];
  }

  updateBreeze() {
    this.sinAngle += this.sinAngleIncrement;
    if(this.sinAngle > this.tau) this.sinAngle = this.sinAngle - this.tau;
    this.breeze *= .995;
    if(this.breeze < 0.0001) this.breeze = 0;

    if(this.breeze == 0) return;
  }

  init() {
    this.initProps();
    this.initCanvas();
    this.initNoise();
    this.generateAngles(this.numAngles);
  }

  initNoise() {
    Perlin.seed(Math.random());
  }

  initProps() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.startLength = this.h / 8;
  }

  initCanvas() {
    this.canvas = document.querySelector('canvas');
    this.canvas.width = this.w * 2;
    this.canvas.height = this.h * 2;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.c = this.canvas.getContext('2d');
    this.c.scale(2, 2);
    this.c.strokeStyle = 'rgba(120,71,54, 0.6)';
  }

  generateAngles(num) {
    for (let i = 0; i < num; i++) {
      this.angles.push(Math.random() * this.tau / 8);
      this.leafColors.push(Math.random() > .5 ? this.fruitColor : this.greenLeafColor);
    }
  }

  getAngle() {
    return this.angles[this.angleIndex++];
  }

  getColor() {
    return this.leafColors[this.angleIndex];
  }

  drawBranch(l) {
    const factor = .77;//.5 + Math.random() * .3;
    if (l < 20) {
      l = 5;
      this.c.save();
      this.c.strokeStyle = this.getColor(); //Math.random() > .5 ? this.fruitColor : this.greenLeafColor;
      this.c.beginPath();
      this.c.lineCap = "round";
      this.c.lineWidth = 15;
      this.c.moveTo(0, 0);
      this.c.lineTo(0, -l);
      this.c.stroke();
      this.c.restore();
      return;
    }
    if (l < 10) return;
    this.c.beginPath();
    this.c.lineCap = "round";
    this.c.lineWidth = l / 8;
    this.c.moveTo(0, 0);
    this.c.lineTo(0, -l);
    this.c.stroke();
    this.c.translate(0, -l);
    this.c.save();
    this.c.rotate(this.getAngle() + (Math.sin(this.sinAngle) * this.breeze));
    this.drawBranch(l * factor);
    this.c.restore();
    this.c.save();
    this.c.rotate(-this.getAngle()+ (Math.sin(this.sinAngle) * this.breeze));
    this.drawBranch(l * factor);
    this.c.restore();
    this.c.save();
    this.c.rotate(this.getAngle()+ (Math.sin(this.sinAngle) * this.breeze));
    this.drawBranch(l * .6);
    this.c.restore();
  }

  draw() {
    this.updateBreeze();
    this.c.clearRect(0, 0, this.w, this.h);
    this.angleIndex = 0;
    this.drawTree(this.w / 2, this.h, this.startLength);
    //this.drawTree(this.w / 2 + 20, this.h, this.startLength / 2);
    //this.drawTree(this.w / 2 - 20, this.h, this.startLength / 3);
    requestAnimationFrame(() => {
      this.draw()
    });
  }

  drawTree(x, y, l) {
    this.c.save();
    this.c.translate(x, y);
    this.drawBranch(l);
    this.c.restore();
  }
}