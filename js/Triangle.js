import { ThreeD } from './ThreeD.js';
export class Triangle extends ThreeD {
  vertices = [
    { x: 0.5, y: 1, z: 0.5 }, // 0
    { x: 1, y: 0, z: 0 }, // 1
    { x: 0, y: 0, z: 0 }, // 2
    { x: 1, y: 0, z: 1 }, // 3
    { x: 0, y: 0, z: 1 }, // 4
  ];

  // rule bl tl tr bl
  faces = [
    [0, 2, 1],
    [0, 1, 3],
    [0, 3, 4],
    [0, 4, 2],
    [2, 4, 3],
    [2, 3, 1],
  ];

  constructor() {
    super();

    for (let f of this.faces) {
      this.mesh_cube.push({
        vertices_tri: [
          { ...this.vertices[f[0]], w: 1 },
          { ...this.vertices[f[1]], w: 1 },
          { ...this.vertices[f[2]], w: 1 },
        ],
      });
    }
  }
}
