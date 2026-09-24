# rename-json-keys

> Recursively rename JSON keys using a mapping dictionary or spec without altering data structure or values.

[![npm version](https://img.shields.io/npm/v/rename-json-keys.svg)](https://www.npmjs.com/package/rename-json-keys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## The Problem

Enterprise backend systems, legacy ERPs, or XML/SOAP APIs produce cumbersome and verbose property names:
```json
{
  "VOUCHERNUMBER": 1,
  "ALLINVENTORYENTRIES.LIST": [
    {
      "STOCKITEMNAME": "Shading Net",
      "BATCHALLOCATIONS.LIST": [
        { "BATCHNAME": "B1" }
      ]
    }
  ]
}
```
Accessing `row["ALLINVENTORYENTRIES.LIST"]` in UI table renderers or frontend views is clumsy and error-prone.

`rename-json-keys` cleanly renames these keys recursively at any depth while leaving your data values and array structures 100% intact.

---

## Installation

```bash
npm install rename-json-keys
```

---

## Usage

### 1. Global Dictionary Renaming (Flat Spec)

Pass a simple dictionary of `{ "OLD_KEY": "newKey" }`. Keys are renamed anywhere they appear in the JSON tree:

```javascript
import { renameJsonKeys } from "rename-json-keys";

const rawData = [
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

const keyMap = {
  VOUCHERNUMBER: "voucherNo",
  DATE: "date",
  "ALLINVENTORYENTRIES.LIST": "items",
  STOCKITEMNAME: "itemName",
  RATE: "rate",
  AMOUNT: "amount",
  "BATCHALLOCATIONS.LIST": "batches",
  BATCHNAME: "batchName"
};

const clean = renameJsonKeys(rawData, keyMap);
console.log(clean);
```

**Output:**
```json
[
  {
    "date": "20260401",
    "voucherNo": 1,
    "items": [
      {
        "itemName": "Shading Net",
        "rate": "200/kg",
        "amount": 1000,
        "batches": [
          { "batchName": "B1", "amount": 1000 }
        ]
      }
    ]
  }
]
```

---

### 2. Scoped Hierarchical Renaming (`$as`)

If a specific child branch requires distinct renaming, specify an object with `$as`:

```javascript
const clean = renameJsonKeys(data, {
  "ALLINVENTORYENTRIES.LIST": {
    $as: "items",
    STOCKITEMNAME: "productTitle"
  }
});
```

---

### 3. KeshavSoft Parameter Convention

Supports both positional arguments and the KeshavSoft `{ inData, inKeys }` destructured object calling pattern:

```javascript
const result = renameJsonKeys({
  inData: rawData,
  inKeys: keyMap
});
```

---

## Dynamic Multi-Version Support

`rename-json-keys` includes dynamic version discovery:
* `import { renameJsonKeys } from "rename-json-keys"` — loads the latest version dynamically (`v1`).
* `import { renameJsonKeys } from "rename-json-keys/v1"` — loads `v1` explicitly.

---

## License

[MIT](LICENSE) © [KeshavSoft](https://keshavsoft.com)
