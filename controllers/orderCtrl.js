const Orders = require('../models/orderModel');
const Products = require('../models/productModel');
const Seller = require('../models/sellerModel');
const Cart = require('../models/cartModel');


const orderCtrl = {
  createOrder: async (req, res) => {
    try {
      const userId = req.user.id
      const { productsArray } = req.body;
      const orderProducts = []
      let totalPrice = 0;

      for (const loot of productsArray) {
        const product = await Products.findById(loot.productId)
        if (!product) {
          return res.status(404).json({ error: 'Loot not found' })
        }
        
        const requestedQuantity = parseInt(loot.quantity)
        const availableQuantity = parseInt(product.quantity)
        
        if (requestedQuantity > availableQuantity) {
          return res.status(404).json({ error: `Sorry we only have ${availableQuantity} ${product.productName}s left...` })
        }
        
        const orderQuantity = Math.min(requestedQuantity, availableQuantity)
        const lootPrice = product.price
        const lootTotalPrice = lootPrice * orderQuantity
        
        orderProducts.push({
          product: product,
          quantity: orderQuantity,
          shopper: req.user.name,
          seller: product.seller,
        })
        totalPrice += lootTotalPrice
      }
      const newOrder = new Orders({
        products: orderProducts,
        totalPrice,
        shopper: req.user.id
      })

      await updateSellerOrders(orderProducts, newOrder._id);
      
      await newOrder.save()
      await clearCart(userId);

      res.json({ msg: 'Order created', order: newOrder})
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await Orders.find({ shopper: req.user.id })
      res.json(orders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getOrder: async (req, res) => {
    try {
      const order = await Orders.findOne({ 
        _id: req.params.id,
        shopper: req.user.id 
      })
      res.json(order);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  
  cancelOrder: async (req, res) => {
    try {
      const order = await Orders.findOne({
        _id: req.params.id,
        shopper: req.user.id
      });

      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      order.status = 'Cancelled';

      await order.save();

      res.json({ msg: 'Order deleted', order });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  shipOrder: async (req, res) => {
    try {
      const order = await Orders.findOne({
        _id: req.params.id,
        shopper: req.user.id
      });

      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      order.status = 'Shipped';

      await order.save();

      res.json({ msg: 'Order shipped', order });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deliverOrder: async (req, res) => {
    try {
      const order = await Orders.findOne({
        _id: req.params.id,
        shopper: req.user.id
      });

      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      order.status = 'Delivered';

      await order.save();

      res.json({ msg: 'Order delivered', order });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  processOrder: async (req, res) => {
    const { sellerId, orderId } = req.params;
    const { status } = req.body;
  
    try {
      // Find the seller by ID
      const seller = await Seller.findById(sellerId);
  
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
  
      // Find the order in the seller's orders array and update the status
      const orderToUpdate = seller.orders.find(order => order._id.toString() === orderId);
  
      if (!orderToUpdate) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      orderToUpdate.status = status;
  
      // Save the updated seller document
      const updatedSeller = await seller.save();
  
      // Check if all products in the order have the same status
      const isOrderComplete = seller.orders.every(order => order.status === status);

      if (isOrderComplete) {
          // Update the customer's order status
          await updateCustomerOrderStatus(orderToUpdate.orderId, status);
      }

      res.json(updatedSeller);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  pendOrder: async (req, res) => {
    try {
      const order = await Orders.findOne({
        _id: req.params.id,
        shopper: req.user.id
      });

      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }

      order.status = 'Pending';

      await order.save();

      res.json({ msg: 'Order pending', order });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

// Function to update seller's orders
const updateSellerOrders = async (orderProducts, orderId) => {
  try {
    for (const orderProduct of orderProducts) {
      const { seller, product, quantity, shopper } = orderProduct;
      // Find the seller by ID
      const merchant = await Seller.findById(seller);
      const loot = await Products.findById(product);
      
      // Check if the seller exists
      if (merchant) {
        
        // Add the order to the seller's orders with product information
        merchant.orders.push({
          orderId,
          product: loot,
          quantity,
          shopper
        });
      }
      // Save the updated seller data
      await merchant.save()
    }
  } catch (error) {
    console.error(`Error updating seller's orders: ${error.message}`);
  }
};

const updateCustomerOrderStatus = async (orderId, status) => {
  try {
      // Find the customer's order by ID
      const customerOrder = await Orders.findById(orderId);

      if (!customerOrder) {
          return;  // Handle accordingly, e.g., log or throw an error
      }

      // Check if all products in the order have the same status
      const isOrderComplete = customerOrder.products.every(product => product.status === status);

      if (isOrderComplete) {
          // Update the customer's order status
          customerOrder.status = status;

          // Save the updated customer order document
          await customerOrder.save();
      }
  } catch (err) {
      // Handle the error
      console.error('Error updating customer order status:', err);
  }
};

const clearCart = async (userId) => {
    try {
      let cart = await Cart.findOne({ shopper: userId });
  
      if (!cart) {
        console.log(msg = 'Cart not found' );
      }
  
      // Clear the products array and update the total to 0
      cart.products = [];
      cart.total = 0;
  
      // Save the updated cart
      await cart.save();
  
    } catch (err) {
      console.log({ msg: err.message });
    }
};

module.exports = orderCtrl;