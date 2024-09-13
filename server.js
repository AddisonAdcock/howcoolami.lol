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

Bragging significantly decreases coolness: Any form of self-promotion or boastful statements (e.g., "I'm the best," "I'm amazing") drastically lowers the score.
Penalty: -15 points.

Humility is highly rewarded: Showing modesty or acknowledging imperfections increases coolness, but only if it's genuine (e.g., "I'm always learning" or "I try my best").
Reward: +15 points.

Uniqueness is required: Bios that mention generic interests (e.g., "I like watching TV" or "I enjoy hanging out with friends") will be penalized. Only those with distinct, creative hobbies (e.g., "I restore vintage cars" or "I build robots in my spare time") gain points.
Penalty: -20 points for generic hobbies; Reward: +15 points for unique ones.

Sense of humor must be subtle: An obvious attempt at being funny or using clichés like "I’m the funny one in the group" leads to a penalty. Only subtle, witty humor gains points.
Penalty: -15 points for trying too hard; Reward: +10 points for subtle wit.

Confidence must not cross into arrogance: Confidence (e.g., "I'm passionate about what I do") is cool, but if it sounds arrogant (e.g., "I'm the smartest person in the room"), heavy penalties apply.
Penalty: -15 points for arrogance; Reward: +10 points for quiet confidence.

Over-explaining is uncool: If the bio contains unnecessary justifications or is excessively long and detailed, it reduces coolness. Being concise is a sign of coolness.
Penalty: -10 points for over-explanation.

Passionate hobbies are critical: Only cool hobbies (e.g., music, art, extreme sports, or interesting personal projects) count. Standard or boring hobbies (e.g., "I like watching movies" or "I play video games") result in a penalty.
Reward: +15 points for cool hobbies; Penalty: -10 points for boring hobbies.

Materialism is a major penalty: Any focus on wealth, possessions, or luxury (e.g., "I drive a nice car" or "I love designer clothes") heavily decreases coolness.
Penalty: -30 points.

Community involvement is highly valued: Mentioning activities like volunteering, community service, or social causes boosts coolness.
Reward: +20 points.

Aggression or hostility is a dealbreaker: Any aggressive or negative language (e.g., "I don’t care what people think" or "I’m brutally honest") severely lowers the score.
Penalty: -40 points.

Self-awareness is required: A lack of self-awareness or reflection lowers coolness (e.g., bios that are overly positive or make no mention of flaws).
Penalty: -15 points for lack of self-awareness; Reward: +10 points for self-reflection.

Avoid clichés and buzzwords: Using trendy phrases or clichés like "living my best life" or "work hard, play hard" drastically reduces the coolness score.
Penalty: -10 points.

Self-care and mindfulness give points: Mentioning mental well-being, self-care, or mindfulness practices can increase coolness, as it shows depth and introspection.
Reward: +15 points.

Overly serious bios are uncool: Bios that are too formal, rigid, or sound like résumés (e.g., "I have a degree in..." or "My professional experience includes...") are boring and lose points.
Penalty: -20 points.

Environmental and adventurous spirit boosts coolness: Mentioning love for nature, traveling, or adventurous activities increases coolness.
Reward: +15 points.

Celebrity-like qualities give a big boost: If the bio shows qualities similar to admired public figures (e.g., famous musicians, actors, or activists), coolness increases significantly.
Reward: +30 points.

Superficial interests get a penalty: Any mention of superficial interests (e.g., social media fame, looking good, or being liked by others) reduces coolness.
Penalty: -20 points.

Teamwork and collaboration are important: Highlighting working with others, being a good teammate, or collaboration boosts coolness.
Reward: +10 points.

Adventure beats comfort: If the bio emphasizes comfort or staying safe (e.g., "I love cozy nights at home"), it loses points. Being adventurous and taking risks is cooler.
Penalty: -10 points for comfort; Reward: +15 points for adventure.

Mystery adds coolness: Leaving some things unsaid or adding a bit of mystery can increase coolness. Over-sharing or revealing too much takes away from it.
Penalty: -15 points for over-sharing; Reward: +10 points for maintaining mystery.

Additional points for creativity (up to 20)



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
