/* eslint-disable @typescript-eslint/no-namespace */

import { RequestHandler } from 'express';

import { IjwtPayload, Ipagination } from '../../utils/generateToken';
import { Icustomer } from '../customer';
import { PaginationResponse, successResponse } from '../response';


declare global {
  namespace Express {
    interface Request {
      loggedUser?: IjwtPayload;
      pagination: Ipagination;
    }
  }
}

export interface SignupCustomerHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Icustomer; token: string }>,
    Pick<Icustomer, 'phone'>,
    unknown
  > {}
export interface GetCustomerHandler
  extends RequestHandler<
  { customerId: string },
  successResponse<{ data: Icustomer }>,
  unknown,
  unknown
  > {}
  
export interface GetCustomersHandler
  extends RequestHandler<unknown, PaginationResponse<{ data: Icustomer[] }>, unknown, unknown> {}
  
export interface DeleteCustomerHandler
  extends RequestHandler<{ customerId: string }, successResponse<unknown>, unknown, unknown> {}
  
export interface GetLoggedCustomerHandler
  extends RequestHandler<unknown, successResponse<{ data: Icustomer }>, unknown, unknown> {}
  

// new feature
export interface CreateCustomerHandler
    extends RequestHandler<unknown , successResponse<{data:Icustomer}> , Pick<Icustomer , 'phone' | 'name' | 'location'> , unknown>{}

export interface UpdateCustomerHandler
  extends RequestHandler<{customerId:string}, successResponse<{data:Icustomer}> , Pick<Icustomer , 'phone' | 'name'> , unknown>{}

export interface AddLocationHandler
extends RequestHandler<{customerId:string} , successResponse<{data:Icustomer}> , {address:string} , unknown>{}

export interface UpdateLocationHandler
extends RequestHandler<{customerId:string} , successResponse<{data:Icustomer}> , {addressId:string, address:string} , unknown>{}

export interface DeleteLocationHandler
extends RequestHandler<{customerId:string} , successResponse<unknown> , {addressId:string } , unknown>{}