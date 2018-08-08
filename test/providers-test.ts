import * as Chai from 'chai';

import * as helpers from '../src/helpers';
Chai.should();

// tslint:disable:no-any

const payload: any = {
  comics: ['Praedor', 'Saga'],
  games: ['D&D', 'Shadowrun'],
  animals: ['cats', 'dogs']
};

const payloadAsTuples: any = [
  [ 'comics', [ 'Praedor', 'Saga' ] ],
  [ 'games', [ 'D&D', 'Shadowrun' ] ],
  [ 'animals', [ 'cats', 'dogs' ] ] ];

describe('Helpers', () => {

  it('pick', () => {
    helpers
      .pick(payload, 'games')
      .should
      .deep
      .equal(['D&D', 'Shadowrun']);

    helpers
      .pick({}, 'games')
      .should
      .deep
      .equal({});
  });

  it('toTuples', () =>
    helpers
    .toTuples(payload)
    .should
    .deep
    .equal(payloadAsTuples));

  it('getHmacPayload', () =>
    helpers
    .getHmacPayload(payload, 'yay')
    .should
    .deep
    .equal(`comics:Praedor,Saga\ngames:D&D,Shadowrun\nanimals:cats,dogs\n"yay"`));

  it('calculateHmac', () =>
    helpers
    .calculateHmac('mehehe', '1234')
    .should
    .deep
    .equal('f736efb016cd1cddca043282d62bff7678037e18650218301d9e9b4b1ac99582'));

  it('payloadWithHmac', () =>
    helpers
    .payloadWithHmac('mehehe', payload, 'kissa')
    .should
    .deep
    .equal({
      ...payload,
      signature: 'fc3b3f2efe7d7408b7b05df7721e01bff8cf7ffa37c48c514344c4080446a1f4'
    }));

});
