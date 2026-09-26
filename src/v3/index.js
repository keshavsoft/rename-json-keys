import registerGlobal from "./registerGlobal.js";
import renameValue from "./renameValue/index.js";
import forObject from "./forObject/index.js";
import forArray from "./forArray/index.js";
import guards from "./guards/index.js";
import meta from "./meta.js";

/**
 * Story: KeshavSoft Options Wrapper & Entrypoint Phase
 * Accepts single options object { inSource, inSpec } / { inData, inKeys } or positional arguments (source, spec).
 */
const renameJsonKeys = (inSource, inSpec) => {
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

// Register onto globalThis for browser and Node globals
registerGlobal({ inFuncDefinition: renameJsonKeys });

export {
    renameJsonKeys,
    renameValue,
    forObject,
    forArray,
    guards,
    meta
};

export default renameJsonKeys;
