import { canvas, c } from './main.js';

export class ThreeD {
  fNear = 0.1;
  fFar = 10;
  fFov = 90;
  fAspectRatio = canvas.height / canvas.width;
  fFovRad = 1 / Math.tan(this.conver_degrees_to_pi(this.fFov));

  fTheta = { x: 0, y: 0, z: 0 };
  v_camera = { x: 0, y: 0, z: 0 };

  matProj() {
    return [
      [this.fAspectRatio * this.fFovRad, 0, 0, 0],
      [0, this.fFovRad, 0, 0],
      [0, 0, this.fFar / (this.fFar - this.fNear), 1],
      [0, 0, (-this.fFar * this.fNear) / (this.fFar - this.fNear), 0],
    ];
  }

  // rotation Z
  matix_rotation_z() {
    return [
      [Math.cos(this.fTheta.z), Math.sin(this.fTheta.z), 0, 0],
      [-Math.sin(this.fTheta.z), Math.cos(this.fTheta.z), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }

  // rotation X
  matix_rotation_x() {
    return [
      [1, 0, 0, 0],
      [0, Math.cos(this.fTheta.x), Math.sin(this.fTheta.x), 0],
      [0, -Math.sin(this.fTheta.x), Math.cos(this.fTheta.x), 0],
      [0, 0, 0, 1],
    ];
  }

  // rotation Y
  matix_rotation_y() {
    return [
      [Math.cos(this.fTheta.y), 0, Math.sin(this.fTheta.y), 0],
      [0, 1, 0, 0],
      [-Math.sin(this.fTheta.y), 0, Math.cos(this.fTheta.y), 0],
      [0, 0, 0, 1],
    ];
  }

  scale_matix(matrix, scale) {
    let matrix_translated = matrix;
    for (let i = 0; i < 3; i++) {
      matrix_translated[i].z = matrix[i].z + scale;
    }

    return matrix_translated;
  }

  multiply_matrixs(vertices, matix_rotation) {
    let tri_rotation = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ];

    for (let i = 0; i < 3; i++) {
      this.multiply_matrix_vector(vertices[i], tri_rotation[i], matix_rotation);
    }

    return tri_rotation;
  }

  multiply_matrix_vector(vec1, vec2, matrix) {
    let i = 0;
    for (let key in vec2) {
      vec2[key] = this.multiply_vector(vec1, matrix, i);
      i++;
    }

    let w = this.multiply_vector(vec1, matrix, 3);

    if (w != 0) {
      vec2.x /= w;
      vec2.y /= w;
      vec2.z /= w;
    }
    return vec2;
  }

  multiply_vector(vector, matrix, index) {
    return (
      vector.x * matrix[0][index] +
      vector.y * matrix[1][index] +
      vector.z * matrix[2][index] +
      matrix[3][index]
    );
  }

  vector_line(vec_1, vec_2) {
    let vec = { x: 0, y: 0, z: 0 };
    for (let key in vec) {
      vec[key] = vec_2[key] - vec_1[key];
    }
    return vec;
  }

  cross_product(line1, line2) {
    let product = { x: 0, y: 0, z: 0 };

    product.x = line1.y * line2.z - line1.z * line2.y;
    product.y = line1.z * line2.x - line1.x * line2.z;
    product.z = line1.x * line2.y - line1.y * line2.x;

    return product;
  }

  dot_product(vec_1, vec_2) {
    let result = 0;
    for (let key in vec_1) {
      result += vec_1[key] * vec_2[key];
    }
    return result;
  }

  conver_degrees_to_pi(deg) {
    return ((deg * 0.5) / 180) * Math.PI;
  }

  increase_brightness(hex, percent) {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
      hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

    return (
      '#' +
      (0 | ((1 << 8) + r + ((256 - r) * percent) / 100))
        .toString(16)
        .substr(1) +
      (0 | ((1 << 8) + g + ((256 - g) * percent) / 100))
        .toString(16)
        .substr(1) +
      (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
    );
  }

  draw_triangle(tri_vectors, color, fill = false) {
    tri_vectors.push(tri_vectors[0]);
    c.beginPath();
    c.moveTo(tri_vectors[0].x, tri_vectors[0].y);

    for (let vector of tri_vectors) {
      c.lineTo(vector.x, vector.y);
    }

    c.strokeStyle = color;
    c.stroke();
    if (fill) {
      c.fillStyle = color;
      c.fill();
    }
  }
}
