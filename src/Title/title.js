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

import { Title as ContainerTitle } from '../Container';
import Steps from '../Steps';

import Waiting from './Waiting';

import styles from './title.css';

export default function Title ({ activeStep, busy, busySteps, byline, className, description, isOffset, isSubTitle, steps, title }) {
  if (!title && !steps) {
    return null;
  }

  return (
    <div
      className={
        [
          isSubTitle
            ? styles.subtitle
            : styles.title,
          className
        ].join(' ')
      }
    >
      <ContainerTitle
        byline={byline}
        description={description}
        isOffset
        title={
          steps
            ? steps[activeStep || 0]
            : title
        }
      />
      <Steps
        activeStep={activeStep}
        className={styles.steps}
        steps={steps}
      />
      <Waiting
        activeStep={activeStep}
        busy={busy}
        busySteps={busySteps}
        className={styles.waiting}
      />
    </div>
  );
}

Title.propTypes = {
  activeStep: PropTypes.number,
  description: nodeOrStringProptype(),
  busy: PropTypes.bool,
  busySteps: PropTypes.array,
  byline: nodeOrStringProptype(),
  className: PropTypes.string,
  isOffset: PropTypes.bool,
  isSubTitle: PropTypes.bool,
  steps: PropTypes.array,
  title: nodeOrStringProptype()
};
