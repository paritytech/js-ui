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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import NetChainStore from '../NetChain/store';

import Store from './store';
import TxRow from './TxRow';

import styles from './txList.css';

@observer
export default class TxList extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    address: PropTypes.string.isRequired,
    hashes: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]).isRequired,
    blockNumber: PropTypes.object,
    onNewError: PropTypes.func
  };

  componentWillMount () {
    this.netChainStore = NetChainStore.get(this.context.api);
    this.store = new Store(this.context.api, this.props.onNewError, this.props.hashes);
  }

  componentWillReceiveProps (newProps) {
    this.store.loadTransactions(newProps.hashes);
  }

  render () {
    return (
      <table className={styles.transactions}>
        <tbody>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }

  renderRows () {
    const { address, blockNumber } = this.props;
    const { editTransaction, cancelTransaction, killTransaction } = this.store;
    const { netVersion } = this.netChainStore;

    return this.store.sortedHashes.map((txhash) => {
      const tx = this.store.transactions[txhash];
      const txBlockNumber = tx.blockNumber.toNumber();
      const block = this.store.blocks[txBlockNumber];

      return (
        <TxRow
          key={tx.hash}
          tx={tx}
          block={block}
          blockNumber={blockNumber}
          address={address}
          netVersion={netVersion}
          editTransaction={editTransaction}
          cancelTransaction={cancelTransaction}
          killTransaction={killTransaction}
        />
      );
    });
  }
}
