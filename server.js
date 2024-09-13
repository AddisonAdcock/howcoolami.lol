const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.post('/coolness', async (req, res) => {
  const { bio } = req.body;

  if (!bio) {
    return res.status(400).json({ error: 'Bio is required' });
  }

  try {
    const prompt = `Based on the following bio, determine how cool this person is on a scale of 0-100 using the following rules:

1.) The person should get 5 points if they mention an adventure they went on (vacation, trip, etc).
2.) The person should get 5 points if they tell an interesting story about themself.
3.) The person should get 5 points if they have a common hobby (reading, hiking, etc).
4.) The person should get 5 points if they have a special skill (playing an instrument, speaking multiple languages, etc).
5.) The person should get 5 points if they have a unique job or career (astronaut, actor, etc).
6.) The person should get 5 points if they let us know they are selfless or have done something selfless.
7.) The person should get 5 points if they have a grand accomplishment (won an award, graduated from a prestigious school, etc).
8.) The person should get 5 points if they show that they are a loving person (love someone, sacrifice for someone, etc).
9.) The person should get 5 points if they are rich.
10.) The person should get 5 points if they are famous.
11.) The person should get 10 points if they did something really cool (saved a life, climbed a mountain, etc).
12.) The person should get up to 10 points for a creative response.
13.) The person should get 10 points if they prove that they have strong morals 3 times in the bio.
14.) The person should get 10 points if they have a uncommon hobby (skydiving, bull riding, driving racecars, etc).
15.) The person should get up to 10 points for a very creative response.
16.) Dock 5 points for immoral behavior or selfish acts.
17.) Dock 10 points for hurting other people physically.
18.) Dock 5 points for supporting controversial or immoral causes.
19.) Dock 5 points for being rude or disrespectful in the bio.

Rate the coolness on a scale of 0-100, with 100 being the coolest and 0 being the least cool. Make it hard to get points, no free handouts. I want people to have to do a lot to be cool. You need to be a very harsh judge. It is very, very difficult to be really cool (over 50%). Please respond with just the number.

Here is the bio: "${bio}"
`;
  
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          // Make sure to replace this with your OpenAI API key!
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptResponse = response.data.choices[0].message.content;
    const coolness = parseInt(gptResponse.match(/\d+/)?.[0]);

    if (isNaN(coolness) || coolness < 0 || coolness > 100) {
      return res.status(500).json({ error: 'Could not determine coolness rating' });
    }

    res.json({ bio, coolness });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error interacting with GPT API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
