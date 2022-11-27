import { OBJ3D } from './OBJ3D.js';
import { Rectangle } from './Rectangle.js';
import { Triangle } from './Triangle.js';
import { Util } from './Util.js';

export const canvas = document.querySelector('#canvas');
export const c = canvas.getContext('2d');

canvas.width = 1424;
canvas.height = 776;

let obj_3d = new Triangle();

let rotateX = true;
let rotateY = true;
let rotateZ = true;

var lastCalledTime;
var fps;

function animate() {
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(animate);

  if (obj_3d != null) {
    if (rotateX) obj_3d.set_rotation_angle((a) => (a.x += 0.008));
    if (rotateY) obj_3d.set_rotation_angle((a) => (a.y += 0.008));
    if (rotateZ) obj_3d.set_rotation_angle((a) => (a.z += 0.008));

    obj_3d.draw();
  }

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
