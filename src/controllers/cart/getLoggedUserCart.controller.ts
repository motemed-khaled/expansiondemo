import 'express-async-errors';

import { Cart } from '../../models/cart.model';
import { Icart } from '../../types/cart';
import { GetLoggedUserCartHandler } from '../../types/endpoints/cart.endpoints';
import { calcTotalPrice } from '../../utils/calcCartPrice';

export const getLoggedUserCartHandler: GetLoggedUserCartHandler = async (req, res) => {
  
  const cart = await Cart.findOne({ customer: req.loggedUser?.id }).populate({
    path: 'cartItems.product',
    populate: {
      path: 'extra',
      select: '_id name price desc calories catogryId image status',
    },
  });

  if (!cart) return res.status(200).json(<any>{ message: 'success', data: {
    customer: req.loggedUser?.id,
    cartItems: [],
    createdAt: '',
    updatedAt: '',
    totalPrice: 0,
    id: ''
  } });

  cart.cartItems = cart.cartItems.filter((ele: any) => ele.product.status === true) as Icart['cartItems'];

  cart.cartItems.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());

  cart.totalPrice = calcTotalPrice(cart);

  await cart.save(); 

  await cart.populate({
    path: 'cartItems.product',
    populate: {
      path: 'extra',
      select: '_id name price desc calories catogryId image status'
    },
  });

  res.status(200).json({ message: 'success', data: cart });
};
