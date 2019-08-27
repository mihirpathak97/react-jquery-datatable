/**
 * @Component ReactTable
 */

import * as React from 'react'

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
        <table>
          <thead>
            <tr>
              {
                this.state.columns.map((column: Column) => (
                  <td key={`title-${column.key}`}>{column.title}</td>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              this.state.data.map((item: Object, index) => {
                return (
                  <tr key={`row-${index}`}>
                    {
                      this.state.columns.map((column: Column, index) => {
                        return <td key={`column-${index}-index`}>{item[column.key.toString()]}</td>
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </>
    )
  }
}

export default ReactTable
