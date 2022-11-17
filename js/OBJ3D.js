import { Shape } from './Shape.js';
import { canvas } from './main.js';
export class OBJ3D extends Shape {
  size;

  constructor(context, file) {
    super(context);
    this.init(file);
  }

  init(file) {
    let fileContentArray = file.split(/\r\n|\n/);
    let x = [Number.MAX_VALUE, Number.MIN_VALUE]; // [min,max]
    let y = [Number.MAX_VALUE, Number.MIN_VALUE]; // [min,max]
    // let count = 0;
    for (let text of fileContentArray) {
      text = text.trim();
      if (text.indexOf('v ') === 0) {
        let vertice = text
          .replace('v', '')
          .trim()
          .split(' ')
          .map((nt) => parseFloat(nt) * -1);

        let [x2d, y2d] = Shape.get2DCordinate(vertice);
        if (x2d < x[0]) x[0] = x2d;
        if (x2d > x[1]) x[1] = x2d;
        if (y2d < y[0]) y[0] = y2d;
        if (y2d > y[1]) y[1] = y2d;

        this.vertices.push(vertice);
      } else if (text.indexOf('f ') === 0) {
        // if (count++ > 5000) continue;
        let face = text
          .replace('f', '')
          .trim()
          .split(' ')
          .map((f) => parseInt(f.split('/')[0]) - 1);
        this.faces.push(face);
      }
    }
    this.size = canvas.width / (x[1] - x[0]);
  }

  setSize(size) {
    this.size += size;
  }

  draw() {
    for (let i = 0; i < this.vertices.length; i++) {
      //   if (x * this.width < canvas.width && y * this.height < canvas.height) {
      let rotate = this.rotation(this.vertices[i]);

      let points2d = Shape.get2DCordinate(rotate);

      this.points[i] = [points2d[0] * this.size, points2d[1] * this.size];
      this.drawPoint(this.points[i][0], this.points[i][1]);
      //   }
    }

    this.drawFaces(this.points);
  }
}
