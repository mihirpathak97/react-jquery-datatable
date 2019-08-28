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

interface Column {
  title: string,
  key: string,
  visible: any
}

interface Filter {
  label: string,
  data: Array<any>,
  type: string,
  key: string,
  placeholder: string
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
  filters
}) => {

  const [localData, setData] = React.useState<Array<Object>>([])
  const [localColumns, setColumns] = React.useState<Array<Column>>([])
  const [appliedFilters, setAppliedFilters] = React.useState<Array<Object>>([])

  React.useEffect(() => {
    setData(data)
    setColumns(columns)
  }, [])

  React.useEffect(() => {
    setData(data.filter((item: Object) => {
      return Object.keys(appliedFilters).every(filter => {
        let filterData = filters.filter(item => item.key === filter)[0]
        let appliedFilter = appliedFilters[filter]

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
    }))
  }, [appliedFilters])

  let handleFilterChange = (filterValue: string | boolean, key: string) => {
    setAppliedFilters(prevFilters => {
      return {...prevFilters, [key]: filterValue}
    })
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
    width: ${100/columns.length}%;
    padding: 10px 20px;
  `

    return (
      <>
        <FilterWrapper>
          {
            filters.map((filter: Filter) => {
              if (filter.type === 'select') {
                return (
                  <FilterItem key={`filter-select-${filter.key}`}>
                    <Select onChange={(event) => handleFilterChange(event.target.value, filter.key)} value={appliedFilters[filter.key] || ''}>
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
                    <label>{filter.label}</label>{' '}
                    <input type="text" onChange={(event) => handleFilterChange(event.target.value, filter.key)}  value={appliedFilters[filter.key] || ''} />
                  </FilterItem>
                )
              }
              if (filter.type === 'toggle') {
                return (
                  <FilterItem key={`filter-toggle-${filter.key}`}>
                    <input type="checkbox" onChange={(event) => handleFilterChange(event.target.checked, filter.key)}  checked={appliedFilters[filter.key] || false} />
                    <label>{filter.label}</label>
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
                localColumns.map((column: Column) => {
                  if (!falsy.includes(column.visible))
                    return <Col key={`title-${column.key}`}>{column.title}</Col>
                  return <></>
                })
              }
            </Row>
          </Head>
          <Body>
            {
              localData.map((item: Object, index) => {
                return (
                  <Row key={`row-${index}`}>
                    {
                      localColumns.map((column: Column, index) => {
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

export default ReactTable
