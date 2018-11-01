import React, {Component, Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// components
import Accordion, {AccordionBody, AccordionHeading} from '../Accordion';
import {createNoSubstitutionTemplateLiteral} from 'typescript';

// #region Styled Components
const Styles = styled.div`
  display: flex;
`;

const TabsWrap = styled.div`
  width: ${props => props.width};
  height: 600px;
  background: ${props => props.theme.verticalTabs.tabsBackground};
  border: 1px solid ${props => props.theme.table.headerBorder};
  /* border-bottom: none; */
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 12px;
    -webkit-box-shadow: inset 100px 0 0 ${props => props.theme.scrollbar};
  }
`;

const TabsList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0 5px -3px 0;
  padding: 10px 0 0 39px;
  & > div {
    padding: 6px 0;
  }
`;

const TabsContent = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme.table.headerBorder};
  border-left: 0;
`;
// #endregion

class VerticalTabs extends Component {
  state = {
    selectedTabIds: [],
  };

  componentWillMount() {
    const {selectedTabIds} = this.state;
    const {defaultTabIds, children} = this.props;
    if (defaultTabIds) {
      this.setState({selectedTabIds: defaultTabIds});
    } else {
      const defaultTabs = children[0].props.tabId === -9999 ? [children[1].props.tabId] : [children[0].props.tabId];
      this.setState({selectedTabIds: defaultTabs});
    }
    console.log('tabs:', children, 'default if not set', [children[0].props.tabId], selectedTabIds);
  }

  componentDidUpdate() {
    this.getSelectableTabs();
  }

  getSelectableTabs() {
    const {children} = this.props;
    const {selectedTabIds} = this.state;
    const currentSelectableTabs = selectedTabIds.filter(tab => {
      const childrenTabs = children.map(child => child.props.tabId);
      if (childrenTabs.includes(tab)) return true;
    });
    if (
      !(
        selectedTabIds.length === currentSelectableTabs.length &&
        selectedTabIds.sort().every((value, index) => value === currentSelectableTabs.sort()[index])
      )
    )
      this.setState({selectedTabIds: currentSelectableTabs});
  }

  getAdditionalProps = (index, props) => {
    const {selectedTabIds} = this.state;
    return {
      selectedTabIds, // for multitab selection
      handleTabClick: this.handleTabClick,
      tabIndex: index,
      selected: selectedTabIds.includes(index),
      ...props,
    };
  };

  getChildrenTabsWithProps = () => {
    const {children} = this.props;
    return Children.map(children, child =>
      cloneElement(child, this.getAdditionalProps(child.props.tabId, child.props)),
    );
  };

  getActiveTabContent = () => {
    const {children} = this.props;
    const {selectedTabIds} = this.state;
    // get single tab selected
    const currentChildren = children.filter(child => {
      if (child.props.tabId === selectedTabIds[0]) return child;
    });

    // show multitab selection content
    const multiSelectChild = children[0];
    if (selectedTabIds.length > 1) return multiSelectChild.props.children;

    // show single tab
    if (currentChildren.length === 1) return currentChildren[0].props.children;

    return false;
  };

  handleTabClick = (e, tabIndex) => {
    const {getSelectedTabs} = this.props;
    const {selectedTabIds} = this.state;
    const isTabSelected = selectedTabIds.includes(tabIndex);
    // if ctrl held
    if (e.ctrlKey && !isTabSelected) {
      // select this tab
      const selectedTabs = selectedTabIds;
      selectedTabs.push(tabIndex);
      this.setState({selectedTabIds: selectedTabs});
      getSelectedTabs(selectedTabs); // bubble up selected tabs
      return;
    }
    if (e.ctrlKey && isTabSelected && selectedTabIds.length > 1) {
      // deselect this tab
      const filteredSelectedTabs = selectedTabIds.filter(tab => tab !== tabIndex);
      this.setState({selectedTabIds: filteredSelectedTabs});
      getSelectedTabs(filteredSelectedTabs); // bubble up selected tabs
      return;
    }
    // if nothing held = change to this tab
    this.setState({selectedTabIds: [tabIndex]});
    getSelectedTabs([tabIndex]); // bubble up selected tabs
  };

  render() {
    const childrenTabsWithProps = this.getChildrenTabsWithProps();
    const tabContent = this.getActiveTabContent();
    const {headings, isPanel, width, className, allOpen} = this.props;

    return (
      <Styles className={className}>
        <TabsWrap isPanel={isPanel} width={width}>
          <TabsList>
            {headings.map((type, index) => (
              <Accordion key={index} isOpen={index === 0 || allOpen}>
                <AccordionHeading iconLeft="-35px" isTextClickable>
                  {type}
                </AccordionHeading>
                <AccordionBody>
                  {childrenTabsWithProps.filter(tab => {
                    if (tab.props.nodeType === type) return true;
                    return false;
                  })}
                </AccordionBody>
              </Accordion>
            ))}
          </TabsList>
        </TabsWrap>
        <TabsContent isPanel={isPanel}>{tabContent}</TabsContent>
      </Styles>
    );
  }
}

VerticalTabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  headings: PropTypes.arrayOf(PropTypes.string).isRequired,
  getSelectedTabs: PropTypes.func.isRequired,
  className: PropTypes.string,
  isPanel: PropTypes.bool,
  allOpen: PropTypes.bool,
  defaultTabIds: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.string,
};

VerticalTabs.defaultProps = {
  className: '',
  isPanel: false,
  defaultTabIds: null,
  width: '100%',
  allOpen: false,
};

export default VerticalTabs;
