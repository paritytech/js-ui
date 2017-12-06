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

import styles from './accountLink.css';

export default class AccountLink extends Component {
  static propTypes = {
    accounts: PropTypes.object.isRequired,
    address: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
    externalLink: PropTypes.string.isRequired
  }

  state = {
    link: null
  };

  componentWillMount () {
    const { accounts, address, externalLink } = this.props;

    this.updateLink(accounts, address, externalLink);
  }

  componentWillReceiveProps (nextProps) {
    const { accounts, address, externalLink } = nextProps;

    this.updateLink(accounts, address, externalLink);
  }

  render () {
    const { children, address, className, externalLink } = this.props;

    if (externalLink) {
      return (
        <a
          href={this.state.link}
          target='_blank'
          className={`${styles.container} ${className}`}
        >
          { children || address }
        </a>
      );
    }

    return (
      <div className={`${styles.container} ${className}`}>
        { children || address }
      </div>
    );
  }

  updateLink (accounts, address, externalLink) {
    const isAccount = !!(accounts[address]);

    let link = isAccount
      ? `/accounts/${address}`
      : `/addresses/${address}`;

    if (externalLink) {
      const path = externalLink.replace(/\/+$/, '');

      link = `${path}/#${link}`;
    }

    this.setState({
      link
    });
  }
}
