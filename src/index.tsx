/**
 * @Component ReactTable
 */

import * as React from 'react'

import styled from 'styled-components'

interface Props {
  columns: Array<Column>,
  filters: Array<Filter>,
  data: Array<Object>
}

interface Column {
  title: String,
  key: String
}

interface Filter {
  title: String,
  data: Array<any>,
  type: String,
  key: String
}

class ReactTable extends React.Component<Props> {

  state = {
    data: [],
    filters: [],
    columns: []
  }

  componentDidMount() {
    this.setState({
      data: this.props.data || [],
      filters: this.props.filters || [],
      columns: this.props.columns || []
    })
  }

  handleFilterChange = (data: String | Boolean, key: String, type: String) => {
    this.setState({
      data: this.props.data.filter((item: Object) => {
        
        if (type === 'toggle') {
          if (typeof item[key.toString()] === "boolean") {
            // 
          }
          else {
            item[key.toString()] === '1' || item[key.toString()] === 'true' 
            ? item[key.toString()] = true : item[key.toString()] = false
          }
        }

        switch (type) {
          case 'select':
            return item[key.toString()] === data.toString()
          case 'input':
              return item[key.toString()].toLowerCase().includes(data.toString().toLowerCase())
          case 'toggle':
              return Boolean(item[key.toString()]) === Boolean(data)
          default:
            return true;
        }
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
        <div className="filters">
          {
            this.state.filters.map((filter: Filter) => {
              if (filter.type === 'select') {
                return (
                  <select onChange={(event) => this.handleFilterChange(event.target.value, filter.key, 'select')}>
                    {
                      filter.data.map((item, index) => {
                        return <option key={`${filter.key}-${item}-${index}`}>{item}</option>
                      })
                    }
                  </select>
                )
              }
              if (filter.type === 'input') {
                return (
                  <input type="text" onChange={(event) => this.handleFilterChange(event.target.value, filter.key, 'input')} />
                )
              }
              if (filter.type === 'toggle') {
                return (
                  <>
                    <input type="checkbox" onChange={(event) => this.handleFilterChange(event.target.checked, filter.key, 'toggle')} />
                    <label>{filter.title}</label>
                  </>
                )
              }
              else {
                return (<></>)
              }
            })
          }
        </div>
        <Table>
          <Head>
            <Row>
              {
                this.state.columns.map((column: Column) => (
                  <Col key={`title-${column.key}`}>{column.title}</Col>
                ))
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
                        return <Col key={`column-${index}-index`}>{item[column.key.toString()]}</Col>
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
