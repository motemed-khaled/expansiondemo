import { RequestHandler } from 'express';

import { successResponse } from '../response';




export interface SendWhatsAppMessageHandler
extends RequestHandler<unknown , successResponse<unknown> , {users:string[] , messageBody:string , attachments:string[]} , unknown>{}