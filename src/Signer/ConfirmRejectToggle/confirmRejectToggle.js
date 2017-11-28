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
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { PrevIcon } from '../../Icons';

import styles from './confirmRejectToggle.css';

export default function ConfirmRejectToggle ({ className, isRejectOpen, onToggle }) {
  return (
    <a
      className={`${styles.rejectToggle} ${className}`}
      onClick={onToggle}
    >
      {
        isRejectOpen
          ? (
            <span>
              <PrevIcon />
              <FormattedMessage
                id='signer.txPendingForm.changedMind'
                defaultMessage="I've changed my mind"
              />
            </span>
          )
          : (
            <span>
              <FormattedMessage
                id='signer.txPendingForm.reject'
                defaultMessage='reject request'
              />
            </span>
          )
      }
    </a>
  );
}

ConfirmRejectToggle.propTypes = {
  className: PropTypes.string,
  isRejectOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};
