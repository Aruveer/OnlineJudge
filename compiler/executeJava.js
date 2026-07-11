const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const executeJava = (filepath, inputPath) => {
  const dirPath = path.dirname(filepath);
  // Assuming the file is named Main.java
  const filename = path.basename(filepath, '.java');
  
  return new Promise((resolve, reject) => {
    const command = `javac ${filepath} && cd ${dirPath} && java ${filename} < ${inputPath}`;
    
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up the .class file
      const classPath = path.join(dirPath, `${filename}.class`);
      fs.unlink(classPath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== 'ENOENT') {
           console.error(`Failed to delete class file ${classPath}`, unlinkErr);
        }
      });

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
  executeJava,
};
