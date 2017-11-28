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
import { range } from 'lodash';
import BigNumber from 'bignumber.js';

import { fromWei, toWei } from '@parity/api/lib/util/wei';
import { bytesToHex } from '@parity/api/lib/util/format';
import { ABI_TYPES, parseAbiType } from '@parity/shared/lib/util/abi';
import { nodeOrStringProptype } from '@parity/shared/lib/util/proptypes';

import Button from '../../Button';
import Dropdown from '../../Form/Dropdown';
import Input from '../../Form/Input';
import InputAddressSelect from '../../Form/InputAddressSelect';
import LabelWrapper from '../../Form/LabelWrapper';
import Toggle from '../../Form/Toggle';
import { AddIcon, RemoveIcon } from '../../Icons';

import styles from './typedInput.css';

export default class TypedInput extends Component {
  static propTypes = {
    param: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]).isRequired,

    allowCopy: PropTypes.bool,
    allowedValues: PropTypes.array,
    className: PropTypes.string,
    error: PropTypes.any,
    hint: nodeOrStringProptype(),
    isEth: PropTypes.bool,
    label: nodeOrStringProptype(),
    max: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    value: PropTypes.any
  };

  static defaultProps = {
    allowCopy: false,
    isEth: null,
    min: null,
    max: null,
    onChange: () => {},
    readOnly: false
  };

  state = {
    isEth: false,
    ethValue: 0
  };

  componentWillMount () {
    const { isEth } = this.props;
    const value = this.getValue();

    if (typeof isEth === 'boolean' && value) {
      // Remove formatting commas
      const sanitizedValue = typeof value === 'string' ? value.replace(/,/g, '') : value;
      const ethValue = isEth ? fromWei(sanitizedValue) : value;

      this.setState({ isEth, ethValue });
    }
  }

  render () {
    const param = this.getParam();

    if (param) {
      return this.renderParam(param);
    }

    console.error('<TypedInput>', `unknown "${param}" param passed to props`);
    return null;
  }

  renderParam (param) {
    const { allowCopy, isEth, readOnly } = this.props;
    const { type } = param;

    if (type === ABI_TYPES.ARRAY) {
      const { allowedValues, className, label } = this.props;
      const { subtype, length } = param;
      const value = this.getValue() || param.default;

      const fixedLength = !!length;

      const inputs = range(length || value.length).map((_, index) => {
        const onChange = (inputValue) => {
          const newValues = [].concat(value);

          newValues[index] = inputValue;
          this.props.onChange(newValues);
        };

        return (
          <TypedInput
            allowCopy={allowCopy}
            allowedValues={allowedValues}
            className={className}
            key={`${subtype.type}_${index}`}
            onChange={onChange}
            param={subtype}
            readOnly={readOnly}
            value={value[index]}
          />
        );
      });

      return (
        <LabelWrapper
          className={styles.inputs}
          label={label}
        >
          { fixedLength || readOnly ? null : this.renderLength() }
          { inputs }
        </LabelWrapper>
      );
    }

    if (isEth) {
      return this.renderEth();
    }

    return this.renderType(type);
  }

  renderLength () {
    return (
      <div style={{ marginTop: '0.75em' }}>
        <Button
          icon={<AddIcon />}
          onClick={this.onAddField}
        />
        <Button
          icon={<RemoveIcon />}
          onClick={this.onRemoveField}
        />
      </div>
    );
  }

  renderType (type) {
    if (type === ABI_TYPES.ADDRESS) {
      return this.renderAddress();
    }

    if (type === ABI_TYPES.BOOL) {
      return this.renderBoolean();
    }

    if (type === ABI_TYPES.STRING) {
      return this.renderDefault();
    }

    if (type === ABI_TYPES.BYTES) {
      let value = this.getValue();

      // Convert to hex if it's an array
      if (Array.isArray(value)) {
        value = bytesToHex(value);
      }

      return this.renderDefault(value);
    }

    // If the `isEth` prop is present (true or false)
    // then render the ETH toggle (usefull for contract execution)
    // Don't by default
    if (type === ABI_TYPES.INT) {
      const { isEth } = this.props;

      if (typeof isEth !== 'boolean') {
        return this.renderInteger();
      }

      return this.renderEth();
    }

    if (type === ABI_TYPES.FIXED) {
      return this.renderFloat();
    }

    return this.renderDefault();
  }

  renderEth () {
    const { ethValue, isEth } = this.state;

    const value = ethValue && typeof ethValue.toFixed === 'function'
      ? ethValue.toFixed() // we need a string representation, could be >15 digits
      : ethValue;

    const input = isEth
      ? this.renderFloat(value, this.onEthValueChange)
      : this.renderInteger(value, this.onEthValueChange);

    return (
      <div className={styles.ethInput}>
        <div className={styles.input}>
          { input }
          { isEth ? (<div className={styles.label}>ETH</div>) : null }
        </div>
        <div className={styles.toggle}>
          <Toggle
            toggled={this.state.isEth}
            onToggle={this.onEthTypeChange}
            style={{ width: 46 }}
          />
        </div>
      </div>
    );
  }

  getNumberValue (value, readOnly = this.props.readOnly) {
    if (!value) {
      return value;
    }

    const rawValue = typeof value === 'string'
      ? value.replace(/,/g, '')
      : value;

    const bnValue = new BigNumber(rawValue);

    return readOnly
      ? bnValue.toFormat()
      : bnValue.toFixed(); // we need a string representation, could be >15 digits
  }

  renderInteger (value = this.getValue(), onChange = this.onChange) {
    const { allowCopy, className, label, error, hint, min, max, readOnly } = this.props;
    const param = this.getParam();

    const realValue = this.getNumberValue(value);

    return (
      <Input
        allowCopy={allowCopy ? this.getNumberValue(value, false) : undefined}
        className={className}
        label={label}
        hint={hint}
        value={realValue}
        error={error}
        onChange={onChange}
        readOnly={readOnly}
        type={readOnly ? 'text' : 'number'}
        step={1}
        min={min !== null ? min : (param.signed ? null : 0)}
        max={max !== null ? max : null}
      />
    );
  }

  /**
   * Decimal numbers have to be input via text field
   * because of some react issues with input number fields.
   * Once the issue is fixed, this could be a number again.
   *
   * @see https://github.com/facebook/react/issues/1549
   */
  renderFloat (value = this.getValue(), onChange = this.onChange) {
    const { allowCopy, className, label, error, hint, min, max, readOnly } = this.props;
    const param = this.getParam();

    const realValue = this.getNumberValue(value);

    return (
      <Input
        allowCopy={allowCopy ? this.getNumberValue(value, false) : undefined}
        className={className}
        label={label}
        hint={hint}
        value={realValue}
        error={error}
        onChange={onChange}
        readOnly={readOnly}
        type='text'
        min={min !== null ? min : (param.signed ? null : 0)}
        max={max !== null ? max : null}
      />
    );
  }

  renderDefault (value = this.getValue()) {
    const { allowCopy, className, label, error, hint, readOnly } = this.props;

    return (
      <Input
        allowCopy={allowCopy}
        className={className}
        label={label}
        hint={hint}
        value={value}
        error={error}
        onSubmit={this.onSubmit}
        readOnly={readOnly}
      />
    );
  }

  renderAddress () {
    const { allowCopy, allowedValues, className, label, error, hint, readOnly } = this.props;
    const value = this.getValue();

    return (
      <InputAddressSelect
        allowCopy={allowCopy}
        allowedValues={allowedValues}
        className={className}
        error={error}
        hint={hint}
        label={label}
        onChange={this.onChange}
        readOnly={readOnly}
        value={value}
      />
    );
  }

  renderBoolean () {
    const { allowCopy, className, label, error, hint, readOnly } = this.props;
    const value = this.getValue()
      ? 'true'
      : 'false';

    if (readOnly) {
      return this.renderDefault(value);
    }

    return (
      <Dropdown
        allowCopy={allowCopy}
        className={className}
        error={error}
        hint={hint}
        label={label}
        onChange={this.onChangeBool}
        value={value}
        options={
          ['false', 'true'].map((bool) => {
            return {
              key: bool,
              text: bool,
              value: bool
            };
          })
        }
      />
    );
  }

  onChangeBool = (event, value) => {
    this.props.onChange(value === 'true');
  }

  onEthTypeChange = () => {
    const { isEth, ethValue } = this.state;

    if (ethValue === '' || ethValue === undefined) {
      return this.setState({ isEth: !isEth });
    }

    // Remove formatting commas
    const sanitizedValue = typeof ethValue === 'string' ? ethValue.replace(/,/g, '') : ethValue;
    const value = isEth ? toWei(sanitizedValue) : fromWei(sanitizedValue);

    this.setState({ isEth: !isEth, ethValue: value }, () => {
      this.onEthValueChange(null, value);
    });
  }

  onEthValueChange = (event, value) => {
    const realValue = this.state.isEth && value !== '' && value !== undefined
      ? toWei(value)
      : value;

    this.setState({ ethValue: value });
    this.props.onChange(realValue);
  }

  onChange = (event, value) => {
    this.props.onChange(value);
  }

  onSubmit = (value) => {
    this.props.onChange(value);
  }

  onAddField = () => {
    const { value, onChange } = this.props;
    const param = this.getParam();

    const newValues = [].concat(value, param.subtype.default);

    onChange(newValues);
  }

  onRemoveField = () => {
    const { value, onChange } = this.props;
    const newValues = value.slice(0, -1);

    onChange(newValues);
  }

  getParam () {
    const { param } = this.props;

    if (typeof param === 'string') {
      return parseAbiType(param);
    }

    return param;
  }

  /**
   * If the value comes from `decodeMethodInput`,
   * it can be an object of the shape:
   *   { value: Object, type: String }
   */
  getValue (value = this.props.value) {
    return value && value.value !== undefined
      ? value.value
      : value;
  }
}
