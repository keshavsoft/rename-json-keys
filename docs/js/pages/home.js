import renameJsonKeys from "../common/renameJsonKeys.js";

const source = {
    first_name: "John",
    age: 30,
    city: "Kakinada"
};

const mapping = {
    first_name: "name",
    age: "years",
    city: "location"
};

document.querySelector("#output").textContent =
    JSON.stringify(renameJsonKeys(source, mapping), null, 2);
