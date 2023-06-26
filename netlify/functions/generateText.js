const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoClient = new MongoClient(process.env.MONGODB_URI);
const clientPromise = mongoClient.connect();

// import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler = async (event, context) => {
  console.log('hanling??')
  // export async function handler(event, context) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const { datatext, ip } = JSON.parse(event.body);
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);

    // console.log('database', database)
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const document = await collection.findOne({ ip: ip });

    console.log('document', document)
    const temp = new Date().getTime() - 5 * 60 * 1000;
    const late = await collection.find({ time: { $gte: temp } }).toArray();

    console.log('late', late)

    if (late && late.length > 100)
      return {
        statusCode: 200,
        body: JSON.stringify(
          'Try 1 mins later. Too many users at this moment.',
        ),
      };
    if (document && document.count > 30)
      return {
        statusCode: 200,
        body: JSON.stringify('Count limited'),
      };

    const message = datatext.map(i => {
      return { role: i.role, content: i.content };
    });

    console.log('message', message)

    // prompt: `${datatext} \n A:`,
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: message,
    });

    // console.log('response from openai', response)
    const str = response.data.choices[0]?.message?.content;
    const history = [...datatext, { role: 'bot', content: str }];
    if (document)
      await collection.findOneAndUpdate(
        { ip: ip },
        { $inc: { count: 1 }, $set: { history: history } },
        { new: true },
      );
    else
      await collection.insertOne({
        ip: ip,
        count: 1,
        email: '',
        time: new Date().getTime(),
        history: history,
      });

    return {
      statusCode: 200,
      body: JSON.stringify(str),
    };
  } catch (error) {
    console.log('Error in generateText', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

module.exports = { handler };
