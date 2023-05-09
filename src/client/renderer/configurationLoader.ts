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
        const materialData: MaterialData[] = []
        const materials = meshConstructionData.materialProperties.map(item => {
            const material = this.createMaterial(item.properties, item.specification.id)
            material.name = item.specification.id;
            materialData.push({ materialId: item.specification.id, material: material })
            return { material: material, properties: item.properties, specification: item.specification }
        })
        var root = new BABYLON.TransformNode("root");
        const geometries = meshConstructionData.meshData.meshes.map(meshSpecification => {
            const mesh = this.constructGeometry(root, meshSpecification)
            return { 'mesh': mesh, 'specification': meshSpecification }
        })
        geometries.forEach(geometryData => {
            const planComponentData = meshConstructionData.planComponents.find((item: any) => item.id == geometryData.specification.runtimeComponentId)
            const globalTransform = this.calculateTransformation(planComponentData, geometryData.specification);
            geometryData.mesh.setPreTransformMatrix(globalTransform);
            const materialData = materials.find(material => material.specification.id == geometryData.specification.materialId);
            if (materialData?.material) {
                geometryData.mesh.material = materialData.material;
            }
        });  
        return root;
    }

    private constructGeometry(root: BABYLON.TransformNode, meshSpecification: MeshSpecification): BABYLON.Mesh {
        var turnedFaces: number[] = [];
        for (let i=0; i < meshSpecification.indices.length; i+=3) {
            turnedFaces.push(meshSpecification.indices[i], meshSpecification.indices[i+2], meshSpecification.indices[i+1]);
        }
        var mesh = new BABYLON.Mesh("custom");
        var vertexData = new BABYLON.VertexData();
        vertexData.positions = meshSpecification.vertices;
        vertexData.normals = meshSpecification.normals;
        vertexData.uvs = meshSpecification.uvCoords;
        vertexData.indices = turnedFaces;	
        vertexData.applyToMesh(mesh, true);
        mesh.parent = root;        
        return mesh;
    }
    
    private calculateTransformation(planComponentData: any, meshSpecification: MeshSpecification): BABYLON.Matrix {
        let globalTransform = meshSpecification.transform
            ? convertToBabylonMatrix(meshSpecification.transform)
            : new BABYLON.Matrix();
        if (planComponentData) {
            const floatBuffer = new Float32Array(planComponentData.planComponent.globalTransform.m);
            const componentTransform = convertToBabylonMatrix(floatBuffer);
            globalTransform = globalTransform.multiply(componentTransform);
        }
        const scale = 1 / 1000;
        const c = Math.cos(-Math.PI / 2);
        const s = Math.sin(-Math.PI / 2);
        const roomleToBabylonTransform = BABYLON.Matrix.FromArray([
            -scale, 0, 0, 0,
            0, scale * c, scale * s, 0,
            0, -scale * s, scale * c, 0,
            0, 0, 0, 1,
        ]);
        globalTransform = globalTransform.multiply(roomleToBabylonTransform);
        return globalTransform;
    }

    public createMaterial(properties: MaterialProperties, id: string): BABYLON.Material {
        const material = new BABYLON.StandardMaterial("material-" + id);
        //material.backFaceCulling = false;
        //material.cullBackFaces = false;
        
        const baseColor = new BABYLON.Color3(...properties.baseColor);
        if (properties.diffuseMap) {
            material.diffuseTexture = new BABYLON.Texture(properties.diffuseMap.url);
            material.diffuseTexture.hasAlpha = properties.diffuseMapHasAlpha;
            this.setTextureProperties(material.diffuseTexture as BABYLON.Texture, properties.diffuseMap);
        } else {
            material.diffuseColor = baseColor;
            if (properties.alpha < 1) {
                material.transparencyMode = 2; // ALPHABLEND
                material.alphaMode = 4; // ALPHA_MULTIPLY
                material.alpha = properties.alpha;
            }
        }
        if (properties.normalMap) {
            //const setNormalTexture = (texture: Texture) => {
            //    this.setTextureProperties(texture, properties.normalMap)
            //    material.normalMap = texture
            //    material.normalMapType = TangentSpaceNormalMap
            //}
            //this.loadAndSetTexture(setNormalTexture, properties.normalMap.url)
        }
        if (properties.ormMap) {
            //const setORMTexture = (texture: Texture) => {
            //    this.setTextureProperties(texture, properties.ormMap)
            //    material.aoMap = texture
            //    material.roughnessMap = texture
            //    material.metalnessMap = texture
            //    material.aoMapIntensity = 1
            //    material.roughness = 1
            //    material.metalness = 1
            //}
            //this.loadAndSetTexture(setORMTexture, properties.ormMap.url)
            material.roughness = 1;
        } else {
            //material.metalness = properties.metallic
            //material.reflectivity = properties.reflectivity
            material.roughness = properties.roughness;
            //material.specularPower = 0;
        }
        //material.transmission = properties.transmission
        //material.ior = 1 + properties.transmissionIOR
        //loadAndSetEnvironmentTexture((cubeTexture: CubeTexture) => { material.envMap = cubeTexture })
        //material.envMapIntensity = 2
        return material;
    }

    private setTextureProperties(texture: BABYLON.Texture, textureProperties?: TextureProperties): void {
        if (textureProperties) {
            let textureWidth = textureProperties.mmWidth === 0 ? 1000 : textureProperties.mmWidth;
            let textureHeight = textureProperties.mmHeight === 0 ? 1000 : textureProperties.mmHeight;
            texture.uScale = 1 / textureWidth;
            texture.vScale = 1 / textureHeight;
        }
    }
}

export const convertToBabylonMatrix = (transform: Float32Array): BABYLON.Matrix => {
    const transformArray: number[] = convertCObject(transform);
    let transformMatrix = BABYLON.Matrix.FromArray(transformArray);
    transformMatrix = transformMatrix.transpose();
    return transformMatrix;
};

export interface MaterialData {
    materialId: string,
    material: BABYLON.Material,
}