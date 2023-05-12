import { BabylonConfigurationLoader} from './renderer/configurationLoader';
import {
    ArcRotateCamera,
    Color3,
    Color4,
    DefaultRenderingPipeline,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    Scene,
    SSAORenderingPipeline,
    UniversalCamera,
    Vector3,
} from 'babylonjs'

const canvas = document.getElementById('babylonjs_canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const engine = new Engine(canvas, true, {
    antialias: true,
});

const scene = new Scene(engine);
//const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
//const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 5, -10), scene);
const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI/3, 8, new Vector3(0, 0, 0), scene);
camera.setTarget(Vector3.Zero());
camera.attachControl(canvas, true);

var pipeline = new DefaultRenderingPipeline(
    "defaultPipeline", // The name of the pipeline
    true, // Do you want the pipeline to use HDR texture?
    scene, // The scene instance
    [camera] // The list of cameras to be attached to
);
pipeline.samples = 4;
pipeline.fxaaEnabled = true;

scene.clearColor = new Color4(1, 1, 1, 1.0);
scene.createDefaultEnvironment({
    skyboxColor: new Color3(1, 1, 1),
    groundColor: new Color3(1, 1, 1),
});
//const ssao = new SSAORenderingPipeline("ssaopipeline", scene, 0.75, [camera]);

const light = new HemisphericLight("light", new Vector3(-1, 2, 1), scene);
light.intensity = 1.0;
const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
sphere.position.y = 1;
//const ground = MeshBuilder.CreateGround("ground", {width: 5, height: 5}, scene);

//const id = 'roomle_script_test:uv_transfom_external_mesh:7BA3885FD5EAFB3187F5CFBD8EC55762D461B3EF2906B9209E9C290BB898A608';
//const id = 'roomle_script_test:rubiks_cube:84872783D647B1780D479B953E9CE01E4C38332FF6B23C120C6ABDD5C8C588FD'
const id1 = 'usm:frame:80490DB7C5DD43CFF0CEA63649861F9C57394E874E2499DA7996918215A4A54E';
const id2 = 'brands_3:Eames_Plastic_Chairs:E7645ABD321BBD9CC09CF565D22EB7463FE1EAB3431EEC4CCE1E3A4FF1F525D4';
//const id3 = 'revised:Eartham:6107617DE6E2FE8DDD27115B1CBC7D8741CEAEC52B7B00E27231B00882F8E396';
//const id3 = 'musterring:Vittoria_Right:A736BA3E8E4908A64B2480D34C818133BB21AE74810431EC7025EE62E9ACF7A0';
//const id3 = 'dreikant:202';

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
/*
configurationLoader.loadAsync(id3).then((root) => {
    sphere.isVisible = false;
    root.position.x = 2;
    root.position.z = 0.5;
    root.rotation.y = -Math.PI / 2;
});
*/

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    engine.resize(true);
});

engine.runRenderLoop(() => {
    scene.render();
});
