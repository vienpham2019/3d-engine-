import { Shape } from './Shape.js';

export class Rectangle extends Shape {
  projection_matrix = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  //   1/1/1 2/2/1 3/3/1 4/4/1 5/5/1 6/6/1
  //   vectors = [
  //     // face 1
  //     [[-1], [-1], [-1]],
  //     [[1], [-1], [-1]],
  //     [[1], [1], [-1]],
  //     [[-1], [1], [-1]],
  //     // face 2
  //     [[-1], [-1], [1]],
  //     [[1], [-1], [1]],
  //     [[1], [1], [1]],
  //     [[-1], [1], [1]],
  //   ];

  vertices;

  //   edges = [
  //     [0, 1],
  //     [1, 2],
  //     [2, 3],
  //     [3, 0],
  //     // [2, 0],
  //     [4, 5],
  //     [5, 6],
  //     [6, 7],
  //     [7, 4],
  //     // [7, 5],
  //     [0, 4],
  //     [7, 3],
  //     // [3, 4],
  //     [1, 5],
  //     [2, 6],
  //     // [1, 6],
  //     // [0, 5],
  //     // [3, 6],
  //   ];

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
