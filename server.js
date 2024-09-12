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

1. **Bragging decreases coolness**: Statements like "I am the best" or "Everyone loves me" reduce the coolness score.
2. **Humility increases coolness**: Being modest, self-aware, or showing vulnerability can increase the coolness score.
3. **Creativity and uniqueness**: A bio that reflects original, creative, or unique qualities increases coolness.
4. **Sense of humor**: If the bio shows a good sense of humor or wit, boost the coolness score.
5. **Overly serious or formal bios decrease coolness**: If the bio lacks personality or is overly formal, reduce the coolness score.
6. **Passionate cool hobbies increase coolness**: Hobbies like music, art, sports, or creative pursuits increase coolness.
7. **Kindness and compassion**: Showing empathy or compassion in the bio increases the coolness score.
8. **Self-awareness**: If the bio reflects self-awareness or acknowledges both strengths and weaknesses, potentially increase the score.
9. **Buzzwords or clichés decrease coolness**: Overuse of trendy phrases or clichés lowers the coolness score.
10. **Confidence without arrogance**: Confidence is cool, but arrogance reduces coolness.
11. **Adventurous spirit increases coolness**: Mentioning travel, exploration, or taking risks raises coolness.
12. **Intellectual curiosity boosts coolness**: A bio that reflects curiosity, love for learning, or intellectual interests can increase the score.
13. **Over-explanation decreases coolness**: If the bio tries too hard to justify or explain everything, reduce the coolness score.
14. **Mentions of teamwork and collaboration increase coolness**: Highlighting working with others or being a team player boosts coolness.
15. **Overly materialistic statements decrease coolness**: If the bio focuses too much on material possessions or wealth, reduce the score.
16. **Mentions of self-care and mental health increase coolness**: Talking about self-care, mindfulness, or mental well-being boosts coolness.
17. **Love for nature and the environment increases coolness**: If the bio reflects an appreciation for the environment or outdoor activities, increase the score.
18. **Aggressiveness or hostility decreases coolness**: Aggressive or confrontational language lowers the coolness score.
19. **Community involvement increases coolness**: Mentioning volunteer work, social causes, or community engagement boosts coolness.
20. **What someone does with their time is important**: Cool Jobs, Cool hobbies, cool things.
21. **If you are like a movie star you are VERY COOL**: The more you are like a famous person, the cooler you are.
22. **If you have a really cool job you are cool**: If you have a job that is really cool, you are cool.

Rate the coolness on a scale of 0-100, with 100 being the coolest and 0 being the least cool. Make it hard to get points, no free handouts. I want people to have to do a lot to be cool. You need to be a very harsh judge. It is very, very difficult to be really cool (over 50%). Please respond with just the number.

Here is the bio: "${bio}"
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
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
