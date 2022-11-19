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

  drawFaces(matrixArray, rotate_vertices) {
    for (let i = 0; i < this.faces.length; i++) {
      let close_faces = [...this.faces[i], this.faces[i][0]];
      if (
        // this.faces[i].length < 3 ||
        this.cross_product(this.faces[i], rotate_vertices).z < 0
      ) {
        this.context.beginPath();
        this.context.moveTo(
          matrixArray[close_faces[0]][0] + this.center[0],
          matrixArray[close_faces[0]][1] + this.center[1]
        );
        for (let j = 0; j < close_faces.length; j++) {
          let vertice;
          if (j === close_faces.length - 1)
            vertice = [close_faces[j], close_faces[0]];
          else vertice = [close_faces[j], close_faces[j + 1]];

          this.context.lineTo(
            matrixArray[vertice[1]][0] + this.center[0],
            matrixArray[vertice[1]][1] + this.center[1]
          );
          this.context.strokeStyle = '#f1c232';
          this.context.stroke();
          // this.context.fillStyle = '#9498A6';
          // this.context.fill();
        }
      }
    }
  }

  cross_product(faceIndexs, rotate_vertices) {
    let [p1i, p2i, p3i] = faceIndexs;
    let line1 = { x: 0, y: 0, z: 0 };
    let line2 = { x: 0, y: 0, z: 0 };
    let normal = { x: 0, y: 0, z: 0 };

    line1.x = rotate_vertices[p2i][0] - rotate_vertices[p1i][0];
    line1.y = rotate_vertices[p2i][1] - rotate_vertices[p1i][1];
    line1.z = rotate_vertices[p2i][2] - rotate_vertices[p1i][2];

    line2.x = rotate_vertices[p3i][0] - rotate_vertices[p1i][0];
    line2.y = rotate_vertices[p3i][1] - rotate_vertices[p1i][1];
    line2.z = rotate_vertices[p3i][2] - rotate_vertices[p1i][2];

    normal.x = line1.y * line2.z - line1.z * line2.y;
    normal.y = line1.z * line2.x - line1.x * line2.z;
    normal.z = line1.x * line2.y - line1.y * line2.x;

    let l = Math.sqrt(
      normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
    );

    normal.x /= l;
    normal.y /= l;
    normal.z /= l;

    return normal;
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
