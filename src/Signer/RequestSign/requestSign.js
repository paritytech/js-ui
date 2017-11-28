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
import ReactMarkdown from 'react-markdown';

import { hexToAscii } from '@parity/api/lib/util/format';
import SignerStore from '@parity/shared/lib/mobx/signerStore';

import Account from '../Account';
import ConfirmForm from '../ConfirmForm';
import Layout from '../Layout';
import Origin from '../Origin';

import styles from './requestSign.css';

function isAscii (data) {
  for (let i = 2; i < data.length; i += 2) {
    let n = parseInt(data.substr(i, 2), 16);

    if (n < 32 || n >= 128) {
      return false;
    }
  }

  return true;
}

function decodeMarkdown (data) {
  return decodeURIComponent(escape(hexToAscii(data)));
}

export function isMarkdown (data) {
  try {
    const decoded = decodeMarkdown(data);

    for (let i = 0; i < decoded.length; i++) {
      const code = decoded.charCodeAt(i);

      if (code < 32 && code !== 10) {
        return false;
      }
    }

    return decoded.indexOf('#') !== -1 || decoded.indexOf('*') !== -1;
  } catch (error) {
    return false;
  }
}

@observer
export default class RequestSign extends Component {
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

  state = {
    hashToSign: null
  };

  signerStore = new SignerStore(this.context.api);

  componentWillMount () {
    const { address } = this.props;

    this.signerStore.fetchBalance(address);
  }

  componentDidMount () {
    this.computeHashToSign(this.props.data);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.data !== nextProps.data) {
      this.computeHashToSign(nextProps.data);
    }
  }

  computeHashToSign (data) {
    const { sha3, hexToBytes, asciiToHex } = this.context.api.util;
    const bytes = hexToBytes(data);
    const message = hexToBytes(asciiToHex(`\x19Ethereum Signed Message:\n${bytes.length}`));
    const hashToSign = sha3(message.concat(bytes));

    this.setState({ hashToSign });
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

  renderAsciiDetails (ascii) {
    return (
      <div className={styles.signData}>
        <p>{ascii}</p>
      </div>
    );
  }

  renderData (data) {
    if (isMarkdown(data)) {
      return (
        <ReactMarkdown source={decodeMarkdown(data)} />
      );
    }

    if (isAscii(data)) {
      return hexToAscii(data);
    }

    return (
      <FormattedMessage
        id='signer.signRequest.unknownBinary'
        defaultMessage='(Unknown binary data)'
      />
    );
  }

  renderDetails () {
    const { accounts, address, data, netVersion, origin } = this.props;
    const { hashToSign } = this.state;
    const { balances, externalLink } = this.signerStore;

    const balance = balances[address];

    if (!balance) {
      return <Layout.Main />;
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
        <div
          className={styles.info}
          data-effect='solid'
          data-for={`signRequest-${hashToSign}`}
          data-place='top'
          data-tip
        >
          <p>
            <FormattedMessage
              id='signer.signRequest.request'
              defaultMessage='A request to sign data using your account:'
            />
          </p>
          <div className={styles.signData}>
            <p>{ this.renderData(data) }</p>
          </div>
          <p>
            <strong>
              <FormattedMessage
                id='signer.signRequest.warning'
                defaultMessage='WARNING: The consequences of doing this may be grave. Confirm the request only if you are sure.'
              />
            </strong>
          </p>
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
                id='signer.signRequest.state.confirmed'
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
              id='signer.signRequest.state.rejected'
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
        dataToSign={{ data }}
      />
    );
  }
}
