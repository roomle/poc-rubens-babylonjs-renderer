import {
    ConfiguratorCoreInterface, 
    ConfiguratorContainer, 
    Configuration, 
    Vector3f, 
    RapiId, 
    EmscriptenString, 
    EmscriptenMap,
    Component
} from 'roomle-core-hsc/src/embind/configuratorCoreInterface'
import { ConfigurationRequestsInterface } from 'roomle-core-hsc/src/embind/configuratorCallback'
import {
    loadConfiguration, 
    loadComponent, 
    loadComponents, 
    loadItem,
    loadMaterials, 
    loadMesh, 
    loadMeshData, 
    loadData
} from './rapiAccess'

interface ComponentRequest {
    conversationId: number, 
    configuration: Configuration, 
    parentId: number
}

interface SubComponentRequest {
    parentId: number,
    partId: string,
    componentId: string
}

interface ExternalMeshRequest {
    meshId: string,
    quality: number
}

export class ConfigurationRequests implements ConfigurationRequestsInterface {
    
    private static conversationId: number = 0
    private _configuratorModule: ConfiguratorContainer
    private _configurator: ConfiguratorCoreInterface
    //private _callbackEvent: EventEmitter = new EventEmitter()
    private _componentRequests: ComponentRequest[] = []
    private _subComponentRequests: SubComponentRequest[] = []
    private _materialPropertyRequests: string[] = [] 
    private _externalMeshRequests: ExternalMeshRequest[] = []
    
    public constructor(configuratorModule: ConfiguratorContainer, configurator: ConfiguratorCoreInterface) {
        this._configuratorModule = configuratorModule
        this._configurator = configurator
    }

    //private emitError(err: any) {
    //    this._callbackEvent.emit('error', err)
    //}

    public async load(configurationId: string) : Promise<void> {
        console.log(`LOAD: ${configurationId}`)
        ConfigurationRequests.conversationId ++;
        let configurationJson : string = ''
        const countColons = configurationId.split(':').length - 1
        if (configurationId.startsWith('component@')) {
            const componentId = configurationId.substr(configurationId.indexOf('@') + 1)
            configurationJson = `{"componentId":"${componentId}"}`
        } else if (countColons === 1) {
            configurationJson = await this.loadItemDefinition(configurationId)
        } else {
            configurationJson = await this.loadConfigurationDefinition(configurationId)
        }
        const bounds: Vector3f = { x: 0, y: 0, z: 0}
        this._configurator.loadConfiguration(ConfigurationRequests.conversationId, configurationJson, bounds)
        await this.batchLoad()
        //await once(this._callbackEvent, 'configurationLoaded')
        console.log(`... LOADED: ${configurationId}`)
    }

    public async batchLoad() : Promise<void> {
        while (this._componentRequests?.length || this._subComponentRequests?.length || this._materialPropertyRequests?.length || this._externalMeshRequests?.length) {
            if (this._componentRequests?.length) {
                const componentRequests = this._componentRequests
                this._componentRequests = []
                await this.loadComponents(componentRequests);
            }
            if (this._subComponentRequests?.length) {
                const subComponentRequests = this._subComponentRequests
                this._subComponentRequests = []
                await this.loadSubComponents(subComponentRequests)
            }
            if (this._materialPropertyRequests?.length) {
                const materialPropertyRequests = this._materialPropertyRequests
                this._materialPropertyRequests = []
                await this.loadMaterialsAndProperties(materialPropertyRequests)
            }
            if (this._externalMeshRequests?.length) {
                const externalMeshRequests = this._externalMeshRequests
                this._externalMeshRequests = []
                await this.loadExternalMeshes(externalMeshRequests)
            }
        }
    }

    public async loadConfigurationDefinition(configurationId: string) {
        const configurationData: any = await loadConfiguration(configurationId)
        const configuration : string = configurationData.configuration.configuration
        return configuration
    }

    public async loadItemDefinition(configurationId: string) {
        const itemData: any = await loadItem(configurationId)
        const item : string = itemData.item.configuration
        return item
    }

    public configurationLoaded(conversationId: number, objectId: number, componentId: number, hash: string, errors: EmscriptenString[]): void {
        //this._callbackEvent.emit('configurationLoaded')
    }

    public configurationLoadingError(runtimeId: number, errors?: EmscriptenString[]): void {
        console.log(errors)
        //this.emitError(new Error(`${errors}`))
    }

