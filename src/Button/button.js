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
import { Button as SemanticButton } from 'semantic-ui-react';

import { nodeOrStringProptype } from '@parity/shared/lib/util/proptypes';

export default function Button ({ active, animated, basic, className, color, disabled, fullWidth, icon, isDisabled, label, onClick, primary, size, toggle }) {
  const _isDisabled = isDisabled || disabled;
  const _onClick = _isDisabled
    ? () => false
    : onClick;

  return (
    <SemanticButton
      active={active}
      animated={animated}
      basic={basic}
      className={className}
      content={label}
      color={color}
      disabled={_isDisabled}
      fluid={fullWidth}
      icon={icon}
      onClick={_onClick}
      primary={primary}
      size={size}
      toggle={toggle}
    />
  );
}

Button.propTypes = {
  active: PropTypes.bool,
  animated: PropTypes.bool,
  basic: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  isDisabled: PropTypes.bool,
  label: nodeOrStringProptype(),
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  size: PropTypes.string,
  toggle: PropTypes.bool
};

Button.defaultProps = {
  primary: true
};
