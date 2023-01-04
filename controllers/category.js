const category = require("../models/category");
const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: "Unable to get the categories"
            })
        }
        req.category = category;
    })
    next();
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);

    category.save((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "ACCESS DENIED, admin zone"
            })
        }
        category.createdAt =undefined,
        category.updatedAt =undefined,
        res.json(category)
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if(err){
            return res.status(400).json({
                error: "NO categories found."
            })
        }
        res.status(200).json(items);
    })
}

exports.updateCategory = (req, res) => {
    let category = req.category;
    category.name = req.body.name;
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: "Cannot update the category."
            })
        }
        category.createdAt =undefined,
        category.updatedAt =undefined,
        res.json(category)
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if(err){
            return res.statis(400).json({
                error: "Unable to delete the category."
            })
        }
        res.json({
            message: `Deleted the category named ${category.name} successfully.`
        })
    })
}