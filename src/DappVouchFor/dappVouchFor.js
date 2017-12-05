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
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import IdentityIcon from '../IdentityIcon';

import Store from './store';
import styles from './dappVouchFor.css';

@observer
export default class DappVouchFor extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    app: PropTypes.object.isRequired,
    className: PropTypes.string,
    maxNumber: PropTypes.number
  };

  static defaultProps = {
    maxNumber: 1
  };

  store = new Store(this.context.api, this.props.app);

  render () {
    const { className, maxNumber } = this.props;
    const count = this.store.vouchers.length;

    if (!count) {
      return null;
    }

    return (
      <div className={[styles.tag, className].join(' ')}>
        {
          [...Array(Math.min(count, maxNumber)).keys()].map((index) => (
            <IdentityIcon
              address={this.store.vouchers[index]}
              className={styles.image}
              key={this.store.vouchers[index]}
              alt={`${count} identities vouch for this dapp`}
            />
          ))
        }
        <div className={styles.bubble}>
          { count }
        </div>
      </div>
    );
  }
}
