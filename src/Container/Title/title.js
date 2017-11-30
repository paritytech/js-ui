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

import { nodeOrStringProptype } from '@parity/shared/lib/util/proptypes';

import Actions from './Actions';
import Byline from './Byline';
import Description from './Description';

import styles from './title.css';

export default function Title ({ actions, byline, className, description, isOffset, title }) {
  if (!title && !byline && !description) {
    return null;
  }

  return (
    <div className={className}>
      <div>
        <h3 className={[styles.title, isOffset && styles.offset].join(' ')}>
          <div className={styles.text}>
            { title }
          </div>
        </h3>
        <Byline byline={byline} />
        <Description description={description} />
      </div>
      <Actions actions={actions} />
    </div>
  );
}

Title.propTypes = {
  actions: PropTypes.array,
  byline: nodeOrStringProptype(),
  className: PropTypes.string,
  description: nodeOrStringProptype(),
  isOffset: PropTypes.bool,
  title: nodeOrStringProptype()
};
