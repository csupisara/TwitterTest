import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import {
  // BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  // Tooltip,
  // Legend,
  // Bar,
  Line,
  LineChart,
} from 'recharts'
import moment from 'moment'

class App extends Component {
  constructor() {
    super()
    this.state = {
      message: [],
      endpoint: "https://swptwitter.appspot.com" // เชื่อมต่อไปยัง url ของ realtime server
      // endpoint: "35.184.23.109"
    }
  }

  componentDidMount = () => {
    const { endpoint, message } = this.state
    const temp = message
    const socket = socketIOClient(endpoint)
    socket.on('new-message', (messageNew) => {
      temp.push(messageNew)
      this.setState({ message: temp })
    })
  }

  render() {
    const { message } = this.state
    const data = []

    message.forEach(m => {
      let text = m.text
      if(text && typeof text === 'string' && text.toUpperCase().includes('#TRADEWAR')){
        let time = m.timestamp / 1000
        let unixTime = moment.unix(time).format('HH:mm')
        console.log(unixTime)
        const findData = data.find(d => d.timestamp === unixTime)
        if (findData){
          findData.count++
        }
        else{
          data.push({timestamp: unixTime, count: 1})
        }
      }
    })

    return (
      <div>
        <div>
        <h1 style={{color: 'blue'}}> Number of #TradeWar tweets </h1>
          <LineChart width={1000} height={300} data={data}>
            <XAxis dataKey="timestamp"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </div>
        <div style={{ height: '500px', overflow: 'scroll' }}>
          {
            message.map((data, i) =>
              <div key={i} style={{ marginTop: 20, paddingLeft: 50 }} >
                {i + 1} : {data.text}
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

export default App