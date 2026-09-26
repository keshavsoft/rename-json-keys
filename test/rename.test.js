import test from "node:test";
import assert from "node:assert/strict";
import { renameJsonKeys, meta, forObject, forArray, guards } from "../src/index.js";
import renameV1, { renameJsonKeys as namedV1, meta as metaV1 } from "../src/v1/index.js";
import renameV2, { renameJsonKeys as namedV2, meta as metaV2 } from "../src/v2/index.js";
import renameV3, { renameJsonKeys as namedV3, meta as metaV3 } from "../src/v3/index.js";

test("exports v3 engine as latest from src/index.js", () => {
    assert.equal(meta.version, "v3.0");
    assert.equal(metaV3.version, "v3.0");
    assert.equal(typeof renameJsonKeys, "function");
    assert.equal(typeof renameV3, "function");
    assert.equal(typeof namedV3, "function");
    assert.equal(typeof forObject, "function");
    assert.equal(typeof forArray, "function");
    assert.equal(typeof guards.isPlainObject, "function");
});

test("exports v2 engine from src/v2/index.js for backward compatibility", () => {
    assert.equal(metaV2.version, "v2.0");
    assert.equal(typeof renameV2, "function");
    assert.equal(typeof namedV2, "function");
});

test("exports v1 engine from src/v1/index.js for backward compatibility", () => {
    assert.equal(metaV1.version, "v1.0");
    assert.equal(typeof renameV1, "function");
    assert.equal(typeof namedV1, "function");
});

test("v3: renames top-level keys in an object", () => {
    const data = { VOUCHERNUMBER: 101, VOUCHERTYPENAME: "Sales", EXTRA: "keep" };
    const keys = { VOUCHERNUMBER: "voucherNo", VOUCHERTYPENAME: "voucherType" };
    assert.deepEqual(renameJsonKeys(data, keys), {
        voucherNo: 101,
        voucherType: "Sales",
        EXTRA: "keep"
    });
});

test("v3: renames keys in arrays of objects", () => {
    const data = [
        { ID: 1, NAME: "Item A" },
        { ID: 2, NAME: "Item B" }
    ];
    const keys = { ID: "id", NAME: "name" };
    assert.deepEqual(renameJsonKeys(data, keys), [
        { id: 1, name: "Item A" },
        { id: 2, name: "Item B" }
    ]);
});

test("v3: renames parent object key using $as while renaming nested children", () => {
    const data = {
        user_id: 101,
        contact_info: {
            email_addr: "alice@example.com",
            phone_no: "+1-555-0199"
        }
    };

    const keys = {
        user_id: "id",
        contact_info: {
            $as: "contact",
            email_addr: "email",
            phone_no: "phone"
        }
    };

    assert.deepEqual(renameJsonKeys(data, keys), {
        id: 101,
        contact: {
            email: "alice@example.com",
            phone: "+1-555-0199"
        }
    });
});

test("v3: renames parent object key using $rename directive", () => {
    const data = {
        meta_data: {
            created_at: "2026-04-01"
        }
    };

    const keys = {
        meta_data: {
            $rename: "meta",
            created_at: "createdAt"
        }
    };

    assert.deepEqual(renameJsonKeys(data, keys), {
        meta: {
            createdAt: "2026-04-01"
        }
    });
});

test("v3: tree-scoped nested enterprise renaming (inventory and batch allocations)", () => {
    const data = [
        {
            DATE: "20260401",
            VOUCHERNUMBER: 1,
            "ALLINVENTORYENTRIES.LIST": [
                {
                    STOCKITEMNAME: "Shading Net",
                    RATE: "200/kg",
                    AMOUNT: 1000,
                    "BATCHALLOCATIONS.LIST": [
                        { BATCHNAME: "B1", AMOUNT: 1000 }
                    ]
                }
            ]
        }
    ];

    const keys = {
        VOUCHERNUMBER: "voucherNo",
        DATE: "date",
        "ALLINVENTORYENTRIES.LIST": {
            $as: "items",
            STOCKITEMNAME: "itemName",
            RATE: "rate",
            AMOUNT: "amount",
            "BATCHALLOCATIONS.LIST": {
                $as: "batches",
                BATCHNAME: "batchName",
                AMOUNT: "amount"
            }
        }
    };

    const expected = [
        {
            date: "20260401",
            voucherNo: 1,
            items: [
                {
                    itemName: "Shading Net",
                    rate: "200/kg",
                    amount: 1000,
                    batches: [
                        { batchName: "B1", amount: 1000 }
                    ]
                }
            ]
        }
    ];

    assert.deepEqual(renameJsonKeys(data, keys), expected);
});

test("v3: supports object parameter conventions { inSource, inSpec } and { inData, inKeys }", () => {
    const inSource = { A: 1, B: 2 };
    const inSpec = { A: "alpha" };
    assert.deepEqual(renameJsonKeys({ inSource, inSpec }), { alpha: 1, B: 2 });
    assert.deepEqual(renameJsonKeys({ inData: inSource, inKeys: inSpec }), { alpha: 1, B: 2 });
});

test("v3: safely handles null, undefined, and non-object inputs", () => {
    assert.equal(renameJsonKeys(null, { A: "alpha" }), null);
    assert.equal(renameJsonKeys(undefined, { A: "alpha" }), undefined);
    assert.equal(renameJsonKeys("string", { A: "alpha" }), "string");
    assert.equal(renameJsonKeys(123, { A: "alpha" }), 123);
    assert.deepEqual(renameJsonKeys([], { A: "alpha" }), []);
    assert.deepEqual(renameJsonKeys({ A: 1 }, null), { A: 1 });
});

test("v3: registers on globalThis.ks", async () => {
    const { default: registerGlobalV3 } = await import("../src/v3/registerGlobal.js");
    registerGlobalV3({ inFuncDefinition: renameV3 });

    assert.equal(typeof globalThis.ks, "object");
    assert.equal(typeof globalThis.ks.renameJsonKeys, "function");
    assert.equal(typeof globalThis.ks["rename-json-keys"], "object");
    assert.equal(globalThis.ks["rename-json-keys"].meta.version, "v3.0");

    const res = globalThis.ks.renameJsonKeys({ OLD: 42 }, { OLD: "NEW" });
    assert.deepEqual(res, { NEW: 42 });
});

test("v1: renames deeply nested enterprise keys with flat dictionary", () => {
    const data = [
        {
            DATE: "20260401",
            VOUCHERNUMBER: 1,
            "ALLINVENTORYENTRIES.LIST": [
                {
                    STOCKITEMNAME: "Shading Net",
                    RATE: "200/kg",
                    AMOUNT: 1000,
                    "BATCHALLOCATIONS.LIST": [
                        { BATCHNAME: "B1", AMOUNT: 1000 }
                    ]
                }
            ]
        }
    ];

    const keys = {
        VOUCHERNUMBER: "voucherNo",
        DATE: "date",
        "ALLINVENTORYENTRIES.LIST": "items",
        STOCKITEMNAME: "itemName",
        RATE: "rate",
        AMOUNT: "amount",
        "BATCHALLOCATIONS.LIST": "batches",
        BATCHNAME: "batchName"
    };

    const expected = [
        {
            date: "20260401",
            voucherNo: 1,
            items: [
                {
                    itemName: "Shading Net",
                    rate: "200/kg",
                    amount: 1000,
                    batches: [
                        { batchName: "B1", amount: 1000 }
                    ]
                }
            ]
        }
    ];

    assert.deepEqual(renameV1(data, keys), expected);
});
