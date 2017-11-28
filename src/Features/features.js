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

import { observer } from 'mobx-react';
import React, { Component } from 'react';

import Checkbox from '../Form/Checkbox';
import List from '../List';

import defaults, { MODES } from './defaults';
import Store from './store';
import styles from './features.css';

@observer
export default class Features extends Component {
  store = Store.get();

  render () {
    if (process.env.NODE_ENV === 'production') {
      return null;
    }

    return (
      <List
        items={
          Object
            .keys(defaults)
            .filter((key) => defaults[key].mode !== MODES.PRODUCTION)
            .map(this.renderItem)
        }
      />
    );
  }

  renderItem = (key) => {
    const feature = defaults[key];
    const onCheck = () => this.store.toggleActive(key);

    return {
      description: (
        <div className={styles.description}>
          { feature.description }
        </div>
      ),
      key,
      label: (
        <div>
          <Checkbox
            checked={this.store.active[key]}
            onClick={onCheck}
          />
          <span>{ feature.name }</span>
        </div>
      )
    };
  }
}
