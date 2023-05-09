import { BabylonConfigurationLoader} from './renderer/configurationLoader';
import * as BABYLON from 'babylonjs'

const canvas = document.getElementById('babylonjs_canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
//const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
//const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -10), scene);
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

scene.clearColor = new BABYLON.Color4(0.2, 0.2, 0.3, 1.0);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1, 2, 1), scene);
light.intensity = 1.0;
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

const configurationLoader = new BabylonConfigurationLoader();
configurationLoader.loadAsync('usm:frame:80490DB7C5DD43CFF0CEA63649861F9C57394E874E2499DA7996918215A4A54E').then((root) => {
    sphere.isVisible = false;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize(true);
});

engine.runRenderLoop(() => {
    scene.render();
});
