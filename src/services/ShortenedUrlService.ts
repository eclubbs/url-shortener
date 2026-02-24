import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import { IShortenedUrl } from '@src/models/ShortenedUrl.model';
import ShortenedUrlRepo from '@src/repos/ShortenedUrlRepo';

/******************************************************************************
                                Constants
******************************************************************************/

const Errors = {
  URL_NOT_FOUND: 'URL not found',
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get a shortenedUrl by its key.
 */
function get(key:string): Promise<IShortenedUrl | null> {
  return ShortenedUrlRepo.getOne(key);
}

/**
 * Add a new shortenedUrl.
 */
function add(url: IShortenedUrl): Promise<IShortenedUrl> {
  return ShortenedUrlRepo.add(url);
}

/**
 *  Get a shortenedUrl
 */
async function update(url: IShortenedUrl): Promise<void> {
  const exists = await ShortenedUrlRepo.exists(url.key);
  if (!exists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.URL_NOT_FOUND);
  }
  return ShortenedUrlRepo.update(url);
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  Errors,
  get,
  add,
  update
} as const;
