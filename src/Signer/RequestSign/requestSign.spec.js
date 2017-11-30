// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

/* eslint-disable no-unused-expressions */

import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import { asciiToHex } from '@aprity/api/lib/util/format';

import SignRequest, { isMarkdown } from '.request';

let component;
let signerStore;

function createSignerStore () {
  return {
    balances: {},
    fetchBalance: sinon.stub()
  };
}

function render () {
  signerStore = createSignerStore();
  const context = {
    api: {
      transport: {
        on: sinon.stub()
      },
      pubsub: {
        subscribeAndGetResult: sinon.stub().returns(Promise.resolve(1))
      },
      util: {
        sha3: (x) => x,
        hexToBytes: (x) => x,
        asciiToHex: (x) => x
      }
    }
  };

  component = shallow(
    <SignRequest signerStore={signerStore} />,
    { context }
  );

  return component;
}

describe('views/Signer/components/SignRequest', () => {
  beforeEach(() => {
    render();
  });

  it('renders', () => {
    expect(component).to.be.ok;
  });

  describe('isMarkdown', () => {
    it('returns true for markdown', () => {
      const testMd = '# this is some\n\n*markdown*';
      const encodedMd = asciiToHex(unescape(encodeURIComponent(testMd)));

      expect(isMarkdown(encodedMd)).to.be.true;
    });

    it('return true with utf-8 markdown', () => {
      const testMd = '# header\n\n(n) you are not a citizen of, or resident in, or located in, or incorporated or otherwise established in, the People\'s Republic of China 参与方并非中华人民共和国公民，或不常住中华人民共和国，或不位于中华人民共和国境内，或并非在中华人民共和国设立或以其他方式组建; and';
      const encodedMd = asciiToHex(unescape(encodeURIComponent(testMd)));

      expect(isMarkdown(encodedMd)).to.be.true;
    });

    it('returns false for random data', () => {
      expect(isMarkdown('0x1234')).to.be.false;
    });
  });
});
