import { Shape } from './Shape.js';
import { canvas } from './main.js';
export class Rectangle extends Shape {
  projection_matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  vertices;
  faces;
  width;
  height;

  constructor(width, height, context, vertices, faces) {
    super(context);
    this.width = width;
    this.height = height;
    this.vertices = vertices;
    this.faces = faces;
  }

  draw() {
    for (let i = 0; i < this.vertices.length; i++) {
      let rotate_x = this.multiply_m(this.rotationMatrixX, this.vertices[i]);
      let rotate_y = this.multiply_m(this.rotationMatrixY, rotate_x);
      let rotate_z = this.multiply_m(this.rotationMatrixZ, rotate_y);

      let points2d = this.multiply_m(this.projection_matrix, rotate_z);
      this.points[i] = [
        points2d[0][0] * this.width,
        points2d[1][0] * this.height,
      ];
      this.drawPoint(this.points[i][0], this.points[i][1]);
    }

    this.drawFaces(this.faces, this.points);
  }
}
