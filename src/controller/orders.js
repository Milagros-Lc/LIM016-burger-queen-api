const { isValidObjectId } = require("mongoose");
const Order = require("../models/orders.js");
const { pagination } = require("../utils/utils");
module.exports = {
  getOrders: async (req, resp, next) => {
    const config = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
    };
    const orders = await Order.paginate({}, config);

    const url = `${req.protocol}://${req.get("host") + req.path}`;
    const links = pagination(
      orders,
      url,
      config.page,
      config.limit,
      orders.totalPages
    );

    resp.links(links);
    return resp.status(200).json(orders.docs);
  },
  getOrderById: async (req, resp, next) => {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) return resp.status(404).json({ message: "no es válido el orderId" });
    const order = await Order.findById({ _id: req.params.orderId }).populate('products.product');
    if (!order) return resp.status(404).json({ message: "la orden no existe" });
    return resp.status(200).json(order);
  },
  postOrder: async (req, res, next) => {
    const { userId, client, products } = req.body;
    if (!products || products.length === 0) return next(400);
    const newOrder = new Order({
      userId,
      client,
      products: products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      })),
    });
    const order = await newOrder.save();
    const orderUpdate = await Order.findOne({ _id: order._id }).populate(
      "products.product"
    );
    return res.status(200).json(orderUpdate);
  },
  updateOrder: async (req, resp, next) => {
    const { orderId } = req.params;

    if (!isValidObjectId(orderId)) return resp.status(404).json({message:"no es válido es orderId"});
    const statusOrder = [
      "pending",
      "canceled",
      "delivering",
      "delivered",
      "preparing",
    ];
    if (Object.keys(req.body).length === 0)
      return resp
        .status(400)
        .json({ message: "no se ha indicado datos a modificar" });
    if (!statusOrder.includes(req.body.status)) return next(400);

    const orderUpdated = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    return resp.status(200).json(orderUpdated);
  },
  deleteOrder: async (req, resp, next) => {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId))
      return resp.status(404).json({ message: "no ha indicado el orderId" });

    if (!orderId)
      return resp.status(404).json({ message: "no ha indicado el orderId" });
    const res = await Order.findOne({ _id: req.params.orderId });
    if (!res)
      return resp.status(404).json({ message: "el producto no existe" });
    await Order.findByIdAndDelete({ _id: req.params.orderId });
    return resp.status(200).json({ message: "eliminado " });
  },
};

// convertir un string a un número -----parseInt
