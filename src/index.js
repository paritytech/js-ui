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

import 'semantic-ui-css/semantic.css';

import packageJson from '../package.json';

export AccountCard from './AccountCard';
export Actionbar, { Export as ActionbarExport, Import as ActionbarImport, Search as ActionbarSearch, Sort as ActionbarSort } from './Actionbar';
export Badge from './Badge';
export Balance from './Balance';
export BlockNumber from './BlockNumber';
export BlockTimestamp from './BlockTimestamp';
export Button from './Button';
export Certifications from './Certifications';
export ClientVersion from './ClientVersion';
export ConfirmDialog from './ConfirmDialog';
export Container, { Title as ContainerTitle } from './Container';
export ContextProvider from './ContextProvider';
export CopyToClipboard from './CopyToClipboard';
export CurrencySymbol from './CurrencySymbol';
export DappCard from './DappCard';
export DappIcon from './DappIcon';
export DappLink from './DappLink';
export Errors from './Errors';
export Features, { FEATURES, FeaturesStore } from './Features';
export Form, { AddressSelect, Checkbox, DappUrlInput, Dropdown, FileSelect, Input, InputAddress, InputAddressSelect, InputChip, InputDateTime, Label, LabelWrapper, RadioButtons, Slider, Toggle, TypedInput, VaultSelect, Tab } from './Form';
export GasPriceEditor from './GasPriceEditor';
export GasPriceSelector from './GasPriceSelector';
export GradientBg from './GradientBg';
export IconCache from './IconCache';
export Icons from './Icons';
export IdentityIcon from './IdentityIcon';
export IdentityName from './IdentityName';
export LanguageSelector from './LanguageSelector';
export List from './List';
export Loading from './Loading';
export MethodDecoding from './MethodDecoding';
export { Busy as BusyStep, Completed as CompletedStep } from './Modal';
export ModalBox from './ModalBox';
export NetChain from './NetChain';
export NetPeers from './NetPeers';
export Page from './Page';
export Popup from './Popup';
export Portal from './Portal';
export Progress from './Progress';
export QrCode from './QrCode';
export QrScan from './QrScan';
export ScrollableText from './ScrollableText';
export SectionList from './SectionList';
export SelectionList from './SelectionList';
export ShortenedHash from './ShortenedHash';
export Snackbar from './Snackbar';
export StatusIndicator from './StatusIndicator';
export Tabs from './Tabs';
export Tags from './Tags';
export Title from './Title';
export TokenImage from './TokenImage';
export TxHash from './TxHash';
export TxList from './TxList';
export VaultCard from './VaultCard';
export VaultTag from './VaultTag';
export Warning from './Warning';

const _version = packageJson.version;

export {
  _version
};
