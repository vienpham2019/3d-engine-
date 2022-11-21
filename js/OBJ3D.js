import { canvas, c } from './main.js';
import { ThreeD } from './ThreeD.js';
import { Util } from './Util.js';
export class OBJ3D extends ThreeD {
  constructor(file) {
    super();
    this.init(file);
  }

  setSize(s) {}

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

        this.vertices.push({ x: vertice[0], y: vertice[1], z: vertice[2] });
      } else if (text.indexOf('f ') === 0) {
        let face = text
          .replace('f', '')
          .trim()
          .split(' ')
          .map((f) => parseInt(f.split('/')[0]) - 1);
        temp_faces.push(face);
        // if (face.length > 3) {
        //   console.log(this.triangulate(this.vertices, face));
        // } else {
        //   this.faces.push(face);
        // }
      }
    }

    for (let face of temp_faces) {
      if (face.length > 3) {
        this.faces.push(...this.triangulate(this.vertices, face));
      } else {
        this.faces.push(face);
      }
    }
  }

  conver_to_tri(p) {
    let n = 0;
    let triangles = [];
    for (let i = 3; i < p.length; i++) {
      triangles[n++] = [p[i - 3], p[i - 1], p[i]];
    }

    return triangles;
  }

  triangulate(input_vertices, input_faces) {
    let count = 0;
    let triangles = [];
    let triangle_index_count = 0;
    while (input_faces.length > 3 && count++ < 1000) {
      // console.log(input_faces.length);
      for (let i = 0; i < input_faces.length; i++) {
        let a = input_faces[i];
        let b = Util.get_item(input_faces, i + 1);
        let c = Util.get_item(input_faces, i - 1);

        let va = input_vertices[a];
        let vb = input_vertices[b];
        let vc = input_vertices[c];

        let va_to_vb = Util.vector_line(va, vb);
        let va_to_vc = Util.vector_line(va, vc);

        // Is ear test vertext is cenvex ?
        if (Util.cross_product(va_to_vb, va_to_vc) < 0) {
          continue;
        }

        // Does test ear contain any polygon input_vertices?
        let is_ear = true;

        if (is_ear) {
          triangles[triangle_index_count++] = [a, b, c];

          input_faces.splice(i, 1);
          break;
        }
      }
    }
    triangles[triangle_index_count++] = [
      input_faces[0],
      input_faces[1],
      input_faces[2],
    ];

    return triangles;
  }

  is_point_in_triangle(p, a, b, c) {
    let ab = Util.vector_line(a, b);
    let bc = Util.vector_line(b, c);
    let ca = Util.vector_line(c, a);

    let ap = Util.vector_line(a, p);
    let bp = Util.vector_line(b, p);
    let cp = Util.vector_line(c, p);

    let cross1 = Util.cross_product(ab, ap);
    let cross2 = Util.cross_product(bc, bp);
    let cross3 = Util.cross_product(ca, cp);

    return !(cross1 > 0 || cross2 > 0 || cross3 > 0);
  }
}