    public componentConfigurationUpdated(runtimeComponentId: number, geometryChanged: boolean): void {
    }

    public componentMetaUpdated(kernelComponent: Component): void {
    }

    public planObjectCreated(conversationId: number, planObjectId: number): void {
    }

    public planObjectUpdated(planObjectId: number): void {
    }

    public sceneCleared(): void {
    }

    public requestComponent(conversationId: number, configuration: Configuration, parentId: number): void {
        this._componentRequests.push({conversationId: conversationId, configuration: configuration, parentId: parentId})
    } 

    public requestSubComponent(parentId: number, partId: string, componentId: string): void {
        this._subComponentRequests.push({parentId: parentId, partId: partId, componentId: componentId})
    }

    public requestMaterialsInGroup(groupIds: string[]): void {
        
    }

    public requestMaterialProperties(materialIds: string[]): void {
        this._materialPropertyRequests.push(...materialIds)
    }

    public requestExternalMesh(meshId: string, quality: number): void {
        this._externalMeshRequests.push({meshId: meshId, quality: quality})
    }

    private async loadComponents(componentRequests: ComponentRequest[]): Promise<void> {
        try {
            const componentIds: string[] = componentRequests.map(component => component.configuration.componentId);
            const componentsData: any = await loadComponents(componentIds)
            componentRequests.forEach(component => {
                const componentData = componentsData.components?.find((data: any) => data.id.toLowerCase() === component.configuration.componentId.toLowerCase())
                if (componentData) {
                    const componentDefinition = componentData.configuration
                    this._configurator.loadComponent(component.conversationId, componentDefinition, component.configuration, component.parentId)
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    private async loadSubComponents(subComponentRequests: SubComponentRequest[]): Promise<void> {
        try {
            const componentIds: string[] = subComponentRequests.map(component => component.componentId);
            const componentsData: any = await loadComponents(componentIds)
            subComponentRequests.forEach(component => {
                const componentData = componentsData.components?.find((data: any) => data.id.toLowerCase() === component.componentId.toLowerCase())
                if (componentData) {
                    const componentDefinition = componentData.configuration
                    this._configurator.loadedSubComponent(component.parentId, component.partId, component.componentId, componentDefinition)
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    private async loadComponent(conversationId: number, configuration: Configuration, parentId: number): Promise<void> {
        try {
            const componentData: any = await loadComponent(configuration.componentId)
            const componentDefinition: string = componentData.component.configuration
            this._configurator.loadComponent(conversationId, componentDefinition, configuration, parentId);
        } catch (err) {
            console.log(err)
        }
    }

    private async loadSubComponent(parentId: number, partId: string, componentId: string): Promise<void> {
        try {
            const componentData: any = await loadComponent(componentId)
            const componentDefinition: string = componentData.component.configuration
            this._configurator.loadedSubComponent(parentId, partId, componentId, componentDefinition);
        } catch (err) {
            console.log(err)
        }
    }

    private async loadMaterialsAndProperties(materialIds: RapiId[]): Promise<void> {
        try {
            const materialData: any = await loadMaterials(materialIds)
            let propertiesOfMaterials: Array<{id: RapiId; properties: EmscriptenMap<string, string>}> = [];
            materialData.materials?.forEach((material: any) => {
                // @ts-ignore
                const materialProperties = new this._configuratorModule.StringStringMap() as EmscriptenMap<string, string>;
                const properties = material.properties || {};
                for (let key in properties) {
                    if (properties.hasOwnProperty(key)) {
                        materialProperties.set(key, properties[key]);
                    }
                }
                if (materialProperties.size()) {
                    propertiesOfMaterials.push({id: material.id, properties: materialProperties});
                }
            });
            if (propertiesOfMaterials.length) {
                this._configurator.setMaterialProperties(propertiesOfMaterials);
            }
        } catch (err) {
            console.log(err)
        }
    }

    private async loadExternalMeshes(externalMeshRequests: ExternalMeshRequest[]): Promise<void> {
        try {
            for (const meshRequest of externalMeshRequests) {
                const mesh = await loadMesh(meshRequest.meshId, meshRequest.quality)
                const meshDataArray = await loadMeshData(mesh.mesh.links.data)
                for (const meshData of meshDataArray.meshDatas) {
                    const crtMesh = await loadData(meshData.url)
                    this._configurator.addMeshCorto(meshRequest.meshId, meshRequest.quality, new Uint8Array(crtMesh))
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}
