import renameValue from "../renameValue/index.js";
import { isPlainObject } from "../guards/index.js";

/**
 * Story: Object Key Renaming & Scoped Spec Phase
 * Renames keys at the current level using leaf strings or scoped branch objects with $as.
 * Strips directives ($as, as, $rename) before passing child specs down to nested structures.
 */
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
            // Scoped branch rule: rename parent key via $as/as/$rename and scope childSpec
            targetKey = rule.$as || rule.as || rule.$rename || key;
            const { $as, as, $rename, ...cleanSpec } = rule;
            childSpec = cleanSpec;
        }

        localResult[targetKey] = renameValue({
            inSource: val,
            inSpec: childSpec
        });
    });

    return localResult;
};

export { forObject };
export default forObject;
