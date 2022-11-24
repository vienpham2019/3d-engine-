import { ThreeD } from './ThreeD.js';

export class Rectangle extends ThreeD {
  vertices = [
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },

    { x: 0, y: 1, z: 1 },
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 0, y: 0, z: 1 },
  ];

  // rule bl tl tr bl
  faces = [
    [0, 3, 2],
    [0, 2, 1],
    //
    [1, 2, 6],
    [1, 6, 5],
    //
    [5, 6, 7],
    [5, 7, 4],
    //
    [4, 7, 3],
    [4, 3, 0],
    //
    [3, 7, 6],
    [3, 6, 2],
    //
    [4, 0, 1],
    [4, 1, 5],
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
