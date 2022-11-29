import { c, canvas } from './main.js';
import { Util } from './Util.js';

export class PolygonHelper {
  static triangulate(input_vertices, input_faces) {
    let count = 0;
    let triangles = [];
    let triangle_index_count = 0;
    while (input_faces.length > 3 && count++ < 1000) {
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

  static generate_polygon(np = 3) {
    if (np < 3) np = 3;
    else if (np > 100) np = 100;
    else np = np;

    let angle = (2 * Math.PI) / np;
    let pyShift = Math.PI / 2;
    let radius = 1;

    let polygon_vertices = [{ x: radius, y: 0, z: -1 }];
    let polygon_faces = [];

    for (let m = 0; m <= np; m++) {
      let newAngle = m * angle + pyShift;
      let x_val = radius * Math.cos(newAngle);
      let y_val = radius * Math.sin(newAngle);
      polygon_vertices.push({ x: x_val + radius, y: y_val, z: 0 });
      polygon_faces.push(m);
    }

    return {
      polygon_vertices,
      polygon_faces,
    };
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

  static draw_triangle({ tri_vectors, color, fill = false, stroke = true }) {
    c.beginPath();
    c.moveTo(tri_vectors[0].x, tri_vectors[0].y);
    c.lineTo(tri_vectors[1].x, tri_vectors[1].y);
    c.lineTo(tri_vectors[2].x, tri_vectors[2].y);
    c.lineTo(tri_vectors[0].x, tri_vectors[0].y);

    c.strokeStyle = color;
    c.fillStyle = color;

    if (fill) {
      c.fill();
    }
    if (stroke || !fill) c.strokeStyle = 'black';

    c.stroke();
  }

  static hex_to_rgb(hex) {
    return hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m, r, g, b) => '#' + r + r + g + g + b + b
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x) => parseInt(x, 16));
  }

  static rgb_to_hex(r, g, b) {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  static lighten(color, luminosity) {
    // validate hex string
    color = new String(color).replace(/[^0-9a-f]/gi, '');
    if (color.length < 6) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    luminosity = luminosity || 0;

    // convert to decimal and change luminosity
    var newColor = '#',
      c,
      i,
      black = 0,
      white = 255;
    for (i = 0; i < 3; i++) {
      c = parseInt(color.substr(i * 2, 2), 16);
      c = Math.round(
        Math.min(Math.max(black, c + luminosity * white), white)
      ).toString(16);
      newColor += ('00' + c).substr(c.length);
    }
    return newColor;
  }
}
