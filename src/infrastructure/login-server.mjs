//Merged In app-server.js



import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const PORT = 3001; // separate from register server
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Ensure db.json exists
if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, '[]');
}

// POST /login
app.post('/login', (req, res) => {
    const { userName, password } = req.body;

    try {
        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const users = rawData.trim() ? JSON.parse(rawData) : [];

        const user = users.find(
            u => u.userName === userName && u.password === password
        );

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Login server running at http://localhost:${PORT}`);
});
