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
import { Checkbox as SemanticCheckbox } from 'semantic-ui-react';

import { nodeOrStringProptype } from '@parity/shared/lib/util/proptypes';

import Label from '../Label';

export default function Checkbox ({ checked = false, className, label, onClick, style }) {
  return (
    <SemanticCheckbox
      checked={checked}
      className={className}
      label={
        <Label label={label} />
      }
      onClick={onClick}
      style={style}
    />
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  label: nodeOrStringProptype(),
  onClick: PropTypes.func,
  style: PropTypes.object
};
