import {
    ConfiguratorCallback, 
    Configuration, 
    EmscriptenString, 
    ConfigurationString, 
    Component,
    DockPairToPointArray,
    DockPairToLineArray,
    RapiId, 
    VariantArray,
    Vector3f
} from './wasm/configuratorCoreInterface'
import {ConfigurationRequests} from './configurationRequests'
import {ConfigurationConstructor} from './configurationConstructor'

const notImplemented: string = 'NOT IMPLEMENTED CALLBACK: '

export class ConfiguratorCallbackHandler implements ConfiguratorCallback {

    public static enableCallbackLogs = false;
    private _configurationLoader? : ConfigurationRequests;
    private _configurationConstructor? : ConfigurationConstructor;

    private callbackLog(message: string) {
        if (ConfiguratorCallbackHandler.enableCallbackLogs)
            console.log(message);
    }

    setLoader(configurationLoader?: ConfigurationRequests) {
        this._configurationLoader = configurationLoader;
    }

    setConstructor(configurationConstructor?: ConfigurationConstructor) {
        this._configurationConstructor = configurationConstructor;
    }

    isReady() : void {
        this.callbackLog('isReady')
    }
    
    loadComponent(conversationId: number, configuration: Configuration, parentId: number): void {
        if (this._configurationLoader) {
            this.callbackLog(`loadComponent ${configuration.componentId}`)
            this._configurationLoader.requestComponent(conversationId, configuration, parentId);
        } else {
            this.callbackLog(notImplemented + 'loadComponent')
        }
    }
    
    loadSubComponent(parentId: number, partId: string, componentId: string): void {
        if (this._configurationLoader) {
            this.callbackLog(`loadSubComponent ${partId} ${componentId}`)
            this._configurationLoader.requestSubComponent(parentId, partId, componentId);
        } else {
            this.callbackLog(notImplemented + 'loadSubComponent')
        }
    }
    
    configurationLoaded(conversationId: number, objectId: number, componentId: number, hash: string, errors: EmscriptenString[]): void {
        if (this._configurationLoader) {
            this.callbackLog(`configurationLoaded ${componentId}`)
            this._configurationLoader.configurationLoaded(conversationId, objectId, componentId, hash, errors);
        } else {
            this.callbackLog(notImplemented + 'configurationLoaded')
        }
    }

    configurationLoadingError(runtimeId: number, errors?: EmscriptenString[]): void {
        if (this._configurationLoader) {
            this.callbackLog(`configurationLoadingError ${runtimeId}`)
            this._configurationLoader.configurationLoadingError(runtimeId, errors);
        } else {
            this.callbackLog(notImplemented + 'configurationLoadingError')
        }
    }

    configurationSaved(conversationId: number, configuration: ConfigurationString, hash: string, rootComponentId: number): void {
        this.callbackLog(notImplemented + 'configurationSaved')
    }

    componentDefinitionLoaded(conversationId: number, componentId: number): void {
        this.callbackLog(notImplemented + 'componentDefinitionLoaded')
    }

    componentDefinitionLoadingError(conversationId: number, errorMessage: string): void {
        this.callbackLog(notImplemented + 'componentDefinitionLoadingError')
    }

    componentConfigurationUpdated(runtimeComponentId: number, geometryChanged: boolean): void {
        if (this._configurationLoader) {
            this.callbackLog(`componentConfigurationUpdated ${runtimeComponentId}, ${geometryChanged ? 'gemoetry changed' : ''}'`)
            this._configurationLoader.componentConfigurationUpdated(runtimeComponentId, geometryChanged);
        } else {
            this.callbackLog(notImplemented + 'componentConfigurationUpdated')
        }
    }

    componentMetaUpdated(kernelComponent: Component): void {
        if (this._configurationLoader) {
            this.callbackLog(`componentMetaUpdated ${kernelComponent.componentId}`)
            this._configurationLoader.componentMetaUpdated(kernelComponent);
        } else {
            this.callbackLog(notImplemented + 'componentMetaUpdated')
        }
    }

    componentDeleted(componentId: number): void {
        this.callbackLog(notImplemented + 'componentDeleted')
    }

    planObjectCreated(conversationId: number, planObjectId: number): void {
        if (this._configurationLoader) {
            this.callbackLog(`planObjectCreated ${conversationId}, ${planObjectId}`)
            this._configurationLoader.planObjectCreated(conversationId, planObjectId);
        } else {
            this.callbackLog(notImplemented + 'planObjectCreated')
        }
    }

    planObjectUpdated(planObjectId: number): void {
        if (this._configurationLoader) {
            this.callbackLog(`planObjectUpdated ${planObjectId}`)
            this._configurationLoader.planObjectUpdated(planObjectId);
        } else {
            this.callbackLog(notImplemented + 'planObjectUpdated')
        }
    }

    planObjectDeleted(objectId: number): void {
        this.callbackLog(notImplemented + 'planObjectDeleted')
    }

    planObjectConfigurationUpdated(planObjectId: number, configuration: ConfigurationString, hash: string): void {
        this.callbackLog(notImplemented + 'planObjectConfigurationUpdated')
    }

    sceneCleared(): void {
        if (this._configurationLoader) {
            this.callbackLog(`sceneCleared`)
            this._configurationLoader.sceneCleared();
        } else {
            this.callbackLog(notImplemented + 'sceneCleared')
        }
    }

    listOfVariants(componentId: RapiId, list: VariantArray): void {
        this.callbackLog(notImplemented + 'listOfVariants')
    }

    listOfVariantsError(dbId: RapiId, error: string): void {
        this.callbackLog(notImplemented + 'listOfVariantsError')
    }

