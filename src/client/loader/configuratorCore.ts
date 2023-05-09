import {
    ConfiguratorContainer,
    ConfiguratorIoContext,
    ConfiguratorCoreInterface,
    ConfiguratorCallback
} from './wasm/configuratorCoreInterface'
import {convertCObject} from './configuratorUtils'

interface ConfiguratorCoreModule extends ConfiguratorContainer {
}

export interface IoContext extends ConfiguratorIoContext {
}

export class ConfiguratorCore {
    private _useWasm: boolean
    private _configuratorCoreModule?: ConfiguratorCoreModule
    private _configuratorCoreInstance?: ConfiguratorCoreInterface

    constructor(useWasm : boolean) {
        this._useWasm = useWasm
    }

    public getConfiguratorModule(): ConfiguratorCoreModule | undefined {
        return this._configuratorCoreModule;
    }

    public getConfigurator(): ConfiguratorCoreInterface | undefined {
        return this._configuratorCoreInstance;
    }

    private async init(ioContext: IoContext, configuratorCallback: ConfiguratorCallback) : Promise<void> {
        if (!this._configuratorCoreInstance) {
            //const configuratorCoreModuleConstructor = await require(this._useWasm
            //    ? './wasm/ConfiguratorKernel.js'
            //    : './wasm/ConfiguratorKernelJs.js');  
            const configuratorCoreModuleConstructor = await require('./wasm/ConfiguratorKernel.js')
            this._configuratorCoreModule = await configuratorCoreModuleConstructor() as ConfiguratorCoreModule
            this._configuratorCoreModule.setExternalHelpers(ioContext, {convertCObject})
            this._configuratorCoreModule.registerConfiguratorCallback(configuratorCallback);
            // @ts-ignore
            this._configuratorCoreInstance = new this._configuratorCoreModule.Kernel()
            this._configuratorCoreInstance?.useEnvironmentGeometry(true)
        }
    }

    public static async newConfiguratorCore(ioContext: IoContext, configuratorCallback: ConfiguratorCallback, useWasm : boolean) : Promise<ConfiguratorCore> {
        const configuratorCore : ConfiguratorCore = new ConfiguratorCore(useWasm)
        await configuratorCore.init(ioContext, configuratorCallback)
        return configuratorCore
    }
}