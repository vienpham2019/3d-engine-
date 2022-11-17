import { Shape } from './Shape.js';
export class Rectangle extends Shape {
  width;
  height;

  constructor(width, height, context) {
    super(context);
    this.width = width;
    this.height = height;
    this.init();
  }

  init() {
    this.vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
    this.faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 4, 7, 3],
      [1, 5, 6, 2],
    ];
  }

  setSize(s) {
    this.width += s;
    this.height += s;
  }

  draw() {
    for (let i = 0; i < this.vertices.length; i++) {
      //   if (x * this.width < canvas.width && y * this.height < canvas.height) {
      let rotate = this.rotation(this.vertices[i]);

      let points2d = Shape.get2DCordinate(rotate);

      this.points[i] = [points2d[0] * this.width, points2d[1] * this.height];
      this.drawPoint(this.points[i][0], this.points[i][1]);
      //   }
    }

    this.drawFaces(this.points);
  }
}
