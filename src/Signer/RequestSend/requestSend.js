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

import Button from '../../Button';
import GasPriceEditor from '../../GasPriceEditor';

import ConfirmForm from '../ConfirmForm';
import Layout from '../Layout';
import TransactionDetails from '../TransactionDetails';

import * as tUtil from '../util/transaction';

@observer
export default class RequestSend extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    accounts: PropTypes.object.isRequired,
    className: PropTypes.string,
    confirmElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]).isRequired,
    gasLimit: PropTypes.object,
    id: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    isFocussed: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    netVersion: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    origin: PropTypes.any,
    transaction: PropTypes.shape({
      condition: PropTypes.object,
      data: PropTypes.string,
      from: PropTypes.string.isRequired,
      gas: PropTypes.object.isRequired,
      gasPrice: PropTypes.object.isRequired,
      to: PropTypes.string,
      value: PropTypes.object.isRequired
    }).isRequired
  };

  gasStore = new GasPriceEditor.Store(this.context.api, {
    condition: this.props.transaction.condition,
    gas: this.props.transaction.gas.toFixed(),
    gasLimit: this.props.gasLimit,
    gasPrice: this.props.transaction.gasPrice.toFixed()
  });

  signerStore = new SignerStore(this.context.api);

  componentWillMount () {
    const { transaction } = this.props;
    const { from, gas, gasPrice, to, value } = transaction;

    const fee = tUtil.getFee(gas, gasPrice); // BigNumber object
    const gasPriceEthmDisplay = tUtil.getEthmFromWeiDisplay(gasPrice);
    const gasToDisplay = tUtil.getGasDisplay(gas);
    const totalValue = tUtil.getTotalValue(fee, value);

    this.setState({ gasPriceEthmDisplay, totalValue, gasToDisplay });
    this.gasStore.setEthValue(value);
    this.signerStore.fetchBalances([from, to]);
  }

  render () {
    return this.gasStore.isEditing
      ? this.renderTxEditor()
      : this.renderTransaction();
  }

  renderTransaction () {
    const transaction = this.gasStore.overrideTransaction(this.props.transaction);

    const { accounts, className, confirmElement, id, isDisabled, isFocussed, isSending, netVersion, onReject, origin } = this.props;
    const { totalValue } = this.state;
    const { balances, externalLink } = this.signerStore;
    const { from, value } = transaction;
    const fromBalance = balances[from];
    const account = accounts[from] || {};

    return (
      <Layout className={className}>
        <TransactionDetails
          accounts={accounts}
          externalLink={externalLink}
          from={from}
          fromBalance={fromBalance}
          gasStore={this.gasStore}
          isDisabled={isDisabled}
          netVersion={netVersion}
          origin={origin}
          totalValue={totalValue}
          transaction={transaction}
          value={value}
        />
        <ConfirmForm
          account={account}
          address={from}
          confirmElement={confirmElement}
          id={id}
          isDisabled={isDisabled}
          isFocussed={isFocussed}
          isSending={isSending}
          netVersion={netVersion}
          onConfirm={this.onConfirm}
          onReject={onReject}
          dataToSign={{ transaction }}
        />
      </Layout>
    );
  }

  renderTxEditor () {
    const { className } = this.props;

    return (
      <Layout className={className}>
        <GasPriceEditor store={this.gasStore}>
          <Button
            label={
              <FormattedMessage
                id='signer.txPending.buttons.viewToggle'
                defaultMessage='view transaction'
              />
            }
            onClick={this.gasStore.toggleEditing}
          />
        </GasPriceEditor>
      </Layout>
    );
  }

  onConfirm = (data) => {
    const { transaction } = this.props;
    const { password, txSigned, wallet } = data;
    const { condition, gas, gasPrice } = this.gasStore.overrideTransaction(transaction);

    const options = {
      gas,
      gasPrice,
      password,
      txSigned,
      wallet
    };

    if (condition && (condition.block || condition.time)) {
      options.condition = condition;
    }

    this.props.onConfirm(options);
  }
}
