import registerGlobal from "./registerGlobal.js";
import { renameJsonKeys } from "./rename.js";
import meta from "./meta.js";

// Register onto globalThis for browser and Node globals
registerGlobal({ inFuncDefinition: renameJsonKeys });

export { renameJsonKeys, meta };
export default renameJsonKeys;
