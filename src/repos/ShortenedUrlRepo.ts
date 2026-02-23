import { IShortenedUrl } from '@src/models/ShortenedUrl.model';

import orm from './MockOrm';
import { getRandomAlphaNumeric } from '@src/common/utils/string-utils';
import ShortenedUrlConfig from '@src/common/constants/ShortenedUrlConfig';
import { getRandomInt } from '@src/common/utils/number-utils';


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get a shortened url.
 */
async function getOne(key: string): Promise<IShortenedUrl | null> {
  const db = await orm.openDb();
  return db.urls.find(u => u.key === key) || null;
}

/**
 * Add a new shortened url.
 */
async function add(url: IShortenedUrl): Promise<IShortenedUrl> {
  
  const db = await orm.openDb();
  const newId = getRandomInt();
  url.id = newId;
  url.key = getRandomAlphaNumeric(ShortenedUrlConfig.KeyLength)

  if (!url.expires) {
    const expiryDate = new Date();
    expiryDate.setDate(url.created.getDate() + ShortenedUrlConfig.DefaultExpiryInDays);
    url.expires = expiryDate;
  }

  db.urls.push(url);
  await orm.saveDb(db);
  return url;
}

/**
 * Verify a shortened url exists.
 */
async function exists(key: string): Promise<boolean> {
  const db = await orm.openDb();
  return db.urls.some(u => u.key === key);
}

/**
 * Update a shortened url.
 */
async function update(url: IShortenedUrl): Promise<void> {
  const db = await orm.openDb();
  const dbUrlIndex = db.urls.findIndex(u => u.key === url.key);

  if (dbUrlIndex === -1) {
    throw new Error(`Cannot find url '${url.key}'. Update cannot be performed.`);
  }

  const dbUrl = db.urls[dbUrlIndex];
  db.urls[dbUrlIndex] = {
    ...dbUrl,
    visitCount: url.visitCount,
    lastVisited: url.lastVisited,
  };
  return orm.saveDb(db);
}

/**
 * Delete one url.
 */
async function delete_(key: string): Promise<void> {
  const db = await orm.openDb();
  for (let i = 0; i < db.urls.length; i++) {
    if (db.urls[i].key === key) {
      db.urls.splice(i, 1);
      return orm.saveDb(db);
    }
  }
}

// **** Unit-Tests Only **** //

/**
 * @testOnly
 *
 * Delete every user record.
 */
async function deleteAllUrls(): Promise<void> {
  const db = await orm.openDb();
  db.urls = [];
  return orm.saveDb(db);
}

/**
 * @testOnly
 *
 * Insert multiple urls. Can't do multiple at once cause using a plain file
 * for now.
 */
async function insertMultiple(
  urls: IShortenedUrl[] | readonly IShortenedUrl[],
): Promise<IShortenedUrl[]> {
  const db = await orm.openDb(),
    urlsF = [...urls];
  for (const url of urlsF) {
    url.id = getRandomInt();
    url.created = new Date();
  }
  db.urls = [...db.urls, ...urls];
  await orm.saveDb(db);
  return urlsF;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  add,
  exists,
  update,
  delete: delete_,
  deleteAllUrls,
  insertMultiple,
} as const;
