const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (language, code) => {
  const jobId = uuid();
  let filename = `${jobId}.${language}`;
  if (language === 'java') {
      // For MVP, assuming user's class is Main for Java
      filename = `Main.java`;
  }
  const filepath = path.join(dirCodes, filename);
  
  // For Java, we might need to put it inside a job folder if multiple users submit simultaneously,
  // to avoid Main.java conflicts. Let's create a subfolder for Java if needed.
  if (language === 'java') {
    const jobDir = path.join(dirCodes, jobId);
    fs.mkdirSync(jobDir, { recursive: true });
    const javaFilepath = path.join(jobDir, filename);
    await fs.promises.writeFile(javaFilepath, code);
    return javaFilepath;
  }

  await fs.promises.writeFile(filepath, code);
  return filepath;
};

module.exports = {
  generateFile,
};
