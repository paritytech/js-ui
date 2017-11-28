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

import dateDifference from 'date-difference';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { txLink } from '@parity/etherscan';

import DappLink from '../../DappLink';
import IdentityIcon from '../../IdentityIcon';
import IdentityName from '../../IdentityName';
import MethodDecoding from '../../MethodDecoding';
import MethodDecodingStore from '../../MethodDecoding/methodDecodingStore';

import Store from './store';
import styles from '../txList.css';

@observer
export default class TxRow extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  };

  static propTypes = {
    address: PropTypes.string.isRequired,
    blockNumber: PropTypes.object,
    netVersion: PropTypes.string.isRequired,
    tx: PropTypes.object.isRequired,

    block: PropTypes.object,
    className: PropTypes.string,
    cancelTransaction: PropTypes.func,
    editTransaction: PropTypes.func,
    historic: PropTypes.bool,
    killTransaction: PropTypes.func
  };

  static defaultProps = {
    historic: true
  };

  state = {
    isCancelOpen: false,
    isEditOpen: false,
    canceled: false,
    editing: false,
    isContract: false,
    isDeploy: false
  };

  methodDecodingStore = MethodDecodingStore.get(this.context.api);
  store = Store.get(this.context.api);

  componentWillMount () {
    const { address, tx } = this.props;

    this
      .methodDecodingStore
      .lookup(address, tx)
      .then((lookup) => {
        const newState = {
          isContract: lookup.contract,
          isDeploy: lookup.deploy
        };

        this.setState(newState);
      });
  }

  render () {
    const { address, className, historic, netVersion, tx } = this.props;

    return (
      <tr className={className || ''}>
        { this.renderBlockNumber(tx.blockNumber) }
        { this.renderAddress(tx.from, false) }
        <td className={styles.transaction}>
          { this.renderEtherValue(tx.value) }
          <div>⇒</div>
          <div>
            <a
              className={styles.link}
              href={txLink(tx.hash, false, netVersion)}
              target='_blank'
            >
              { `${tx.hash.substr(2, 6)}...${tx.hash.slice(-6)}` }
            </a>
          </div>
        </td>
        { this.renderAddress(tx.to || tx.creates, !!tx.creates) }
        <td className={styles.method}>
          <MethodDecoding
            historic={historic}
            address={address}
            transaction={tx}
          />
        </td>
      </tr>
    );
  }

  renderAddress (address, isDeploy = false) {
    const isKnownContract = this.store.isContract(address);
    let esLink = null;

    if (address && (!isDeploy || isKnownContract)) {
      esLink = (
        <DappLink
          activeClassName={styles.currentLink}
          className={styles.link}
          to={this.addressLink(address)}
        >
          <IdentityName
            address={address}
            shorten
          />
        </DappLink>
      );
    }

    return (
      <td className={styles.address}>
        <div className={styles.center}>
          <IdentityIcon
            center
            className={styles.icon}
            address={(!isDeploy || isKnownContract) ? address : ''}
          />
        </div>
        <div className={styles.center}>
          { esLink || 'DEPLOY' }
        </div>
      </td>
    );
  }

  renderEtherValue (_value) {
    const { api } = this.context;
    const { isContract, isDeploy } = this.state;

    // Always show the value if ETH transfer, ie. not
    // a contract or a deployment
    const fullValue = !(isContract || isDeploy);
    const value = api.util.fromWei(_value);

    if (value.eq(0) && !fullValue) {
      return <div className={styles.value}>{ ' ' }</div>;
    }

    return (
      <div className={styles.value}>
        { value.toFormat(5) }<small>ETH</small>
      </div>
    );
  }

  renderBlockNumber (_blockNumber) {
    const { block } = this.props;
    const blockNumber = _blockNumber.toNumber();
    const isMined = !!(blockNumber && block);

    return (
      <td className={styles.timestamp}>
        <div>{ isMined ? moment(block.timestamp).fromNow() : null }</div>
        <div>{ isMined ? _blockNumber.toFormat() : this.renderCancelToggle() }</div>
      </td>
    );
  }

  renderCancelToggle () {
    const { canceled, editing, isCancelOpen, isEditOpen } = this.state;

    if (canceled) {
      return (
        <div className={styles.pending}>
          <FormattedMessage
            lassName={styles.uppercase}
            id='ui.txList.txRow.canceled'
            defaultMessage='Canceled'
          />
        </div>
      );
    }

    if (editing) {
      return (
        <div className={styles.pending}>
          <div className={styles.uppercase}>
            <FormattedMessage
              id='ui.txList.txRow.editing'
              defaultMessage='Editing'
            />
          </div>
        </div>
      );
    }

    if (!isCancelOpen && !isEditOpen) {
      const pendingStatus = this.getCondition();
      const isPending = pendingStatus === 'pending';

      return (
        <div className={styles.pending}>
          {
            isPending
              ? (
                <div className={styles.pending}>
                  <div />
                  <div className={styles.uppercase}>
                    <FormattedMessage
                      id='ui.txList.txRow.submitting'
                      defaultMessage='Pending'
                    />
                  </div>
                </div>
              )
              : (
                <div>
                  <span>
                    { pendingStatus }
                  </span>
                  <div className={styles.uppercase}>
                    <FormattedMessage
                      id='ui.txList.txRow.scheduled'
                      defaultMessage='Scheduled'
                    />
                  </div>
                </div>
              )
          }
          <a onClick={this.setEdit} className={styles.uppercase}>
            <FormattedMessage
              id='ui.txList.txRow.edit'
              defaultMessage='Edit'
            />
          </a>
          <span>{' | '}</span>
          <a onClick={this.setCancel} className={styles.uppercase}>
            <FormattedMessage
              id='ui.txList.txRow.cancel'
              defaultMessage='Cancel'
            />
          </a>
          { isPending
            ? (
              <div>
                <FormattedMessage
                  id='ui.txList.txRow.cancelWarning'
                  defaultMessage='Warning: Editing or Canceling the transaction may not succeed!'
                />
              </div>
            ) : null
          }
        </div>
      );
    }

    let which;

    if (isCancelOpen) {
      which = (
        <FormattedMessage
          id='ui.txList.txRow.verify.cancelEditCancel'
          defaultMessage='Cancel'
        />
      );
    } else {
      which = (
        <FormattedMessage
          id='ui.txList.txRow.verify.cancelEditEdit'
          defaultMessage='Edit'
        />
      );
    }

    return (
      <div className={styles.pending}>
        <div />
        <div className={styles.uppercase}>
          <FormattedMessage
            id='ui.txList.txRow.verify.confirm'
            defaultMessage='Are you sure?'
          />
        </div>
        <a onClick={(isCancelOpen) ? this.cancelTx : this.editTx}>
          { which }
        </a>
        <span>{' | '}</span>
        <a onClick={this.revertEditCancel}>
          <FormattedMessage
            id='ui.txList.txRow.verify.nevermind'
            defaultMessage='Nevermind'
          />
        </a>
      </div>
    );
  }

  addressLink (address) {
    const isAccount = this.store.isAccount(address);
    const isContract = this.store.isContract(address);

    if (isContract) {
      return `/contract/${address}`;
    }

    if (isAccount) {
      return `/account/${address}`;
    }

    return `/address/${address}`;
  }

  getCondition = () => {
    const { blockNumber, tx } = this.props;
    let { time, block = 0 } = tx.condition || {};

    if (time) {
      if ((time.getTime() - Date.now()) >= 0) {
        return (
          <FormattedMessage
            id='ui.txList.txRow.pendingStatus.time'
            defaultMessage='{time} left'
            values={{
              time: dateDifference(new Date(), time, { compact: true })
            }}
          />
        );
      }
    }

    if (blockNumber) {
      block = blockNumber.minus(block);
      if (block.toNumber() < 0) {
        return (
          <FormattedMessage
            id='ui.txList.txRow.pendingStatus.blocksLeft'
            defaultMessage='{blockNumber} blocks left'
            values={{
              blockNumber: block.abs().toFormat(0)
            }}
          />
        );
      }
    }

    return 'pending';
  }

  killTx = () => {
    const { killTransaction, tx } = this.props;

    killTransaction(this, tx);
  }

  cancelTx = () => {
    const { cancelTransaction, tx } = this.props;
    const pendingStatus = this.getCondition();
    const isPending = pendingStatus === 'pending';

    if (isPending) {
      this.killTx();
      return;
    }

    cancelTransaction(this, tx);
  }

  editTx = () => {
    const { editTransaction, tx } = this.props;

    editTransaction(this, tx);
  }

  setCancel = () => {
    this.setState({ isCancelOpen: true });
  }

  setEdit = () => {
    this.setState({ isEditOpen: true });
  }

  revertEditCancel = () => {
    this.setState({ isCancelOpen: false, isEditOpen: false });
  }
}
