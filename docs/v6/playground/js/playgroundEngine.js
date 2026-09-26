import renameJsonKeys from "../../js/common/renameJsonKeys.js";

/**
 * Reusable playground engine supporting live transformation and clipboard actions.
 * Adheres strictly to the { inProperty } and localProperty naming convention.
 */
const initPlayground = ({
    inInitialSource,
    inInitialMapping,
    inSourceId = "inputData",
    inMappingId = "inputKeys",
    inOutputId = "outputJson",
    inCopySourceBtnId = "btnCopySource",
    inCopyMappingBtnId = "btnCopyKeys",
    inCopyOutputBtnId = "btnCopyOutput"
}) => {
    const localInitialSource = inInitialSource;
    const localInitialMapping = inInitialMapping;
    const localSourceId = inSourceId;
    const localMappingId = inMappingId;
    const localOutputId = inOutputId;
    const localCopySourceBtnId = inCopySourceBtnId;
    const localCopyMappingBtnId = inCopyMappingBtnId;
    const localCopyOutputBtnId = inCopyOutputBtnId;

    const localSourceEl = document.getElementById(localSourceId);
    const localMappingEl = document.getElementById(localMappingId);
    const localOutputEl = document.getElementById(localOutputId);

    if (!localSourceEl || !localMappingEl || !localOutputEl) {
        return;
    }

    localSourceEl.value = JSON.stringify(localInitialSource, null, 2);
    localMappingEl.value = JSON.stringify(localInitialMapping, null, 2);

    const render = () => {
        try {
            const localParsedData = JSON.parse(localSourceEl.value);
            const localParsedMapping = JSON.parse(localMappingEl.value);
            const localResult = renameJsonKeys({
                inValue: localParsedData,
                inMapping: localParsedMapping
            });
            localOutputEl.textContent = JSON.stringify(localResult, null, 2);
        } catch (err) {
            localOutputEl.textContent = `// Error: ${err.message}`;
        }
    };

    localSourceEl.addEventListener("input", render);
    localMappingEl.addEventListener("input", render);

    const attachCopy = ({ inBtnId, inTargetEl }) => {
        const localBtnId = inBtnId;
        const localEl = inTargetEl;
        const localBtn = document.getElementById(localBtnId);

        if (!localBtn || !localEl) {
            return;
        }

        localBtn.addEventListener("click", () => {
            const localText = localEl.value || localEl.textContent;
            navigator.clipboard.writeText(localText);
            const localOriginalText = localBtn.textContent;
            localBtn.textContent = "Copied!";
            setTimeout(() => {
                localBtn.textContent = localOriginalText;
            }, 1200);
        });
    };

    attachCopy({ inBtnId: localCopySourceBtnId, inTargetEl: localSourceEl });
    attachCopy({ inBtnId: localCopyMappingBtnId, inTargetEl: localMappingEl });
    attachCopy({ inBtnId: localCopyOutputBtnId, inTargetEl: localOutputEl });

    render();
};

export default initPlayground;
