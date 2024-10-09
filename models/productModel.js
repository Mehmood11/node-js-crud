let products = require("../data/products.json");
const { v4: uuidv4 } = require("uuid");
const { writeDataToFile } = require("../utils");
const path = require("path");

// Find all products
function findAll() {
  return new Promise((resolve, reject) => {
    resolve(products);
  });
}

// Find a product by its ID
function findById(id) {
  return new Promise((resolve, reject) => {
    const product = products.find((product) => product.id === id);

    if (product) {
      resolve(product);
    } else {
      reject(new Error("Product not found"));
    }
  });
}

function create(product) {
  return new Promise((resolve, reject) => {
    const newProduct = { id: uuidv4(), ...product };

    products.push(newProduct);
    writeDataToFile(path.join(__dirname, "../data/products.json"), products);

    resolve(newProduct);
  });
}
function update(id, product) {
  return new Promise((resolve, reject) => {
    const index = products.findIndex((product) => product.id === id);
    products[index] = { id, ...product };

    writeDataToFile(path.join(__dirname, "../data/products.json"), products);
    resolve(products[index]);
  });
}
function remove(id) {
  return new Promise((resolve, reject) => {
    products = products.filter((product) => product.id !== id);
    writeDataToFile(path.join(__dirname, "../data/products.json"), products);
    resolve();
  });
}

module.exports = { findAll, findById, create, update, remove };
