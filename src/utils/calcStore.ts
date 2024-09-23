/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { NextFunction } from 'express';

import { BadRequestError } from './errors/bad-request-error';
import { ServerError } from './errors/server-error';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { Icart } from '../types/cart';
import { Istore } from '../types/store';

export const calcStore = async (cartItems: Icart['cartItems'], next: NextFunction): Promise<boolean> => {
  try {
    const processCartItem = async (productId: string, quantity: number) => {
      const stores = await Store.find({ 'products.product': productId });
      
      for (const store of stores) {
        
        const product = store.products.find(p => p.product.toString() === productId.toString());
        const decreaseAmount = (product?.percent.to! / product?.percent.from!) * quantity;
        const availableStore = (store.remainingPercentage / 100) * store.quantity;
        
        if (availableStore < decreaseAmount) {
          const productToUpdate = await Product.findById(productId);
          
          next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
          return false; // Stop further execution
        }

        const percentage = store.remainingPercentage - (decreaseAmount / store.quantity) * 100;

        if (percentage < 0) {
          const productToUpdate = await Product.findById(productId);
          next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
          return false; // Stop further execution
        }

        store.remainingPercentage = percentage;
        await store.save();

        // Check other products in the same store
        await Promise.all(
          store.products.map(async p => {
            const decreaseAmount = p.percent.to! / p.percent.from!;
            const availableStore = (store.remainingPercentage / 100) * store.quantity;
            if (availableStore < decreaseAmount)
              await Product.findByIdAndUpdate(p.product, { status: false });
          })
        );

        if ((store.remainingPercentage / 100) * store.quantity < decreaseAmount) {
          await Product.findByIdAndUpdate(productId, { status: false });
        }
      }
      return true; // Continue with next item
    };

    for (const item of cartItems) {
      const continueExecution = await processCartItem(item.product.toString(), +item.quantity);
      if (!continueExecution) {
        return false; // Stop further execution
      }

      for (const extraItem of item.extra) {
        const continueExecution = await processCartItem(extraItem.toString(), 1);
        if (!continueExecution) {
          return false; // Stop further execution
        }
      }
    }
    return true; // All items processed successfully
  } catch (error) {
    console.error('Error in calcStore:', error);
    next(new ServerError());
    return false; // Stop further execution
  }
};


// export const calcStore = async (cartItems: Icart['cartItems'], next: NextFunction) => {
//   for (const item of cartItems) {
//     const stores = await Store.find({ 'products.product': item.product });

//     if (stores.length > 0) {
//       for (const store of stores) {
//         const product = store.products.find(
//           (p) => p.product.toString() === item.product.toString(),
//         );

//         const decreaseAmount = (product?.percent.to! / product?.percent.from!) * +item.quantity;

//         const availableStore = (store.remainingPercentage / 100) * store.quantity;

//         if (availableStore < decreaseAmount) {
//           const productToUpdate = await Product.findById(item.product);
//           return next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
//         } else {
//           const percentage = store.remainingPercentage - (decreaseAmount / store.quantity) * 100;

//           if (percentage < 0) {
//             const productToUpdate = await Product.findById(item.product);
//             return next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
//           }

//           store.remainingPercentage = percentage;
//           await store.save();
//           // check anthor product in the same store
//           store.products.forEach(async (p) => {
//             const decreaseAmount = p?.percent.to! / p?.percent.from!;
//             const availableStore = (store.remainingPercentage / 100) * store.quantity;
//             if (availableStore < decreaseAmount)
//               await Product.findByIdAndUpdate(p.product, { status: false });
//           });

//           if (
//             (store.remainingPercentage / 100) * store.quantity <
//             product?.percent.to! / product?.percent.from!
//           ) {
//             await Product.findByIdAndUpdate(item.product, { status: false });
//           }
//         }

//         await store.save();
//       }
//     }
//     if (item.extra.length>0) {
//       for (const extraItem of item.extra) {
//         const stores = await Store.find({ 'products.product': extraItem });

//         if (stores.length > 0) {
//           for (const store of stores) {
//             const product = store.products.find(
//               (p) => p.product.toString() === extraItem.toString(),
//             );
    
//             const decreaseAmount = (product?.percent.to! / product?.percent.from!);
    
//             const availableStore = (store.remainingPercentage / 100) * store.quantity;
    
//             if (availableStore < decreaseAmount) {
//               const productToUpdate = await Product.findById(extraItem);
//               return next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
//             } else {
//               const percentage = store.remainingPercentage - (decreaseAmount / store.quantity) * 100;
    
//               if (percentage < 0) {
//                 const productToUpdate = await Product.findById(extraItem);
//                 return next(new BadRequestError(`${productToUpdate?.name} is out of stock`));
//               }
    
//               store.remainingPercentage = percentage;
//               await store.save();
//               // check anthor product in the same store
//               store.products.forEach(async (p) => {
//                 const decreaseAmount = p?.percent.to! / p?.percent.from!;
//                 const availableStore = (store.remainingPercentage / 100) * store.quantity;
//                 if (availableStore < decreaseAmount)
//                   await Product.findByIdAndUpdate(p.product, { status: false });
//               });
    
//               if (
//                 (store.remainingPercentage / 100) * store.quantity <
//                 product?.percent.to! / product?.percent.from!
//               ) {
//                 await Product.findByIdAndUpdate(extraItem, { status: false });
//               }
//             }
    
//             await store.save();
//           }
//         }
//       }
//     }
//   }
// };

export const checkProductStock = async (updatedStore: Istore, productId: string) => {
  const store = updatedStore.products.find((p) => p.product.toString() === productId.toString());
  if (store) {
    const decreaseAmount = store.percent.to! / store.percent.from!;
    const availableStore = (updatedStore.remainingPercentage / 100) * updatedStore.quantity;
    const product = await Product.findById(store.product);
    if (availableStore < decreaseAmount) {
      if (product && product.status !== undefined) {
        product.status = false;
      }
    } else {
      if (product && product.status !== undefined) {
        product.status = true;
      }
    }
    await product?.save();
  }
};
