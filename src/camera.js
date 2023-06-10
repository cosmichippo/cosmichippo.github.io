import * as THREE from 'three';

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.5;
const far = 25;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

export default camera;