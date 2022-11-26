import { OBJ3D } from './OBJ3D.js';
import { Rectangle } from './Rectangle.js';
import { Triangle } from './Triangle.js';
import { Util } from './Util.js';

export const canvas = document.querySelector('#canvas');
export const c = canvas.getContext('2d');

canvas.width = 1424;
canvas.height = 776;

const delay = 200;

c.fillRect(0, 0, canvas.width, canvas.height);

let obj_3d = new Rectangle();
// let obj_3d = new Triangle(200, c, [70, 90, 20]);

// matix 3d to 2d
// [1 0 0]    [x]
// [0 1 0] *  [y] = [x,y]  => x = (1 * x) + (0 * y) + (0 * z)
//            [Z]             y = (0 * x) + (1 * y) + (0 * z)

let rotateX = true;
let rotateY = true;
let rotateZ = true;

var lastCalledTime;
var fps;

function animate() {
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // let imageData = c.createImageData(1, 1);

  // for (let i = 0; i < imageData.data.length; i += 4) {
  //   // Percentage in the x direction, times 255
  //   let x = ((i % 400) / 400) * 255;
  //   // Percentage in the y direction, times 255
  //   let y = (Math.ceil(i / 400) / 100) * 255;

  //   // Modify pixel data
  //   imageData.data[i + 0] = x; // R value
  //   imageData.data[i + 1] = y; // G value
  //   imageData.data[i + 2] = 255 - x; // B value
  //   imageData.data[i + 3] = 255; // A value
  // }

  if (obj_3d != null) {
    if (rotateX) obj_3d.set_rotation_angle((a) => (a.x += 0.008));
    if (rotateY) obj_3d.set_rotation_angle((a) => (a.y += 0.008));
    if (rotateZ) obj_3d.set_rotation_angle((a) => (a.z += 0.008));

    obj_3d.draw();
  }

  // if (!lastCalledTime) {
  //   lastCalledTime = Date.now();
  //   fps = 0;
  //   return;
  // }

  window.requestAnimationFrame(animate);

  let delta = (Date.now() - lastCalledTime) / 1000;
  lastCalledTime = Date.now();
  fps = 1 / delta;

  document.getElementById('fps').innerHTML = Math.floor(fps);
}

animate();

document.getElementById('fileInput').onchange = function (params) {
  let file = this.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    obj_3d = new OBJ3D(reader.result);
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
};

let speed = 1;
window.addEventListener('keydown', (e) => {
  if (obj_3d === null) return;
  let v_for_ward = Util.vector_multiply(obj_3d.v_look_dir, speed);
  switch (e.key) {
    case 'ArrowUp':
      obj_3d.v_camera.y -= speed;
      break;
    case 'ArrowDown':
      obj_3d.v_camera.y += speed;
      break;
    case 'ArrowLeft':
      obj_3d.v_camera.x -= speed;
      break;
    case 'ArrowRight':
      obj_3d.v_camera.x += speed;
      break;

    case 'w':
      obj_3d.v_camera = Util.vector_add(obj_3d.v_camera, v_for_ward);
      break;
    case 's':
      obj_3d.v_camera = Util.vector_sub(obj_3d.v_camera, v_for_ward);

      break;
    case 'a':
      obj_3d.fYaw += 0.2;
      break;
    case 'd':
      obj_3d.fYaw -= 0.2;
      break;

    default:
      break;
  }
});
