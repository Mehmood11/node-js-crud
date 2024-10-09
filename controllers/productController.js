const {
  findAll,
  findById,
  create,
  update,
  remove,
} = require("../models/productModel");

const { getPostData } = require("../utils");

// Get all products
async function getAllProducts(req, res) {
  try {
    const products = await findAll();
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(products));
  } catch (error) {
    console.log(error);
  }
}

// Get a single product by ID
async function getProduct(req, res, id) {
  try {
    const product = await findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(product));
  } catch (error) {
    console.log(error);
  }
}

// Add Product
async function createProduct(req, res) {
  try {
    const { name, age } = await getPostData(req);
    const product = {
      name,
      age,
    };
    const newProduct = await create(product);
    res.writeHead(201, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(newProduct));
  } catch (error) {
    console.log(error);
  }
}

async function updateProduct(req, res, id) {
  try {
    const product = await findById(id);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      const { name, age } = await getPostData(req);

      const productData = {
        name: name || product.name,
        age: age || product.age,
      };

      const updProduct = await update(id, productData);
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(updProduct));
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteProduct(req, res, id) {
  console.log(id);

  try {
    const product = await findById(id);
    console.log(product);

    if (!product) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(404).json({ message: "Product not found" });
    } else {
      await remove(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `Product ${id} removed` }));
    }
  } catch (error) {
    console.log(error);
  }
}

function parseMultipartFormData(req, boundary) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("binary"); // Collect binary data
    });

    req.on("end", () => {
      const parts = body
        .split(boundary)
        .filter((part) => part.includes("Content-Disposition"));

      // Array to store all files and their data
      const files = [];

      // Loop through all parts and extract each file
      parts.forEach((filePart) => {
        // Extract headers from the file part
        const headerEndIndex = filePart.indexOf("\r\n\r\n");
        const headersPart = filePart.slice(0, headerEndIndex).toString();

        // Extract the filename from the headers
        const fileNameMatch = /filename="(.+?)"/.exec(headersPart);
        const fileName = fileNameMatch ? fileNameMatch[1] : "uploaded_file.png"; // Default filename

        // Extract file data (after headers)
        const fileDataStartIndex = headerEndIndex + 4; // Start of binary data
        const fileDataEndIndex = filePart.lastIndexOf("\r\n"); // End of binary data
        const fileData = filePart.slice(fileDataStartIndex, fileDataEndIndex);

        // Push the extracted file details into the files array
        if (fileName && fileData) {
          files.push({ fileName, fileData });
        }
      });

      // Check if any files were uploaded
      if (files.length === 0) {
        return reject("No files uploaded");
      }

      // Resolve with all uploaded files
      resolve(files);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  parseMultipartFormData,
};
