const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('auth.js', 'utf8');

// Minimal mocks
const store = {};
const localStorage = {
  getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};

const document = {
  _values: {},
  getElementById(id) {
    // Return an element-like object with needed properties used by auth.js
    return {
      get value() { return document._values[id] || ''; },
      set value(v) { document._values[id] = v; },
      classList: {
        add() {},
        remove() {}
      },
      set textContent(v) { this._text = v; },
      get textContent() { return this._text; },
      onclick: null
    };
  },
  addEventListener(name, cb) {
    // Immediately call DOMContentLoaded handlers for testing
    if (name === 'DOMContentLoaded') cb();
  }
};

const window = {
  location: { href: '' }
};

const context = {
  console,
  localStorage,
  document,
  window,
  alert: (msg) => { console.log('ALERT:', msg); }
};

vm.createContext(context);
try {
  vm.runInContext(source, context);
} catch (err) {
  console.error('Error while loading auth.js:', err);
  process.exit(1);
}

// Helper to print stored ph_user
function printStored() {
  console.log('ph_user in storage ->', localStorage.getItem('ph_user'));
}

console.log('--- Test 1: register user vuppur@gmail.com / Vurease01@ ---');
context.document._values.email = 'vuppur@gmail.com';
context.document._values.password = 'Vurease01@';
context.document._values.cnfPassword = 'Vurease01@';

try {
  context.register();
  printStored();
} catch (err) {
  console.error('Exception during register():', err);
}

  console.log('\n--- Test 1b: register second user alice@example.com / alicePass ---');
  context.document._values.email = 'alice@example.com';
  context.document._values.password = 'alicePass';
  context.document._values.cnfPassword = 'alicePass';
  try {
    context.register();
    console.log('ph_users ->', localStorage.getItem('ph_users'));
  } catch (err) {
    console.error('Exception during register() second:', err);
  }

console.log('\n--- Test 2: login with correct credentials ---');
context.document._values.email = 'vuppur@gmail.com';
context.document._values.password = 'Vurease01@';
try {
  context.login();
  printStored();
} catch (err) {
  console.error('Exception during login() (correct):', err);
}

console.log('\n--- Test 3: login with incorrect password ---');
context.document._values.email = 'vuppur@gmail.com';
context.document._values.password = 'wrongpass';
try {
  context.login();
  printStored();
} catch (err) {
  console.error('Exception during login() (wrong):', err);
}

console.log('\n--- Test 4: login with unregistered email ---');
context.document._values.email = 'other@example.com';
context.document._values.password = 'password123';
try {
  context.login();
  printStored();
} catch (err) {
  console.error('Exception during login() (unregistered):', err);
}
