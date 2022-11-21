import { canvas, c } from './main.js';
import { ThreeD } from './ThreeD.js';

export class Rectangle2 extends ThreeD {
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

  draw() {
    this.fTheta.x += 0.01;
    this.fTheta.y += 0.01;
    this.fTheta.z += 0.01;

    for (let i = 0; i < this.faces.length; i++) {
      let [p1, p2, p3] = this.faces[i];

      let tri_rotation_z = this.multiply_matrixs(
        [this.vertices[p1], this.vertices[p2], this.vertices[p3]],
        this.matix_rotation_z()
      );

      let tri_rotation_x = this.multiply_matrixs(
        tri_rotation_z,
        this.matix_rotation_x()
      );

      let tri_rotation_y = this.multiply_matrixs(
        tri_rotation_x,
        this.matix_rotation_y()
      );

      // Offset into the screen
      let tri_translated = this.scale_matix(tri_rotation_y, 3.0);

      let line1 = this.vector_line(tri_translated[0], tri_translated[1]);
      let line2 = this.vector_line(tri_translated[0], tri_translated[2]);
      let normal = this.cross_product(line1, line2);

      let nl = Math.sqrt(
        normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
      );

      normal.x /= nl;
      normal.y /= nl;
      normal.z /= nl;

      if (
        this.dot_product(
          normal,
          this.vector_line(this.v_camera, tri_translated[0])
        ) > 0
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

        let dp = this.dot_product(normal, light_direction);

        let color = this.increase_brightness(
          '#21577a',
          (Math.abs(dp) / 1) * 100
        );

        // project triangle from 3d to 2d
        let tri_projected = this.multiply_matrixs(
          tri_translated,
          this.matProj()
        );

        // scale into view
        for (let i = 0; i < 3; i++) {
          tri_projected[i].x += 1.0;
          tri_projected[i].y += 1.0;
          tri_projected[i].x *= 0.5 * canvas.width;
          tri_projected[i].y *= 0.5 * canvas.height;
        }

        // draw triangle
        this.draw_triangle(tri_projected, color, true);
      }
    }
  }
}
