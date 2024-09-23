import 'express-async-errors';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { AddToCartHandler } from '../../types/endpoints/cart.endpoints';
import { calcTotalPrice } from '../../utils/calcCartPrice';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const addToCartHandler: AddToCartHandler = async (req, res, next) => {
  const product = await Product.findById(req.body.productId).populate('extra');
  if (!product) return next(new NotFoundError('Product not found'));
  if (!product.status) return next(new BadRequestError('out of stock'));
  let cart = await Cart.findOne({ customer: req.loggedUser?.id });

  if (!cart) {
    // Create a new cart with the product
    cart = await Cart.create({
      customer: req.loggedUser?.id,
      cartItems: [
        {
          product: req.body.productId,
          price: product.price,
          quantity: req.body.quantity,
        },
      ],
    });
  } else {
    const existProductIndex = cart.cartItems.findIndex(
      (el) => el.product.toString() === req.body.productId,
    );

    let extraPrice = Number(product.price);
    if (req.body.extra?.length > 0) {
      for (const product of req.body.extra) {
        const foundProduct = await Product.findById(product);

        if (!foundProduct) {
          return next(new NotFoundError(`Products not found: ${product}`));
        }
        extraPrice += Number(foundProduct?.price);
      }
      cart.cartItems[existProductIndex].extra = req.body.extra;
      cart.cartItems[existProductIndex].price = Number(extraPrice);
    } else if (req.body.extra?.length === 0) {
      cart.cartItems[existProductIndex].extra = [];
      cart.cartItems[existProductIndex].price = Number(extraPrice);
    }

    if (req.body.quantity || req.body.quantity == 0) {
      if (existProductIndex > -1) {
        // Update the quantity or remove the product if quantity is zero
        if (req.body.quantity == 0) {
          cart.cartItems.splice(existProductIndex, 1);
        } else {
          cart.cartItems[existProductIndex].quantity = req.body.quantity;
        }
      } else {
        // Add the product to the cart
        cart.cartItems.push({
          product: product.id,
          quantity: req.body.quantity,
          price: Number(extraPrice),
          extra: [],
        });
      }
    }
  }

  cart.totalPrice = calcTotalPrice(cart);
  cart.cartItems.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());

  await cart.save();
  res.status(200).json({ message: 'success', data: cart });
};
