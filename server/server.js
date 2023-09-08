import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: 'API_KEY_HERE',
});


const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from BlindGpt'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, 
       max_tokens: 3000, 
       top_p: 1, 
       frequency_penalty: 0.5,
      presence_penalty: 0,
      });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})




app.get('/check-api-key', async (req, res) => {
  try {
    const dummyResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "This is a test request to check the API key.",
      temperature: 0,
      max_tokens: 5,
    });

    res.status(200).send({
      message: 'API key is valid.',
    });
  } catch (error) {
    console.error(error);
    res.status(401).send({
      error: 'API key is invalid or not properly configured.',
    });
  }
});



app.listen(8000, () => console.log('AI server started on http://localhost:8000'))
