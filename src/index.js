import "./styles.scss";

const tau = Math.PI * 2;
let w = window.innerWidth;
let h = window.innerHeight;
let branchCount = 0;
let angles = [];
let numAngles = 10000;
let angleIndex = 0;

const canvas = document.querySelector('canvas');
canvas.width = w;
canvas.height = h;

let breezeAngleMax = tau/200;
let breezeAngle = 0;
let sineAngle = 0;

let startLength = h/4;




const c = canvas.getContext('2d');


const generateAngles = (num) => {
  for (let i = 0; i < num; i++) {
    angles.push((Math.random() * tau / 5) - tau/10);
  }
}

const getAngle = () => {
  const angle = angles[angleIndex++];
  if (angleIndex >= numAngles) angleIndex = 0;
  breezeAngle = breezeAngleMax * Math.sin(sineAngle);
  sineAngle += 0.00001;
  return angle + breezeAngle;
}

const drawCircle = (x, y, r) => {
  c.save();
  c.lineWidth = 2;
  c.translate(x, y);
  c.beginPath();
  c.arc(0, 0, r, 0, tau);
  c.stroke();
  c.restore();
}

const drawCircles = (num) => {
  for (let i = 0; i < num; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    drawCircle(x, y, Math.random() * 5 + 1);
  }
}

const drawBranch = (l) => {
  const factor = .72;//.5 + Math.random() * .3;
  if (l < 10) return;
  branchCount++;
  c.beginPath();
  c.lineCap = "round";
  c.lineWidth = l / 40;
  c.moveTo(0, 0);
  c.lineTo(0, -l);
  c.stroke();
  c.translate(0, -l);
  c.save();
  c.rotate(getAngle());
  drawBranch(l * factor);
  c.restore();
  c.save();
  c.rotate(getAngle());
  drawBranch(l * factor);
  c.restore();
  c.save();
  c.rotate(getAngle());
  drawBranch(l * factor / 2);
  c.restore();
}


const draw = () => {
  c.clearRect(0, 0, w, h);
  angleIndex = 0;
  //drawCircles(100);
  c.save();
  c.translate(w / 2, h);
  c.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  drawBranch(startLength);
  c.restore();
  requestAnimationFrame(draw);
}

generateAngles(numAngles);
draw();
// console.log(angles)
// const now = new Date().getTime();
// c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
// drawCircles(100);
// c.translate(w / 2, h);
// c.strokeStyle = 'rgba(255, 255, 255, 0.9)';
// drawBranch(h / 4);
// const then = new Date().getTime();
// console.log('elapsed:', then - now);

// console.log(branchCount);



