import { Rectangle } from './Rectangle.js';
export const canvas = document.querySelector('#canvas');
export const c = canvas.getContext('2d');

canvas.width = 1424;
canvas.height = 776;

const delay = 200;

c.fillRect(0, 0, canvas.width, canvas.height);

// matix 3d to 2d
// [1 0 0]    [x]
// [0 1 0] *  [y] = [x,y]  => x = (1 * x) + (0 * y) + (0 * z)
//            [Z]             y = (0 * x) + (1 * y) + (0 * z)

// function animate() {
//   //   await sleep(delay);
//   window.requestAnimationFrame(animate);
//   c.fillStyle = 'black';
//   c.fillRect(0, 0, canvas.width, canvas.height);

//   //   rect.set_angle_X(0.005);
//   //   rect.set_angle_Y(0.005);
//   //   rect.set_angle_Z(0.005);
//   //   rect.draw();
// }

// animate();

document.getElementById('fileInput').onchange = function (params) {
  let file = this.files[0];
  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    var fileContentArray = reader.result.split(/\r\n|\n/);

    let vertices = [];
    let faces = [];

    for (let text of fileContentArray) {
      if (text.indexOf('v') === 0) {
        vertices.push(
          text
            .replace('v ', '')
            .split(' ')
            .map((nt) => [parseFloat(nt) * -1])
        );
      } else if (text.indexOf('f') === 0) {
        let face = text
          .trim()
          .replace('f ', '')
          .split(' ')
          .map((f) => parseInt(f.split('/')[0]) - 1);
        faces.push(face);
      }
    }

    let rect = new Rectangle(50, 50, c, vertices, faces);
    function animate() {
      //   await sleep(delay);
      window.requestAnimationFrame(animate);
      c.fillStyle = 'black';
      c.fillRect(0, 0, canvas.width, canvas.height);

      rect.set_angle_X(0.008);
      rect.set_angle_Y(0.008);
      rect.set_angle_Z(0.008);
      rect.draw();
    }

    animate();
    // console.log(fileContentArray);
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
};
