export class Util {
  static conver_degrees_to_pi(deg) {
    return ((deg * 0.5) / 180) * Math.PI;
  }

  static conver_matrix_obj_to_array(matrix) {
    let result = [];
    for (let m of matrix) {
      result.push([m.x, m.y, m.z]);
    }
    return result;
  }

  static dot_product(vec_1, vec_2) {
    return vec_1.x * vec_2.x + vec_1.y * vec_2.y + vec_1.z * vec_2.z;
  }

  static cross_product(line1, line2) {
    let product = { x: 0, y: 0, z: 0 };

    product.x = line1.y * line2.z - line1.z * line2.y;
    product.y = line1.z * line2.x - line1.x * line2.z;
    product.z = line1.x * line2.y - line1.y * line2.x;

    return product;
  }

  static find_vector_magnitude(vector) {
    return Math.sqrt(this.dot_product(vector, vector));
  }

  static scale_matix(matrix, scale) {
    let matrix_translated = matrix;
    for (let i = 0; i < 3; i++) {
      matrix_translated[i].z = matrix[i].z + scale;
    }

    return matrix_translated;
  }

  static calculate_vector(vector, calculate_function) {
    for (let key in vector) {
      vector[key] = calculate_function(vector[key]);
    }
  }

  static vector_sub(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
  }

  static vector_add(v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
  }

  static vector_multiply(v1, k) {
    return { x: v1.x * k, y: v1.y * k, z: v1.z * k };
  }

  static vector_divide(v1, k) {
    return { x: v1.x / k, y: v1.y / k, z: v1.z / k };
  }

  static vector_normalise(vector) {
    let l = this.find_vector_magnitude(vector);
    return this.vector_divide(vector, l);
  }

  static get_item(array, index) {
    if (index >= array.length) {
      return array[index % array.length];
    } else if (index < 0) {
      return array[(index % array.length) + array.length];
    } else {
      return array[index];
    }
  }

