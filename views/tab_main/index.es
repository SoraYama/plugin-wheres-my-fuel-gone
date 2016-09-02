import React, { Component } from 'react'
import { Input, Button, Pagination } from 'react-bootstrap'
import { connect } from 'react-redux'

import { pluginDataSelector } from '../redux/selectors'
import { addFilter } from '../redux/filters'
import { RuleSelectorMenu, RuleDisplay, translateRuleList } from '../filter_selector'
import { MainTable } from './main_table'

export const TabMain = connect(
  (state) => ({
    records: pluginDataSelector(state).records,
  }), {
    addFilter,
  }
)(class TabMain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ruleList: [],
      ruleTexts: [],
      activePage: 1,
    }
  }

  handleSelectPage = (eventKey) => {
    this.setState({
      activePage: eventKey,
    })
  }

  addRule = (path, value) => {
    const ruleList = this.state.ruleList
    ruleList.push({path, value})
    this.setState({
      ruleList: ruleList,
    })
    this.filterChangeTo(ruleList)
  }

  removeRule = (i) => {
    let ruleList
    if (i == null) {
      ruleList = []
    } else {
      ruleList = this.state.ruleList
      ruleList.splice(i, 1)
    }
    this.setState({
      ruleList: ruleList,
    })
    this.filterChangeTo(ruleList)
  }

  saveFilter = () => {
    this.props.addFilter(this.state.ruleList)
  }

  filterChangeTo = (nowRuleList) => {
    // testError has been done at RuleSelectorMenu
    const {func, texts, errors} = translateRuleList(nowRuleList)
    this.setState({
      ruleTexts: texts,
      filter: func,
      activePage: 1,
    })
  }

  render() {
    const data = (this.props.records || []).filter(this.state.filter || (() => true)).reverse()
    const dataLen = data.length
    const startNo = Math.min((this.state.activePage-1)*10, dataLen)
    const endNo = Math.min(startNo+10, dataLen)
    const maxPages = Math.max(Math.ceil((data.length)/10), 1)
    const sumData = this.state.ruleList.length ? window.sumUpConsumption(data) : null

    return (
      <div className='tabcontents-wrapper'>
        <RuleSelectorMenu 
          onAddRule={this.addRule} />
        <RuleDisplay
          ruleTexts={this.state.ruleTexts}
          onSave={this.saveFilter}
          onRemove={this.removeRule} />
        <MainTable 
          data={data.slice(startNo, endNo)}
          startNo={startNo}
          sumData={sumData}
          sortieTimes={data.length}
          />
        <div style={{textAlign: 'center'}}>
          <Pagination
            first
            last
            ellipsis
            items={maxPages}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelectPage} />
        </div>
      </div>
    )
  }
})