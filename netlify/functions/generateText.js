const { Configuration, OpenAIApi } = require('openai');

// import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler = async (event, context) => {
  // export async function handler(event, context) {
  try {
    const dotenv = require('dotenv').config();
    const configuration = new Configuration({
      apiKey: process.env.API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const { datatext } = event.queryStringParameters;

    const message = JSON.parse(datatext).map(i => {
      return { role: i.role, content: i.content };
    });

    // prompt: `${datatext} \n A:`,
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: message,
    });
    const str = response.data.choices[0]?.message?.content;

    return {
      statusCode: 200,
      body: JSON.stringify(str),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

module.exports = { handler };
