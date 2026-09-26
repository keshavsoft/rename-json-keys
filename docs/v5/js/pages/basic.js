import renameJsonKeys from "../common/renameJsonKeys.js";

/**
 * Initializes the live transformation display on the Basic example page.
 * Guarded against missing DOM to prevent any cross-page errors.
 */
const renderBasicOutput = ({ inElementId }) => {
    const localElementId = inElementId;
    const localTargetEl = document.querySelector(localElementId);

    if (!localTargetEl) {
        return;
    }

    const localSource = {
        first_name: "John",
        age: 30,
        city: "Kakinada"
    };

    const localMapping = {
        first_name: "name",
        age: "years",
        city: "location"
    };

    const localResult = renameJsonKeys({
        inValue: localSource,
        inMapping: localMapping
    });

    localTargetEl.textContent = JSON.stringify(localResult, null, 2);
};

renderBasicOutput({ inElementId: "#output" });
