import { 
    MeshConstructionData,
    MaterialProperties,
    MeshConstructor,
    MeshSpecification,
    TextureProperties
} from 'roomle-core-hsc/src/loader/configurationLoader';
import { convertCObject } from 'roomle-core-hsc/src/embind/configuratorUtils';
import {
    Color3,
    Material,
    Matrix,
    Mesh,
    PBRMaterial,
    StandardMaterial,
    Texture,
    TransformNode,
    VertexData,
} from 'babylonjs'

export class BabylonConfigurationLoader {

    public async loadAsync(configurationId: string): Promise<TransformNode> {
        const configuratorMesh: MeshConstructor = await MeshConstructor.newMeshConstructor();
        const meshConstructionData = await configuratorMesh.constructMesh(configurationId);
        console.log(meshConstructionData);
        return this.constructMesh(meshConstructionData);
    }

    private constructMesh(meshConstructionData: MeshConstructionData): TransformNode {
        const materialData: MaterialData[] = []
        const materials = meshConstructionData.materialProperties.map(item => {
            const material = this.createMaterial(item.properties, item.specification.id)
            material.name = item.specification.id;
            materialData.push({ materialId: item.specification.id, material: material })
            return { material: material, properties: item.properties, specification: item.specification }
        })
        var root = new TransformNode("root");
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

    private constructGeometry(root: TransformNode, meshSpecification: MeshSpecification): Mesh {
        var turnedFaces: number[] = [];
        for (let i=0; i < meshSpecification.indices.length; i+=3) {
            turnedFaces.push(meshSpecification.indices[i], meshSpecification.indices[i+2], meshSpecification.indices[i+1]);
        }
        var mesh = new Mesh("custom");
        var vertexData = new VertexData();
        vertexData.positions = meshSpecification.vertices;
        vertexData.normals = meshSpecification.normals;
        vertexData.uvs = meshSpecification.uvCoords;
        vertexData.indices = turnedFaces;	
        vertexData.applyToMesh(mesh, true);
        mesh.parent = root;        
        return mesh;
    }
    
    private calculateTransformation(planComponentData: any, meshSpecification: MeshSpecification): Matrix {
        let globalTransform = meshSpecification.transform
            ? convertToBabylonMatrix(meshSpecification.transform)
            : new Matrix();
        if (planComponentData) {
            const floatBuffer = new Float32Array(planComponentData.planComponent.globalTransform.m);
            const componentTransform = convertToBabylonMatrix(floatBuffer);
            globalTransform = globalTransform.multiply(componentTransform);
        }
        const scale = 1 / 1000;
        const c = Math.cos(-Math.PI / 2);
        const s = Math.sin(-Math.PI / 2);
        const roomleToBabylonTransform = Matrix.FromArray([
            -scale, 0, 0, 0,
            0, scale * c, scale * s, 0,
            0, -scale * s, scale * c, 0,
            0, 0, 0, 1,
        ]);
        globalTransform = globalTransform.multiply(roomleToBabylonTransform);
        return globalTransform;
    }

    public createMaterial(properties: MaterialProperties, id: string): Material {
        const material = new PBRMaterial("material-" + id);
        //material.backFaceCulling = false;
        //material.cullBackFaces = false;
        
        const baseColor = new Color3(...properties.baseColor);
        if (properties.diffuseMap) {
            material.albedoTexture = new Texture(properties.diffuseMap.url);
            material.albedoTexture.hasAlpha = properties.diffuseMapHasAlpha;
            this.setTextureProperties(material.albedoTexture as Texture, properties.diffuseMap);
        } else {
            material.albedoColor = baseColor;
            if (properties.alpha < 1) {
                material.transparencyMode = 2; // ALPHABLEND
                material.alphaMode = 4; // ALPHA_MULTIPLY
                material.alpha = properties.alpha;
            }
        }
        if (properties.normalMap) {
            material.bumpTexture = new Texture(properties.normalMap.url);
            this.setTextureProperties(material.bumpTexture as Texture, properties.normalMap);
        }
        if (properties.ormMap) {
            material.useAmbientOcclusionFromMetallicTextureRed = true;
            material.useRoughnessFromMetallicTextureAlpha = false;
            material.useRoughnessFromMetallicTextureGreen = true;
            material.useMetallnessFromMetallicTextureBlue = true;
            material.metallicTexture = new Texture(properties.ormMap.url);
            this.setTextureProperties(material.metallicTexture as Texture, properties.ormMap);
            material.metallic = 1;
            material.roughness = 1;
        } else {
            material.metallic = properties.metallic;
            material.roughness = properties.roughness;
        }
        material.subSurface.isTranslucencyEnabled = properties.transmission > 0.001;
        material.subSurface.translucencyIntensity = properties.transmission;
        //material.transmission = properties.transmission
        //material.ior = 1 + properties.transmissionIOR
        //loadAndSetEnvironmentTexture((cubeTexture: CubeTexture) => { material.envMap = cubeTexture })
        //material.envMapIntensity = 2
        return material;
    }

    private setTextureProperties(texture: Texture, textureProperties?: TextureProperties): void {
        if (textureProperties) {
            let textureWidth = textureProperties.mmWidth === 0 ? 1000 : textureProperties.mmWidth;
            let textureHeight = textureProperties.mmHeight === 0 ? 1000 : textureProperties.mmHeight;
            texture.uScale = 1 / textureWidth;
            texture.vScale = 1 / textureHeight;
        }
    }
}

export const convertToBabylonMatrix = (transform: Float32Array): Matrix => {
    const transformArray: number[] = convertCObject(transform);
    let transformMatrix = Matrix.FromArray(transformArray);
    transformMatrix = transformMatrix.transpose();
    return transformMatrix;
};

export interface MaterialData {
    materialId: string,
    material: Material,
}