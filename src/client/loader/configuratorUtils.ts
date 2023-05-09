export const utilityToArray = (obj: any): any[] => {
    let result = [];
    if (obj) {
        let size = obj.size();
        for (let i = 0; i < size; i++) {
            result.push(obj.get(i));
        }
    }
    return result;
};

export const utilityStringToUTF16 = (str: string): string => {
    return decodeURIComponent(encodeURIComponent(str));
};

export const convertCObject = (obj: any): any => {
    if (!obj) {
        const typeOfObj = typeof obj;
        if (typeOfObj === 'number' || typeOfObj === 'boolean') {
            return obj;
        }
        return null;
    }

    if (!obj.hasOwnProperty('size') && !!obj.size && typeof obj.size === 'function') {
        let result = utilityToArray(obj);
        for (let i = 0; i < result.length; i++) {
            result[i] = convertCObject(result[i]);
        }
        if (typeof result === 'string') {
            return utilityStringToUTF16(result);
        }
        return result;
    }
    if (typeof obj === 'object') {
        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                obj[property] = convertCObject(obj[property]);
            }
        }
    }

    if (typeof obj === 'string') {
        return utilityStringToUTF16(obj);
    }

    return obj;
};

