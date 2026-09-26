const renameJsonKeys = (value, mapping = {}) => {
    if (Array.isArray(value)) {
        return value.map(item => renameJsonKeys(item, mapping));
    }

    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, child]) => {
                const mappedKey = typeof mapping[key] === "string"
                    ? mapping[key]
                    : key;

                const childMapping = mapping[key] && typeof mapping[key] === "object"
                    ? mapping[key]
                    : {};

                return [mappedKey, renameJsonKeys(child, childMapping)];
            })
        );
    }

    return value;
};

export default renameJsonKeys;
