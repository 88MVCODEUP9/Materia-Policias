/* Rode com: node scripts/verificar-cards.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({
  document: {querySelector: () => null, querySelectorAll: () => [], addEventListener() {}},
  window: {addEventListener() {}}, location: {search: ''}, URLSearchParams,
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/app.js'), 'utf8'), context);
for (const [a, b, expected] of [
  [true, true, [false, true, true, false, true, true]],
  [true, false, [false, false, true, true, false, false]],
  [false, true, [true, false, true, true, true, false]],
  [false, false, [true, false, false, false, true, true]],
]) assert.deepEqual(Array.from(Object.values(context.avaliarConectivos(a,b))), expected);
console.log('OK: os seis conectivos nas quatro combinações de p e q.');
