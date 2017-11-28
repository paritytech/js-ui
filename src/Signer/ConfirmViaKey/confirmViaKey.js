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

import keycode from 'keycode';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';
import ReactTooltip from 'react-tooltip';

import Button from '../../Button';
import Form from '../../Form';
import Input from '../../Form/Input';
import IdentityIcon from '../../IdentityIcon';

import styles from './confirmViaKey.css';

export default class ConfirmViaKey extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    address: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isFocussed: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  id = Math.random(); // for tooltip

  state = {
    password: '',
    wallet: null,
    walletError: null
  }

  componentDidMount () {
    this.focus();
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isFocussed && nextProps.isFocussed) {
      this.focus(nextProps);
    }
  }

  focus (props = this.props) {
    if (props.isFocussed) {
      const textNode = ReactDOM.findDOMNode(this.refs.input);

      if (!textNode) {
        return;
      }

      const inputNode = textNode.querySelector('input');

      inputNode && inputNode.focus();
    }
  }

  render () {
    const { address, isDisabled, isSending } = this.props;
    const { wallet, walletError } = this.state;
    const isWalletOk = walletError === null && wallet !== null;

    return (
      <div className={styles.confirmForm}>
        <Form>
          { this.renderKeyInput() }
          { this.renderPassword() }
          { this.renderHint() }
          <div
            data-effect='solid'
            data-for={`transactionConfirmForm${this.id}`}
            data-place='bottom'
            data-tip
          >
            <Button
              className={styles.confirmButton}
              isDisabled={isDisabled || isSending || !isWalletOk}
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
              onClick={this.onConfirm}
            />
          </div>
          { this.renderTooltip() }
        </Form>
      </div>
    );
  }

  renderPassword () {
    const { password, wallet } = this.state;

    if (!wallet) {
      return null;
    }

    return (
      <Input
        hint={
          <FormattedMessage
            id='signer.txPendingConfirm.password.decrypt.hint'
            defaultMessage='decrypt the key'
          />
        }
        label={
          <FormattedMessage
            id='signer.txPendingConfirm.password.decrypt.label'
            defaultMessage='Key Password'
          />
        }
        onChange={this.onModifyPassword}
        onKeyDown={this.onKeyDown}
        ref='input'
        type='password'
        value={password}
      />
    );
  }

  renderHint () {
    const { wallet } = this.state;

    const passwordHint = (wallet && wallet.meta && wallet.meta.passwordHint) || null;

    if (!passwordHint) {
      return null;
    }

    return (
      <div className={styles.passwordHint}>
        <FormattedMessage
          id='signer.txPendingConfirm.passwordHint'
          defaultMessage='(hint) {passwordHint}'
          values={{
            passwordHint
          }}
        />
      </div>
    );
  }

  renderKeyInput () {
    const { walletError } = this.state;

    return (
      <Input
        className={styles.fileInput}
        error={walletError}
        hint={
          <FormattedMessage
            id='signer.txPendingConfirm.selectKey.hint'
            defaultMessage='The keyfile to use for this account'
          />
        }
        label={
          <FormattedMessage
            id='signer.txPendingConfirm.selectKey.label'
            defaultMessage='Select Local Key'
          />
        }
        onChange={this.onKeySelect}
        type='file'
      />
    );
  }

  renderTooltip () {
    if (this.state.password.length) {
      return null;
    }

    return (
      <ReactTooltip id={`transactionConfirmForm${this.id}`}>
        <FormattedMessage
          id='signer.txPendingConfirm.tooltips.password'
          defaultMessage='Please provide a password for this account'
        />
      </ReactTooltip>
    );
  }

  onKeySelect = (event) => {
    // Check that file have been selected
    if (event.target.files.length === 0) {
      return this.setState({
        wallet: null,
        walletError: null
      });
    }

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        const wallet = JSON.parse(e.target.result);

        try {
          if (wallet && typeof wallet.meta === 'string') {
            wallet.meta = JSON.parse(wallet.meta);
          }
        } catch (e) {}

        this.setState({
          wallet,
          walletError: null
        });
      } catch (error) {
        this.setState({
          wallet: null,
          walletError: (
            <FormattedMessage
              id='signer.txPendingConfirm.errors.invalidWallet'
              defaultMessage='Given wallet file is invalid.'
            />
          )
        });
      }
    };

    fileReader.readAsText(event.target.files[0]);
  }

  onModifyPassword = (event) => {
    const password = event.target.value;

    this.setState({
      password
    });
  }

  onConfirm = () => {
    const { password, wallet } = this.state;

    this.props.onConfirm({
      password,
      wallet
    });
  }

  onKeyDown = (event) => {
    const codeName = keycode(event);

    if (codeName !== 'enter') {
      return;
    }

    this.onConfirm();
  }
}
