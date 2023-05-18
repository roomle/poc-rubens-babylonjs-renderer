import {
    IoContext, 
    ConfiguratorCore
} from 'roomle-core-hsc/src/embind/configuratorCore'
import {ConfiguratorCallbackHandler} from 'roomle-core-hsc/src/embind/configuratorCallback'
import {ConfigurationRequests} from './configurationRequests'
import {
    ConfigurationConstructor,
    MeshData,
    MeshSpecification
} from './configurationConstructor'

export { MeshData, MeshSpecification } from './configurationConstructor';

const ioContext: IoContext = {
    log: (message : string) => { console.log(`LOG: ${message}`) },
    info: (message : string) => { console.log(`INFO: ${message}`) },
    warn: (message : string) => { console.log(`WARNING: ${message}`) },
    error: (message : string) => {console.log(`ERROR: ${message}`) }
}

export interface TextureProperties {
    url: string
    mmWidth: number,
    mmHeight: number
}

export interface MaterialProperties {
    doubleSided: boolean
    baseColor: number[],
    diffuseMap?: TextureProperties,
    diffuseMapHasAlpha: boolean,
    normalMap?: TextureProperties
    ormMap?: TextureProperties
    alpha: number,
    roughness: number,
    metallic: number,
    reflectivity: number,
    transmission: number,
    transmissionIOR: number,
}

export interface MeshConstructionData {
    meshData: MeshData;
    materialProperties: { specification: any, properties: MaterialProperties }[];
    planComponents: { id: number, component: any }[];
}

export class MeshConstructor {

    public static enableConstructionLogs = false;
    private _configuratorCore?: ConfiguratorCore
    private _callbackHandler: ConfiguratorCallbackHandler = new ConfiguratorCallbackHandler()
    private _configurationLoader?: ConfigurationRequests
    private _configurationConstructor?: ConfigurationConstructor
    
    private static constructionLog(message: string) {
        if (MeshConstructor.enableConstructionLogs)
            console.log(message);
    }

    private async init() : Promise<void> {
        if (!this._configuratorCore) {
            this._configuratorCore = await ConfiguratorCore.newConfiguratorCore(ioContext, this._callbackHandler, true)
            const module = this._configuratorCore.getConfiguratorModule()
            const core = this._configuratorCore.getConfigurator()
            if (core && module) {
                this._configurationLoader = new ConfigurationRequests(module, core)
                this._configurationConstructor = new ConfigurationConstructor(module, core)
            }
        }
    }

    public static async newMeshConstructor() : Promise<MeshConstructor> {
        const meshConstructor : MeshConstructor = new MeshConstructor()
        await meshConstructor.init()
        return meshConstructor
    }

    public registerCallbacks(): void {
        if (!this._configurationLoader || !this._configurationConstructor) {
            return;
        } 
        this._callbackHandler.setLoader(this._configurationLoader)
        this._callbackHandler.setConstructor(this._configurationConstructor)
    }

    public unregisterCallbacks():  void {
        this._callbackHandler.setLoader(undefined)
        this._callbackHandler.setConstructor(undefined)
    }
    
    public async constructMesh(configurationId: string): Promise<MeshConstructionData> {
        if (!this._configuratorCore || !this._configurationLoader || !this._configurationConstructor) {
            return {
                meshData: { meshes: [], materials: [] },
                materialProperties: [],
                planComponents: [],
            }
        } 
        const core = this._configuratorCore.getConfigurator()
        this.registerCallbacks()
        core?.clearAll()
        await this._configurationLoader.load(configurationId)
        const meshData: MeshData = await this._configurationConstructor.construct(1)
        this.unregisterCallbacks()
        MeshConstructor.logMesh(meshData)
        return this.createConstructionData(meshData);
    }

    private createConstructionData(meshData: MeshData): MeshConstructionData { 
        const materialProperties: any [] = meshData.materials.map(materialSpecification => {
            return {
                specification: materialSpecification,
                properties: this.getMaterialProperties(materialSpecification)
            }
        });
        const planComponents: any[] = this.getPlanComponents(meshData);
        return { 
            meshData,
            materialProperties,
            planComponents,
        };
    }

