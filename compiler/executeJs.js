const { exec } = require('child_process');

const executeJs = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    const command = `node ${filepath} < ${inputPath}`;
    
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
  executeJs,
};
