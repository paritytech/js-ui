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

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import SignerStore from '@parity/shared/lib/mobx/signerStore';

import Account from '../Account';
import ConfirmForm from '../ConfirmForm';
import Layout from '../Layout';
import Origin from '../Origin';

import styles from '../RequestSign/requestSign.css';

@observer
export default class RequestDecrypt extends Component {
  static contextTypes = {
    api: PropTypes.object
  };

  static propTypes = {
    accounts: PropTypes.object.isRequired,
    address: PropTypes.string.isRequired,
    className: PropTypes.string,
    confirmElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]).isRequired,
    data: PropTypes.string.isRequired,
    id: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    isFinished: PropTypes.bool.isRequired,
    isFocussed: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    netVersion: PropTypes.string.isRequired,
    onConfirm: PropTypes.func,
    onReject: PropTypes.func,
    origin: PropTypes.any,
    status: PropTypes.string
  };

  signerStore = new SignerStore(this.context.api);

  componentWillMount () {
    const { address } = this.props;

    this.signerStore.fetchBalance(address);
  }

  render () {
    const { className } = this.props;

    return (
      <Layout className={className}>
        { this.renderDetails() }
        { this.renderActions() }
      </Layout>
    );
  }

  renderDetails () {
    const { api } = this.context;
    const { accounts, address, data, netVersion, origin } = this.props;
    const { balances, externalLink } = this.signerStore;

    const balance = balances[address];

    if (!balance) {
      return <div />;
    }

    return (
      <Layout.Main className={styles.signDetails}>
        <div className={styles.address}>
          <Account
            accounts={accounts}
            address={address}
            balance={balance}
            className={styles.account}
            externalLink={externalLink}
            netVersion={netVersion}
          />
          <Origin origin={origin} />
        </div>
        <div className={styles.info} title={api.util.sha3(data)}>
          <p>
            <FormattedMessage
              id='signer.decryptRequest.request'
              defaultMessage='A request to decrypt data using your account:'
            />
          </p>

          <div className={styles.signData}>
            <p>{ data }</p>
          </div>
        </div>
      </Layout.Main>
    );
  }

  renderActions () {
    const { accounts, address, confirmElement, data, id, isDisabled, isFocussed, isFinished, isSending, netVersion, onConfirm, onReject, status } = this.props;
    const account = accounts[address] || {};

    if (isFinished) {
      if (status === 'confirmed') {
        return (
          <div className={styles.actions}>
            <span className={styles.isConfirmed}>
              <FormattedMessage
                id='signer.decryptRequest.state.confirmed'
                defaultMessage='Confirmed'
              />
            </span>
          </div>
        );
      }

      return (
        <div className={styles.actions}>
          <span className={styles.isRejected}>
            <FormattedMessage
              id='signer.decryptRequest.state.rejected'
              defaultMessage='Rejected'
            />
          </span>
        </div>
      );
    }

    return (
      <ConfirmForm
        account={account}
        address={address}
        confirmElement={confirmElement}
        id={id}
        isDisabled={isDisabled}
        isFocussed={isFocussed}
        isSending={isSending}
        netVersion={netVersion}
        onConfirm={onConfirm}
        onReject={onReject}
        className={styles.actions}
        dataToSign={{ decrypt: data }}
      />
    );
  }
}
