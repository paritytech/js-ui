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

import { generateTxQr, generateDecryptQr, generateDataQr } from '@parity/shared/lib/util/qrscan';

import Button from '../../Button';
import Form from '../../Form';
import IdentityIcon from '../../IdentityIcon';
import QrCode from '../../QrCode';
import QrScan from '../../QrScan';

import styles from './confirmViaQr.css';

const QR_VISIBLE = 1;
const QR_SCAN = 2;
const QR_COMPLETED = 3;

export default class ConfirmViaQr extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    account: PropTypes.object,
    address: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    netVersion: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    dataToSign: PropTypes.object.isRequired
  };

  id = Math.random(); // for tooltip

  state = {
    qrState: QR_VISIBLE,
    qr: {}
  }

  componentWillMount () {
    this.readNonce();
    this.subscribeNonce();
  }

  componentWillUnmount () {
    this.unsubscribeNonce();
  }

  render () {
    const { address, isDisabled, isSending } = this.props;
    const confirmText = this.renderConfirmText();
    const confirmButton = confirmText
      ? (
        <div
          data-effect='solid'
          data-for={`transactionConfirmForm${this.id}`}
          data-place='bottom'
          data-tip
        >
          <Button
            className={styles.confirmButton}
            isDisabled={isDisabled || isSending}
            fullWidth
            icon={
              <IdentityIcon
                address={address}
                button
                className={styles.signerIcon}
              />
            }
            label={confirmText}
            onClick={this.onConfirm}
          />
        </div>
      )
      : null;

    return (
      <div className={styles.confirmForm}>
        <Form>
          { this.renderQrCode() }
          { this.renderQrScanner() }
          { this.renderHint() }
          { confirmButton }
        </Form>
      </div>
    );
  }

  renderConfirmText () {
    const { qrState } = this.state;

    if (qrState === QR_VISIBLE) {
      return (
        <FormattedMessage
          id='signer.txPendingConfirm.buttons.scanSigned'
          defaultMessage='Scan Signed QR'
        />
      );
    }

    return null;
  }

  renderHint () {
    const { qrState } = this.state;

    switch (qrState) {
      case QR_VISIBLE:
        return (
          <div className={styles.passwordHint}>
            <FormattedMessage
              id='signer.sending.external.scanTx'
              defaultMessage='Please scan the transaction QR on your external device'
            />
          </div>
        );

      case QR_SCAN:
        return (
          <div className={styles.passwordHint}>
            <FormattedMessage
              id='signer.sending.external.scanSigned'
              defaultMessage='Scan the QR code of the signed transaction from your external device'
            />
          </div>
        );

      case QR_COMPLETED:
      default:
        return null;
    }
  }

  renderQrCode () {
    const { qrState, qr } = this.state;

    if (qrState !== QR_VISIBLE || !qr.value) {
      return null;
    }

    return (
      <QrCode
        className={styles.qr}
        value={qr.value}
      />
    );
  }

  renderQrScanner () {
    const { qrState } = this.state;

    if (qrState !== QR_SCAN) {
      return null;
    }

    return (
      <QrScan
        className={styles.camera}
        onScan={this.onScan}
      />
    );
  }

  onScan = (signature) => {
    const { onConfirm } = this.props;
    const { chainId, rlp, tx, data, decrypt } = this.state.qr;

    if (!signature) {
      return;
    }

    if (signature && signature.substr(0, 2) !== '0x') {
      signature = `0x${signature}`;
    }

    this.setState({ qrState: QR_COMPLETED });

    if (tx) {
      onConfirm({
        txSigned: {
          chainId,
          rlp,
          signature,
          tx
        }
      });
      return;
    }

    if (decrypt) {
      onConfirm({
        decrypted: {
          decrypt,
          msg: signature
        }
      });
      return;
    }

    onConfirm({
      dataSigned: {
        data,
        signature
      }
    });
  }

  onConfirm = () => {
    const { qrState } = this.state;

    if (qrState !== QR_VISIBLE) {
      return;
    }

    this.setState({ qrState: QR_SCAN });
  }

  generateQr = () => {
    const { api } = this.context;
    const { netVersion, dataToSign } = this.props;
    const { transaction, data, decrypt } = dataToSign;
    const setState = qr => {
      this.setState({ qr });
    };

    if (transaction) {
      generateTxQr(api, netVersion, transaction).then(setState);
      return;
    }

    if (decrypt) {
      generateDecryptQr(decrypt).then(setState);
      return;
    }

    generateDataQr(data).then(setState);
  }

  subscribeNonce () {
    const nonceTimerId = setInterval(this.readNonce, 1000);

    this.setState({ nonceTimerId });
  }

  unsubscribeNonce () {
    const { nonceTimerId } = this.state;

    if (!nonceTimerId) {
      return;
    }

    clearInterval(nonceTimerId);
  }

  readNonce = () => {
    const { api } = this.context;
    const { account, dataToSign } = this.props;
    const { qr } = this.state;

    if ((dataToSign.data || dataToSign.decrypt) && qr && !qr.value) {
      this.generateQr();
      return;
    }

    if (!account || !api.transport.isConnected || !dataToSign.transaction) {
      return;
    }

    return api.parity
      .nextNonce(account.address)
      .then((newNonce) => {
        const { nonce } = this.state.qr;

        if (!nonce || !newNonce.eq(nonce)) {
          this.generateQr();
        }
      });
  }
}
