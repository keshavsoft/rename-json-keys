/**
 * Recursively renames keys of an object or array according to a mapping specification.
 * Supports string mappings, nested object mappings, and $as / $rename directives.
 * Adheres strictly to the { inProperty } and localProperty naming convention.
 */
const renameJsonKeys = ({ inValue, inMapping = {} }) => {
    const localValue = inValue;
    const localMapping = inMapping ?? {};

    if (Array.isArray(localValue)) {
        return localValue.map(item => renameJsonKeys({ inValue: item, inMapping: localMapping }));
    }

    if (localValue !== null && typeof localValue === "object") {
        return Object.fromEntries(
            Object.entries(localValue).map(([key, child]) => {
                const rule = localMapping[key];
                let mappedKey = key;
                let childMapping = {};

                if (typeof rule === "string") {
                    mappedKey = rule;
                } else if (rule !== null && typeof rule === "object" && !Array.isArray(rule)) {
                    mappedKey = rule.$as || rule.as || rule.$rename || key;
                    const { $as, as, $rename, ...cleanSpec } = rule;
                    childMapping = cleanSpec;
                }

                return [mappedKey, renameJsonKeys({ inValue: child, inMapping: childMapping })];
            })
        );
    }

    return localValue;
};

export default renameJsonKeys;
