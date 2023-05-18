import {
    ConfiguratorCoreInterface, 
    ConfiguratorContainer, 
    Vector3f
} from 'roomle-core-hsc/src/embind/configuratorCoreInterface'
import { ConfigurationConstructorInterface } from 'roomle-core-hsc/src/embind/configuratorCallback'
import { loadMaterials } from './rapiAccess'

export interface MeshData {
    meshes: MeshSpecification[]
    materials: any[]
}

export interface MeshSpecification {
    runtimeComponentId: number,
    environmentGeometry: boolean,
    baked: boolean
    meshId?: string,
    geometryId?: string,
    materialId: string,
    vertices: Float32Array,
    indices: Uint32Array,
    uvCoords: Float32Array,
    normals: Float32Array,
    transform?: Float32Array,
    uvTransform?: Float32Array
}

export class ConfigurationConstructor implements ConfigurationConstructorInterface {

    private _configuratorModule: ConfiguratorContainer
    private _configurator: ConfiguratorCoreInterface
    private _meshData?: MeshData

    public constructor(configuratorModule: ConfiguratorContainer, configurator: ConfiguratorCoreInterface) {
        this._configuratorModule = configuratorModule
        this._configurator = configurator
    }

    public async construct(objectId: number) : Promise<MeshData> {
        this._meshData = { 'meshes': [], 'materials': [] }
        await  this.constructGeometry(objectId)
        await this.loadMaterials(objectId)
        const meshData: MeshData = this._meshData
        this._meshData = undefined
        return meshData
    }

    public async constructGeometry(objectId: number) : Promise<void> {
        console.log(`CONSTRUCT: ${objectId}`)
        this._configurator.requestPlanObjectConstruction(objectId)
        console.log(`... CONSTRUCTED: ${objectId}`)
    }

    public async loadMaterials(objectId: number) : Promise<void> {
        if (!this._meshData) {
            return
        }
        console.log(`LOAD MATERIALS: ${objectId}`)
        const materialIds: string[] = Array.from(new Set(this._meshData.meshes.map(mesh => mesh.materialId)));
        const materialData: any = await loadMaterials(materialIds)
        this._meshData.materials = materialData.materials
        console.log(`... MATERIALS LOADED: ${objectId}`)
    }

    public componentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectRuntimeId: number, isRootComponent: boolean): void {
    }

    public rootComponentCreated(id: number, position: Vector3f, eulerAngles: Vector3f, parentObjectId: number): void {
    }

    public geometryReady(id: number): void {
        
    }

    public geometryNotReady(id: number): void {
        
    }

    public beginConstruction(componentId: number, isDeltaUpdate: boolean): void {
        
    }

    public endConstruction(id: number): void {
        
    }

    private findMesh(runtimeComponentId: number, meshId: string, geometryId: string): MeshSpecification | undefined {
        return this._meshData?.meshes.find((mesh: any) => 
            !mesh.baked && 
            mesh.runtimeComponentId === runtimeComponentId && 
            mesh.meshId === meshId && 
            mesh.geometryId === geometryId)
    }

    public addBakedMesh(runtimeComponentId: number, materialId: string, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean): void {
        if (!this._meshData) {
            return
        }
        this._meshData.meshes.push({
            runtimeComponentId: runtimeComponentId,
            environmentGeometry: environmentGeometry,
            baked: true,
            meshId: undefined,
            geometryId: undefined,
            materialId: materialId,
            vertices: Float32Array.from(vertices),
            indices: Uint32Array.from(indices),
            uvCoords: Float32Array.from(uvCoords),
            normals: Float32Array.from(normals),
            transform: undefined,
            uvTransform: undefined
        })
    }

    public addNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materialId: string, transform: Float32Array, vertices: Float32Array, indices: Int32Array, uvCoords: Float32Array, normals: Float32Array, environmentGeometry: boolean, uvTransform: Float32Array): void {
        if (!this._meshData) {
            return
        }
        const meshData = this.findMesh(runtimeComponentId, meshId, geometryId)
        if (meshData) {
            meshData.environmentGeometry = environmentGeometry
            meshData.materialId = materialId
            meshData.vertices = Float32Array.from(vertices) 
            meshData.indices = Uint32Array.from(indices)
            meshData.uvCoords = Float32Array.from(uvCoords)
            meshData.normals = Float32Array.from(normals)
            meshData.transform = Float32Array.from(transform)
            meshData.uvTransform = uvTransform ? Float32Array.from(uvTransform) : undefined
        } else {
            this._meshData.meshes.push({
                runtimeComponentId: runtimeComponentId,
                environmentGeometry: environmentGeometry,
                baked: false,
                meshId: meshId,
                geometryId: geometryId,
                materialId: materialId,
                vertices: Float32Array.from(vertices),
                indices: Uint32Array.from(indices),
                uvCoords: Float32Array.from(uvCoords),
                normals: Float32Array.from(normals),
                transform: Float32Array.from(transform),
                uvTransform: uvTransform ? Float32Array.from(uvTransform) : undefined 
            })
        }
    }

    public changedNamedMesh(runtimeComponentId: number, meshId: string, geometryId: string, materialId: string, transform: Float32Array, uvTransform: Float32Array): void {
        const meshData = this.findMesh(runtimeComponentId, meshId, geometryId)
        if (meshData) {
            meshData.materialId = materialId
            meshData.transform = Float32Array.from(transform)
            meshData.uvTransform = uvTransform ? Float32Array.from(uvTransform) : undefined
        }
    }

    public removeNamedMesh(runtimeComponentId: number, geometryId: string): void {
    }

    public objectConstructionDone(planObjectId: number): void {
    }
}