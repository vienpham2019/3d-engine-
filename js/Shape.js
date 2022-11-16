import { canvas } from './main.js';
export class Shape {
  points = [];
  angle_X = 0;
  angle_Y = 0;
  angle_Z = 0;
  context;

  rotationMatrixX;

  rotationMatrixY;
  rotationMatrixZ;

  constructor(context) {
    this.context = context;
    this.rotationMatrixX = [
      [1, 0, 0],
      [0, Math.cos(0), -Math.sin(0)],
      [0, Math.sin(0), Math.cos(0)],
    ];

    this.rotationMatrixY = [
      [Math.cos(0), 0, Math.sin(0)],
      [0, 1, 0],
      [-Math.sin(0), 0, Math.cos(0)],
    ];

    this.rotationMatrixZ = [
      [Math.cos(0), -Math.sin(0), 0],
      [Math.sin(0), Math.cos(0), 0],
      [0, 0, 1],
    ];
  }

  set_angle_X(x) {
    this.angle_X += x;
    this.rotationMatrixX = [
      [1, 0, 0],
      [0, Math.cos(this.angle_X), -Math.sin(this.angle_X)],
      [0, Math.sin(this.angle_X), Math.cos(this.angle_X)],
    ];
  }

  set_angle_Y(y) {
    this.angle_Y += y;
    this.rotationMatrixY = [
      [Math.cos(this.angle_Y), 0, Math.sin(this.angle_Y)],
      [0, 1, 0],
      [-Math.sin(this.angle_Y), 0, Math.cos(this.angle_Y)],
    ];
  }

  set_angle_Z(z) {
    this.angle_Z += z;
    this.rotationMatrixZ = [
      [Math.cos(this.angle_Z), -Math.sin(this.angle_Z), 0],
      [Math.sin(this.angle_Z), Math.cos(this.angle_Z), 0],
      [0, 0, 1],
    ];
  }

  multiply_m(a, b) {
    let product = [];
    //   console.log('mactch');
    for (let i = 0; i < a.length; i++) {
      product[i] = [];
      // a rows
      for (let j = 0; j < b[0].length; j++) {
        product[i][j] = 0;
        // number of element
        for (let k = 0; k < b.length; k++) {
          // b colums
          product[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return product;
  }

  drawFaces(faces, matrixArray) {
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    for (let i = 0; i < faces.length; i++) {
      let [x, y] = faces[i];
      this.context.beginPath();
      this.context.moveTo(
        matrixArray[x][0] + centerX,
        matrixArray[x][1] + centerY
      );
      this.context.lineTo(
        matrixArray[y][0] + centerX,
        matrixArray[y][1] + centerY
      );
      this.context.strokeStyle = 'red';
      this.context.closePath();
      this.context.stroke();
    }
  }

  drawPoint(x, y, label, color = 'white', size = 1) {
    if (color == null) {
      color = '#000';
    }
    if (size == null) {
      size = 5;
    }

    var radius = 0.5 * size;

    // to increase smoothing for numbers with decimal part
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    var pointX = Math.round(x - radius) + centerX;
    var pointY = Math.round(y - radius) + centerY;

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
    this.context.fill();

    if (label) {
      var textX = pointX;
      var textY = Math.round(pointY - size - 3);

      this.context.font = 'Italic 14px Arial';
      this.context.fillStyle = color;
      this.context.textAlign = 'center';
      this.context.fillText(label, textX, textY);
    }
  }
}
