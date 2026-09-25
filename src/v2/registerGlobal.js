import meta from "./meta.js";

export const registerGlobal = (inParam) => {
    const localFuncDefinition = typeof inParam === "function"
        ? inParam
        : inParam?.inFuncDefinition;

    if (typeof globalThis === "undefined" || !localFuncDefinition) return;

    globalThis.ks ??= {};
    globalThis.ks["rename-json-keys"] = {
        meta,
        renameJsonKeys: localFuncDefinition
    };

    globalThis.ks.renameJsonKeys = localFuncDefinition;
};

export default registerGlobal;
