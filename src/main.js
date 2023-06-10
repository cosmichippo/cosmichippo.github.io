import * as THREE from 'three';
//import {makeInstance} from "./objects/objectwrapper.js";
import { resizeRendererToDisplaySize } from './context.js';
import camera from './camera.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {canvas, renderer} from './context.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const texture = loader.load('./src/textures/background.webp', () =>{
	const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	scene.background = rt.texture;
});

//console.log(camera.matrix);

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const planeGeometry = new THREE.BoxGeometry(10, 0.001, 10);
//planeGeometry.rotateX(-Math.PI/2);
planeGeometry.translate(0,-1,0);

//const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
const material = new THREE.MeshPhongMaterial({color: 0x044aa88});

const t = loader.load('./src/textures/grass.png');
t.wrapS = THREE.RepeatWrapping;
t.wrapT = THREE.RepeatWrapping;
t.minFilter = THREE.NearestFilter;
t.repeat.set(5,5);
const planeMaterial = new THREE.MeshPhongMaterial({
	map: t,
});



const cube = new THREE.Mesh(geometry, material);
cube.castShadow=true;
scene.add(cube);

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);

const color = 0x00FFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.castShadow = true;
let angle = 90;
light.position.set(-1, 7, 4);
light.target.position.set(0,-2,0);
scene.add(light);

const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);

function updateLight() {
	light.target.updateMatrixWorld();
	helper.update();
  }
updateLight();

const ambientColor = 0xFFFFFF;
const ambientIntensity = 0.3;
const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
ambientLight.position.set(5,0,-5);
scene.add(ambientLight);


{
	const objLoader = new OBJLoader();
	const mtlLoader = new MTLLoader();
	mtlLoader.load('./src/objects/Lowpoly_tree_sample.mtl', (mtl) => {
	  	mtl.preload();
	  	objLoader.setMaterials(mtl);
		objLoader.load('./src/objects/Lowpoly_tree_sample.obj', (root) => {
		root.scale.setScalar(0.25);
		let test = root.clone();
		//test.castShadow = true;
		test.traverse(function(child) {
			child.castShadow = true;
		});
		root.traverse(function(child) {
			child.castShadow = true;
		});

		root.castShadow = true;
		test.translateX(5.0);
		scene.add(test);
	 	scene.add(root);
		});
	});
}


const controls = new OrbitControls(camera, canvas);
//controls.lookAt(0.0, 0.0, -1.0);
camera.position.z = 2;
//controls.update();


function render(time){
	time *= 0.001;
	console.log(time, Math.floor(time));
	//angle = (angle + 20*time) % 360;
	let lightPos = Math.sin(time*0.5) * 10;
	light.position.y = lightPos;
	light.position.z = Math.cos(time *0.5) * 10;
	updateLight();
	console.log(lightPos);
	controls.update();
	console.log(camera.matrix);


	renderer.render(scene, camera);
	
	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		//controls.handleResize();
		camera.updateProjectionMatrix();
		controls.update();

	}
	requestAnimationFrame(render);

}
console.log(scene);
requestAnimationFrame(render);