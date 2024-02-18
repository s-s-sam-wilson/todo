const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT library
const uuid = require('uuid');

var cors = require('cors');

const mongoose = require('mongoose');
const { Int32 } = require("mongodb");
const uri = "mongodb+srv://vercel-admin-user:7s9KeOIYETUpsLs6@cluster0.soiqlfi.mongodb.net/Todo?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() =>{
    console.log("DB connected");
})
.catch((error ) =>{
    console.log('Error connecting to database:', error.message);
});

const Schema  = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const ulogins = mongoose.model('userlogin', Schema);

const app = express();

const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Secret key for signing JWTs
const JWT_SECRET = 'your_jwt_secret';

// Function to generate JWT
function generateToken(userid) {
    return jwt.sign({ userid }, JWT_SECRET, { expiresIn: '1h' }); // Expires in 1 hour
}

app.post('/api/register', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await ulogins.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email Already exist' });
        }
        console.log(email, password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const userid = uuid.v4(); // Generate a unique userid
        ulogins.create({userid, email, password:hashedPassword}); // Store userid along with other details
        const token = generateToken(userid); // Generate JWT
        res.status(201).json({ message: 'User registered successfully', token, userid });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login endpoint
app.post('/api/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await ulogins.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email id doesnt exist.' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Wrong password' });
        }
        const token = generateToken(user.userid); // Generate JWT
        const userid = user.userid;
        res.status(201).json({ message: 'User Logged in successfully', token, userid });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
