const express = require('express');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeJs } = require('./executeJs');
const { executeJava } = require('./executeJava');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/execute', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  try {
    const filepath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    let output;

    if (language === 'cpp') {
      output = await executeCpp(filepath, inputPath);
    } else if (language === 'python') {
      output = await executePy(filepath, inputPath);
    } else if (language === 'javascript') {
      output = await executeJs(filepath, inputPath);
    } else if (language === 'java') {
      output = await executeJava(filepath, inputPath);
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    return res.status(200).json({ output });
  } catch (err) {
    return res.status(400).json({ error: typeof err === 'string' ? err : err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Compiler service is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Compiler microservice running on port ${PORT}`);
});
