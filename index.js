require("dotenv").config()
const express = require('express')
const cors = require('cors')
const app = express()
let bodyParser = require('body-parser')
const req = require('express/lib/request')

app.use(cors())



app.set('views', './views')
app.use('/static', express.static('public'))
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index')
})


app.post('/', (req, res, next) => {
    let city = req.body.citySelection
    if (city) {
        fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`)
        .then(res => res.json())
        .then(data => { 
            let options = {
                    selectedCity: data.location.name,
                    selectedCountry: data.location.country,
                    time: data.location.localtime,
                    tempC: data.current.temp_c,
                    tempF: data.current.temp_f,
                    condition: data.current.condition.text,
                    conditionPic: data.current.condition.icon,
                    currentWind: data.current.wind_mph,
                    currentHumidity: data.current.humidity
                }
            console.log(options)
            res.render('weather', options)
        })
        .catch(error => {
            const err = new Error('Something went wrong')
            console.log(err)
            err.status = 500
            next(err)
        })
    } else {
        res.render('index')
    }
    
})

app.use((req, res, next) => {
    const err= new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.locals.error = err
    res.status(err.status)
    res.render('error')
})


let city = 'London'
const url = 'http://api.weatherapi.com/v1/current.json'

// app.post('/', (req, res) => {
//     // 
//     let city = req.body.citySelection
//     const params = {
//         'key': process.env.WEATHER_API_KEY,
//         'q': city,
//         'aqi': 'no'
//     }
//     const request = (url, params, method='GET') => {
//         if ('GET' === method) {
//             url += '?' + (new URLSearchParams( params )).toString()
//             console.log(url)
//         }
//         fetch(url)
//             .then(res => res.json())
//             .then(data => console.log(data))
//     }
//     request(url, params)
// })

app.listen(3000, () => {
    console.log("Running on 3000")
})