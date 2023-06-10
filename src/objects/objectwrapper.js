import { MeshPhongMaterial, Mesh } from "three";

function makeInstance(geometry, color, scene) {
    const material = new MeshPhongMaterial({color});
  
    const cube = new Mesh(geometry, material);
    scene.add(cube);
  
    cube.position.x = x;
  
    return cube;
  }

export {makeInstance};