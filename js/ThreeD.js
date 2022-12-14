import { canvas, c } from './main.js';
import { PolygonHelper } from './PloygonHelper.js';
import { Util } from './Util.js';

export class ThreeD {
  fNear = 0.1;
  fFar = 10;
  fFov = 90;
  fAspectRatio = canvas.height / canvas.width;
  fFovRad = 1 / Math.tan(Util.conver_degrees_to_pi(this.fFov));

  fTheta = { x: 0, y: 0, z: 0 };
  v_camera = { x: 0, y: 0, z: 1 };
  v_look_dir = { x: 0, y: 0, z: 1 };

  fYaw = 0;

  vertices = [];
  faces = [];

  mesh_cube = [];

  draw_faces = true;
  draw_stroke = false;

  size = 7;

  color = '#08004f';

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

  draw() {
    let vec_triangles_to_raster = [];

    let v_up = { x: 0, y: 1, z: 0 };
    let v_target = { x: 0, y: 0, z: 1 };
    this.v_look_dir.x = Util.multiply_vector(
      v_target,
      Util.matix_rotation_y(this.fYaw),
      0
    );
    this.v_look_dir.y = Util.multiply_vector(
      v_target,
      Util.matix_rotation_y(this.fYaw),
      1
    );
    this.v_look_dir.z = Util.multiply_vector(
      v_target,
      Util.matix_rotation_y(this.fYaw),
      2
    );

    v_target = Util.vector_add(this.v_camera, this.v_look_dir);
    let mat_camera = Util.matrix_point_at(this.v_camera, v_target, v_up);

    // make view matrix from camera
    let mat_view = Util.matrix_quick_inverse(mat_camera);

    for (let mesh of this.mesh_cube) {
      let [p1, p2, p3] = mesh.vertices_tri;
      let tri_viewed;

      let tri_rotation_z = Util.multiply_matrixs(
        [p1, p2, p3],
        Util.matix_rotation_z(this.fTheta.z)
      );

      let tri_rotation_x = Util.multiply_matrixs(
        tri_rotation_z,
        Util.matix_rotation_x(this.fTheta.x)
      );

      let tri_rotation_y = Util.multiply_matrixs(
        tri_rotation_x,
        Util.matix_rotation_y(this.fTheta.y)
      );

      // Offset into the screen
      let tri_translated = {};
      tri_translated.vertices_tri = Util.scale_matix(tri_rotation_y, this.size);

      let line1 = Util.vector_sub(
        tri_translated.vertices_tri[1],
        tri_translated.vertices_tri[0]
      );
      let line2 = Util.vector_sub(
        tri_translated.vertices_tri[2],
        tri_translated.vertices_tri[0]
      );

      let normal = Util.vector_normalise(Util.cross_product(line1, line2));

      if (
        Util.dot_product(
          normal,
          Util.vector_sub(tri_translated.vertices_tri[0], this.v_camera)
        ) > 0
      ) {
        // Illumination
        let light_direction = Util.vector_normalise({ x: 0, y: 0, z: -1 });

        let dp = Util.dot_product(normal, light_direction);

        tri_viewed = {};
        tri_viewed.vertices_tri = Util.multiply_matrixs(
          tri_translated.vertices_tri,
          mat_view
        );

        let clipped = Util.triangle_clip_against_plane(
          { x: 0, y: 0, z: 0.1 },
          { x: 0, y: 0, z: 1 },
          tri_viewed
        );

        for (let tri of clipped) {
          // project triangle from 3d to 2d
          let tri_projected = {};
          tri_projected.vertices_tri = Util.multiply_matrixs(
            tri.vertices_tri,
            this.matProj()
          );

          for (let i = 0; i < 3; i++) {
            tri_projected.vertices_tri[i] = Util.vector_divide(
              tri_projected.vertices_tri[i],
              tri_projected.vertices_tri[i].w
            );
          }

          // scale into view
          for (let i = 0; i < 3; i++) {
            tri_projected.vertices_tri[i].x *= -1;
            tri_projected.vertices_tri[i].y *= -1;
            tri_projected.vertices_tri[i].x += 1.0;
            tri_projected.vertices_tri[i].y += 1.0;
            tri_projected.vertices_tri[i].x *= 0.5 * canvas.width;
            tri_projected.vertices_tri[i].y *= 0.5 * canvas.height;
          }

          vec_triangles_to_raster.push({
            tri: tri_projected,
            alpha: Math.abs(dp),
          });
        }
      }
    }

    vec_triangles_to_raster.sort((t1, t2) => {
      let z1 =
        (t1.tri.vertices_tri[0].z +
          t1.tri.vertices_tri[1].z +
          t1.tri.vertices_tri[2].z) /
        3.0;
      let z2 =
        (t2.tri.vertices_tri[0].z +
          t2.tri.vertices_tri[1].z +
          t2.tri.vertices_tri[2].z) /
        3.0;

      return z2 - z1;
    });

    for (let triangle of vec_triangles_to_raster) {
      let list_triangles = [];
      list_triangles[list_triangles.length] = triangle;

      let n_new_triangles = 1;

      // check 4 face
      for (let p = 0; p < 4; p++) {
        let tri_to_adds = [];
        while (n_new_triangles > 0) {
          // take the first triangle of the queue
          let test_tri = list_triangles.shift();
          n_new_triangles--;

          switch (p) {
            case 0:
              tri_to_adds = Util.triangle_clip_against_plane(
                { x: 0, y: 0, z: 0 },
                { x: 0, y: 1, z: 0 },
                test_tri.tri
              );
              break;
            case 1:
              tri_to_adds = Util.triangle_clip_against_plane(
                { x: 0, y: canvas.height - 1, z: 0 },
                { x: 0, y: -1, z: 0 },
                test_tri.tri
              );
              break;
            case 2:
              tri_to_adds = Util.triangle_clip_against_plane(
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 0, z: 0 },
                test_tri.tri
              );
              break;
            case 3:
              tri_to_adds = Util.triangle_clip_against_plane(
                { x: canvas.width - 1, y: 0, z: 0 },
                { x: -1, y: 0, z: 0 },
                test_tri.tri
              );
              break;
          }

          for (let tri_to_add of tri_to_adds) {
            list_triangles.push({
              tri: tri_to_add,
              alpha: triangle.alpha,
            });
          }
        }
        n_new_triangles = list_triangles.length;
      }

      for (let tri of list_triangles) {
        PolygonHelper.draw_triangle({
          tri_vectors: tri.tri.vertices_tri,
          color: PolygonHelper.lighten(this.color, tri.alpha),
          fill: this.draw_faces,
          stroke: this.draw_stroke,
        });
      }
    }
  }
}
