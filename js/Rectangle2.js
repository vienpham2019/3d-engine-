import { canvas, c } from './main.js';

export class Rectangle2 {
  vertices = [
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },

    { x: 0, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 0, y: 0, z: 1 },
  ];

  // rule bl tl tr bl
  faces = [
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

  fNear = 0.1;
  fFar = 10;
  fFov = 90;
  fAspectRatio = canvas.height / canvas.width;
  fFovRad = 1 / Math.tan(this.conver_degrees_to_pi(this.fFov));

  matProj = [
    [this.fAspectRatio * this.fFovRad, 0, 0, 0],
    [0, this.fFovRad, 0, 0],
    [0, 0, this.fFar / (this.fFar - this.fNear), 1],
    [0, 0, (-this.fFar * this.fNear) / (this.fFar - this.fNear), 0],
  ];

  fTheta = { x: 0, y: 0, z: 0 };
  v_camera = { x: 0, y: 0, z: 0 };

  conver_degrees_to_pi(deg) {
    return ((deg * 0.5) / 180) * Math.PI;
  }

  multiply_matrix_vector(vec1, vec2, matrix) {
    vec2.x =
      vec1.x * matrix[0][0] +
      vec1.y * matrix[1][0] +
      vec1.z * matrix[2][0] +
      matrix[3][0];
    vec2.y =
      vec1.x * matrix[0][1] +
      vec1.y * matrix[1][1] +
      vec1.z * matrix[2][1] +
      matrix[3][1];
    vec2.z =
      vec1.x * matrix[0][2] +
      vec1.y * matrix[1][2] +
      vec1.z * matrix[2][2] +
      matrix[3][2];

    let w =
      vec1.x * matrix[0][3] +
      vec1.y * matrix[1][3] +
      vec1.z * matrix[2][3] +
      matrix[3][3];

    if (w != 0) {
      vec2.x /= w;
      vec2.y /= w;
      vec2.z /= w;
    }
    return vec2;
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

  draw() {
    // this.fTheta.x += 0.015;
    this.fTheta.y += 0.015;
    // this.fTheta.z += 0.015;

    // rotation Z
    let matRotZ = [
      [Math.cos(this.fTheta.z), Math.sin(this.fTheta.z), 0, 0],
      [-Math.sin(this.fTheta.z), Math.cos(this.fTheta.z), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    // rotation X
    let matRotX = [
      [1, 0, 0, 0],
      [0, Math.cos(this.fTheta.x), Math.sin(this.fTheta.x), 0],
      [0, -Math.sin(this.fTheta.x), Math.cos(this.fTheta.x), 0],
      [0, 0, 0, 1],
    ];

    // rotation Y
    let matRotY = [
      [Math.cos(this.fTheta.y), 0, Math.sin(this.fTheta.y), 0],
      [0, 1, 0, 0],
      [-Math.sin(this.fTheta.y), 0, Math.cos(this.fTheta.y), 0],
      [0, 0, 0, 1],
    ];

    for (let i = 0; i < this.faces.length; i++) {
      let [p1, p2, p3] = this.faces[i];

      let tri_rotation_z = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ];

      let tri_rotation_x = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ];

      let tri_rotation_y = [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
        { x: 0, y: 0, z: 0 },
      ];

      this.multiply_matrix_vector(
        this.vertices[p1],
        tri_rotation_z[0],
        matRotZ
      );
      this.multiply_matrix_vector(
        this.vertices[p2],
        tri_rotation_z[1],
        matRotZ
      );
      this.multiply_matrix_vector(
        this.vertices[p3],
        tri_rotation_z[2],
        matRotZ
      );

      // rotation x
      this.multiply_matrix_vector(
        tri_rotation_z[0],
        tri_rotation_x[0],
        matRotX
      );
      this.multiply_matrix_vector(
        tri_rotation_z[1],
        tri_rotation_x[1],
        matRotX
      );
      this.multiply_matrix_vector(
        tri_rotation_z[2],
        tri_rotation_x[2],
        matRotX
      );

      // rotation y
      this.multiply_matrix_vector(
        tri_rotation_x[0],
        tri_rotation_y[0],
        matRotY
      );
      this.multiply_matrix_vector(
        tri_rotation_x[1],
        tri_rotation_y[1],
        matRotY
      );
      this.multiply_matrix_vector(
        tri_rotation_x[2],
        tri_rotation_y[2],
        matRotY
      );

      // Offset into the screen
      let tri_translated = tri_rotation_y;
      tri_translated[0].z = tri_rotation_y[0].z + 3.0;
      tri_translated[1].z = tri_rotation_y[1].z + 3.0;
      tri_translated[2].z = tri_rotation_y[2].z + 3.0;

      let normal = { x: 0, y: 0, z: 0 };
      let line1 = { x: 0, y: 0, z: 0 };
      let line2 = { x: 0, y: 0, z: 0 };

      line1.x = tri_translated[1].x - tri_translated[0].x;
      line1.y = tri_translated[1].y - tri_translated[0].y;
      line1.z = tri_translated[1].z - tri_translated[0].z;

      line2.x = tri_translated[2].x - tri_translated[0].x;
      line2.y = tri_translated[2].y - tri_translated[0].y;
      line2.z = tri_translated[2].z - tri_translated[0].z;

      normal.x = line1.y * line2.z - line1.z * line2.y;
      normal.y = line1.z * line2.x - line1.x * line2.z;
      normal.z = line1.x * line2.y - line1.y * line2.x;

      let nl = Math.sqrt(
        normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
      );

      normal.x /= nl;
      normal.y /= nl;
      normal.z /= nl;

      if (
        normal.x * (tri_translated[0].x - this.v_camera.x) +
          normal.y * (tri_translated[0].y - this.v_camera.y) +
          normal.z * (tri_translated[0].z - this.v_camera.z) >
        0
      ) {
        // Illumination
        let light_direction = { x: 0, y: 0, z: -1 };
        let ll = Math.sqrt(
          light_direction.x * light_direction.x +
            light_direction.y * light_direction.y +
            light_direction.z * light_direction.z
        );

        light_direction.x /= ll;
        light_direction.y /= ll;
        light_direction.z /= ll;

        let dp =
          normal.x * light_direction.x +
          normal.y * light_direction.y +
          normal.z * light_direction.z;

        let color = this.increase_brightness(
          '#21577a',
          (Math.abs(dp) / 1) * 100
        );

        // project triangle from 3d to 2d
        let tri_projected = [
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
        ];

        this.multiply_matrix_vector(
          tri_translated[0],
          tri_projected[0],
          this.matProj
        );
        this.multiply_matrix_vector(
          tri_translated[1],
          tri_projected[1],
          this.matProj
        );
        this.multiply_matrix_vector(
          tri_translated[2],
          tri_projected[2],
          this.matProj
        );

        // scale into view
        tri_projected[0].x += 1.0;
        tri_projected[0].y += 1.0;
        tri_projected[1].x += 1.0;
        tri_projected[1].y += 1.0;
        tri_projected[2].x += 1.0;
        tri_projected[2].y += 1.0;

        tri_projected[0].x *= 0.5 * canvas.width;
        tri_projected[0].y *= 0.5 * canvas.height;
        tri_projected[1].x *= 0.5 * canvas.width;
        tri_projected[1].y *= 0.5 * canvas.height;
        tri_projected[2].x *= 0.5 * canvas.width;
        tri_projected[2].y *= 0.5 * canvas.height;

        // draw triangle
        c.beginPath();
        c.moveTo(tri_projected[0].x, tri_projected[0].y);
        c.lineTo(tri_projected[1].x, tri_projected[1].y);
        c.lineTo(tri_projected[2].x, tri_projected[2].y);
        c.lineTo(tri_projected[0].x, tri_projected[0].y);
        // c.strokeStyle = '#f1c232';
        // c.stroke();
        c.strokeStyle = color;
        c.stroke();
        c.fillStyle = color;
        c.fill();
      }
    }
  }
}
