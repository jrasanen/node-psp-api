import * as request from 'superagent';

import { payloadWithHmac } from './helpers';

const PSP_URL: string = 'https://api.checkout.fi';

// tslint:disable:no-any

const getHeaders: any =
  (account: string) => ({
    'checkout-account': account,
    'checkout-algorithm': 'sha256',
    'checkout-method': 'POST',
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
