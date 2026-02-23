import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ShortenedUrlService from '@src/services/ShortenedUrlService';

import { Response } from 'express';
import parseReq from './common/parseReq';
import { isValidKey,isValidUrl } from '@src/common/utils/validators';
import ShortenedUrl, { IShortenedUrl } from '@src/models/ShortenedUrl.model';

import logger from 'jet-logger';
import { RouteError } from '@src/common/utils/route-errors';
import { RequestWithBody, RequestWithParams, UrlResponse } from './common/express-types';

/******************************************************************************
                                Constants
******************************************************************************/

const reqValidators = {
  get: parseReq({ key: isValidKey }),
  add: parseReq({ targetUrl: isValidUrl }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get a redirect from an existing shortened url.
 *
 * @route GET /:key
 */
async function get(req: RequestWithParams, res: Response) {
  reqValidators.get(req.params);
  const key:string  = req.params.key; 
  const shortenedUrl = await ShortenedUrlService.get(key);

  if (!shortenedUrl) {
    res.status(HttpStatusCodes.NOT_FOUND).send('This link cannot be found. Please verify it was entered correctly and try again.');
    return;
  }

  logger.info(`Shortened url retrieved : ${shortenedUrl.key} - ${shortenedUrl.targetUrl}. Visit Count: ${shortenedUrl.visitCount}`);

  if (shortenedUrl.expires && new Date(shortenedUrl.expires) < new Date()) {
    res.status(HttpStatusCodes.GONE).send('This link has expired and is no longer available.');
    return;
  }

  shortenedUrl.visitCount++;
  shortenedUrl.lastVisited = new Date();
  await ShortenedUrlService.update(shortenedUrl);

  res.redirect(shortenedUrl.targetUrl);
}

/**
 * Add a shortened url.
 *
 * @route POST /urls/add
 */
async function add(req: RequestWithBody<IShortenedUrl>, res: UrlResponse) {
  reqValidators.add(req.body);
 
  const newUrl = ShortenedUrl.new({...req.body});
  const shortenedUrl = await ShortenedUrlService.add(newUrl);
  
  const absoluteUrl = URL.parse(`./${shortenedUrl.key}`,`${req.protocol}://${req.host}`);
  if (!absoluteUrl)
    throw new RouteError(HttpStatusCodes.INTERNAL_SERVER_ERROR, `Error creating a shortened url for ${shortenedUrl.targetUrl}`);

  logger.info(`New shortened url created: ${shortenedUrl.key} - ${shortenedUrl.targetUrl} - ${absoluteUrl.href}` );

  res.status(HttpStatusCodes.CREATED).json({shortenedUrl: absoluteUrl, expires: shortenedUrl.expires});
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  get,
  add,
} as const;
