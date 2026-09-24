import renameJsonKeys from "../../src/index.js";

import dataJson from './data.json' with { type: 'json' };

const keys = {
    DATE: "date",
    VOUCHERTYPENAME: "voucherType",
    VOUCHERNUMBER: "voucherNumber",
    REFERENCE: "reference",
    MASTERID: "masterId",
    "ALLINVENTORYENTRIES.LIST": "inventoryEntries",
    STOCKITEMNAME: "stockItemName",
    RATE: "rate",
    AMOUNT: "amount",
    ACTUALQTY: "actualQty",
    BILLEDQTY: "billedQty",
    "BATCHALLOCATIONS.LIST": "batchAllocations",
    MFDON: "mfdOn",
    GODOWNNAME: "godownName",
    BATCHNAME: "batchName",
    DESTINATIONGODOWNNAME: "destinationGodownName"
};

const result = renameJsonKeys(dataJson, keys);

console.log("=== Full Renamed Record 0 ===");
console.dir(result[0], { depth: null });

console.log("\n=== Specifically L17-L18 Renamed Batch Allocation ===");
console.log(result[0].inventoryEntries[0].batchAllocations[0]);