    requestMaterialsInGroup(groupIds: string[]): void {
        if (this._configurationLoader) {
            this.callbackLog(`requestMaterialsInGroup ${groupIds}`)
            this._configurationLoader.requestMaterialsInGroup(groupIds);
        } else {
            this.callbackLog(notImplemented + 'requestMaterialsInGroup')
        }
    }

    requestMaterialProperties(materialIds: RapiId[]): void {
        if (this._configurationLoader) {
            this.callbackLog(`requestMaterialProperties ${materialIds}`)
            this._configurationLoader.requestMaterialProperties(materialIds);
        } else {
            this.callbackLog(notImplemented + 'requestMaterialProperties')
        }
    }

    requestExternalMesh(meshId: string, quality: number): void {
        if (this._configurationLoader) {
            this.callbackLog(`requestExternalMesh ${meshId}`)
            this._configurationLoader.requestExternalMesh(meshId, quality);
        } else {
            this.callbackLog(notImplemented + 'requestExternalMesh')
        }
    }

    Editor3dComponentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectRuntimeId: number, isRootComponent: boolean): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dComponentCreated ${id}`)
            this._configurationConstructor.componentCreated(id, position, eulerAngles, parentObjectRuntimeId, isRootComponent);
        } else {
            this.callbackLog(notImplemented + 'Editor3dComponentCreated')
        }
    }

    Editor3dRootComponentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectId: number): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dRootComponentCreated ${id}`)
            this._configurationConstructor.rootComponentCreated(id, position, eulerAngles, parentObjectId);
        } else {
            this.callbackLog(notImplemented + 'Editor3dRootComponentCreated')
        }
    }

    Editor3dComponentDocked(componentId: number, parentId: number, componentPosition: Vector3f, componentRotation: Vector3f): void {
        this.callbackLog(notImplemented + 'Editor3dComponentDocked')
    }

    Editor3dAddDockPreview(componentId: number, previewId: number): void {
        this.callbackLog(notImplemented + 'Editor3dAddDockPreview')
    }

    Editor3dSetPreviewPointAssociations(dockPairs: DockPairToPointArray, previewId: number): void {
        this.callbackLog(notImplemented + 'Editor3dSetPreviewPointAssociations')
    }

    Editor3dSetPreviewLineAssociations(dockLines: DockPairToLineArray, previewId: number): void {
        this.callbackLog(notImplemented + 'Editor3dSetPreviewLineAssociations')
    }

    Editor3dPreviewConstructionDone(componentId: number, objectId: number): void {
        this.callbackLog(notImplemented + 'Editor3dPreviewConstructionDone')
    }

    Editor3dGeometryReady(id: number): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dGeometryReady ${id}`)
            this._configurationConstructor.geometryReady(id);
        } else {
            this.callbackLog(notImplemented + 'Editor3dGeometryReady')
        }
    }

    Editor3dGeometryNotReady(id: number): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dGeometryNotReady ${id}`)
            this._configurationConstructor.geometryNotReady(id);
        } else {
            this.callbackLog(notImplemented + 'Editor3dGeometryNotReady')
        }
    }

    Editor3dBeginConstruction(componentId: number, isDeltaUpdate: boolean): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dBeginConstruction ${componentId}`)
            this._configurationConstructor.beginConstruction(componentId, isDeltaUpdate);
        } else {
            this.callbackLog(notImplemented + 'Editor3dBeginConstruction')
        }
    }

    Editor3dEndConstruction(id: number): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dEndConstruction ${id}`)
            this._configurationConstructor.endConstruction(id);
        } else {
            this.callbackLog(notImplemented + 'Editor3dEndConstruction')
        }
    }

    Editor3dAddBakedMesh(runtimeComponentId: number, materialId: string, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dAddBakedMesh ${runtimeComponentId}`)
            this._configurationConstructor.addBakedMesh(runtimeComponentId, materialId, vertices, indices, uvCoords, normals, environmentGeometry);
        } else {
            this.callbackLog(notImplemented + 'Editor3dAddBakedMesh')
        }
    }

    Editor3dAddNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materialId: string, transform: Float32Array, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean, uvTransform: Float32Array): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dAddNamedMesh ${runtimeComponentId} ${meshId} ${geometryId}`)
            this._configurationConstructor.addNamedMesh(runtimeComponentId, meshId, geometryId, materialId, transform, vertices, indices, uvCoords, normals, environmentGeometry, uvTransform);
        } else {
            this.callbackLog(notImplemented + 'Editor3dAddNamedMesh')
        }
    }

    Editor3ChangedNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materiadlId: string, transform: Float32Array, uvTransform: Float32Array): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3ChangedNamedMesh ${runtimeComponentId} ${meshId} ${geometryId}`)
            this._configurationConstructor.changedNamedMesh(runtimeComponentId, meshId, geometryId, materiadlId, transform, uvTransform);
        } else {
            this.callbackLog(notImplemented + 'Editor3ChangedNamedMesh')
        }
    }

    Editor3dRemoveNamedMesh(runtimeComponentId: number, geometryId: string): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dRemoveNamedMesh ${runtimeComponentId} ${geometryId}`)
            this._configurationConstructor.removeNamedMesh(runtimeComponentId, geometryId);
        } else {
            this.callbackLog(notImplemented + 'Editor3dRemoveNamedMesh')
        }
    }

    Editor3dPlanObjectConstructionDone(planObjectId: number): void {
        if (this._configurationConstructor) {
            this.callbackLog(`Editor3dPlanObjectConstructionDone ${planObjectId}`)
            this._configurationConstructor.objectConstructionDone(planObjectId);
        } else {
            this.callbackLog(notImplemented + 'Editor3dPlanObjectConstructionDone')
        }
    }
}