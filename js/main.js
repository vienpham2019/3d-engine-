import { OBJ3D } from './OBJ3D.js';
import { Rectangle2 } from './Rectangle2.js';
import { Triangle } from './Triangle.js';

export const canvas = document.querySelector('#canvas');
export const c = canvas.getContext('2d');

canvas.width = 1424;
canvas.height = 776;

const delay = 200;

c.fillRect(0, 0, canvas.width, canvas.height);

let obj_3d = new Rectangle2();
// let obj_3d = new Triangle(200, c, [70, 90, 20]);

// matix 3d to 2d
// [1 0 0]    [x]
// [0 1 0] *  [y] = [x,y]  => x = (1 * x) + (0 * y) + (0 * z)
//            [Z]             y = (0 * x) + (1 * y) + (0 * z)

let rotateX,
  rotateY,
  rotateZ = false;

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  if (obj_3d != null) {
    if (rotateX) obj_3d.set_angle_X(0.008);
    if (rotateY) obj_3d.set_angle_Y(0.008);
    if (rotateZ) obj_3d.set_angle_Z(0.008);

    obj_3d.draw();
  }
}

animate();

document.getElementById('fileInput').onchange = function (params) {
  let file = this.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    obj_3d = new OBJ3D(c, reader.result);
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
};

let speed = 5;
window.addEventListener('keydown', (e) => {
  if (obj_3d === null) return;
  switch (e.key) {
    case '=':
      obj_3d.setSize(5);
      break;
    case '-':
      obj_3d.setSize(-5);
      break;
    case 'x':
      rotateX = !rotateX;
      break;
    case 'y':
      rotateY = !rotateY;
      break;
    case 'z':
      rotateZ = !rotateZ;
      break;
    case 'a':
      obj_3d.center[0] -= speed;
      break;
    case 'd':
      obj_3d.center[0] += speed;
      break;
    case 'w':
      obj_3d.center[1] -= speed;
      break;
    case 's':
      obj_3d.center[1] += speed;
      break;

    default:
      break;
  }
});

window.addEventListener('wheel', (e) => {
  if (e.deltaY < 0) {
    // go up
    obj_3d.setSize(10);
  } else if (e.deltaY > 0) {
    // go down
    obj_3d.setSize(-10);
  }
});
