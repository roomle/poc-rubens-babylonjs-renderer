import axios from 'axios';

const requestGet = async(url: string, parameter: any) => {
    try {
        const { data, status } = await axios.get(url, { params: parameter }) 
        return data
    } catch (error) {
        const message = axios.isAxiosError(error) ? error.message : error;
        console.log('error: ', message);
        return message;
    }
}

export async function preloadConfiguration(configurationId: string, language?: string) {
    const url : string = 'https://www.roomle.com/api/v2/preloads/components/'
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token:'anonym', configurationId: configurationId
    }
    return await requestGet(url, parameters)
}

export async function loadConfiguration(configurationId : string, language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/configurations' + (configurationId[0] == '/' ? '' : '/') + configurationId
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym'
    }
    return await requestGet(url, parameters)
}

export async function loadComponent(componentId : string, language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/components' + (componentId[0] == '/' ? '' : '/') + componentId
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym'
    }
    return await requestGet(url, parameters)
}

export async function loadComponents(componentIds : string[], language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/components'
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym', 'ids': componentIds
    }
    return await requestGet(url, parameters)
}

export async function loadItem(itemId : string, language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/items' + (itemId[0] == '/' ? '' : '/') + itemId
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym'
    }
    return await requestGet(url, parameters)
}

export async function loadMaterials(materialIds : string[], language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/materials'
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym', 'embedTextures': 'true', 'ids': materialIds
    }
    return await requestGet(url, parameters)
}

export async function loadMesh(meshId : string, quality: number, language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2/meshes' + (meshId[0] == '/' ? '' : '/') + meshId
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym', 'format': 'crt', 'targetQuality': quality
    }
    return await requestGet(url, parameters)
}

export async function loadMeshData(meshDataId : string, language?: string) : Promise<any> {
    const url : string = 'https://www.roomle.com/api/v2' + (meshDataId[0] == '/' ? '' : '/') + meshDataId
    const lang = language ?? 'en'
    const parameters = {
        apiKey: 'roomle_portal_v2', language: lang, token: 'anonym'
    }
    return await requestGet(url, parameters)
}

export async function loadData(url: string) : Promise<ArrayBuffer> {
    const { data, status } = await axios.get(url, { responseType: 'arraybuffer' }) 
    return data as ArrayBuffer
}

