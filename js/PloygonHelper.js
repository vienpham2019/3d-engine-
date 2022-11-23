import { c } from './main.js';
import { Util } from './Util.js';

export class PolygonHelper {
  static triangulate(input_vertices, input_faces) {
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

        let va_to_vb = Util.vector_sub(vb, va);
        let va_to_vc = Util.vector_sub(vc, va);

        // Is ear test vertext is cenvex ?
        if (Util.cross_product(va_to_vb, va_to_vc) < 0) {
          continue;
        }

        triangles[triangle_index_count++] = [a, b, c];

        input_faces.splice(i, 1);
        break;
      }
    }

    triangles[triangle_index_count++] = [
      input_faces[0],
      input_faces[1],
      input_faces[2],
    ];

    return triangles;
  }

  static is_point_in_triangle(p, a, b, c) {
    let ab = Util.vector_sub(b, a);
    let bc = Util.vector_sub(c, b);
    let ca = Util.vector_sub(a, c);

    let ap = Util.vector_sub(p, a);
    let bp = Util.vector_sub(p, b);
    let cp = Util.vector_sub(p, c);

    let cross1 = Util.cross_product(ab, ap);
    let cross2 = Util.cross_product(bc, bp);
    let cross3 = Util.cross_product(ca, cp);

    return !(cross1 > 0 || cross2 > 0 || cross3 > 0);
  }

  static draw_triangle(tri_vectors, color, fill = false) {
    tri_vectors.push(tri_vectors[0]);
    c.beginPath();
    c.moveTo(tri_vectors[0].x, tri_vectors[0].y);

    for (let vector of tri_vectors) {
      c.lineTo(vector.x, vector.y);
    }

    // c.strokeStyle = color;
    c.strokeStyle = 'black';
    c.stroke();
    if (fill) {
      c.fillStyle = color;
      c.fill();
    }
  }

  static increase_brightness(hex, percent) {
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
}
