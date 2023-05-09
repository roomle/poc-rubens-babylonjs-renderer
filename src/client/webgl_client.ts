import * as BABYLON from 'babylonjs'

const canvas = document.getElementById('babylonjs_canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
//const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
//const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -10), scene);
const camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1.0);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize(true);
});

engine.runRenderLoop(() => {
    scene.render();
});
