const inquirer = require('inquirer')
require('colors')


const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?\n',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
]


const inquirerMenu = async () => {

    console.clear()

    console.log('==========================='.green)
    console.log('   Seleccione una opción   '.white)
    console.log('===========================\n'.green)

    const { option } = await inquirer.prompt(questions)
    return option
}


const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'pause',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ]
    console.log('\n')

    const { pause } = await inquirer.prompt(question)
    return pause
}


const readInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate (value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]

    const { desc } = await inquirer.prompt(question)
    return desc
}


const listPlaces = async (places = []) => {
    const choices = places.map((place, i) => {

        const index = `${i + 1}.`.green

        return {
            value: place.id,
            name: `${index} ${place.nombre}`
        }
    })

    // Agregar opción al inicio
    choices.unshift({
        value: 0,
        name: '0. '.green + 'Volver'.yellow
    })

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            pageSize: `${choices.length}`,
            choices
        }
    ]

    const { id } = await inquirer.prompt(questions)
    return id
}


module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces
}

