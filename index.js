const http = require("http");
const fs = require("fs");
const path = require("path");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  parseMultipartFormData,
} = require("./controllers/productController");

const PORT = 8000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/products" && req.method === "GET") {
    getAllProducts(req, res);
  } else if (
    req.url.match(/\/api\/products\/([0-9]+)/) &&
    req.method === "GET"
  ) {
    const id = req.url.split("/")[3];
    getProduct(req, res, id);
  } else if (req.method === "POST" && req.url === "/api/products") {
    createProduct(req, res);
  } else if (
    req.method === "PUT" &&
    req.url.match(/\/api\/products\/([0-9]+)/)
  ) {
    const id = req.url.split("/")[3];
    updateProduct(req, res, id);
  } else if (
    req.method === "DELETE" &&
    req.url.match(/\/api\/products\/([0-9]+)/)
  ) {
    const id = req.url.split("/")[3];
    deleteProduct(req, res, id);
  } else if (req.url === "/api/upload" && req.method === "POST") {
    // Ensure the content type is multipart form-data
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid content type" }));
      return;
    }

    // Extract boundary string from Content-Type
    const boundary = "--" + contentType.split("boundary=")[1];

    try {
      // Parse multipart form data and get the files
      const files = await parseMultipartFormData(req, boundary);

      // Save each file
      files.forEach(({ fileName, fileData }) => {
        const uploadPath = path.join(__dirname, "uploads", fileName);
        fs.writeFileSync(uploadPath, fileData, "binary"); // Save each file
      });

      // Respond with success message
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Files uploaded successfully",
          files: files.map((f) => f.fileName),
        })
      );
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error uploading files", error: err }));
    }
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ message: "route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
