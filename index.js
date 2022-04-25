require('dotenv').config()

const { readInput, pause, inquirerMenu, listPlaces } = require("./helpers/inquirer");
const Searches = require("./models/searches");


const appMain = async () => {

    const searches = new Searches()

    let option = ''

    do {

        option = await inquirerMenu()

        switch (option) {
            case 1:
                // Mostrar mensaje - Llenar input
                const term = await readInput('Ciudad: ')

                // Buscar los lugares relacionados
                const places = await searches.city(term)

                // Seleccionar el lugar
                const idSel = await listPlaces(places)

                if (idSel === 0) {
                    continue
                }

                const placeSelect = places.find(p => p.id === idSel)

                // Destructuring 
                const { nombre, lat, lng } = placeSelect

                // Guardar en DB
                searches.addHistory(nombre)

                // Clima del lugar
                const weather = await searches.weatherPlace(lat, lng)

                // Destructuring
                const { desc, temp, min, max } = weather


                // Mostrar los resultados
                console.clear()
                console.log('\nInformación de la ciudad seleccionada\n'.green)
                console.log('*'.green, 'Ciudad:', nombre)
                console.log('*'.green, 'Coordenadas')
                console.log(' -'.green, 'Latitud:', lat)
                console.log(' -'.green, 'Longitud:', lng)
                console.log('*'.green, 'Temperatura:', temp)
                console.log('*'.green, 'Mínima:', min)
                console.log('*'.green, 'Máxima:', max)
                console.log('*'.green, 'Descripción del clima:', desc.green)
                break;

            case 2:
                searches.historyCapitalised.forEach((place, i) => {
                    const index = `${i + 1}`.green
                    console.log(`${index} ${place}`)
                })
                break;

            case 0:

                break;
        }


        if (option !== 0) await pause()
    } while (option !== 0);
}

appMain()