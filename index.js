require('dotenv').config();
require('./utils.js');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 12;
const expireTime = 24 * 60 * 60 * 1000;

const { database } = include('/databaseConnection.js');
const userCollection = database.db(process.env.MONGODB_DATABASE).collection('users');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

// Set up session middleware
app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`,
    }),
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: expireTime }
}));

// Connect to MongoDB
(async () => {
    try {
        await database.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
})();

// Signup route
app.post('/signupSubmit', async (req, res) => {
    const {
        username,
        firstName,
        lastName,
        street,
        city,
        postalCode,
        email,
        password
      } = req.body;   

    // Validate input using Joi
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        street: Joi.string().min(1).max(100).required(),
        city: Joi.string().min(1).max(50).required(),
        postalCode: Joi.string().alphanum().min(3).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const validation = schema.validate({
        username,
        firstName,
        lastName,
        street,
        city,
        postalCode,
        email,
        password
    });

    // Check for validation errors
    if (validation.error) {
        return res.send("Invalid input: " + validation.error.details[0].message);
    }

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) return res.send("Email already exists.");

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const fullAddress = `${street}, ${city}, BC, ${postalCode}`;

    await userCollection.insertOne({
        username,
        firstName,
        lastName,
        address: fullAddress,
        email,
        password: hashedPassword
    });

    req.session.authenticated = true;
    req.session.name = firstName;


    // needs to be redirected to a home page of the app with the map and nearby trees
    res.redirect('/welcome');
});


// Login route
app.post('/loginSubmit', async (req, res) => {
    const { identifier, password } = req.body;

    // Find user by either username or email
    const user = await userCollection.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    });

    if (!user) return res.send("Invalid username/email or password.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Invalid username/email or password.");

    req.session.authenticated = true;
    req.session.name = user.firstName;

    // needs to be redirected to a home page of the app with the map and nearby trees
    res.redirect('/welcome');
});


// Welcome Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/welcome.html");
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  