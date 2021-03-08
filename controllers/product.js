const Product = require("../models/product");
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs");
const product = require("../models/product");



exports.getProductById=(req,res,next,id)=>{
    product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err)
        {
            return res.status(400).json({
                error:"product not found"
            })
        }
        req.product =product;
        next();
    })

};

exports.createProduct=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }
        //destructure fields

        const{name,price,description,category,stock}=fields;

        //restriction TODO

        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error:"please include all fields"
            })
        }

        let product = new Product(fields)

        //handle files
        if(file.photo){
                if(file.photo.size>3000000){
                    return res.status(400).json({
                        error:"file size is to big"
                    })
                }
                product.photo.data=fs.readFileSync(file.photo.path)
                product.photo.contentType=file.photo.type
        }
        //save to db

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"saving tshirt faild"
                })
            }
            res.json(product);
        })

    })

};

exports.getProduct=(req,res)=>{
    req.product.photo =undefined;

    return res.json(req.product)

}

//middleware 
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("content-type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

exports.deleteProduct=(req,res)=>{
    let product = req.product;
    product.remove((err,delproduct)=>{
        if(err){
            return res.status(400).json({
                error:"failed to delete product"
            })
        }
        res.json({
            messgae:`product ${delproduct} deleted successfully`

        })
    })

}

exports.updateProduct=(req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }
        
        //update product code
        let product =req.product;
        product = _.extend(product,fields)

        //handle files
        if(file.photo){
                if(file.photo.size>3000000){
                    return res.status(400).json({
                        error:"file size is to big"
                    })
                }
                product.photo.data=fs.readFileSync(file.photo.path)
                product.photo.contentType=file.photo.type
        }
        //save to db

        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"updation of  tshirt failed"
                })
            }
            res.json(product);
        })

    })
};

exports.getAllproducts=(req,res)=>{
    let limit =req.query.limit? parseInt(req.query.limit):8;
    let sortBy=req.query.sortBy? req.query.sortBy : "_id";
    Product
    .find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"No product found"
            })
        }
        res.json(product)
    })
}

exports.updateStock = (req,res,next) =>{

    let myOperations = req.body.order.products.map(prod =>{
        return {
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}}
            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk operation failed"
            })
        }
        next()
    });

}

exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"no categories found"
            })
        }
        res.json(category);
    })
}