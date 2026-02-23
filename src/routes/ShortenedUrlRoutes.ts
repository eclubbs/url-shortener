import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ShortenedUrlService from '@src/services/ShortenedUrlService';

import { Request, Response  } from 'express';
import parseReq from './common/parseReq';
import { isValidKey,isValidUrl } from '@src/common/utils/validators';
import ShortenedUrl from '@src/models/ShortenedUrl.model';

import logger from 'jet-logger';
import EnvVars from '@src/common/constants/env';

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
 * Get all users.
 *
 * @route GET /
 */
async function get(req: Request, res: Response) {
  const { key } = reqValidators.get(req.params);
  const shortenedUrl = await ShortenedUrlService.get(key as string);

  if (!shortenedUrl) {
    res.status(HttpStatusCodes.NOT_FOUND).send('This link cannot be found. Please verify it was entered correctly and try again.');
    return;
  }

  logger.info(`Shortened url retrieved : ${shortenedUrl.key} -  ${shortenedUrl.targetUrl}. Created ${shortenedUrl.created}. Expires ${shortenedUrl.expires}. Visit Count: ${shortenedUrl.visitCount}`);

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
async function add(req: Request, res: Response) {
  const { targetUrl } = reqValidators.add(req.body);
  const newUrl = ShortenedUrl.new({targetUrl: targetUrl as string});
  const shortenedUrl = await ShortenedUrlService.add(newUrl);
  
  const absoluteUrl = URL.parse(`./${shortenedUrl.key}`,`${req.protocol}://${req.host}`);
  console.log(req);
  logger.info(`New shortened url created: ${shortenedUrl.key} - ${targetUrl} - ${absoluteUrl} -  ${req.protocol + req.host}` )
  res.status(HttpStatusCodes.CREATED).send(absoluteUrl);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  get,
  add,
} as const;
