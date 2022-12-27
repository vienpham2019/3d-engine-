import { PolygonHelper } from './PloygonHelper.js';
import { ThreeD } from './ThreeD.js';
import { Util } from './Util.js';

export class OBJ3D extends ThreeD {
  constructor(file) {
    super();
    this.init(file);
    for (let f of this.faces) {
      this.mesh_cube.push({
        vertices_tri: Util.multiply_matrixs(
          [
            { ...this.vertices[f[0]], w: 1 },
            { ...this.vertices[f[1]], w: 1 },
            { ...this.vertices[f[2]], w: 1 },
          ],
          Util.matix_rotation_x(Util.degrees_to_radians(180))
        ),
      });
    }
  }

  init(file) {
    let fileContentArray = file.split(/\r\n|\n/);
    let temp_faces = [];
    for (let text of fileContentArray) {
      text = text.trim();
      if (text.indexOf('v ') === 0) {
        let vertice = text
          .replace('v', '')
          .trim()
          .split(' ')
          .map((nt) => parseFloat(nt) * -1);

        this.vertices.push({
          x: vertice[0],
          y: vertice[1],
          z: vertice[2],
        });
      } else if (text.indexOf('f ') === 0) {
        let face = text
          .replace('f', '')
          .trim()
          .split(' ')
          .map((f) => {
            let face_value;
            if (f.includes('/')) {
              face_value = f.split('/')[0];
            } else {
              face_value = f.split(' ')[0];
            }
            return parseInt(face_value) - 1;
          });
        temp_faces.push(face);
      }
    }

    for (let face of temp_faces) {
      if (face.length > 3) {
        this.faces.push(...PolygonHelper.triangulate(this.vertices, face));
      } else if (face.length === 3) {
        this.faces.push(face);
      }
    }
  }
}
