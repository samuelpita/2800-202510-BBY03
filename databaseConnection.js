// creates connections to the database
require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_host = process.env.MONGODB_HOST;

const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/?retryWrites=true&w=majority`;

const client = new MongoClient(atlasURI);
module.exports = { database: client };
