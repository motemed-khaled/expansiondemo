import { RequestHandler } from 'express';

import { IresturantProfile } from '../resturant';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateResturantHandler
  extends RequestHandler<
    unknown,
    successResponse<unknown>,
    Pick<IresturantProfile, 'name'>,
    unknown
  > {}
export interface UpdateResturantHandler
  extends RequestHandler<
    { resturantId: string },
    successResponse<{ data: IresturantProfile }>,
    Partial<
      Pick<
        IresturantProfile,
        | 'name'
        | 'imageProfile'
        | 'profileCover'
        | 'shippingPrice'
        | 'currency'
        | 'location'
        | 'cheifAlert'
        | 'waiterAlert'
        | 'TaxNumber'
        | 'CommercialRecord'
        | 'qrCodeLink'
        | 'orgnizationName'
        | 'branchName'
        | 'twilioNumber'
        | 'twilioToken'
        | 'twilioSid'
      >
    >,
    unknown
  > {}

export interface GetResturantHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: IresturantProfile[] }>,
    unknown,
    unknown
  > {}
  
export interface TestApp
  extends RequestHandler<unknown, successResponse<{ data: boolean }>, unknown, unknown> {}
  
export interface AddSocialMediaHandler
  extends RequestHandler<
  { resturantId: string },
  successResponse<{ data: IresturantProfile }>,
  { link: string; icon: string },
  unknown
  > {}
  
export interface UpdateSocialMediaHandler
  extends RequestHandler<
  { resturantId: string },
    successResponse<{ data: IresturantProfile }>,
    Partial<{ link: string; icon: string; socialId: string }>,
    unknown
    > {}
    
export interface DeleteSocialMediaHandler
    extends RequestHandler<
    { resturantId: string; socialId: string },
    successResponse<unknown>,
    unknown
    > {}
    
    
export interface UpdatePlanHandler
      extends RequestHandler<
        unknown,
        successResponse<{ data: IresturantProfile }>,
        { status: boolean , chief:number , cashier:number , waiter:number , cleaner:number , whatsAppService:boolean },
        unknown
      > {}

export interface PlanControlHandler
extends RequestHandler<unknown , successResponse<{data:{status:boolean}}> , {status:boolean} , unknown>{}