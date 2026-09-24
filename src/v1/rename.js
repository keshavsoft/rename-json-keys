/**
 * rename-json-keys v1 Engine
 * Story: Recursively renames JSON keys using a mapping dictionary or tree while preserving structure and values.
 */

const isObject = ({ inValue } = {}) => {
    const localValue = inValue;
    return localValue !== null && typeof localValue === "object";
};

const isPlainObject = ({ inValue } = {}) => {
    const localValue = inValue;
    return isObject({ inValue: localValue }) && !Array.isArray(localValue);
};

const isArray = ({ inValue } = {}) => {
    const localValue = inValue;
    return Array.isArray(localValue);
};

const forArray = ({ inArray, inKeys, inRootKeys } = {}) => {
    const localArray = inArray;
    const localKeys = inKeys;
    const localRootKeys = inRootKeys ?? inKeys;

    if (!Array.isArray(localArray)) {
        return [];
    }

    return localArray.map(item => renameValue({
        inValue: item,
        inKeys: localKeys,
        inRootKeys: localRootKeys
    }));
};

const forObject = ({ inObject, inKeys, inRootKeys } = {}) => {
    const localObject = inObject;
    const localKeys = inKeys ?? {};
    const localRootKeys = inRootKeys ?? localKeys;

    if (!isPlainObject({ inValue: localObject })) {
        return localObject;
    }

    const localResult = {};

    Object.entries(localObject).forEach(([key, val]) => {
        // Look up mapping rule: prioritize scoped keys, then root keys
        const rule = localKeys[key] ?? localRootKeys?.[key];

        let targetKey = key;
        let childKeys = localRootKeys;

        if (typeof rule === "string") {
            targetKey = rule;
            childKeys = localRootKeys;
        } else if (isPlainObject({ inValue: rule })) {
            targetKey = rule.$as || rule.as || key;
            childKeys = rule;
        }

        localResult[targetKey] = renameValue({
            inValue: val,
            inKeys: childKeys,
            inRootKeys: localRootKeys
        });
    });

    return localResult;
};

export const renameValue = ({ inValue, inKeys, inRootKeys } = {}) => {
    const localValue = inValue;
    const localKeys = inKeys;
    const localRootKeys = inRootKeys ?? inKeys;

    if (!isObject({ inValue: localValue })) {
        return localValue;
    }

    if (isArray({ inValue: localValue })) {
        return forArray({
            inArray: localValue,
            inKeys: localKeys,
            inRootKeys: localRootKeys
        });
    }

    return forObject({
        inObject: localValue,
        inKeys: localKeys,
        inRootKeys: localRootKeys
    });
};

export const renameJsonKeys = (inData, inKeys) => {
    // Case 1: Called with single options object { inData, inKeys } or { inSource, inKeys }
    if (
        inData !== null &&
        typeof inData === "object" &&
        !Array.isArray(inData) &&
        ("inData" in inData || "inSource" in inData) &&
        ("inKeys" in inData || "inMapping" in inData)
    ) {
        const localData = inData.inData ?? inData.inSource;
        const localKeys = inData.inKeys ?? inData.inMapping;
        return renameValue({ inValue: localData, inKeys: localKeys });
    }

    // Case 2: Positional arguments (data, keys)
    const localData = inData;
    const localKeys = inKeys;
    return renameValue({ inValue: localData, inKeys: localKeys });
};

export {
    isObject,
    isPlainObject,
    isArray,
    forArray,
    forObject
};

export default renameJsonKeys;
