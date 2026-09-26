/**
 * rename-json-keys v2 Engine
 * Story: Tree-scoped, non-destructive, zero-dependency JSON key renaming engine following KeshavSoft conventions.
 * Every key replacement is strictly scoped to its exact location in the schema tree hierarchy.
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

const forArray = ({ inArray, inSpec } = {}) => {
    const localArray = inArray;
    const localSpec = inSpec;

    if (!Array.isArray(localArray)) {
        return [];
    }

    return localArray.map(item => renameValue({
        inSource: item,
        inSpec: localSpec
    }));
};

const forObject = ({ inSource, inSpec } = {}) => {
    const localSource = inSource;
    const localSpec = inSpec ?? {};

    if (!isPlainObject({ inValue: localSource })) {
        return localSource;
    }

    const localResult = {};

    Object.entries(localSource).forEach(([key, val]) => {
        const rule = localSpec[key];

        let targetKey = key;
        let childSpec = undefined;

        if (typeof rule === "string") {
            // Leaf rule: rename key at this exact tree level
            targetKey = rule;
        } else if (isPlainObject({ inValue: rule })) {
            // Scoped branch rule: optionally rename current key via $as, and scope childSpec
            targetKey = rule.$as || rule.as || key;
            childSpec = rule;
        }

        localResult[targetKey] = renameValue({
            inSource: val,
            inSpec: childSpec
        });
    });

    return localResult;
};

export const renameValue = ({ inSource, inSpec } = {}) => {
    const localSource = inSource;
    const localSpec = inSpec;

    if (!isObject({ inValue: localSource })) {
        return localSource;
    }

    if (isArray({ inValue: localSource })) {
        return forArray({ inArray: localSource, inSpec: localSpec });
    }

    return forObject({ inSource: localSource, inSpec: localSpec });
};

export const renameJsonKeys = (inSource, inSpec) => {
    // Case 1: Called with single options object { inSource, inSpec } or { inData, inKeys }
    if (
        inSource !== null &&
        typeof inSource === "object" &&
        !Array.isArray(inSource) &&
        ("inSource" in inSource || "inData" in inSource) &&
        ("inSpec" in inSource || "inKeys" in inSource || "inMapping" in inSource)
    ) {
        const localSource = inSource.inSource ?? inSource.inData;
        const localSpec = inSource.inSpec ?? inSource.inKeys ?? inSource.inMapping;
        return renameValue({ inSource: localSource, inSpec: localSpec });
    }

    // Case 2: Positional arguments (source, spec)
    const localSource = inSource;
    const localSpec = inSpec;
    return renameValue({ inSource: localSource, inSpec: localSpec });
};

export {
    isObject,
    isPlainObject,
    isArray,
    forArray,
    forObject
};

export default renameJsonKeys;
