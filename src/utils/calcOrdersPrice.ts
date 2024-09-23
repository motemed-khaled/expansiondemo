import { Iorder } from '../types/order';

export const CalculateOrdersPrice = (orders: Iorder[]) => {
  let totalPrice = 0;
  orders.forEach((order) => (totalPrice += order.totalOrderPrice));
  return totalPrice;
};
