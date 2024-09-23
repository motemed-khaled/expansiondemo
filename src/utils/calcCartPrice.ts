import { Icart } from '../types/cart';

export const calcTotalPrice = (cart: Icart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((ele) => (totalPrice += ele.quantity * ele.price));
  return totalPrice;
};
