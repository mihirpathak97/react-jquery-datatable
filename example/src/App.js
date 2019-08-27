import React, { Component } from 'react'

import ReactTable from 'react-table'

export default class App extends Component {
  render () {

    const data = [
      {
        name: 'Mihir',
        email: 'mihirpathak97',
        shouldShow: '1'
      },
      {
        name: 'Bleh',
        email: 'mihirpathak',
        shouldShow: '0'
      }
    ]

    const columns = [
      {
        key: 'name',
        title: 'Name'
      },
      {
        key: 'email',
        title: 'E-mail'
      },
      {
        key: 'shouldShow',
        title: 'Should Show'
      },
    ]

    const filters = [
      {
        type: 'select',
        title: 'Should Show?',
        data: ['Mihir', 'Bleh'],
        key: 'name'
      }
    ]

    return (
      <div>
        <ReactTable columns={columns} data={data} filters={filters} />
      </div>
    )
  }
}
