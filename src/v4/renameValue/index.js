import { isObject, isArray } from "../guards/index.js";
import forArray from "../forArray/index.js";
import forObject from "../forObject/index.js";

/**
 * Story: Value Dispatcher / Routing Phase
 * Inspects source data type and dispatches to array handler, object handler, or returns primitives.
 */
const renameValue = ({ inSource, inSpec } = {}) => {
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

export { renameValue };
export default renameValue;
