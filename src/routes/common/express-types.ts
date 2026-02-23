import { Request, Response } from 'express';

type UrlParams = Record<string, string>;

interface IShortenedUrlResponse {
    shortenedUrl: URL;
    expires?: Date | undefined;
};

export type RequestWithParams = Request<UrlParams>;
export type RequestWithBody<T> = Request<UrlParams, unknown, T>;

export type UrlResponse = Response<IShortenedUrlResponse>;