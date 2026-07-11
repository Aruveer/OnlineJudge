const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
  const jobId = uuid();
  const input_filename = `${jobId}.txt`;
  const input_filepath = path.join(dirInputs, input_filename);
  
  // Create file even if input is empty so stdin always has a valid file to read from
  await fs.promises.writeFile(input_filepath, input || '');
  return input_filepath;
};

module.exports = {
  generateInputFile,
};
