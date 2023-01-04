const { Order, ProductCart } = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate('products.product', 'name price description')
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: 'NO orders FOUND',
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: 'Unable to process your order',
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate('user', '_id name email')
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: 'No Orders are place',
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValue);
}

exports.updateStatus = (req, res) => {
  Order.findByIdAndUpdate(
    {_id: req.order._id},
    {$set: {status: req.body.status}},
    {new: true},
    (err, order) => {
      if(err){
        return res.status(400).json({
          error: "Can't update the order status"
        })
      }
      res.json(order);
    }
    
  )
}