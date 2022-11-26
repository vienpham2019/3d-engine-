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

  static draw_triangle({ tri_vectors, color, fill = false, stroke = true }) {
    tri_vectors.push(tri_vectors[0]);
    c.beginPath();
    c.moveTo(tri_vectors[0].x, tri_vectors[0].y);

    for (let vector of tri_vectors) {
      c.lineTo(vector.x, vector.y);
    }

    if (fill && !stroke) c.strokeStyle = color;
    else if (fill && stroke) c.strokeStyle = 'black';
    else c.strokeStyle = 'white';
    c.stroke();
    if (fill) {
      c.fillStyle = color;
      c.fill();
    }
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

  static texterd_triangle(x1, y1, u1, v1, x2, y2, u2, v2, x3, y3, u3, v3, tex) {
    if (y2 < y1) {
      [y1, y2] = Util.swap(y1, y2);
      [x1, x2] = Util.swap(x1, x2);
      [u1, u2] = Util.swap(u1, u2);
      [u1, u2] = Util.swap(v1, v2);
    }

    if (y3 < y1) {
      [y1, y3] = Util.swap(y1, y3);
      [x1, x3] = Util.swap(x1, x3);
      [u1, u3] = Util.swap(u1, u3);
      [v1, v3] = Util.swap(v1, v3);
    }

    if (y3 < y2) {
      [y2, y3] = Util.swap(y2, y3);
      [x2, x3] = Util.swap(x2, x3);
      [u2, u3] = Util.swap(u2, u3);
      [v2, v3] = Util.swap(v2, v3);
    }

    let dy1 = y2 - y1;
    let dx1 = x2 - x1;
    let du1 = u2 - u1;
    let dv1 = v2 - v1;

    let dy2 = y3 - y1;
    let dx2 = x3 - x1;
    let du2 = u3 - u1;
    let dv2 = v3 - v1;

    let dax_step = 0,
      dbx_step = 0,
      du1_step = 0,
      dv1_step = 0,
      du2_step = 0,
      dv2_step = 0;

    let tex_u, tex_v;

    if (!!dy1) dax_step = dx1 / Math.abs(dy1);
    if (!!dy2) dbx_step = dx2 / Math.abs(dy2);

    if (!!dy1) du1_step = du1 / Math.abs(dy1);
    if (!!dy1) dv1_step = dv1 / Math.abs(dy1);

    if (!!dy2) du2_step = du2 / Math.abs(dy2);
    if (!!dy2) dv2_step = dv2 / Math.abs(dy2);

    if (!!dy1) {
      for (let i = y1; i <= y2; i++) {
        let ax = x1 + (i - y1) * dax_step;
        let bx = x1 + (i - y1) * dbx_step;

        let tex_su = u1 + (i - y1) * du1_step;
        let tex_sv = v1 + (i - y1) * dv1_step;

        let tex_eu = u1 + (i - y1) * du2_step;
        let tex_ev = v1 + (i - y1) * dv2_step;

        if (ax > bx) {
          [ax, bx] = Util.swap(ax, bx);
          [tex_su, tex_eu] = Util.swap(tex_su, tex_eu);
          [tex_sv, tex_ev] = Util.swap(tex_sv, tex_ev);
        }

        // set to start location u,v for texture
        tex_u = tex_su;
        tex_v = tex_sv;

        // scan line
        let tstep = 1 / (bx - ax);
        let t = 0;
        let count = 255;
        for (let j = ax; j < bx; j++) {
          tex_u = (1 - t) * tex_su + t * tex_eu;
          tex_v = (1 - t) * tex_sv + t * tex_ev;

          c.fillStyle = this.rgb_to_hex(50, 168, count--);
          c.fillRect(Math.floor(j), Math.floor(i), 1, 1);

          t += tstep;
        }
      }

      dy1 = y3 - y2;
      dx1 = x3 - x2;
      dv1 = v3 - v2;
      du1 = u3 - u2;

      if (!!dy1) dax_step = dx1 / Math.abs(dy1);
      if (!!dy2) dbx_step = dx2 / Math.abs(dy2);

      du1_step = 0;
      dv1_step = 0;
      if (!!dy1) du1_step = du1 / Math.abs(dy1);
      if (!!dy1) dv1_step = dv1 / Math.abs(dy1);

      for (let i = y2; i <= y3; i++) {
        let ax = x2 + (i - y2) * dax_step;
        let bx = x1 + (i - y1) * dbx_step;

        let tex_su = u2 + (i - y2) * du1_step;
        let tex_sv = v2 + (i - y2) * dv1_step;

        let tex_eu = u1 + (i - y1) * du2_step;
        let tex_ev = v1 + (i - y1) * dv2_step;

        if (ax > bx) {
          [ax, bx] = Util.swap(ax, bx);
          [tex_su, tex_eu] = Util.swap(tex_su, tex_eu);
          [tex_sv, tex_ev] = Util.swap(tex_sv, tex_ev);
        }

        // set to start location u,v for texture
        tex_u = tex_su;
        tex_v = tex_sv;

        // scan line
        let tstep = 1 / (bx - ax);
        let t = 0;
        let count = 255;
        for (let j = ax; j < bx; j++) {
          tex_u = (1 - t) * tex_su + t * tex_eu;
          tex_v = (1 - t) * tex_sv + t * tex_ev;

          c.fillStyle = this.rgb_to_hex(50, 168, count--);
          c.fillRect(Math.floor(j), Math.floor(i), 1, 1);

          t += tstep;
        }
      }
    }
  }
}
