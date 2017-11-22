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

import Api from '@parity/api';
import React from 'react';
import PropTypes from 'prop-types';

import { createIcon } from '../Icons';

import styles from './dappIcon.css';

export default function DappIcon ({ app, className, small }, { api }) {
  const { dappsUrl } = api;
  const classes = [
    styles.icon, styles[small ? 'small' : 'normal'], className
  ].join(' ');

  if (app['semantic-icon']) {
    return createIcon(app['semantic-icon'], { className: classes });
  }

  let imageSrc;

  if (app.type === 'builtin' || app.type === 'view') {
    let dapphost = process.env.DAPPS_URL || (
      process.env.NODE_ENV === 'production'
        ? `${dappsUrl}/ui`
        : ''
    );

    if (dapphost === '/') {
      dapphost = '';
    }

    const appId = Api.util.isHex(app.id)
      ? app.id
      : Api.util.sha3(app.url);

    const fallbackSrc = window.location.protocol === 'file:'
      ? `dapps/${appId}/icon.png`
      : `${dapphost}/dapps/${appId}/icon.png`;

    imageSrc = app.image || fallbackSrc;
  } else if (app.type === 'local') {
    imageSrc = `${dappsUrl}/${app.id}/${app.iconUrl}`;
  } else {
    imageSrc = app.image;
  }

  return (
    <img
      className={ classes }
      src={ imageSrc }
    />
  );
}

DappIcon.contextTypes = {
  api: PropTypes.object.isRequired
};

DappIcon.propTypes = {
  app: PropTypes.object.isRequired,
  className: PropTypes.string,
  small: PropTypes.bool
};
