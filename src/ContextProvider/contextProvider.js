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
import { IntlProvider } from 'react-intl';
import { observer } from 'mobx-react';

// FIXME: Re-enable locales
// import { LocaleStore } from '~/i18n';
const LocaleStore = {
  get: () => {
    console.warn('js-ui: i18n in `ContextProvider` disabled');

    return {
      locale: 'en',
      locales: [],
      messages: {}
    };
  }
};

@observer
export default class ContextProvider extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    store: PropTypes.object,
    children: PropTypes.node.isRequired
  }

  static childContextTypes = {
    api: PropTypes.object,
    store: PropTypes.object
  }

  localeStore = LocaleStore.get();

  render () {
    const { children } = this.props;
    const { locale, messages } = this.localeStore;

    return (
      <IntlProvider locale={locale} messages={messages}>
        { children }
      </IntlProvider>
    );
  }

  getChildContext () {
    const { api, store } = this.props;

    return {
      api,
      store
    };
  }
}
