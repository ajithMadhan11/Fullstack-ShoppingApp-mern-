const Product = require("../models/product");
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs");



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