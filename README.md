# rename-json-keys

> Recursively rename JSON keys using a mapping dictionary or spec without altering data structure or values.

[![npm version](https://img.shields.io/npm/v/rename-json-keys.svg)](https://www.npmjs.com/package/rename-json-keys)
[![Live Docs & Playground](https://img.shields.io/badge/Docs-Live%20Playground-emerald.svg)](https://keshavsoft.github.io/rename-json-keys/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

---

## Quick Links

* 🌐 **Interactive Web Playground:** [https://keshavsoft.github.io/rename-json-keys/](https://keshavsoft.github.io/rename-json-keys/)
* 📦 **npm Package:** [https://www.npmjs.com/package/rename-json-keys](https://www.npmjs.com/package/rename-json-keys)
* 🐙 **GitHub Repository:** [https://github.com/keshavsoft/rename-json-keys](https://github.com/keshavsoft/rename-json-keys)
* 🚀 **End-to-End Pipeline Workbench:** [https://keshavsoft.github.io/json-transform-recipes/](https://keshavsoft.github.io/json-transform-recipes/)

---

## The Vision: Part of the Declarative Data Pipeline

`rename-json-keys` is **Step 2** in the declarative data pipeline. It normalizes verbose or legacy uppercase keys into clean property names without mutating values or changing array structures:

```
[ Raw Enterprise XML / JSON ]
             │
             ▼
   select-json-by-json     --> Step 1: Filter fields (1:1 projection)
             │
             ▼
    rename-json-keys       --> Step 2: Normalize keys (Input Data is Source of Truth)
             │
             ▼
    map-json-by-json       --> Step 3: Reshape into contract (Template is Source of Truth)
             │
             ▼
    json-to-tag-table      --> Step 4: Render interactive drilldown web tables
```

### Ecosystem Repositories

| Step | Package | Role | Links |
| :---: | :--- | :--- | :--- |
| **1** | **`select-json-by-json`** | Field projection & filtering | [GitHub](https://github.com/keshavsoft/select-json-by-json) • [Playground](https://keshavsoft.github.io/select-json-by-json/) |
| **2** | **`rename-json-keys`** | Key normalization (this package) | [GitHub](https://github.com/keshavsoft/rename-json-keys) • [Playground](https://keshavsoft.github.io/rename-json-keys/) |
| **3** | **`map-json-by-json`** | Schema contract mapping | [GitHub](https://github.com/keshavsoft/map-json-by-json) • [Playground](https://keshavsoft.github.io/map-json-by-json/) |
| **4** | **`json-to-tag-table`** | Visual table & child drilldown | [GitHub](https://github.com/keshavsoft/json-to-tag-table) • [Table UI](https://keshavsoft.github.io/json-transform-recipes/4-table.html) |
| **Suite** | **`json-transform-recipes`** | Master workbench & pipeline recipes | [GitHub](https://github.com/keshavsoft/json-transform-recipes) • [Workbench](https://keshavsoft.github.io/json-transform-recipes/) |

---

## Installation

### Node.js (npm)
```bash
npm install rename-json-keys
```

### Browser via CDN
```html
<script type="module">
  import { renameJsonKeys } from "https://cdn.jsdelivr.net/gh/keshavsoft/rename-json-keys@main/docs/dist/min.js";
  // or window.ks.renameJsonKeys
</script>
```

---

## Usage

### 1. Real-World Enterprise Vouchers & Nested Batch Allocations

Deeply nested records—such as vouchers containing inventory collections with child batch allocations—are recursively renamed at every level. The data structure is 100% preserved:

```javascript
import { renameJsonKeys } from "rename-json-keys";

const vouchers = [
  {
    "DATE": "20260401",
    "VOUCHERTYPENAME": "Sales/CA",
    "VOUCHERNUMBER": 1,
    "REFERENCE": "CA/1",
    "MASTERID": 174169,
    "ALLINVENTORYENTRIES.LIST": [
      {
        "STOCKITEMNAME": "Shading Net Kgs",
        "RATE": "280.90/kgs",
        "AMOUNT": 1280.9,
        "ACTUALQTY": "4.560 kgs",
        "BILLEDQTY": "4.560 kgs",
        "BATCHALLOCATIONS.LIST": [
          {
            "MFDON": 20210723,
            "GODOWNNAME": "Main Location",
            "BATCHNAME": "Rishi-Rs.205/-",
            "DESTINATIONGODOWNNAME": "Main Location",
            "ACTUALQTY": "3.560 kgs",
            "BILLEDQTY": "3.560 kgs",
            "AMOUNT": 1000
          }
        ]
      }
    ]
  }
];

const keyMap = {
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

const clean = renameJsonKeys(vouchers, keyMap);
console.log(JSON.stringify(clean[0].inventoryEntries[0].batchAllocations[0], null, 2));
```

**Output:**
```json
{
  "mfdOn": 20210723,
  "godownName": "Main Location",
  "batchName": "Rishi-Rs.205/-",
  "destinationGodownName": "Main Location",
  "actualQty": "3.560 kgs",
  "billedQty": "3.560 kgs",
  "amount": 1000
}
```

---

### 2. Scoped Branch Renaming (`$as`)

When a child sub-collection requires dedicated property mappings distinct from global keys, supply an object with `$as`:

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

Both positional arguments and the single options object calling convention are supported:

```javascript
const result = renameJsonKeys({
  inData: vouchers,
  inKeys: keyMap
});
```

---

## Dynamic Multi-Version Architecture

`rename-json-keys` uses auto-discovering version loaders:
* `import { renameJsonKeys } from "rename-json-keys"` — dynamically loads the highest version engine available (`v1`).
* `import { renameJsonKeys } from "rename-json-keys/v1"` — loads `v1` explicitly.

---

## License

[MIT](LICENSE) © [KeshavSoft](https://keshavsoft.com)
