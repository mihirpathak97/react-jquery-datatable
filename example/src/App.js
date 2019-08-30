import React, { Component } from 'react'

import ReactTable from 'react-table'

import axios from 'axios'

export default class App extends Component {

  state = {
    data: [],
    loading: true
  }

  componentDidMount() {
    axios.get('https://jsonplaceholder.typicode.com/photos')
      .then(response => {
        this.setState({
          data: response.data,
          loading: false
        })
      })
  }

  render () {

    const columns = [
      {
        dataIndex: 'id',
        key: 'id',
        title: 'ID'
      },
      {
        dataIndex: 'title',
        key: 'title',
        title: 'Title'
      },
      {
        dataIndex: 'url',
        key: 'url',
        title: 'URL',
        render: (text) => <a href={text}>{text}</a>
      },
      {
        dataIndex: 'thumbnailUrl',
        key: 'thumbnailUrl',
        title: 'Thumbnail',
        render: (text, record) => {
          return <img src={text} alt={record.title}></img>
        }
      }
    ]

    return (
      <div>
        <ReactTable columns={columns} loading={this.state.loading} data={this.state.data} />
      </div>
    )
  }
}
