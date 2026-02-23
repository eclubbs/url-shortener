import { isInteger, isNonEmptyString, isOptionalDate, isString, isUnsignedInteger } from 'jet-validators';
import { parseObject, Schema, testObject } from 'jet-validators/utils';

import { transformIsDate, transformIsOptionalDate} from '@src/common/utils/validators';

import { Entity } from './common/types';

/******************************************************************************
                                 Constants
******************************************************************************/

const GetDefaults = (): IShortenedUrl => ({
  id: 0,
  key: '',
  targetUrl: '',
  created: new Date(),
  lastVisited: undefined,
  visitCount: 0,
  expires: undefined
});

const schema: Schema<IShortenedUrl> = {
  id: isUnsignedInteger,
  key: isString,
  targetUrl: isString,
  created: transformIsDate,
  lastVisited: isOptionalDate,
  visitCount: isInteger,
  expires: transformIsOptionalDate,
};

/******************************************************************************
                                  Types
******************************************************************************/

/**
 * @entity shortenedUrl
 */
export interface IShortenedUrl extends Entity {
  key: string;
  targetUrl: string;
  visitCount: number;
  lastVisited?: Date | undefined;
  expires?: Date | undefined;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Set the "parseShortenedUrl" function
const parseShortenedUrl = parseObject<IShortenedUrl>(schema);

// For the APIs make sure the right fields are complete
const isCompleteUrl = testObject<IShortenedUrl>({
  ...schema,
  key: isNonEmptyString,
  targetUrl: isNonEmptyString,
});


/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function new_(shortenedUrl?: Partial<IShortenedUrl>): IShortenedUrl {
  return parseShortenedUrl({ ...GetDefaults(), ...shortenedUrl }, (errors) => {
    throw new Error('Create new shortenedUrl failed ' + JSON.stringify(errors, null, 2));
  });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: new_,
  isComplete: isCompleteUrl,
} as const;
