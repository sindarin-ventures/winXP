const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

// import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler = async (event, context) => {
  // export async function handler(event, context) {
  try {
    const { ip, email } = JSON.parse(event.body);
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const document = await collection.findOne({ ip: ip });
    if (document) {
      await collection.findOneAndUpdate(
        { ip: ip },
        { $set: { email: email } },
        { new: true },
      );
      return {
        statusCode: 200,
        body: JSON.stringify('sucess'),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

module.exports = { handler };
