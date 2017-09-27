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

import DecryptRequest from '../DecryptRequest';
import SignRequest from '../SignRequest';
import TransactionPending from '../TransactionPending';

export default class RequestPending extends Component {
  static propTypes = {
    accounts: PropTypes.object.isRequired,
    className: PropTypes.string,
    date: PropTypes.instanceOf(Date).isRequired,
    elementRequest: PropTypes.any,
    gasLimit: PropTypes.object.isRequired,
    isFocussed: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    netVersion: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    origin: PropTypes.object.isRequired,
    payload: PropTypes.oneOfType([
      PropTypes.shape({ decrypt: PropTypes.object.isRequired }),
      PropTypes.shape({ sendTransaction: PropTypes.object.isRequired }),
      PropTypes.shape({ sign: PropTypes.object.isRequired }),
      PropTypes.shape({ signTransaction: PropTypes.object.isRequired })
    ]).isRequired
  };

  static defaultProps = {
    isFocussed: false,
    isSending: false
  };

  render () {
    const { accounts, className, date, elementRequest, gasLimit, isFocussed, isSending, netVersion, onReject, payload, origin } = this.props;
    const Request = elementRequest;

    if (Request) {
      return (
        <Request
          accounts={ accounts }
          className={ className }
          date={ date }
          isFocussed={ isFocussed }
          gasLimit={ gasLimit }
          isSending={ isSending }
          netVersion={ netVersion }
          onConfirm={ this.onConfirm }
          onReject={ onReject }
          origin={ origin }
          payload={ payload }
        />
      );
    }

    if (payload.sign) {
      const { sign } = payload;

      return (
        <SignRequest
          accounts={ accounts }
          address={ sign.address }
          className={ className }
          isFocussed={ isFocussed }
          data={ sign.data }
          isFinished={ false }
          isSending={ isSending }
          netVersion={ netVersion }
          onConfirm={ this.onConfirm }
          onReject={ onReject }
          origin={ origin }
        />
      );
    }

    if (payload.decrypt) {
      const { decrypt } = payload;

      return (
        <DecryptRequest
          accounts={ accounts }
          address={ decrypt.address }
          className={ className }
          isFocussed={ isFocussed }
          data={ decrypt.msg }
          isFinished={ false }
          isSending={ isSending }
          netVersion={ netVersion }
          onConfirm={ this.onConfirm }
          onReject={ onReject }
          origin={ origin }
        />
      );
    }

    const transaction = payload.sendTransaction || payload.signTransaction;

    if (transaction) {
      return (
        <TransactionPending
          accounts={ accounts }
          className={ className }
          date={ date }
          isFocussed={ isFocussed }
          gasLimit={ gasLimit }
          isSending={ isSending }
          netVersion={ netVersion }
          onConfirm={ this.onConfirm }
          onReject={ onReject }
          origin={ origin }
          transaction={ transaction }
        />
      );
    }

    console.error('RequestPending: Unknown payload', payload);
    return null;
  }

  onConfirm = (data) => {
    const { onConfirm, payload } = this.props;

    data.payload = payload;
    onConfirm(data);
  };
}
