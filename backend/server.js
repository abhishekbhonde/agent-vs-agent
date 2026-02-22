import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDebate, runLlamaTurn, runGeminiTurn, voteWinner, getDebate } from './debate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Start a new debate
app.post('/api/debate/start', (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const debate = createDebate(topic);
    res.json({ debateId: debate.id, topic: debate.topic });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run an individual turn
app.post('/api/debate/turn', async (req, res) => {
  try {
    const { debateId, agent } = req.body;
    if (!debateId || !agent) {
      return res.status(400).json({ error: 'debateId and agent are required' });
    }

    // Check if debate exists
    const debate = getDebate(debateId);
    if (!debate) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    let result;
    if (agent === 'llama') {
      result = await runLlamaTurn(debateId);
    } else if (agent === 'gemini') {
      result = await runGeminiTurn(debateId);
    } else {
      return res.status(400).json({ error: 'Invalid agent type' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error running turn:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vote on a winner
app.post('/api/debate/vote', (req, res) => {
  try {
    const { debateId, winner } = req.body;
    if (!debateId || !winner) {
      return res.status(400).json({ error: 'debateId and winner are required' });
    }
    const result = voteWinner(debateId, winner);
    res.json({ success: true, winner: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
