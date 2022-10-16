const XMLHttpRequest = require("xmlhttprequest-ssl")
const express = require('express')
const app = express()
/**
 * @param {int seconds} pollInterval
 * @param {int minutes} trackingDuration
*/
var pollInterval = 30
var trackingDuration = 5

var history = []

app.get('/', (req, res) => {
    res.status(200).send(JSON.stringify(history))
})

app.listen(8000)

var fetchPlayerCountLoop = setInterval(() => {
    fetchPlayerCount()
}, pollInterval * 1000)

fetchPlayerCount()

function fetchPlayerCount() {
    var playerCount = 0
    var request = new XMLHttpRequest()
    request.open('POST', 'https://io-8.com/find_instances', true)
    request.setRequestHeader('Content-Type', 'application/json')
    var info = {
        game: 'gats.io'
    }
    request.send(JSON.stringify(info))
    request.onload = function () {
        console.log(this.responseText)
        var resp = JSON.parse(this.responseText)
        for (var i = 0; i < resp.length; i++) {
            playerCount += resp[i].players
        }
        history.push({ time: Date.now(), count: playerCount })
        history = history.slice(-Math.floor(((60 / pollInterval) * trackingDuration)))
    }
}
