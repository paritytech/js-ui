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
import { FormattedMessage } from 'react-intl';

import HardwareStore from '@parity/shared/lib/mobx/hardwareStore';

import Button from '../../Button';
import Form from '../../Form';
import IdentityIcon from '../../IdentityIcon';

import styles from '../ConfirmViaPassword/confirmViaPassword.css';

export default class ConfirmViaHardware extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    address: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  hardwareStore = HardwareStore.get(this.context.api);

  render () {
    const { address, isDisabled, isSending, onConfirm } = this.props;
    const _isDisabled = isDisabled || !this.hardwareStore.isConnected(address);

    return (
      <div className={styles.confirmForm}>
        <Form>
          { this.renderHint() }
          <div
            data-effect='solid'
            data-for={`transactionConfirmForm${this.id}`}
            data-place='bottom'
            data-tip
          >
            <Button
              className={styles.confirmButton}
              isDisabled={_isDisabled || isSending}
              fullWidth
              icon={
                <IdentityIcon
                  address={address}
                  button
                  className={styles.signerIcon}
                />
              }
              label={
                isSending
                  ? (
                    <FormattedMessage
                      id='signer.txPendingConfirm.buttons.confirmBusy'
                      defaultMessage='Confirming...'
                    />
                  )
                  : (
                    <FormattedMessage
                      id='signer.txPendingConfirm.buttons.confirmRequest'
                      defaultMessage='Confirm Request'
                    />
                  )
              }
              onClick={onConfirm}
            />
          </div>
        </Form>
      </div>
    );
  }

  renderHint () {
    const { address, isDisabled, isSending } = this.props;
    const _isDisabled = isDisabled || !this.hardwareStore.isConnected(address);

    if (isSending) {
      return (
        <div className={styles.passwordHint}>
          <FormattedMessage
            id='signer.sending.hardware.confirm'
            defaultMessage='Please confirm the transaction on your attached hardware device'
          />
        </div>
      );
    } else if (_isDisabled) {
      return (
        <div className={styles.passwordHint}>
          <FormattedMessage
            id='signer.sending.hardware.connect'
            defaultMessage='Please attach your hardware device before confirming the transaction'
          />
        </div>
      );
    }

    return null;
  }
}
