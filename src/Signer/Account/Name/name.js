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

import React from 'react';
import PropTypes from 'prop-types';

import IdentityName from '../../../IdentityName';

import AccountLink from '../AccountLink';

import styles from './name.css';

function tinyAddress (address) {
  return `[${address.slice(2, 4)}..${address.slice(address.length - 2)}]`;
}

function shortAddress (address) {
  return `[${address.slice(2, 8)}..${address.slice(address.length - 7)}]`;
}

export default function Name ({ accounts, address, className, externalLink, netVersion }) {
  const name = <IdentityName address={address} empty />;

  if (!name) {
    return (
      <AccountLink
        accounts={accounts}
        address={address}
        className={className}
        externalLink={externalLink}
        netVersion={netVersion}
      >
        { shortAddress(address) }
      </AccountLink>
    );
  }

  return (
    <AccountLink
      accounts={accounts}
      address={address}
      className={className}
      externalLink={externalLink}
      netVersion={netVersion}
    >
      <span>
        <span className={styles.name}>{ name }</span>
        <span className={styles.address}>{ tinyAddress(address) }</span>
      </span>
    </AccountLink>
  );
}

Name.propTypes = {
  accounts: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
  className: PropTypes.string,
  externalLink: PropTypes.string.isRequired,
  netVersion: PropTypes.string.isRequired
};
