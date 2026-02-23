import { isDate } from 'jet-validators';
import { transform } from 'jet-validators/utils';
import ShortenedUrlConfig from '../constants/ShortenedUrlConfig';

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Convert to date object then check is a validate date.
 */
export const transformIsDate = transform(
  (arg) => new Date(arg as string),
  (arg) => isDate(arg)
);


export const isValidKey = 
  (arg:string) => new RegExp(`[a-zA-Z0-9]{${ShortenedUrlConfig.KeyLength}}`).test(arg);


export const isValidUrl = 
  (arg:string) => { try { new URL(arg); } catch(_) { return false;} return true;};

