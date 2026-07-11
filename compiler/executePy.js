const { exec } = require('child_process');

const executePy = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    const command = `python3 ${filepath} < ${inputPath}`;
    
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) {
          reject('Execution Timed Out');
        } else {
          reject(stderr || error.message);
        }
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executePy,
};
