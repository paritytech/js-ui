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
import { Menu as SemanticMenu } from 'semantic-ui-react';

export default function Tab ({ isActive, className, index, label, name, onClick, style }) {
  return (
    <SemanticMenu.Item
      active={isActive}
      index={index}
      name={name}
      onClick={onClick}
    >
      { label }
    </SemanticMenu.Item>
  );
}

Tab.propTypes = {
  className: PropTypes.string,
  index: PropTypes.number,
  isActive: PropTypes.bool,
  label: PropTypes.any,
  name: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object
};
