/**
 * @Component ReactTable
 */

import * as React from 'react'

import styled from 'styled-components'

interface OwnProps {
  columns: Array<Column>,
  filters: Array<Filter>,
  data: Array<Object>
}

interface OwnState {
  data: Array<Object>,
  filters: Array<Filter>,
  columns: Array<Column>,
  appliedFilters: Object
}

interface Column {
  title: string,
  key: string,
  visible: any
}

interface Filter {
  title: string,
  data: Array<any>,
  type: string,
  key: string
}

const FilterWrapper = styled.div`
  display: flex;
  width: 80%;
  height: auto;
  margin: auto;
  flex-direction: row;
  justify-content: space-between;
`

const FilterItem = styled.div`
  padding: 10px;
  margin: 10px 20px;
`

const Select = styled.select`
  padding: 10px;
  min-width: 6rem;
`

const falsy = [false, '0', 'false', 0]
const truthy = [true, '1', 'true', 1]

class ReactTable extends React.Component<OwnProps, OwnState> {

  state: Readonly<OwnState> = {
    data: [],
    columns: [],
    filters: [],
    appliedFilters: {}
  }

  componentDidMount() {
    this.setState({
      data: this.props.data || [],
      filters: this.props.filters || [],
      columns: this.props.columns || []
    })
  }

  handleFilterChange = (filterValue: string | boolean, key: string) => {
    this.setState(prevState => {
      return {
        appliedFilters: {...prevState.appliedFilters, [key]: filterValue}
      }
    }, () => {
      this.setState({
        data: this.props.data.filter((item: Object) => {
          return Object.keys(this.state.appliedFilters).every(filter => {
            let filterData = this.props.filters.filter(item => item.key === filter)[0]
            let appliedFilter = this.state.appliedFilters[filter]

            switch (filterData.type) {
              case 'select':
                return item[filter] === appliedFilter
              case 'input':
                return item[filter].toLowerCase().includes(appliedFilter.toString().toLowerCase())
              case 'toggle':
                return !!item[filter] === appliedFilter
              default:
                return true;
            }
          })
        })
      })
    })
  }

  render() {

    const Table = styled.table`
      display: block;
      margin: auto;
      max-width: 90%;
      min-width: 80%;
    `

    const Row = styled.tr`
      width: 100%;
    `

    const Head = styled.thead`
      width: 100%;
    `

    const Body = styled.tbody`
      width: 100%;
    `

    const Col = styled.td`
      width: ${100/this.props.columns.length}%;
      padding: 10px 20px;
    `

    return (
      <>
        <FilterWrapper>
          {
            this.state.filters.map((filter: Filter) => {
              if (filter.type === 'select') {
                return (
                  <FilterItem key={`filter-select-${filter.key}`}>
                    <Select onChange={(event) => this.handleFilterChange(event.target.value, filter.key)} value={this.state.appliedFilters[filter.key] || ''}>
                      {
                        filter.data.map((item, index) => {
                          return <option key={`${filter.key}-${item}-${index}`}>{item}</option>
                        })
                      }
                    </Select>
                  </FilterItem>
                )
              }
              if (filter.type === 'input') {
                return (
                  <FilterItem key={`filter-input-${filter.key}`}>
                    <input type="text" onChange={(event) => this.handleFilterChange(event.target.value, filter.key)}  value={this.state.appliedFilters[filter.key] || ''} />
                  </FilterItem>
                )
              }
              if (filter.type === 'toggle') {
                return (
                  <FilterItem  key={`filter-toggle-${filter.key}`}>
                    <input type="checkbox" onChange={(event) => this.handleFilterChange(event.target.checked, filter.key)}  checked={this.state.appliedFilters[filter.key] || false} />
                    <label>{filter.title}</label>
                  </FilterItem>
                )
              }
              else {
                return (<></>)
              }
            })
          }
        </FilterWrapper>
        <Table>
          <Head>
            <Row>
              {
                this.state.columns.map((column: Column) => {
                  if (!falsy.includes(column.visible))
                    return <Col key={`title-${column.key}`}>{column.title}</Col>
                  return <></>
                })
              }
            </Row>
          </Head>
          <Body>
            {
              this.state.data.map((item: Object, index) => {
                return (
                  <Row key={`row-${index}`}>
                    {
                      this.state.columns.map((column: Column, index) => {
                        if (!falsy.includes(column.visible))
                          return <Col key={`column-${index}-index`}>{item[column.key.toString()]}</Col>
                        return <></>
                      })
                    }
                  </Row>
                )
              })
            }
          </Body>
        </Table>
      </>
    )
  }
}

export default ReactTable
