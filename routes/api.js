var express = require('express');
var router = express.Router();
require('dotenv').config();
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

String.prototype.toObjectId = function() {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
  };

const uri = process.env.MONGODB_URL;

mongoose.connect( uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

const categorySchema = new mongoose.Schema({
    name: String,
});

const productSchema = new mongoose.Schema({
    name: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, default: 0 },
    published: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true }
});

const Products = mongoose.model('products', productSchema);

/* GET users listing. */
router.get('/products', async function(req, res, next) {
    try {
        if (!req.query.name) {
            const allProducts = await Products.find();
            res.status(200).send({
                status: 'Success',
                data: allProducts
            });
        } else {
            const fetchProducts = await Products.find({name:req.query.name});
            res.status(200).send({
                status: 'Success',
                data: fetchProducts
            });
        }
    } catch (err) {
        res.status(500).send({
            status: 'error',
            data: err
        });
    }
});

router.get('/products/:id', async function(req, res, next) {
    console.log('id = ' + req.params.id);
    try {
        var id =req.params.id.toObjectId()
        const product = await Products.findOne({_id: id});
        res.status(200).send({
            status: 'Success',
            data: product
        });
    } catch (err) {
        res.status(404).send( {
            status: 'error',
            data: err
        });
    }
});

router.post('/products', async function(req, res, next) {
    try{
        const result = await Products.create({
            name: req.query.name,
            description: req.query.description,
            price: req.query.price,
            published: req.query.published,
            category: req.query.category
        });
        
        res.status(200).send({
            status: 'Success',
            data: result
        })
    } catch (err) {
        res.status(500).send({
            status: 'error',
            data: err
        })
    }
});
router.put('/products/:id', async function(req, res, next) {
    console.log('id = ' + req.params.id);
    try {
        var id =req.params.id.toObjectId();
        let product = await Products.findOne({_id: id});
        if (!!req.query.name) {
            product.name = req.query.name
        }
        if (!!req.query.description) {
            product.description = req.query.description
        }
        if (!!req.query.price) {
            product.price = req.query.price
        }
        if (!!req.query.published) {
            product.published = req.query.published
        }
        if (!!req.query.category) {
            product.category = req.query.category
        }

        product.save();

        res.status(200).send({
            status: 'Success',
            data: product
        });
    } catch (err) {
        res.status(404).send( {
            status: 'error',
            data: err
        });
    }
});
router.delete('/products/:id', async function(req, res, next) {
    console.log('id = ' + req.params.id);
    try {
        var id =req.params.id.toObjectId()
        const product = await Products.deleteOne({_id: id});
        res.status(200).send({
            status: 'Success',
            data: product
        });
    } catch (err) {
        res.status(404).send( {
            status: 'error',
            data: err
        });
    }
});

router.delete('/products', async function(req, res, next) {
    const result = await Products.deleteMany()
    res.status(200).send({
        status: 'Success',
        data: result
    })
});


module.exports = router;
