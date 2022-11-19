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
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],

      [0, 1, 1],
      [1, 1, 1],
      [1, 0, 1],
      [0, 0, 1],
    ];
    // rule bl tl tr bl
    this.faces = [
      [0, 3, 2],
      [0, 2, 1],
      //
      [1, 2, 6],
      [1, 6, 5],
      //
      [5, 6, 7],
      [5, 7, 4],
      //
      [4, 7, 3],
      [4, 3, 0],
      //
      [3, 7, 6],
      [3, 6, 2],
      //
      [4, 0, 1],
      [4, 1, 5],
    ];
  }

  setSize(s) {
    this.width += s;
    this.height += s;
  }

  draw() {
    let rotate_vertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      //   if (x * this.width < canvas.width && y * this.height < canvas.height) {
      let rotate = this.rotation(this.vertices[i]);
      rotate_vertices[i] = [
        rotate[0] * this.width,
        rotate[1] * this.width,
        rotate[2] * this.width,
      ];

      let points2d = Shape.get2DCordinate(rotate);

      this.points[i] = [points2d[0] * this.width, points2d[1] * this.height];
      this.drawPoint(this.points[i][0], this.points[i][1], i + 1);
      //   }
    }

    this.drawFaces(this.points, rotate_vertices);
  }
}
