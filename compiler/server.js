const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

app.post('/execute', (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const jobId = uuidv4();
  
  let ext = '';
  let command = '';

  // Configure command based on language
  // NOTE: In a real system you'd use Docker inside this microservice too for isolation
  if (language === 'javascript') {
    ext = 'js';
    command = `node ${jobId}.${ext}`;
  } else if (language === 'python') {
    ext = 'py';
    command = `python ${jobId}.${ext}`;
  } else {
    return res.status(400).json({ error: 'Unsupported language for now' });
  }

  const filePath = path.join(TEMP_DIR, `${jobId}.${ext}`);

  // Write code to temp file
  fs.writeFile(filePath, code, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create temp file' });
    }

    // Execute the code
    exec(command, { cwd: TEMP_DIR, timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up the file after execution
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(`Failed to delete temp file ${filePath}`, unlinkErr);
      });

      if (error) {
        if (error.killed) {
          return res.status(400).json({ output: 'Error: Execution Timed Out' });
        }
        return res.status(400).json({ output: stderr || error.message });
      }

      if (stderr) {
        return res.status(400).json({ output: stderr });
      }

      return res.status(200).json({ output: stdout });
    });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Compiler service is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Compiler microservice running on port ${PORT}`);
});
