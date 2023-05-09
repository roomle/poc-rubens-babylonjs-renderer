import { 
    MeshConstructionData,
    MeshData, 
    MaterialProperties,
    MeshConstructor,
    MeshSpecification,
    TextureProperties
} from '../loader/meshConstructor';
import { convertCObject } from '../loader/configuratorUtils';
import * as BABYLON from 'babylonjs'

export class BabylonConfigurationLoader {

    public async loadAsync(configurationId: string): Promise<BABYLON.TransformNode> {
        const configuratorMesh: MeshConstructor = await MeshConstructor.newMeshConstructor();
        const meshConstructionData = await configuratorMesh.constructMesh(configurationId);
        console.log(meshConstructionData);
        return this.constructMesh(meshConstructionData);
    }

    private constructMesh(meshConstructionData: MeshConstructionData): BABYLON.TransformNode {
        var root = new BABYLON.TransformNode("root");
        const geometries = meshConstructionData.meshData.meshes.map(meshSpecification => {
            const mesh = this.constructGeometry(root, meshSpecification)
            return { 'mesh': mesh, 'specification': meshSpecification }
        })
        geometries.forEach(geometryData => {
            const planComponentData = meshConstructionData.planComponents.find((item: any) => item.id == geometryData.specification.runtimeComponentId)
            const globalTransform = this.calculateTransformation(planComponentData, geometryData.specification);
            geometryData.mesh.setPreTransformMatrix(globalTransform);
        });  
        root.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);  
        root.rotation.x = -Math.PI/2;
        return root;
    }

    private constructGeometry(root: BABYLON.TransformNode, meshSpecification: MeshSpecification): BABYLON.Mesh {
        var mesh = new BABYLON.Mesh("custom");
        var vertexData = new BABYLON.VertexData();
        vertexData.positions = meshSpecification.vertices;
        vertexData.normals = meshSpecification.normals;
        vertexData.uvs = meshSpecification.uvCoords;
        vertexData.indices = meshSpecification.indices;	
        vertexData.applyToMesh(mesh);
        mesh.parent = root;
        return mesh;
    }
    
    private calculateTransformation(planComponentData: any, meshSpecification: MeshSpecification): BABYLON.Matrix {
        let globalTransform = new BABYLON.Matrix();
        if (planComponentData) {
            const floatBuffer = new Float32Array(planComponentData.planComponent.globalTransform.m);
            globalTransform = convertToBabylonMatrix(floatBuffer);
        }
        if (meshSpecification.transform) {
            const transform = convertToBabylonMatrix(meshSpecification.transform);
            globalTransform = transform.multiply(globalTransform);
        }
        return globalTransform;
    }
}
BABYLON.Matrix
export const convertToBabylonMatrix = (transform: Float32Array): BABYLON.Matrix => {
    const transformArray: number[] = convertCObject(transform);
    let transformMatrix = BABYLON.Matrix.FromArray(transformArray);
    transformMatrix = transformMatrix.transpose();

    //return convertKernelMatrixCoordsToThree(transformMatrix);
    return transformMatrix;
};