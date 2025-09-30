const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const TintucModel = require("../models/tintuc");


const index =  async (req, res)=>{
    const product = await ProductModel.find();
    const tintuc = await TintucModel.find();
    const products = product.length;
const view = product.reduce((sum, item) => sum + (item.view || 0), 0);
const order = await OrderModel.find();


    res.render("./admin/admin",{products, tintuc: tintuc.length, view, order: order.length});
}
module.exports = {
    index
};