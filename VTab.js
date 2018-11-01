import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// components
import {APPICONS} from '../../constants-icons';
import Icon from '../Icon';

// #region Styled Components
const CloseIcon = styled(Icon)`
  display: none;
  position: absolute;
  right: -5px;
  top: -2px;
  cursor: pointer;
  svg *,
  svg path {
    fill: ${props => props.theme.verticalTabs.removeTab};
  }
`;

const Styles = styled.li`
  position: relative;
  list-style: none;
  &:hover {
    border-color: #b8d2fb;
    transition-duration: 0.175s;
    color: ${props => props.theme.link};
    svg *,
    svg path {
      fill: ${props => props.theme.verticalTabs.removeTab};
    }
    ${CloseIcon} {
      display: block;
      opacity: 0.4;
      svg *,
      svg path {
        fill: ${props => props.theme.verticalTabs.removeTab};
      }
      &:hover {
        opacity: 1;
      }
    }
  }
`;

const TabsItem = styled.span`
  font-size: 0.85em;
  font-weight: 600;
  box-sizing: border-box;
  display: flex;
  background: ${props => {
    if (props.selected) return props.theme.verticalTabs.selectedTabBackground;
    return 'transparent';
  }};
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  transition: border-color 0.35s;
  padding: 10px 0 9px 25px;
  margin: 3px 0 3px -25px;
  color: ${props => {
    if (props.selected) return props.theme.link;
    return props.theme.tabs.tabText;
  }};
  &:hover {
    border-color: #b8d2fb;
    transition-duration: 0.175s;
    color: ${props => props.theme.link};
    svg *,
    svg path {
      fill: ${props => props.theme.verticalTabs.removeTab};
    }
  }
`;
// #endregion

class VTab extends PureComponent {
  handleClick = e => {
    e.preventDefault();
    this.props.handleTabClick(e, this.props.tabIndex);
  };

  render() {
    const {selected, tabId, title} = this.props;
    return (
      <Styles>
        <TabsItem selected={selected} onClick={this.handleClick} onContextMenu={e => this.handleClick(e)}>
          {title}
        </TabsItem>
        <CloseIcon icon={APPICONS.MULTIPLY_SMALL} clickHandler={() => this.props.removeTab(tabId)} />
      </Styles>
    );
  }
}

VTab.propTypes = {
  title: PropTypes.string.isRequired,
  // handleClick: PropTypes.func.isRequired,
  // clickHandler: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  tabId: PropTypes.number.isRequired,
  removeTab: PropTypes.func.isRequired,
};

export default VTab;
