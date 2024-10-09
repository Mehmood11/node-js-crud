const fs = require("fs");
const path = require("path");

function writeDataToFile(filename, content) {
  const filePath = path.resolve(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.error(`Error writing to file: ${err}`);
      return;
    }
  });
}

function getPostData(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = { writeDataToFile, getPostData };
