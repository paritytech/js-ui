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

import GeoPattern from 'geopattern';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const imageCache = {};

function getBackgroundStyle (_gradient, _seed) {
  const gradient = _gradient || 'rgba(255, 255, 255, 0.25)';
  const seed = _seed || '0';
  let url;

  if (imageCache[seed] && imageCache[seed][gradient]) {
    url = imageCache[seed][gradient];
  } else {
    url = GeoPattern.generate(seed).toDataUrl();

    imageCache[seed] = imageCache[seed] || {};
    imageCache[seed][gradient] = url;
  }

  return {
    background: `linear-gradient(${gradient}, ${gradient}), ${url}`
  };
}

export default class ParityBackground extends Component {
  static propTypes = {
    attachDocument: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    seed: PropTypes.string, // eslint-disable-line
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  state = {
    style: {}
  };

  _seed = null;

  componentWillMount () {
    this.setStyle();
  }

  componentWillReceiveProps (nextProps) {
    this.setStyle(nextProps);
  }

  shouldComponentUpdate (_, nextState) {
    return nextState.style !== this.state.style;
  }

  setStyle (props = this.props) {
    const { seed, gradient } = props;

    if (this._seed === seed) {
      return;
    }

    const style = getBackgroundStyle(gradient, seed);

    this.setState({ style });
  }

  render () {
    const { attachDocument, children, className, onClick } = this.props;

    const style = {
      ...this.state.style,
      ...this.props.style
    };

    if (attachDocument) {
      document.documentElement.style.backgroundImage = style.background;
    }

    return (
      <div
        className={className}
        style={
          attachDocument
            ? {}
            : style
        }
        onTouchTap={onClick}
      >
        { children }
      </div>
    );
  }
}
