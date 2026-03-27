const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const products = await Product.find().lean();
    const mainCategories = [...new Set(products.map((p) => p.mainCategory).filter(Boolean))];
    const subCategories = [...new Set(products.map((p) => p.subCategory).filter(Boolean))];

    return res.json({ main: mainCategories, sub: subCategories });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, mainCategory, subCategory, price, description, brand, stockQuantity, inStock, image } = req.body;

    if (!name || !mainCategory || !subCategory || !price) {
      return res.status(400).json({ message: 'Name, main category, sub category, and price are required' });
    }

    const product = await Product.create({
      name,
      mainCategory,
      subCategory,
      price: Number(price),
      description,
      brand,
      stockQuantity: Number(stockQuantity) || 0,
      inStock: inStock !== undefined ? inStock : true,
      images: image && image.trim() !== '' ? [image] : [],
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const { name, mainCategory, subCategory, price, description, brand, stockQuantity, inStock, image } = req.body;

    const updateData = {
      name,
      mainCategory,
      subCategory,
      price: Number(price),
      description,
      brand,
      stockQuantity: Number(stockQuantity) || 0,
      inStock: inStock !== undefined ? inStock : true,
    };

    if (image !== undefined && image !== null) {
      updateData.images = image && image.trim() !== '' ? [image] : [];
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
