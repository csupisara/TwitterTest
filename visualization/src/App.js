import React, { Component } from 'react'
// import socketIOClient from 'socket.io-client'
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'
import moment from 'moment'
const firebase = require("firebase/app")
require("firebase/database")

var firebaseConfig = {
  apiKey: "AIzaSyCeU4jshffXwvq-jpTmjMD5LHl8a-jh--E",
  authDomain: "swptwitter.firebaseapp.com",
  databaseURL: "https://swptwitter.firebaseio.com",
  projectId: "swptwitter",
  storageBucket: "swptwitter.appspot.com",
  messagingSenderId: "348188449421",
  appId: "1:348188449421:web:0338f76cbe619bf7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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
    firebase.database().ref('/db').on("value",snap => {
      if(snap.val()) {
        const values = Object.values(snap.val())
        this.setState({ message: values })
      }
    })
  }

  render() {
    const { message } = this.state
    const data = []

    message.forEach(m => {
        let time = m.timestamp / 1000
        let unixTime = moment.unix(time).startOf("minutes").format('HH:mm')

        const filtered = data.filter(d => {
          return d.timestamp === unixTime
        })

        // index
        if(filtered.length > 0) {
          const index = data.indexOf(filtered[0])
          data[index].count += 1
        } else {
          data.push({timestamp: unixTime, count: 1})
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