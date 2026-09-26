# rename-json-keys

> Recursively rename JSON keys using a simple dictionary map without changing data structures or values.

[![npm version](https://img.shields.io/npm/v/rename-json-keys.svg)](https://www.npmjs.com/package/rename-json-keys)
[![Documentation](https://img.shields.io/badge/Docs-Live%20Story-blue.svg)](https://keshavsoft.github.io/rename-json-keys/)
[![Playground](https://img.shields.io/badge/Playground-Interactive%20Tester-emerald.svg)](https://keshavsoft.github.io/rename-json-keys/playground/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

### The Problem

> **"The data is useful. The keys are not always useful."**

External systems and APIs often return field names that do not match the naming conventions used by your application. Changing the values or rebuilding the whole JSON structure just to rename fields adds unnecessary work and introduces bugs.

**The Goal:** Keep the JSON data exactly where it is and change only the key names.

---

## 🔗 Quick Links

* 📖 **Documentation Story**:
  * [01 · Problem](https://keshavsoft.github.io/rename-json-keys/) — Why key renaming should be isolated
  * [02 · Basic](https://keshavsoft.github.io/rename-json-keys/basic.html) — Three JSON objects, one simple transformation
  * [03 · Nested](https://keshavsoft.github.io/rename-json-keys/nested.html) — Recursive structures and arrays
  * [04 · Advanced](https://keshavsoft.github.io/rename-json-keys/advanced.html) — Explicit rules and predictable mapping
  * [05 · Usage](https://keshavsoft.github.io/rename-json-keys/usage.html) — Small transformation step & guarantees
* 🎮 **Interactive Playground** (4 Flavors): [https://keshavsoft.github.io/rename-json-keys/playground/](https://keshavsoft.github.io/rename-json-keys/playground/)
  * [01 · Simple Object](https://keshavsoft.github.io/rename-json-keys/playground/)
  * [02 · Nested Object](https://keshavsoft.github.io/rename-json-keys/playground/nested.html)
  * [03 · Array of Objects](https://keshavsoft.github.io/rename-json-keys/playground/array.html)
  * [04 · Advanced Directives (`$as`)](https://keshavsoft.github.io/rename-json-keys/playground/advanced.html)
* 📦 **npm Package**: [https://www.npmjs.com/package/rename-json-keys](https://www.npmjs.com/package/rename-json-keys)
* 🐙 **GitHub Repository**: [https://github.com/keshavsoft/rename-json-keys](https://github.com/keshavsoft/rename-json-keys)

---

## Core Guarantees

* ✅ **Renames keys recursively** throughout objects and arrays.
* ✅ **Preserves values** untouched without coercion or conversion.
* ✅ **Preserves the JSON hierarchy** and property ordering.
* ✅ **Zero dependencies** — lightweight and fast.
* ✅ **Focused transformation** — does not mix key renaming with unrelated data normalization.

---

## Installation

```bash
npm install rename-json-keys
```

---

## Usage

### 1. Basic Transformation (Flat Object)

```javascript
import renameJsonKeys from "rename-json-keys";

const input = {
  first_name: "John",
  age: 30,
  city: "Kakinada"
};

const map = {
  first_name: "name",
  age: "years",
  city: "location"
};

const output = renameJsonKeys(input, map);
console.log(output);
// { name: "John", years: 30, location: "Kakinada" }
```

---

### 2. Nested Objects & Arrays

The transformation recursively follows the JSON structure, including nested objects inside arrays:

```javascript
import { renameJsonKeys } from "rename-json-keys";

const input = {
  customer: {
    first_name: "John",
    address: { zip_code: "533001" }
  },
  items: [
    { item_name: "Pen" },
    { item_name: "Book" }
  ]
};

const map = {
  customer: {
    first_name: "name",
    address: { zip_code: "postal_code" }
  },
  items: { item_name: "name" }
};

const output = renameJsonKeys(input, map);
```

**Output:**
```json
{
  "customer": {
    "name": "John",
    "address": { "postal_code": "533001" }
  },
  "items": [
    { "name": "Pen" },
    { "name": "Book" }
  ]
}
```

---

### 3. Parent Key Renaming (`$as` Directive)

Rename both the parent container key and its child properties simultaneously using the `"$as"` directive:

```javascript
const input = {
  contact_info: {
    email_addr: "alice@example.com",
    phone_no: "+1-555-0199"
  }
};

const map = {
  contact_info: {
    $as: "contact",
    email_addr: "email",
    phone_no: "phone"
  }
};

const output = renameJsonKeys(input, map);
// { contact: { email: "alice@example.com", phone: "+1-555-0199" } }
```

---

## Single Object Parameter Convention

Also supports the KeshavSoft single-object argument convention:

```javascript
const output = renameJsonKeys({
  inSource: inputData,
  inSpec: renameMap
});

// Or using inData / inKeys aliases:
const output = renameJsonKeys({
  inData: inputData,
  inKeys: renameMap
});
```

---

## Enterprise Pipeline Role

`rename-json-keys` serves as Step 2 in the KeshavSoft declarative data suite:

```text
Tally XML ➔ select-json-by-json ➔ rename-json-keys ➔ normalize-json-by-json ➔ map-json-by-json
```

---

## License

[MIT](LICENSE) © [KeshavSoft](https://keshavsoft.com)
