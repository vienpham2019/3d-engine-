import { canvas } from './main.js';
import { PolygonHelper } from './PloygonHelper.js';
import { Util } from './Util.js';

export class ThreeD {
  fNear = 0.1;
  fFar = 10;
  fFov = 90;
  fAspectRatio = canvas.height / canvas.width;
  fFovRad = 1 / Math.tan(Util.conver_degrees_to_pi(this.fFov));

  fTheta = { x: 0, y: 0, z: 0 };
  v_camera = { x: 0, y: 0, z: 0 };

  vertices = [];
  faces = [];

  size = 7;

  setSize(s) {
    this.size += s;
  }

  set_rotation_angle(angle_function) {
    angle_function(this.fTheta);
  }

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

  draw() {
    let vec_triangles_to_raster = [];

    for (let i = 0; i < this.faces.length; i++) {
      let [p1, p2, p3] = this.faces[i];

      let tri_rotation_z = Util.multiply_matrixs(
        [this.vertices[p1], this.vertices[p2], this.vertices[p3]],
        this.matix_rotation_z()
      );

      let tri_rotation_x = Util.multiply_matrixs(
        tri_rotation_z,
        this.matix_rotation_x()
      );

      let tri_rotation_y = Util.multiply_matrixs(
        tri_rotation_x,
        this.matix_rotation_y()
      );

      // Offset into the screen
      let tri_translated = Util.scale_matix(tri_rotation_y, this.size);

      let line1 = Util.vector_line(tri_translated[0], tri_translated[1]);
      let line2 = Util.vector_line(tri_translated[0], tri_translated[2]);
      let normal = Util.vector_normalise(Util.cross_product(line1, line2));

      if (
        Util.dot_product(
          normal,
          Util.vector_line(this.v_camera, tri_translated[0])
        ) > 0
      ) {
        // Illumination
        let light_direction = Util.vector_normalise({ x: 0, y: 0, z: -1 });

        let dp = Util.dot_product(normal, light_direction);

        let color = PolygonHelper.increase_brightness(
          '#21577a',
          (Math.abs(dp) / 1) * 100
        );

        // project triangle from 3d to 2d
        let tri_projected = Util.multiply_matrixs(
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

        vec_triangles_to_raster.push({ tri: tri_projected, color });
      }
    }

    vec_triangles_to_raster.sort((t1, t2) => {
      let z1 = (t1.tri[0].z + t1.tri[1].z + t1.tri[2].z) / 3.0;
      let z2 = (t2.tri[0].z + t2.tri[1].z + t2.tri[2].z) / 3.0;

      return z2 - z1;
    });

    for (let triangle of vec_triangles_to_raster) {
      PolygonHelper.draw_triangle(triangle.tri, triangle.color, true);
    }
  }
}
