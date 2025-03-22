const fs = require('fs');
const path = require('path');

function readData(file, defaultValue) {
  const filePath = path.join(__dirname, '..', file);
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    return defaultValue;
  }
}

function writeData(file, data) {
  const filePath = path.join(__dirname, '..', file);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${file}:`, error);
  }
}

module.exports = { readData, writeData };