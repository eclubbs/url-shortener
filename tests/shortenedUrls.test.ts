import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { JetPaths as Paths } from '@src/common/constants/Paths';
import { ValidationError } from '@src/common/utils/route-errors';
import ShortenedUrl, { IShortenedUrl } from '@src/models/ShortenedUrl.model';
import ShortenedUrlRepo from '@src/repos/ShortenedUrlRepo';

import { agent } from './support/agent';
import { TestRes } from './common/supertest-types';
import { parseValidationError } from './common/error-utils';

/******************************************************************************
                               Constants
******************************************************************************/

const DUMMY_URLS = [
  ShortenedUrl.new({id:873592853161,key:"RiKa5t",targetUrl:"https://www.youtube.com/watch?v=dQw4w9WgXcQ",created:new Date("2026-02-22T15:38:18.643Z"),visitCount:4,lastVisited:new Date("2026-02-23T10:22:34.778Z")}),
  ShortenedUrl.new({id:873592853162,key:"Hb3X00",targetUrl:"https://hubexo.com/",created:new Date("2026-02-22T15:38:18.643Z"),visitCount:0,lastVisited:new Date("2026-02-23T00:57:55.334Z")}),
  ShortenedUrl.new({id:873592853163,key:"B8Fkta",targetUrl:"https://www.byggfakta.no/smart-engelsk",created:new Date("2025-02-22T15:38:18.643Z"), expires: new Date("2026-02-22T15:38:18.643Z"),visitCount:1,lastVisited:new Date("2026-02-23T01:07:17.987Z")}),
] as const;

const { BAD_REQUEST, CREATED, OK, NOT_FOUND, FOUND } = HttpStatusCodes;

/******************************************************************************
                                 Tests
  IMPORTANT: Following TypeScript best practices, we test all scenarios that 
  can be triggered by a user under normal circumstances. Not all theoretically
  scenarios (i.e. a failed database connection). 
******************************************************************************/

describe('ShortenedUrlRoutes', () => {
  let dbUsers: IShortenedUrl[] = [];

  beforeEach(async () => {
    await ShortenedUrlRepo.deleteAllUsers();
    dbUsers = await ShortenedUrlRepo.insertMultiple(DUMMY_URLS);
  });

  describe(`"GET:${Paths.Get}"`, () => {
    it(
      'should return a redirect to the targetUrl and a status code of ' +
        `"${FOUND}" if the request was successful.`,
      async () => {
        const shortenedUrl = DUMMY_URLS[0];
        const res: TestRes = await agent.get(`/${shortenedUrl.key}`);
        expect(res.status).toBe(FOUND);
        expect(res.redirect).toBeTruthy();
        expect(res.headers.location).toStrictEqual(shortenedUrl.targetUrl);
      },
    );

    it(
      'should return a status code of ' +
        `"${NOT_FOUND}" if the key is not present within the url list`,
      async () => {
        const nonExistentKey = 'ABCDEF'
        const res: TestRes = await agent.get(`/${nonExistentKey}`);
        expect(res.status).toBe(NOT_FOUND);
      },
    );

    it(
      'should return a status code of ' +
        `"${NOT_FOUND}" if the key is not present within the url list`,
      async () => {
        const nonExistentKey = 'ABCDEF'
        const res: TestRes = await agent.get(`/${nonExistentKey}`);
        expect(res.status).toBe(NOT_FOUND);
      },
    );

    it(
      'should return a status code of ' +
        `"${BAD_REQUEST}" if the key is not valid length`,
      async () => {
        const invaldKey = 'ABCD'
        const res: TestRes = await agent.get(`/${invaldKey}`);
        expect(res.status).toBe(BAD_REQUEST);
        const errorObject = parseValidationError(res.body.error);
        expect(errorObject.message).toBe(ValidationError.MESSAGE);
        expect(errorObject.errors[0].key).toStrictEqual('key');
      },
    );

    it(
      'should return a status code of ' +
        `"${BAD_REQUEST}" if the key is not valid characters`,
      async () => {
        const invaldKey = 'ABCD$='
        const res: TestRes = await agent.get(`/${invaldKey}`);
        expect(res.status).toBe(BAD_REQUEST);
        const errorObject = parseValidationError(res.body.error);
        expect(errorObject.message).toBe(ValidationError.MESSAGE);
        expect(errorObject.errors[0].key).toStrictEqual('key');
      },
    );
  });

  describe(`"POST:${Paths.Urls.Add}"`, () => {
    it(
      `should return a status code of "${CREATED}" and a valid shortened url if the request was ` +
        'successful.',
      async () => {
        const urlToBeShortened = 'https://www.hubexo.com'
        const res: TestRes<string> = await agent.post(Paths.Urls.Add).send({ targetUrl: urlToBeShortened });
        expect(res.status).toBe(CREATED);
        expect(URL.parse(res.body)).not.toBeNull();
      },
    );

    it(
      'should return a JSON object with an error message of and a status ' +
        `code of "${BAD_REQUEST}" if the targetUrl param is missing.`,
      async () => {
        const res: TestRes = await agent
          .post(Paths.Urls.Add)
          .send({ targetUrl: null });
        expect(res.status).toBe(BAD_REQUEST);
        const errorObject = parseValidationError(res.body.error);
        expect(errorObject.message).toBe(ValidationError.MESSAGE);
        expect(errorObject.errors[0].key).toStrictEqual('targetUrl');
      },
    );

    it(
      'should return a JSON object with an error message of and a status ' +
        `code of "${BAD_REQUEST}" if the targetUrl param is not a valid URL.`,
      async () => {
        const res: TestRes = await agent
          .post(Paths.Urls.Add)
          .send({ targetUrl: null });
        expect(res.status).toBe(BAD_REQUEST);
        const errorObject = parseValidationError(res.body.error);
        expect(errorObject.message).toBe(ValidationError.MESSAGE);
        expect(errorObject.errors[0].key).toStrictEqual('targetUrl');
      },
    );
  });  
});
