const express = require('express');
const fs = require('fs');
const path = require('path');
const argon2 = require('argon2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'users.json');

function readUsers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = readUsers();
    if (users.find(u => u.email === email)) return res.status(409).json({ error: 'email already registered' });

    const hash = await argon2.hash(password);
    const user = { email, passwordHash: hash };
    if (fullName) user.fullName = fullName;

    users.push(user);
    writeUsers(users);

    return res.status(201).json({ email });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const users = readUsers();
    const found = users.find(u => u.email === email);
    if (!found) return res.status(401).json({ error: 'invalid' });

    const ok = await argon2.verify(found.passwordHash, password);
    if (!ok) return res.status(401).json({ error: 'invalid' });

    // For demo we return a simple success and the email. In production, issue a token.
    return res.json({ email });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Auth server running on port', port));

// Payment storage (masked only)
// GET /api/payment?email=...
app.get('/api/payment', (req, res) => {
  try {
    const email = (req.query || {}).email;
    if (!email) return res.status(400).json({ error: 'email required' });
    const users = readUsers();
    const found = users.find(u => u.email === email);
    if (!found) return res.status(404).json({ error: 'not found' });
    return res.json({ payment: found.payment || null });
  } catch (err) {
    console.error('get payment error', err);
    return res.status(500).json({ error: 'internal' });
  }
});

// POST /api/payment { email, payment: { cardholderName, brand, last4, expMonth, expYear } }
app.post('/api/payment', (req, res) => {
  try {
    const { email, payment } = req.body || {};
    if (!email || !payment) return res.status(400).json({ error: 'email and payment required' });
    const { cardholderName, brand, last4, expMonth, expYear } = payment;
    if (!cardholderName || !brand || !last4 || !expMonth || !expYear) {
      return res.status(400).json({ error: 'incomplete payment payload' });
    }
    const users = readUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    users[idx].payment = { cardholderName, brand, last4, expMonth, expYear, updatedAt: new Date().toISOString() };
    writeUsers(users);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('post payment error', err);
    return res.status(500).json({ error: 'internal' });
  }
});
