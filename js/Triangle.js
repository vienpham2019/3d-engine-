import { ThreeD } from './ThreeD.js';
export class Triangle extends ThreeD {
  size;
  angles = [];
  depth;
  error;

  constructor(size, context, angles) {
    super(context);
    this.size = size;
    this.angles = [
      this.conver_degrees_to_pi(angles[0]),
      this.conver_degrees_to_pi(angles[1]),
      this.conver_degrees_to_pi(angles[2]),
    ];
    this.depth = 0.5;
    this.init();
  }

  init() {
    this.vertices = [
      [0, 0, 0],
      [Math.cos(this.angles[0]), -Math.sin(this.angles[0]), 0],
      [
        Math.sin(this.angles[0]) / Math.tan(this.angles[2]) +
          Math.cos(this.angles[0]),
        0,
        0,
      ],

      [0, 0, this.depth],
      [Math.cos(this.angles[0]), -Math.sin(this.angles[0]), this.depth],
      [
        Math.sin(this.angles[0]) / Math.tan(this.angles[2]) +
          Math.cos(this.angles[0]),
        0,
        this.depth,
      ],
    ];
    this.faces = [
      [0, 1, 2],
      [3, 4, 5],
      [0, 3, 4, 1],
      [2, 5, 4, 1],
      [0, 3, 5, 2],
    ];
  }

  conver_degrees_to_pi(deg) {
    return (deg * Math.PI) / 180;
  }

  setSize(s) {
    this.size += s;
  }

  draw() {
    for (let i = 0; i < this.vertices.length; i++) {
      //   if (x * this.width < canvas.width && y * this.height < canvas.height) {
      let rotate = this.rotation(this.vertices[i]);

      let points2d = Shape.get2DCordinate(rotate);

      this.points[i] = [points2d[0] * this.size, points2d[1] * this.size];
      this.drawPoint(this.points[i][0], this.points[i][1], i + 1);
      //   }
    }

    this.drawFaces(this.points);
  }
}
