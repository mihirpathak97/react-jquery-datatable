/**
 * @FunctionComponent ReactTable
 */

import * as React from 'react'
import styled from 'styled-components'
interface OwnProps {
  columns: Array<Column>,
  filters?: Array<Filter>,
  data: Array<Object>,
  rowKey?: string,
  loading?: boolean
}

/**
 * A column
 * @typedef Column
 * @property {string} title - Specifies column title
 * @property {string} key - A unique key that will be used as `key` in React
 * @property {string} dataIndex - The key to find in data passed
 * @property {*} visible - Specifies if column is visible. Accepts falsy values
 * @property {func} render - A custom render function for column
 */
interface Column {
  title: string,
  key: string,
  dataIndex: string,
  visible?: any,
  render?: Function
}

/**
 * A filter
 * @typedef Filter
 * @property {string=} label - Specifies filter label
 * @property {string=} data - Array to specifiy data for `select`
 * @property {string} type - Type of filter. One of [select, input, toggle]
 * @property {string} dataIndex - Specifies which key to filter
 * @property {string=} placeholder - Input placeholder
 */
interface Filter {
  label?: string,
  data?: Array<any>,
  type: string,
  dataIndex: string,
  placeholder?: string
}

/**
 * Same like filter, but will hold only type
 * @typedef FilterType
 * @property {string} type - Type of filter. One of [select, input, toggle]
 */
interface FilterType {
  type: string
}

const FilterWrapper = styled.div`
  display: flex;
  width: 80%;
  height: auto;
  margin: auto;
  flex-direction: row;
  justify-content: flex-start;
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

const ReactTable: React.FunctionComponent<OwnProps> = ({
  data,
  columns,
  filters,
  rowKey,
  loading
}) => {

  const [localData, setData] = React.useState<Array<Object>>([])
  const [localColumns, setColumns] = React.useState<Array<Column>>([])
  const [appliedFilters, setAppliedFilters] = React.useState<Object>({})

  React.useEffect(() => {
    setData(data)
    setColumns(columns)
  }, [])

  React.useEffect(() => {
    setData(data.filter((item: Object) => {
      return Object.keys(appliedFilters).every(filter => {
        let filterData: FilterType = getFilters().filter(item => item.dataIndex === filter)[0]
        let appliedFilter = appliedFilters[filter]

        if (!filterData) {
          filterData = {
            type: 'globalSearch',
          }
        }

        switch (filterData.type) {
          case 'select':
            return item[filter] === appliedFilter
          case 'input':
            return item[filter].toLowerCase().includes(appliedFilter.toString().toLowerCase())
          case 'toggle':
            return !!item[filter] === appliedFilter
          default:
            return Object.keys(item).some((key) => {
              return item[key].toLowerCase().includes(appliedFilter.toLowerCase());
            });
        }
      })
    }))
  }, [appliedFilters])

  let handleFilterChange = (filterValue: string | boolean, key: string) => {
    setAppliedFilters(prevFilters => {
      return { ...prevFilters, [key]: filterValue }
    })
  }

  let getFilters = () => filters ? filters : []

  let getRowKey = (item: Object) => {
    return rowKey ? item[rowKey] : item['key'] ? item['key'] : null
  }

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
    width: ${100 / columns.length}%;
    padding: 10px 20px;
  `

  if (loading) {
    return (
      <>
        Loading please wait...
      </>
    )
  }

  return (
    <>
      <FilterWrapper>
        {
          getFilters().map((filter: Filter) => {
            if (filter.type === 'select') {
              return (
                <FilterItem key={`filter-select-${filter.dataIndex}`}>
                  <Select onChange={(event) => handleFilterChange(event.target.value, filter.dataIndex)} value={appliedFilters[filter.dataIndex] || ''}>
                    <option value="" disabled>{filter.placeholder ? filter.placeholder : 'Select and option'}</option>
                    {
                      filter.data ? filter.data.map((item, index) => {
                        return <option key={`${filter.dataIndex}-${item}-${index}`}>{item}</option>
                      }) : null
                    }
                  </Select>
                </FilterItem>
              )
            }
            if (filter.type === 'input') {
              return (
                <FilterItem key={`filter-input-${filter.dataIndex}`}>
                  <label>{filter.label}</label>{' '}
                  <input type="text" onChange={(event) => handleFilterChange(event.target.value, filter.dataIndex)} value={appliedFilters[filter.dataIndex] || ''} />
                </FilterItem>
              )
            }
            if (filter.type === 'toggle') {
              return (
                <FilterItem key={`filter-toggle-${filter.dataIndex}`}>
                  <input type="checkbox" onChange={(event) => handleFilterChange(event.target.checked, filter.dataIndex)} checked={appliedFilters[filter.dataIndex] || false} />
                  <label>{filter.label}</label>
                </FilterItem>
              )
            }
            else {
              return (<></>)
            }
          })
        }
        <FilterItem key={`filter-input-global`}>
          <label>Global Search</label>{' '}
          <input type="text" onChange={(event) => handleFilterChange(event.target.value, 'globalSearch')} value={appliedFilters['globalSearch'] || ''} />
        </FilterItem>
      </FilterWrapper>
      <Table>
        <Head>
          <Row>
            {
              localColumns.map((column: Column) => {
                if (!falsy.includes(column.visible))
                  return <Col key={`${column.key}`}>{column.title || column.dataIndex}</Col>
                return <></>
              })
            }
          </Row>
        </Head>
        <Body>
          {
            localData.map((item: Object, index) => {
              return (
                <Row key={`${getRowKey(item)}-${index}`}>
                  {
                    localColumns.map((column: Column, index) => {
                      if (!falsy.includes(column.visible))
                        return <Col key={`${column.key}-${index}`}>{
                          typeof column.render === 'function' ? column.render(item[column.dataIndex], item) : item[column.dataIndex]
                        }</Col>
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

export default ReactTable
