import 'express-async-errors';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { Resturant } from '../../models/resturant.model';
import { UpdateOrderHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateOrderHandler: UpdateOrderHandler = async (req, res, next) => {
  const resturant = await Resturant.findOne();
  if (!resturant) return next(new NotFoundError('Restaurant profile not found'));

  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new NotFoundError('Order not found'));

  const productsToUpdate = req.body.products;

  for (const productUpdate of productsToUpdate) {
    const product = await Product.findById(productUpdate.productId);
    if (!product)
      return next(new NotFoundError(`Product with ID ${productUpdate.productId} not found`));

    let extraPrice = Number(product.price);

    if (productUpdate.extra && productUpdate.extra.length > 0) {
      for (const extraProductId of productUpdate.extra) {
        const foundProduct = await Product.findById(extraProductId);
        if (!foundProduct)
          return next(new NotFoundError(`Product not found with ID: ${extraProductId}`));
        extraPrice += Number(foundProduct.price);
      }
    }

    const existProductIndex = order.cartItems.findIndex(
      (el) => el.product.toString() === productUpdate.productId,
    );

    if (existProductIndex > -1) {
      if (productUpdate.quantity === 0) {
        order.cartItems.splice(existProductIndex, 1);
      } else {
        order.cartItems[existProductIndex].quantity = productUpdate.quantity;
        order.cartItems[existProductIndex].extra =
          productUpdate.extra || order.cartItems[existProductIndex].extra;
        order.cartItems[existProductIndex].price = extraPrice;
      }
    } else {
      order.cartItems.push({
        product: product.id,
        quantity: productUpdate.quantity,
        price: extraPrice,
        extra: productUpdate.extra || [],
      });
    }
  }

  const totalPrice = order.cartItems.reduce((acc, ele) => acc + ele.quantity * ele.price, 0);
  order.totalOrderPrice = totalPrice * (resturant.shippingPrice / 100) + totalPrice;
  order.paymentMethodType = req.body.payment || 'نقدى';

  const newOrder = await (
    await order.save()
  ).populate({
    path: 'cartItems.product cartItems.extra',
    populate: {
      path: 'extra',
    },
  });

  res.status(200).json({ message: 'success', data: newOrder });
};
