import * as request from 'superagent';

import { payloadWithHmac } from './helpers';

const PSP_URL: string = 'https://api.checkout.fi';

interface ApiHeaders {
  readonly 'checkout-account': string;
  readonly 'checkout-algorithm': string;
  readonly 'checkout-method': string;
  readonly 'checkout-nonce': string;
  readonly 'checkout-timestamp': string;
  readonly [key: string]: string;
}

const getHeaders: (account: string) => ApiHeaders =
  (account) => ({
    'checkout-account': account,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
    // Current types do not support node 10.8 bigint() yet ¯\_(ツ)_/¯
    // tslint:disable-next-line:no-any
    'checkout-nonce': (process.hrtime as any).bigint().toString(),
    'checkout-timestamp': new Date().toISOString()
  });

export const api: (account: string, secret: string) => {
  payment(body: unknown): request.SuperAgentRequest
} =
  (account, secret) => ({
    payment: (body: unknown) =>
      request
        .post(`${PSP_URL}/payments`)
        .set(payloadWithHmac(secret, getHeaders(account), body))
        .send(body as object)
  });
