import { canvas } from './main.js';
export class Shape {
  points = [];
  angle_X = 0;
  angle_Y = 0;
  angle_Z = 0;
  context;

  center = [];

  rotationMatrixX;

  rotationMatrixY;
  rotationMatrixZ;

  vertices = [];
  faces = [];

  constructor(context) {
    this.context = context;
    this.center = [canvas.width / 2, canvas.height / 2];
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

  drawFaces(matrixArray) {
    // var centerX = canvas.width / 2;
    // var centerY = canvas.height / 2;

    // [
    //     [1,3,2]
    // ]
    for (let i = 0; i < this.faces.length; i++) {
      if (this.faces[i].length < 3) continue;
      for (let j = 0; j < this.faces[i].length; j++) {
        let vertice;
        if (j === this.faces[i].length - 1)
          vertice = [this.faces[i][j], this.faces[i][0]];
        else vertice = [this.faces[i][j], this.faces[i][j + 1]];
        // if (
        //   matrixArray[vertice[0]][0] < canvas.width &&
        //   matrixArray[vertice[0]][1] < canvas.height &&
        //   matrixArray[vertice[1]][0] < canvas.width &&
        //   matrixArray[vertice[1]][1] < canvas.height
        // ) {
        this.context.beginPath();
        this.context.moveTo(
          matrixArray[vertice[0]][0] + this.center[0],
          matrixArray[vertice[0]][1] + this.center[1]
        );
        this.context.lineTo(
          matrixArray[vertice[1]][0] + this.center[0],
          matrixArray[vertice[1]][1] + this.center[1]
        );
        this.context.strokeStyle = '#f1c232';
        this.context.closePath();
        this.context.stroke();
        // }
      }
    }
  }

  rotation(a) {
    let [x, y, z] = a;
    /// over X
    let newXX =
      x * this.rotationMatrixX[0][0] +
      y * this.rotationMatrixX[0][1] +
      z * this.rotationMatrixX[0][2];

    let newXY =
      x * this.rotationMatrixX[1][0] +
      y * this.rotationMatrixX[1][1] +
      z * this.rotationMatrixX[1][2];

    let newXZ =
      x * this.rotationMatrixX[2][0] +
      y * this.rotationMatrixX[2][1] +
      z * this.rotationMatrixX[2][2];

    /// over Y
    let newYX =
      newXX * this.rotationMatrixY[0][0] +
      newXY * this.rotationMatrixY[0][1] +
      newXZ * this.rotationMatrixY[0][2];

    let newYY =
      newXX * this.rotationMatrixY[1][0] +
      newXY * this.rotationMatrixY[1][1] +
      newXZ * this.rotationMatrixY[1][2];

    let newYZ =
      newXX * this.rotationMatrixY[2][0] +
      newXY * this.rotationMatrixY[2][1] +
      newXZ * this.rotationMatrixY[2][2];

    /// over Z
    let newZX =
      newYX * this.rotationMatrixZ[0][0] +
      newYY * this.rotationMatrixZ[0][1] +
      newYZ * this.rotationMatrixZ[0][2];

    let newZY =
      newYX * this.rotationMatrixZ[1][0] +
      newYY * this.rotationMatrixZ[1][1] +
      newYZ * this.rotationMatrixZ[1][2];

    let newZZ =
      newYX * this.rotationMatrixZ[2][0] +
      newYY * this.rotationMatrixZ[2][1] +
      newYZ * this.rotationMatrixZ[2][2];

    return [newZX, newZY, newZZ];
  }

  static get2DCordinate(a) {
    let projection_matrix = [
      [1, 0, 0],
      [0, 1, 0],
    ];

    let [x, y, z] = a;
    let newX =
      x * projection_matrix[0][0] +
      y * projection_matrix[0][1] +
      z * projection_matrix[0][2];
    let newY =
      x * projection_matrix[1][0] +
      y * projection_matrix[1][1] +
      z * projection_matrix[1][2];

    return [newX, newY];
  }

  drawPoint(x, y, label, color = 'white', size = 1) {
    if (color == null) {
      color = '#000';
    }
    if (size == null) {
      size = 5;
    }

    let radius = 0.5 * size;

    // to increase smoothing for numbers with decimal part
    // let centerX = canvas.width / 2;
    // let centerY = canvas.height / 2;

    let pointX = Math.round(x - radius) + this.center[0];
    let pointY = Math.round(y - radius) + this.center[1];

    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
    this.context.fill();

    if (label) {
      let textX = pointX;
      let textY = Math.round(pointY - size - 3);

      this.context.font = 'Italic 14px Arial';
      this.context.fillStyle = color;
      this.context.textAlign = 'center';
      this.context.fillText(label, textX, textY);
    }
  }
}
