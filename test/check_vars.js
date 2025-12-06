const fs = require("fs");

const css = fs.readFileSync("dist/kf.css", "utf8");

// 1. Find all defined variables (--foo: val;)
const definedRegex = /--([a-zA-Z0-9-]+):\s*([^;}]*)(?:;|})/g;
const definedSet = new Set();
const emptyList = [];
let match;
while ((match = definedRegex.exec(css)) !== null) {
  const name = match[1];
  const value = match[2].trim();
  definedSet.add(name);

  if (!value) {
    emptyList.push(name);
  }
}

// 2. Find all used variables (var(--foo))
const usedRegex = /var\(--([a-zA-Z0-9-]+)\)/g;
const usedSet = new Set();
while ((match = usedRegex.exec(css)) !== null) {
  usedSet.add(match[1]);
}

// 3. Calculate Lists
const missingList = []; // Used but not defined
usedSet.forEach((v) => {
  if (!definedSet.has(v)) missingList.push(v);
});

const unusedList = []; // Defined but not used
definedSet.forEach((v) => {
  if (!usedSet.has(v)) unusedList.push(v);
});

console.log(`Defined: ${definedSet.size}`);
console.log(`Used Unique: ${usedSet.size}`);

console.log(`\n--- EMPTY VALUES (Defined with no value) ---`);
if (emptyList.length === 0) console.log("None");
else emptyList.forEach((v) => console.log(v));

console.log(`\n--- MISSING (Used but not defined) ---`);
if (missingList.length === 0) console.log("None");
else missingList.forEach((v) => console.log(v));

console.log(`\n--- UNUSED (Defined but not used) ---`);
if (unusedList.length === 0) console.log("None");
else unusedList.forEach((v) => console.log(v));
