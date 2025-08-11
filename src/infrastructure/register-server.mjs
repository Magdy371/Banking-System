
//Merged in app-server.js



import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Default route → show login page
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR)); // Serve register.html

// Ensure db.json exists
if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, '[]');
}

// API route: register new user
app.post('/register', (req, res) => {
    const newUser = req.body;

    try {
        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const users = rawData.trim() ? JSON.parse(rawData) : [];

        const emailExists = users.some(u => u.userName === newUser.userName);
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered.'
            });
        }

        // Assign a new ID to the user
        const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        const userWithId = { id: nextId, ...newUser };

        // Add the new user to the list and save
        users.push(userWithId);
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');

        res.status(201).json({ message: 'User registered successfully.', userId: nextId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