    private static logMesh(meshData: MeshData): void {
        MeshConstructor.constructionLog('\nGeometry:')
        meshData.meshes.forEach(mesh => {
            const name: string = mesh.baked ? 'baked': `${mesh.meshId} ${mesh.geometryId}`
            MeshConstructor.constructionLog(`${mesh.runtimeComponentId} ${name} ${mesh.environmentGeometry ? 'environment' : ''} v: ${mesh.vertices.length} i: ${mesh.indices.length}`)
        })
        MeshConstructor.constructionLog('\nMaterials:')
        meshData.materials.forEach(material => {
            let properties: string = ''
            if (material.shading?.basecolor) {
                properties = `RGB: ${material.shading.basecolor.r}, ${material.shading.basecolor.g}, ${material.shading.basecolor.b}`
            }
            MeshConstructor.constructionLog(`${material.id} ${properties} textures: ${material.textureObjects?.length ?? 0}`)
        })
    } 

    public isUVIdentityMatrix(uvTransform: Float32Array): boolean {
        return uvTransform.length == 6 && uvTransform[0] === 1 && uvTransform[1] === 0 && uvTransform[2] === 0 && uvTransform[3] === 1 && uvTransform[4] !==0 && uvTransform[5] !== 0;
    }

    private getPlanComponents(meshData: MeshData): any[] {
        const configurator = this._configuratorCore?.getConfigurator()
        if (!configurator) {
            return []
        }
        const ids: number[] = Array.from(new Set(meshData.meshes.map(specification => specification.runtimeComponentId)));
        const planComponents = ids.map(planComponentRuntimeId => {
            const planComponent = configurator.getComponent(planComponentRuntimeId)
            return { id: planComponentRuntimeId, planComponent: planComponent }
        })
        return planComponents
    }

    public getTextureProperties(textureObject: any): TextureProperties {
        return { url: textureObject.url, mmWidth: textureObject.mmWidth, mmHeight: textureObject.mmHeight }
    }

    private getMaterialProperties(materialSpecification: any): MaterialProperties {
        const defaultColor = [0.7, 0.7, 0.7];
        const baseColor = materialSpecification.shading?.basecolor
        let diffuseMap: TextureProperties | undefined = undefined
        let diffuseMapHasAlpha = false
        let normalMap: TextureProperties | undefined = undefined
        let ormMap: TextureProperties | undefined = undefined
        if (materialSpecification.textureObjects) {
            materialSpecification.textureObjects.forEach((textureObject: any) => {
                const textureProperties = this.getTextureProperties(textureObject)
                switch(textureObject.mapping?.toUpperCase()) {
                    case 'RGB': { diffuseMap = textureProperties; break; }
                    case 'RGBA': { diffuseMap = textureProperties; diffuseMapHasAlpha = true; break; }
                    case 'XYZ': { normalMap = textureProperties; break; }
                    case 'ORM': { ormMap = textureProperties; break; }
                    default: { diffuseMap = textureProperties; break; }
                }
            })
        }
        let metallic = materialSpecification.shading?.metallic ?? 0;
        let reflectivity = 0.5;
        // Roomle material version 1
        if (materialSpecification.shading?.metallic !== undefined) {
            const metallicValue = materialSpecification.shading?.metallic;
            metallic = metallicValue === 1 ? 1 : 0.5;
            reflectivity = metallicValue;
        }
        return {
            doubleSided: materialSpecification.shading?.doubleSided ?? true,
            baseColor: baseColor ? [baseColor.r, baseColor.g, baseColor.b] : defaultColor,
            diffuseMap: diffuseMap,
            diffuseMapHasAlpha: diffuseMapHasAlpha,
            normalMap: normalMap,
            ormMap: ormMap,
            alpha: materialSpecification.shading?.alpha ?? 1,
            roughness: materialSpecification.shading?.roughness ?? 0,
            metallic: metallic,
            reflectivity: reflectivity, 
            transmission: materialSpecification.shading?.transmission ?? 0,
            transmissionIOR: materialSpecification.shading?.transmissionIOR ?? 0,
        }
    } 
}
