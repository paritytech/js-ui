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
import ReactTooltip from 'react-tooltip';

import Button from '../../Button';
import MethodDecoding from '../../MethodDecoding';
import { GasIcon } from '../../Icons';

import * as tUtil from '../util/transaction';

import Layout from '../Layout';
import Account from '../Account';
import Origin from '../Origin';

import styles from './transactionDetails.css';

export default class TransactionDetails extends Component {
  static propTypes = {
    accounts: PropTypes.object.isRequired,
    children: PropTypes.node,
    externalLink: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.object,
    gasStore: PropTypes.object,
    isDisabled: PropTypes.bool,
    netVersion: PropTypes.string.isRequired,
    origin: PropTypes.any,
    totalValue: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired
  };

  componentWillMount () {
    const { totalValue, value } = this.props;

    this.updateDisplayValues(value, totalValue);
  }

  componentWillReceiveProps (nextProps) {
    const { totalValue, value } = nextProps;

    this.updateDisplayValues(value, totalValue);
  }

  render () {
    const { accounts, children, externalLink, from, fromBalance, gasStore, isDisabled, netVersion, transaction, origin } = this.props;

    return (
      <Layout.Main>
        <div className={styles.from}>
          <div className={styles.account}>
            <Account
              accounts={accounts}
              address={from}
              balance={fromBalance}
              externalLink={externalLink}
              isDisabled={isDisabled}
              netVersion={netVersion}
            />
          </div>
          <Origin origin={origin} />
        </div>
        <div className={styles.method}>
          <MethodDecoding
            address={from}
            historic={false}
            transaction={
              gasStore
                ? gasStore.overrideTransaction(transaction)
                : transaction
            }
          />
          { this.renderEditTx() }
        </div>
        { children }
      </Layout.Main>
    );
  }

  renderEditTx () {
    const { gasStore } = this.props;

    if (!gasStore) {
      return null;
    }

    return (
      <div className={styles.editButtonRow}>
        <Button
          icon={<GasIcon />}
          label={
            <FormattedMessage
              id='signer.mainDetails.editTx'
              defaultMessage='Edit conditions/gas/gasPrice'
            />
          }
          onClick={gasStore.toggleEditing}
        />
      </div>
    );
  }

  renderTotalValue () {
    const { feeEth, totalValueDisplay, totalValueDisplayWei } = this.state;
    const labelId = `totalValue${Math.random()}`;

    return (
      <div>
        <div
          className={styles.total}
          data-effect='solid'
          data-for={labelId}
          data-place='bottom'
          data-tip
        >
          { totalValueDisplay } <small>ETH</small>
        </div>
        <ReactTooltip id={labelId}>
          <FormattedMessage
            id='signer.mainDetails.tooltips.total1'
            defaultMessage='The value of the transaction including the mining fee is {total} {type}.'
            values={{
              total: <strong>{ totalValueDisplayWei }</strong>,
              type: <small>WEI</small>
            }}
          />
          <br />
          <FormattedMessage
            id='signer.mainDetails.tooltips.total2'
            defaultMessage='(This includes a mining fee of {fee} {token})'
            values={{
              fee: <strong>{ feeEth }</strong>,
              token: <small>ETH</small>
            }}
          />
        </ReactTooltip>
      </div>
    );
  }

  renderValue () {
    const { valueDisplay, valueDisplayWei } = this.state;
    const labelId = `value${Math.random()}`;

    return (
      <div>
        <div
          data-effect='solid'
          data-for={labelId}
          data-tip
        >
          <strong>{ valueDisplay } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id={labelId}>
          <FormattedMessage
            id='signer.mainDetails.tooltips.value1'
            defaultMessage='The value of the transaction.'
          />
          <br />
          <strong>{ valueDisplayWei }</strong> <small>WEI</small>
        </ReactTooltip>
      </div>
    );
  }

  updateDisplayValues (value, totalValue) {
    this.setState({
      feeEth: tUtil.calcFeeInEth(totalValue, value),
      totalValueDisplay: tUtil.getTotalValueDisplay(totalValue),
      totalValueDisplayWei: tUtil.getTotalValueDisplayWei(totalValue),
      valueDisplay: tUtil.getValueDisplay(value),
      valueDisplayWei: tUtil.getValueDisplayWei(value)
    });
  }
}
