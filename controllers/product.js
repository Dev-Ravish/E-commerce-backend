const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fileSystem = require('fs');
const product = require('../models/product');
// const { body, validationResult } = require('express-validator');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'No product listed.',
        });
      }

      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.json({
        error: 'Image not compatible',
      });
    }

    const { name, description, price, stock, category } = fields;

    if (!name || !description || !price || !stock || !category) {
      return res.json({
        error: 'Please fill out all the fields correctly.',
      });
    }
    // console.log(req.body);
    // errors = validationResult(req);
    // console.log(errors);
    // if (!errors.isEmpty()) {
    //   return res.status(422).json({
    //     error: errors.array()[0].msg,
    //     parameter: errors.array()[0].param,
    //   });
    // }

    let product = new Product(fields);

    if (file.image) {
      if (file.image.size > 2000000) {
        return res.status(400).json({
          error: 'Image size too large.',
        });
      }
    }

    product.image.data = fileSystem.readFileSync(file.image.path);
    product.image.contentType = file.image.type;

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Failed in creating product',
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.image = undefined;

  return res.send(req.product);
};

exports.getAllProducts = (req, res) => {
  // let limit = req.querry.limit ? req.querry.limit : 9;
  // let sortBy = req.querry.sortBy ? req.querry.sortBy : 'updatedAt';
  Product.find()
    .select('-image')
    .populate('categories')
    // .limit(limit)
    // .sort([[sortBy, 'asc']])
    .exec((err, products) => {
      if (err) {
        return res.send(400).json({
          error: 'NO products AVAILABLE.',
        });
      }

      res.json(products);
    });
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: 'Image not compatible.',
      });
    }

    let product = req.product;
    _.extend(product, fields);

    if (file.image) {
      if (file.image.size > 2000000) {
        return res.status(400).json({
          error: 'Image size too large.',
        });
      }
    }
    product.image.data = fileSystem.readFileSync(file.image.path);
    product.image.contentType = file.image.type;

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: 'Failed in updating product',
        });
      }
      res.json(product);
    });
  });
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, product) => {
    if (err) {
      return res.send(400).json({
        error: `Unable to delete the poduct name ${product.name}`,
      });
    }

    res.json({
      message: 'Product deleted succesfully.',
      product,
    });
  });
};

//middleware
exports.getImage = (req, res, next) => {
  if (req.product.image.data) {
    res.set('content-Type', req.product.image.contentType);
    return res.send(req.product.image.data);
  }
  next();
};

exports.updateInventory = (req, res, next) => {
  let updation = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(updation, {}, (err, operationResult) => {
    if (err) {
      return res.status(400).json({
        error: "bulkWrite didn't function correctly.",
      });
    }

    next();
  });
};
