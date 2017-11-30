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

import keycode from 'keycode';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DappUrlInput extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onGoto: PropTypes.func.isRequired,
    onRestore: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired
  }

  render () {
    const { className, url } = this.props;

    return (
      <input
        className={className}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        type='text'
        value={url}
      />
    );
  }

  onChange = (event) => {
    this.props.onChange(event.target.value);
  };

  onKeyDown = (event) => {
    switch (keycode(event)) {
      case 'esc':
        this.props.onRestore();
        break;

      case 'enter':
        this.props.onGoto();
        break;

      default:
        break;
    }
  };
}
