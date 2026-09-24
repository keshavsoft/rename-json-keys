import test from "node:test";
import assert from "node:assert/strict";
import { renameJsonKeys, meta } from "../src/index.js";
import renameV1, { renameJsonKeys as namedV1, meta as metaV1 } from "../src/v1/index.js";

test("dynamically loads v1 engine as latest", () => {
    assert.equal(meta.version, "v1.0");
    assert.equal(metaV1.version, "v1.0");
    assert.equal(typeof renameJsonKeys, "function");
    assert.equal(typeof renameV1, "function");
    assert.equal(typeof namedV1, "function");
});

test("renames top-level keys in an object", () => {
    const data = { VOUCHERNUMBER: 101, VOUCHERTYPENAME: "Sales", EXTRA: "keep" };
    const keys = { VOUCHERNUMBER: "voucherNo", VOUCHERTYPENAME: "voucherType" };
    assert.deepEqual(renameJsonKeys(data, keys), {
        voucherNo: 101,
        voucherType: "Sales",
        EXTRA: "keep"
    });
});

test("renames keys in arrays of objects", () => {
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

test("renames deeply nested enterprise keys (inventory and batch allocations)", () => {
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

    assert.deepEqual(renameJsonKeys(data, keys), expected);
});

test("supports scoped nested renaming with $as", () => {
    const data = {
        PARENT: {
            "CHILD.LIST": [
                { OLD_NAME: "val" }
            ]
        }
    };

    const keys = {
        "CHILD.LIST": {
            $as: "children",
            OLD_NAME: "newName"
        }
    };

    assert.deepEqual(renameJsonKeys(data, keys), {
        PARENT: {
            children: [
                { newName: "val" }
            ]
        }
    });
});

test("supports object parameter convention { inData, inKeys }", () => {
    const inData = { A: 1, B: 2 };
    const inKeys = { A: "alpha" };
    assert.deepEqual(renameJsonKeys({ inData, inKeys }), { alpha: 1, B: 2 });
    assert.deepEqual(renameV1({ inData, inKeys }), { alpha: 1, B: 2 });
});

test("safely handles null, undefined, and non-object inputs", () => {
    assert.equal(renameJsonKeys(null, { A: "alpha" }), null);
    assert.equal(renameJsonKeys(undefined, { A: "alpha" }), undefined);
    assert.equal(renameJsonKeys("string", { A: "alpha" }), "string");
    assert.equal(renameJsonKeys(123, { A: "alpha" }), 123);
    assert.deepEqual(renameJsonKeys([], { A: "alpha" }), []);
    assert.deepEqual(renameJsonKeys({ A: 1 }, null), { A: 1 });
});

test("registers on globalThis.ks", () => {
    assert.equal(typeof globalThis.ks, "object");
    assert.equal(typeof globalThis.ks.renameJsonKeys, "function");
    assert.equal(typeof globalThis.ks["rename-json-keys"], "object");
    assert.equal(globalThis.ks["rename-json-keys"].meta.version, "v1.0");

    const res = globalThis.ks.renameJsonKeys({ OLD: 42 }, { OLD: "NEW" });
    assert.deepEqual(res, { NEW: 42 });
});
