/**
 * Story: Type Guard Predicates Phase
 * Validates whether values are objects, plain objects, or arrays.
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

export {
    isObject,
    isPlainObject,
    isArray
};

export default {
    isObject,
    isPlainObject,
    isArray
};
