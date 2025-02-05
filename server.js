const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',  // Change to your MySQL password
    database: 'authdb'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Failed:', err);
        process.exit(1); // Stop execution if DB fails
    }
    console.log('MySQL connected...');
});

// DES Encryption Setup
const key = Buffer.from('mysecret', 'utf-8'); // 8-byte (64-bit) key for DES

function encrypt(text) {
    const cipher = crypto.createCipheriv('des-ecb', key, null); // ECB mode
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('des-ecb', key, null);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Signup API
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password required." });
    }

    const encryptedPassword = encrypt(password);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, encryptedPassword], (err) => {
        if (err) return res.status(500).json({ success: false, message: "Database error." });
        res.json({ success: true, message: "Signup successful." });
    });
});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password required." });
    }

    db.query('SELECT password FROM users WHERE username = ?', [username], (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }

        try {
            const decryptedPassword = decrypt(result[0].password);
            if (decryptedPassword === password) {
                res.json({ success: true, message: "Login successful." });
            } else {
                res.status(400).json({ success: false, message: "Invalid credentials." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Decryption error." });
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
