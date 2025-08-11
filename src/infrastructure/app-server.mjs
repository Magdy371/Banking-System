import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, '[]', 'utf-8');
}

// ===== Middleware =====
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.use(session({
    secret: 'supersecretkey', // change for production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if HTTPS
}));

// ===== Routes =====

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Register
app.post('/register', async (req, res, next) => {
    try {
        const newUser = req.body;

        if (!newUser.userName || !newUser.password) {
            const err = new Error('Missing required fields');
            err.status = 400;
            return next(err);
        }

        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const users = rawData.trim() ? JSON.parse(rawData) : [];

        const userExists = users.some(u => u.userName === newUser.userName);
        if (userExists) {
            const err = new Error('This email is already registered.');
            err.status = 409;
            return next(err);
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

        const userWithId = {
            id: nextId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            userName: newUser.userName,
            password: hashedPassword
        };

        users.push(userWithId);
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');

        res.status(201).json({ success: true, userId: nextId });
    } catch (error) {
        next(error);
    }
});

// Login
app.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const users = rawData.trim() ? JSON.parse(rawData) : [];

        const user = users.find(u => u.userName === userName);
        if (!user) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            return next(err);
        }

        // Store user in session without password
        req.session.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName
        };

        res.json({ success: true, user: req.session.user });
    } catch (error) {
        next(error);
    }
});

// Get session user
app.get('/session-user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        res.json({ success: true });
    });
});

// ===== Centralized Error Handler =====
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
