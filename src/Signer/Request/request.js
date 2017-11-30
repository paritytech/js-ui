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

import RequestDecrypt from '../RequestDecrypt';
import RequestSend from '../RequestSend';
import RequestSign from '../RequestSign';

export default function Request ({ accounts, className, confirmElement, date, gasLimit, id, isDisabled, isFocussed, isSending, netVersion, onConfirm, onReject, origin, payload }) {
  if (payload.sign) {
    const { sign: { address, data } } = payload;

    return (
      <RequestSign
        accounts={accounts}
        address={address}
        className={className}
        confirmElement={confirmElement}
        data={data}
        id={id}
        isDisabled={isDisabled}
        isFinished={false}
        isFocussed={isFocussed}
        isSending={isSending}
        netVersion={netVersion}
        onConfirm={onConfirm}
        onReject={onReject}
        origin={origin}
      />
    );
  }

  if (payload.decrypt) {
    const { decrypt: { address, msg } } = payload;

    return (
      <RequestDecrypt
        accounts={accounts}
        address={address}
        className={className}
        confirmElement={confirmElement}
        data={msg}
        id={id}
        isDisabled={isDisabled}
        isFinished={false}
        isFocussed={isFocussed}
        isSending={isSending}
        netVersion={netVersion}
        onConfirm={onConfirm}
        onReject={onReject}
        origin={origin}
      />
    );
  }

  const transaction = payload.sendTransaction || payload.signTransaction;

  if (transaction) {
    return (
      <RequestSend
        accounts={accounts}
        className={className}
        confirmElement={confirmElement}
        date={date}
        id={id}
        gasLimit={gasLimit}
        isDisabled={isDisabled}
        isFocussed={isFocussed}
        isSending={isSending}
        netVersion={netVersion}
        onConfirm={onConfirm}
        onReject={onReject}
        origin={origin}
        transaction={transaction}
      />
    );
  }

  console.error('Request: Unknown payload', payload);
  return null;
}

Request.propTypes = {
  accounts: PropTypes.object.isRequired,
  className: PropTypes.string,
  confirmElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  gasLimit: PropTypes.object.isRequired,
  id: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool,
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
