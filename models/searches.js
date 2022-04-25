const fs = require('fs')

const axios = require('axios')

class Searches {

    history = []
    dbPath = './db/database.json'

    constructor() {
        this.readDB()
    }

    // Getters
    get historyCapitalised () {
        return this.history.map(place => {
            let words = place.split(' ')
            words = words.map(w => w[0].toUpperCase() + w.substring(1))
            return words.join(' ')
        })
    }


    get paramsMapBox () {
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_TOKEN
        }
    }



    get paramsOpenWeather () {
        return {
            'units': 'metric',
            'lang': 'es',
            'appid': process.env.API_KEY_OPENWEATHER
        }
    }


    async city (place) {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox
            })

            const res = await instance()

            return res.data.features.map(place => ({
                id: place.id,
                nombre: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }))

        } catch (error) {
            return []
        }
    }


    async weatherPlace (lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { lat, lon, ...this.paramsOpenWeather }
            })

            const res = await instance()
            const { weather, main } = res.data

            return {
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }
        } catch (error) {
            console.log(error)
        }
    }


    addHistory (place) {

        if (this.history.includes(place.toLowerCase())) {
            return
        }

        this.history = this.history.splice(0, 5)

        this.history.unshift(place.toLowerCase())

        // Guardar en una BD o txt
        this.saveDB()
    }

    saveDB () {
        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }


    readDB () {
        if (!fs.existsSync(this.dbPath)) return

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info)

        this.history = data.history
    }
}

module.exports = Searches