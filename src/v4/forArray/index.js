import renameValue from "../renameValue/index.js";

/**
 * Story: Array Traversal Phase
 * Iterates through arrays of objects or values, mapping each element with the current spec.
 */
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

export { forArray };
export default forArray;
