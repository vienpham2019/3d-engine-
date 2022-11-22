export class Util {
  static conver_degrees_to_pi(deg) {
    return ((deg * 0.5) / 180) * Math.PI;
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
    return Math.sqrt(
      vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
    );
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

  static vector_line(vec_1, vec_2) {
    let vec = { x: 0, y: 0, z: 0 };
    for (let key in vec) {
      vec[key] = vec_2[key] - vec_1[key];
    }
    return vec;
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

  // matrix
  static multiply_matrixs(vertices, matix_rotation) {
    let tri_rotation = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ];

    for (let i = 0; i < 3; i++) {
      this.multiply_matrix_vector(vertices[i], tri_rotation[i], matix_rotation);
    }

    return tri_rotation;
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
}
