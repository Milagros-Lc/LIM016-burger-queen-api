const Product = require("../models/products");
const {getLink} = require("../extra/extra");
const ObjectId = require('mongoose').Types.ObjectId

module.exports = {
    getProducts:  async (req, resp, next) => {
        try{
            const limit = parseInt(req.query.limit, 10) || 10;
            const page = parseInt(req.query.page, 10) || 1;
      
            const products = await Product.paginate({}, {limit, page});
            const URL = `${req.protocol}://${req.headers.host + req.path}`;
      
            const link = getLink(products, URL, page, limit, products.totalPages )
      
            /*La función res.links() se utiliza para unir los enlaces proporcionados como propiedades 
            del parámetro para completar el campo de encabezado HTTP de enlace de la respuesta.*/
            resp.links(link)
            return resp.status(200).json(products.docs);
        } catch (err) {
            next(err)
        }
    },
    getOneProduct: async (req, res, next) => {
        try{
            const productId = req.params.productId;

            if(!ObjectId.isValid(productId)) return res.status(404).json({message:'This product does not exist, please check the Id'})

            const product = await Product.findOne({_id: `${productId}`});

            if(!product) return res.status(404).json({message:'This product does not exist, please check the Id'})
            
            res.status(200).json(product);
        } catch (err) {
            next(err)
        }
    },
    createProduct: async (req, res, next) => {
        try{
            const { name, price, image, type} = req.body;

            if(!name || !price) return res.status(400).json({ message: 'Please put the name and price'})

            if(typeof(price)==='string') return res.status(400).json({message:'The price should be number'})

            const newProduct = new Product({ 
            name,
            price,
            image,
            type
            });
            await newProduct.save();
            res.status(200).json(newProduct); 
        } catch (err){
            next(err)
        }
    },
    updateProduct: async (req, res, next) => {
        try{
            const productId = req.params.productId;

            if(!ObjectId.isValid(productId)) return res.status(404).json({message:'This product does not exist, please check the Id'})

            const { name, price, image, type } = req.body;

            if(typeof(price)==='string') return res.status(400).json({message:'The price should be number'})

            if(name || price || image || type) {
                //if(typeof(price)==='string') return res.status(400).json({message:'The price should be numbers'})
                const productUpdate = await Product.findByIdAndUpdate(
                {_id: `${productId}`},
                req.body,
                { new: true, useFindAndModify: false }
                )
                return res.status(200).json(productUpdate);
            }
            return res.status(400).json({message:'Has not made any changes'})
        } catch (err) {
            next(err)
        }
    },
    deleteProduct: async(req, res, next) => {
        try{
            const productId = req.params.productId;

            if(!ObjectId.isValid(productId)) return res.status(404).json({message:'This product does not exist, please check the Id'})

            const productDeleted = await Product.findOneAndDelete({_id: `${productId}`});
            res.status(200).json(productDeleted);
        } catch (err) {
            next(err)
        }
    }
}