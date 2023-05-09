import { BabylonConfigurationLoader} from './renderer/configurationLoader';
import * as BABYLON from 'babylonjs'

const canvas = document.getElementById('babylonjs_canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
//const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
//const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -10), scene);
const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI/3, 8, new BABYLON.Vector3(0, 0, 0), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

scene.clearColor = new BABYLON.Color4(1, 1, 1, 1.0);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1, 2, 1), scene);
light.intensity = 1.0;
const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
//const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 5, height: 5}, scene);

//let id: string = '';
//id = 'roomle_script_test:uv_transfom_external_mesh:7BA3885FD5EAFB3187F5CFBD8EC55762D461B3EF2906B9209E9C290BB898A608';
//id = 'roomle_script_test:rubiks_cube:84872783D647B1780D479B953E9CE01E4C38332FF6B23C120C6ABDD5C8C588FD'
const id1 = 'usm:frame:80490DB7C5DD43CFF0CEA63649861F9C57394E874E2499DA7996918215A4A54E';
//const id2 = 'revised:Eartham:6107617DE6E2FE8DDD27115B1CBC7D8741CEAEC52B7B00E27231B00882F8E396';
//const id2 = 'musterring:Vittoria_Right:A736BA3E8E4908A64B2480D34C818133BB21AE74810431EC7025EE62E9ACF7A0';
const id2 = 'brands_3:Eames_Plastic_Chairs:E7645ABD321BBD9CC09CF565D22EB7463FE1EAB3431EEC4CCE1E3A4FF1F525D4';

const configurationLoader = new BabylonConfigurationLoader();
configurationLoader.loadAsync(id1).then((root) => {
    sphere.isVisible = false;
    root.position.z = -0.5;
});
configurationLoader.loadAsync(id2).then((root) => {
    sphere.isVisible = false;
    root.position.x = -1;
    root.position.z = 0.5;
    root.rotation.y = Math.PI / 4;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize(true);
});

engine.runRenderLoop(() => {
    scene.render();
});
