# rename-json-keys

> Recursively rename JSON keys using a simple key map without changing data structure or values.

## Installation

```bash
npm install rename-json-keys
```

## Usage

Pass your data and a key map. It recursively renames matching keys across all objects and arrays:

```javascript
import { renameJsonKeys } from "rename-json-keys";

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

const result = renameJsonKeys(vouchers, keyMap);
console.log(result);
```

### Output

```json
[
  {
    "date": "20260401",
    "voucherNumber": 1,
    "inventoryEntries": [
      {
        "stockItemName": "Shading Net Kgs",
        "amount": 1280.9,
        "batchAllocations": [
          {
            "mfdOn": 20210723,
            "godownName": "Main Location",
            "amount": 1000
          }
        ]
      }
    ]
  }
]
```

## Options Object Convention

Also supports the KeshavSoft single-object argument convention:

```javascript
const result = renameJsonKeys({
  inData: vouchers,
  inKeys: keyMap
});
```

## Pipeline Role

Used as Step 2 in `tally-to-json`:

```text
Tally XML ➔ tally-clean-response ➔ select-json-by-json ➔ rename-json-keys ➔ normalize-json-by-json
```

## License

MIT © [KeshavSoft](https://keshavsoft.com)