  // rotation Z
  static matix_rotation_z(angle) {
    return [
      [Math.cos(angle), Math.sin(angle), 0, 0],
      [-Math.sin(angle), Math.cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
  }

  // rotation X
  static matix_rotation_x(angle) {
    return [
      [1, 0, 0, 0],
      [0, Math.cos(angle), Math.sin(angle), 0],
      [0, -Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 0, 1],
    ];
  }

  // rotation Y
  static matix_rotation_y(angle) {
    return [
      [Math.cos(angle), 0, Math.sin(angle), 0],
      [0, 1, 0, 0],
      [-Math.sin(angle), 0, Math.cos(angle), 0],
      [0, 0, 0, 1],
    ];
  }

  // matrix
  static multiply_matrixs(matrix_1, matrix_2) {
    let matrix = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ];

    // if (!Array.isArray(matrix_1[0]))
    //   matrix_1 = this.conver_matrix_obj_to_array(matrix_1);

    if (!Array.isArray(matrix_2[0]))
      matrix_2 = this.conver_matrix_obj_to_array(matrix_2);

    for (let i = 0; i < 3; i++) {
      this.multiply_matrix_vector(matrix_1[i], matrix[i], matrix_2);
    }

    return matrix;
  }

  static multiply_matrix_vector(vec1, vec2, matrix) {
    let i = 0;
    for (let key in vec2) {
      vec2[key] = this.multiply_vector(vec1, matrix, i);
      i++;
    }

    let w = this.multiply_vector(vec1, matrix, 3);

    if (w != 0) {
      this.calculate_vector(vec2, (v) => v / w);
    }
    return vec2;
  }

  static multiply_vector(vector, matrix, index) {
    if (vector === undefined) return;
    return (
      vector.x * matrix[0][index] +
      vector.y * matrix[1][index] +
      vector.z * matrix[2][index] +
      matrix[3][index]
    );
  }

  static matrix_point_at(pos_vec, target_vec, up_vec) {
    // calculate new forward direction
    let new_forward = this.vector_normalise(
      this.vector_sub(target_vec, pos_vec)
    );

    // calculate new up direction
    let a = this.vector_multiply(
      new_forward,
      this.dot_product(up_vec, new_forward)
    );

    let new_up = this.vector_normalise(this.vector_sub(up_vec, a));

    // new right direction
    let new_right = this.cross_product(new_up, new_forward);

    // construct dimensioning and translation matrix
    let matrix = [[], [], [], []];

    matrix[0][0] = new_right.x;
    matrix[1][0] = new_up.x;
    matrix[2][0] = new_forward.x;
    matrix[3][0] = pos_vec.x;

    matrix[0][1] = new_right.y;
    matrix[1][1] = new_up.y;
    matrix[2][1] = new_forward.y;
    matrix[3][1] = pos_vec.y;

    matrix[0][2] = new_right.z;
    matrix[1][2] = new_up.z;
    matrix[2][2] = new_forward.z;
    matrix[3][2] = pos_vec.z;

    matrix[0][3] = 0;
    matrix[1][3] = 0;
    matrix[2][3] = 0;
    matrix[3][3] = 1;

    return matrix;
  }

  static matrix_quick_inverse(m) {
    let matrix = [[], [], [], []];
    matrix[0][0] = m[0][0];
    matrix[0][1] = m[1][0];
    matrix[0][2] = m[2][0];
    matrix[0][3] = 0;
    matrix[1][0] = m[0][1];
    matrix[1][1] = m[1][1];
    matrix[1][2] = m[2][1];
    matrix[1][3] = 0;
    matrix[2][0] = m[0][2];
    matrix[2][1] = m[1][2];
    matrix[2][2] = m[2][2];
    matrix[2][3] = 0;
    matrix[3][0] = -(
      m[3][0] * matrix[0][0] +
      m[3][1] * matrix[1][0] +
      m[3][2] * matrix[2][0]
    );
    matrix[3][1] = -(
      m[3][0] * matrix[0][1] +
      m[3][1] * matrix[1][1] +
      m[3][2] * matrix[2][1]
    );
    matrix[3][2] = -(
      m[3][0] * matrix[0][2] +
      m[3][1] * matrix[1][2] +
      m[3][2] * matrix[2][2]
    );
    matrix[3][3] = 1;
    return matrix;
  }

  // clipping
  static vector_intersect_plane(plane_p, plane_n, line_start, line_end) {
    plane_n = this.vector_normalise(plane_n);
    let plane_d = -this.dot_product(plane_n, plane_p);
    let ad = this.dot_product(line_start, plane_n);
    let bd = this.dot_product(line_end, plane_n);
    let t = (-plane_d - ad) / (bd - ad);
    let line_start_to_end = this.vector_sub(line_end, line_start);
    let line_to_intersect = this.vector_multiply(line_start_to_end, t);
    return this.vector_add(line_start, line_to_intersect);
  }

  static triangle_clip_against_plane(plane_p, plane_n, in_tri) {
    // make sure plane normal is indeed normal
    plane_n = this.vector_normalise(plane_n);

    let inside_points = [];
    let outside_points = [];
    let n_inside_point_count = 0;
    let n_outside_point_count = 0;

    let d0 =
      this.dot_product(plane_n, in_tri[0]) - this.dot_product(plane_n, plane_p);
    let d1 =
      this.dot_product(plane_n, in_tri[1]) - this.dot_product(plane_n, plane_p);
    let d2 =
      this.dot_product(plane_n, in_tri[2]) - this.dot_product(plane_n, plane_p);

    if (d0 >= 0) inside_points[n_inside_point_count++] = in_tri[0];
    else outside_points[n_outside_point_count++] = in_tri[0];

    if (d1 >= 0) inside_points[n_inside_point_count++] = in_tri[1];
    else outside_points[n_outside_point_count++] = in_tri[1];

    if (d2 >= 0) inside_points[n_inside_point_count++] = in_tri[2];
    else outside_points[n_outside_point_count++] = in_tri[2];

    if (n_inside_point_count === 0) {
      return [];
    }

    if (n_inside_point_count === 3) {
      return [in_tri];
    }

    if (n_inside_point_count == 1 && n_outside_point_count == 2) {
      return [
        [
          inside_points[0],
          this.vector_intersect_plane(
            plane_p,
            plane_n,
            inside_points[0],
            outside_points[0]
          ),
          this.vector_intersect_plane(
            plane_p,
            plane_n,
            inside_points[0],
            outside_points[1]
          ),
        ],
      ];
    }

    if (n_inside_point_count == 2 && n_outside_point_count == 1) {
      return [
        [
          inside_points[0],
          inside_points[1],
          this.vector_intersect_plane(
            plane_p,
            plane_n,
            inside_points[0],
            outside_points[0]
          ),
        ],
        [
          inside_points[1],
          this.vector_intersect_plane(
            plane_p,
            plane_n,
            inside_points[0],
            outside_points[0]
          ),
          this.vector_intersect_plane(
            plane_p,
            plane_n,
            inside_points[1],
            outside_points[0]
          ),
        ],
      ];
    }
  }
}
