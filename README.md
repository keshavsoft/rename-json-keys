# rename-json-keys

> Recursively rename JSON keys using a simple dictionary map without changing data structures or values.

[![npm version](https://img.shields.io/npm/v/rename-json-keys.svg)](https://www.npmjs.com/package/rename-json-keys)
[![Documentation](https://img.shields.io/badge/Docs-Live%20Documentation-blue.svg)](https://keshavsoft.github.io/rename-json-keys/)
[![Playground](https://img.shields.io/badge/Playground-Interactive%20Tester-emerald.svg)](https://keshavsoft.github.io/rename-json-keys/playground.html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🔗 Quick Links

* 📖 **Documentation**: [https://keshavsoft.github.io/rename-json-keys/](https://keshavsoft.github.io/rename-json-keys/)
* 🎮 **Interactive Playground**: [https://keshavsoft.github.io/rename-json-keys/playground.html](https://keshavsoft.github.io/rename-json-keys/playground.html)
* 📦 **npm Package**: [https://www.npmjs.com/package/rename-json-keys](https://www.npmjs.com/package/rename-json-keys)
* 🐙 **GitHub Repository**: [https://github.com/keshavsoft/rename-json-keys](https://github.com/keshavsoft/rename-json-keys)

---

## Why rename-json-keys?

JavaScript has no native way to recursively rename keys in deeply nested objects and arrays without writing manual traversal code or mutating your original data.

`rename-json-keys` gives you:
* **Truly Recursive**: Renames keys everywhere in arrays and nested objects.
* **Non-Destructive**: Never mutates input data; data structure and order remain intact.
* **Zero Dependencies**: Lightweight and fast.
* **Simple Dictionary Map**: Just specify `{ "oldKey": "newKey" }`.

---

## Installation

```bash
npm install rename-json-keys
```

---

## Quick Start (5 Seconds)

```javascript
import { renameJsonKeys } from "rename-json-keys";

const user = {
  user_id: 101,
  contact_info: {
    first_name: "John",
    last_name: "Doe",
    email_addr: "john@example.com"
  }
};

const keyMap = {
  user_id: "id",
  first_name: "firstName",
  last_name: "lastName",
  email_addr: "email"
};

const result = renameJsonKeys(user, keyMap);
console.log(result);
```

### Output:

```json
{
  "id": 101,
  "contact_info": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

## Options Object Convention

Also supports the KeshavSoft single-object argument convention:

```javascript
const result = renameJsonKeys({
  inData: user,
  inKeys: keyMap
});
```

---

## Advanced: Deeply Nested Enterprise Data

Handles multi-level enterprise structures (like accounting vouchers, orders, or logistics manifests) seamlessly:

```javascript
const vouchers = [
  {
    DATE: "20260401",
    VOUCHERNUMBER: 1,
    "ALLINVENTORYENTRIES.LIST": [
      {
        STOCKITEMNAME: "Shading Net Kgs",
        AMOUNT: 1280.9,
        "BATCHALLOCATIONS.LIST": [
          {
            MFDON: 20210723,
            GODOWNNAME: "Main Location",
            AMOUNT: 1000
          }
        ]
      }
    ]
  }
];

const keyMap = {
  DATE: "date",
  VOUCHERNUMBER: "voucherNumber",
  "ALLINVENTORYENTRIES.LIST": "inventoryEntries",
  STOCKITEMNAME: "stockItemName",
  AMOUNT: "amount",
  "BATCHALLOCATIONS.LIST": "batchAllocations",
  MFDON: "mfdOn",
  GODOWNNAME: "godownName"
};

const clean = renameJsonKeys(vouchers, keyMap);
```

---

## Pipeline Role

Used as Step 2 in the KeshavSoft declarative data suite:

```text
Tally XML ➔ select-json-by-json ➔ rename-json-keys ➔ normalize-json-by-json ➔ map-json-by-json
```

---

## License

[MIT](LICENSE) © [KeshavSoft](https://keshavsoft.com)
