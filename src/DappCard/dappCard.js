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

import Container, { Title as ContainerTitle } from '../Container';
import DappIcon from '../DappIcon';
import DappVouchFor from '../DappVouchFor';
import Tags from '../Tags';

import styles from './dappCard.css';

export default class DappCard extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func,
    showLink: PropTypes.bool,
    showTags: PropTypes.bool
  };

  static defaultProps = {
    showLink: false,
    showTags: false
  };

  render () {
    const { app, children, className, onClick, showLink, showTags } = this.props;

    if (!app) {
      return null;
    }

    return (
      <Container
        className={
          [styles.container, className].join(' ')
        }
        link={this.getLink(app)}
        onClick={onClick}
      >
        <DappIcon
          app={app}
          className={styles.image}
        />
        <DappVouchFor app={app} />
        <Tags
          className={styles.tags}
          tags={
            showTags
              ? [app.type]
              : null
          }
        />
        <div className={styles.description}>
          <ContainerTitle
            className={
              showLink
                ? styles.titleLink
                : styles.title
            }
            isOffset
            title={app.name}
            byline={app.description}
          />
          <div className={styles.author}>
            { app.author }, v{ app.version }
          </div>
          { children }
        </div>
      </Container>
    );
  }

  getLink (app) {
    const { showLink } = this.props;

    if (!showLink) {
      return null;
    }

    return `/${app.id}`;
  }
}
