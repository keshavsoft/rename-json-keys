/**
 * Recursively renames keys of an object or array according to a mapping specification.
 * Follows the { inProperty } and localProperty naming convention.
 */
const renameJsonKeys = ({ inValue, inMapping = {} }) => {
    const localValue = inValue;
    const localMapping = inMapping;

    if (Array.isArray(localValue)) {
        return localValue.map(item => renameJsonKeys({ inValue: item, inMapping: localMapping }));
    }

    if (localValue !== null && typeof localValue === "object") {
        return Object.fromEntries(
            Object.entries(localValue).map(([key, child]) => {
                const mappedKey = typeof localMapping[key] === "string"
                    ? localMapping[key]
                    : key;

                const childMapping = localMapping[key] && typeof localMapping[key] === "object"
                    ? localMapping[key]
                    : {};

                return [mappedKey, renameJsonKeys({ inValue: child, inMapping: childMapping })];
            })
        );
    }

    return localValue;
};

export default renameJsonKeys;
