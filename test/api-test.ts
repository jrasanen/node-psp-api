import * as Chai from 'chai';
import * as request from 'superagent';

import { api } from '../src';

const should: Chai.Should = Chai.should();

const ACCOUNT: string = '375917';
const SECRET: string = 'SAIPPUAKAUPPIAS';

// tslint:disable:no-any

const getPayload: any = () =>
  ({
    stamp: (process.hrtime as any).bigint().toString(),
    reference: '3759170',
    amount: 1525,
    currency: 'EUR',
    language: 'FI',
    items: [
      {
        unitPrice: 1525,
        units: 1,
        vatPercentage: 24,
        productCode: '#1234',
        deliveryDate: '2018-09-01'
      }
    ],
    customer: {
      email: 'test.customer@example.com'
    },
    redirectUrls: {
      success: 'https://ecom.example.com/cart/success',
      cancel: 'https://ecom.example.com/cart/cancel'
    }
  });

describe('Api', () => {

  it('new payment', () => {
    api(ACCOUNT, SECRET)
    .payment(getPayload())
    .then((res: request.Response) => {
      should.exist(res.body.transactionId);
      res.status.should.equal(201);
    })
    .catch(console.error);
  });
});
