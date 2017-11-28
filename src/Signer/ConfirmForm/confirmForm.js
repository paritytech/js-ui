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

import ConfirmReject from '../ConfirmReject';
import ConfirmRejectToggle from '../ConfirmRejectToggle';
import Layout from '../Layout';

export default class ConfirmForm extends Component {
  static propTypes = {
    account: PropTypes.object,
    address: PropTypes.string.isRequired,
    className: PropTypes.string,
    confirmElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func
    ]).isRequired,
    id: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    isFocussed: PropTypes.bool,
    isSending: PropTypes.bool.isRequired,
    netVersion: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    dataToSign: PropTypes.oneOfType([
      PropTypes.shape({
        transaction: PropTypes.object.isRequired
      }),
      PropTypes.shape({
        data: PropTypes.string.isRequired
      }),
      PropTypes.shape({
        decrypt: PropTypes.string.isRequired
      })
    ]).isRequired
  };

  state = {
    isRejectOpen: false
  };

  render () {
    const { account, address, className, confirmElement, id, isDisabled, isFocussed, isSending, netVersion, onConfirm, onReject, dataToSign } = this.props;
    const { isRejectOpen } = this.state;
    const ConfirmVia = confirmElement;

    return (
      <Layout.Side className={className}>
        {
          isRejectOpen
            ? <ConfirmReject onReject={onReject} />
            : (
              <ConfirmVia
                address={address}
                account={account}
                id={id}
                isDisabled={isDisabled}
                isFocussed={isFocussed}
                isSending={isSending}
                netVersion={netVersion}
                onConfirm={onConfirm}
                dataToSign={dataToSign}
              />
            )
        }
        <ConfirmRejectToggle
          isRejectOpen={isRejectOpen}
          onToggle={this.onToggleReject}
        />
      </Layout.Side>
    );
  }

  onToggleReject = () => {
    this.setState({
      isRejectOpen: !this.state.isRejectOpen
    });
  }
}
