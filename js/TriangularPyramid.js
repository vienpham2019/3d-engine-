import { ThreeD } from './ThreeD.js';
import { PolygonHelper } from './PloygonHelper.js';
import { Util } from './Util.js';

export class TriangularPyramid extends ThreeD {
  constructor(np = 3) {
    super();
    this.init(np);
  }

  init(np) {
    let { polygon_vertices, polygon_faces } =
      PolygonHelper.generate_polygon(np);
    this.vertices = [...polygon_vertices];
    polygon_faces.push(1);
    for (let f = 1; f < polygon_faces.length - 1; f++) {
      this.faces.push([polygon_faces[f], 0, polygon_faces[f + 1]]);
    }

    polygon_faces.pop();

    this.faces.push(...PolygonHelper.triangulate(this.vertices, polygon_faces));

    for (let f of this.faces) {
      this.mesh_cube.push({
        vertices_tri: Util.multiply_matrixs(
          [
            { ...this.vertices[f[0]], w: 1 },
            { ...this.vertices[f[1]], w: 1 },
            { ...this.vertices[f[2]], w: 1 },
          ],
          Util.matix_rotation_x(Util.degrees_to_radians(90))
        ),
      });
    }
  }
}
