import * as crypto from 'crypto';

export interface IndexedObject {
  readonly [key: string]: string|IndexedObject;
}

export type Tuple = [string, string];

// TODO: change `any` to `unknown` when TS3 learns obj[key] check
// tslint:disable-next-line:no-any
export const pick: (obj: any, key: string) => {} =
  (obj, key) =>
    obj === Object(obj) && obj.hasOwnProperty(key)
      ? obj[key]
      : {};

export const joinN: (glue: string, arr: Array<unknown>) => string =
  (glue, arr) =>
    arr.join(glue);

export const join: (glue: string) => (arr: Array<unknown>) => string =
  (glue) =>
    (arr) =>
      joinN(glue, arr);

// tslint:disable-next-line:no-any
export const toTuples: (obj: IndexedObject) => Tuple[] =
  (obj) =>
    Object.keys(obj)
          .map((key) => [ key, obj[key] ]) as Tuple[];

export const getHmacPayload: (headers: IndexedObject, body: unknown) => string =
  (headers, body) =>
    toTuples(headers)
    .map(join(':'))
    .concat(JSON.stringify(body))
    .join('\n');

export const calculateHmac: (secret: string, hmacPayload: string) => string =
  (secret, hmacPayload) =>
    crypto
      .createHmac('sha256', secret)
      .update(hmacPayload)
      .digest('hex');

export const payloadWithHmac: (secret: string, headers: IndexedObject, body: unknown) => {} =
  (secret, headers, body) =>
    Object.assign(
      {},
      headers,
      { signature: calculateHmac(secret, getHmacPayload(headers, body)) }
    );
