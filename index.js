let CELULAS_RANDOM = true
let PROBABILIDAD_DE_NACER = 20
let FILAS_TOTALES = 40
let COLUMNAS_TOTALES = 40
let TIEMPO_CICLO = 500
let INTERVALO_PAUSADO = true
let CICLOS = 0
let PIXELES_POR_CELDA = 1

let CELDAS = []

let inputVelocidad
let intervaloCiclos
let canvas
let ctx

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.querySelector("canvas")
    ctx = canvas.getContext("2d")

    inputVelocidad = document.getElementById("velocidadInput")
    document.getElementById("ciclos").innerHTML = CICLOS
    document.getElementById("velocidad").innerHTML = TIEMPO_CICLO

    generarTablero()

    document.addEventListener("keydown", (e) => {
        if (e.key == " " && INTERVALO_PAUSADO) {
            e.preventDefault()
            INTERVALO_PAUSADO = false
        } else if (e.key == " " && !INTERVALO_PAUSADO) {
            e.preventDefault()
            INTERVALO_PAUSADO = true
        }

        if (e.key == "ArrowRight") {
            e.preventDefault()
            avanzarCiclo()
        }

        if (e.key == "r" || e.key == "R") {
            e.preventDefault()
            CELULAS_RANDOM = true
            generarTablero()
        }
        
        if (e.key == "q" || e.key == "Q") {
            e.preventDefault()
            CELULAS_RANDOM = false
            generarTablero()
        }

        if (e.key == "o" || e.key == "O") {
            if (document.body.style.overflow == "hidden") {
                document.body.style.cursor = "auto"
                document.body.style.overflow = "auto"
            } else {
                document.body.style.cursor = "none"
                document.body.style.overflow = "hidden"
            }
        }
    })


    inputVelocidad.addEventListener("input", cambiarVelocidad)
})

function generarTablero() {
    CELDAS = []
    CICLOS = 0
    INTERVALO_PAUSADO = true
    FILAS_TOTALES = document.getElementById("filas").value
    COLUMNAS_TOTALES = document.getElementById("columnas").value
    PROBABILIDAD_DE_NACER = document.getElementById("prob-random").value
    canvas.height = FILAS_TOTALES * PIXELES_POR_CELDA
    canvas.width = COLUMNAS_TOTALES * PIXELES_POR_CELDA
    ctx.clearRect(0, 0, FILAS_TOTALES * PIXELES_POR_CELDA, COLUMNAS_TOTALES * PIXELES_POR_CELDA)
    for (let i = 0; i != FILAS_TOTALES; i++) {
        const fila = []
        for (let j = 0; j != COLUMNAS_TOTALES; j++) {
            if (Math.floor(Math.random() * 100) < PROBABILIDAD_DE_NACER && CELULAS_RANDOM) fila.push(1)
            else fila.push(0)
        }
        CELDAS.push(fila)
    }
    mostrarCelulas()

    intervaloCiclos = setInterval(() => {
        if (!INTERVALO_PAUSADO) avanzarCiclo()
    }, TIEMPO_CICLO)
}

function mostrarCelulas() {
    for (let i = 0; i < CELDAS.length; i++) {
        for (let j = 0; j < CELDAS[i].length; j++) {
            dibujarCelula(CELDAS[i][j], [j * PIXELES_POR_CELDA, i * PIXELES_POR_CELDA])
        }
    }
}

function dibujarCelula(estado, esquina) {
    if (estado == 1) ctx.fillStyle = "white"
    else ctx.fillStyle = "black"
    ctx.fillRect(esquina[0], esquina[1], PIXELES_POR_CELDA, PIXELES_POR_CELDA)
}

function cambiarVelocidad() {
    TIEMPO_CICLO = inputVelocidad.value
    clearInterval(intervaloCiclos)
    intervaloCiclos = setInterval(() => {
        if (!INTERVALO_PAUSADO) avanzarCiclo()
    }, TIEMPO_CICLO)
    document.getElementById("velocidad").innerHTML = TIEMPO_CICLO
}

function avanzarCiclo() {
    CICLOS++
    const celdasCopia = CELDAS.map(fila => [...fila])
    for (let i = 0; i < CELDAS.length; i++) {
        for (let j = 0; j < CELDAS[i].length; j++) {
            let vivasAlr = contarCelulasAlrededor(i, j)
            let celdaActual = CELDAS[i][j]
            if (celdaActual == 0 && vivasAlr == 3) celdasCopia[i][j] = 1
            else if (celdaActual == 1 && (vivasAlr != 2 && vivasAlr != 3)) celdasCopia[i][j] = 0
        }
    }

    CELDAS = celdasCopia
    document.getElementById("ciclos").innerHTML = CICLOS

    mostrarCelulas()
}

function contarCelulasAlrededor(idxFila, idxColumna) {
    const celulasAlrededor = []
    if (idxFila == 0 && idxColumna == 0) {
        celulasAlrededor.push([idxFila, idxColumna + 1])
        celulasAlrededor.push([idxFila + 1, idxColumna + 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
    } else if (idxFila == 0 && idxColumna > 0 && idxColumna < COLUMNAS_TOTALES - 1) {
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila, idxColumna + 1])
        celulasAlrededor.push([idxFila + 1, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
        celulasAlrededor.push([idxFila + 1, idxColumna + 1])
    } else if (idxFila == 0 && idxColumna == COLUMNAS_TOTALES - 1) {
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
    } else if (idxFila > 0 && idxFila < FILAS_TOTALES - 1 && idxColumna == 0) {
        celulasAlrededor.push([idxFila - 1, idxColumna])
        celulasAlrededor.push([idxFila - 1, idxColumna + 1])
        celulasAlrededor.push([idxFila, idxColumna + 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
        celulasAlrededor.push([idxFila + 1, idxColumna + 1])
    } else if (idxFila > 0 && idxFila < FILAS_TOTALES - 1 && idxColumna == COLUMNAS_TOTALES - 1) {
        celulasAlrededor.push([idxFila - 1, idxColumna])
        celulasAlrededor.push([idxFila - 1, idxColumna - 1])
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
    } else if (idxFila == FILAS_TOTALES - 1 && idxColumna == 0) {
        celulasAlrededor.push([idxFila - 1, idxColumna])
        celulasAlrededor.push([idxFila - 1, idxColumna + 1])
        celulasAlrededor.push([idxFila, idxColumna + 1])
    } else if (idxFila == FILAS_TOTALES - 1 && idxColumna > 0 && idxColumna < COLUMNAS_TOTALES - 1) {
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila - 1, idxColumna - 1])
        celulasAlrededor.push([idxFila - 1, idxColumna])
        celulasAlrededor.push([idxFila - 1, idxColumna + 1])
        celulasAlrededor.push([idxFila, idxColumna + 1])
    } else if (idxFila == FILAS_TOTALES - 1 && idxColumna == COLUMNAS_TOTALES - 1) {
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila - 1, idxColumna - 1])
        celulasAlrededor.push([idxFila - 1, idxColumna])
    } else {
        celulasAlrededor.push([idxFila - 1, idxColumna - 1])
        celulasAlrededor.push([idxFila - 1, idxColumna])
        celulasAlrededor.push([idxFila - 1, idxColumna + 1])
        celulasAlrededor.push([idxFila, idxColumna - 1])
        celulasAlrededor.push([idxFila, idxColumna + 1])
        celulasAlrededor.push([idxFila + 1, idxColumna - 1])
        celulasAlrededor.push([idxFila + 1, idxColumna])
        celulasAlrededor.push([idxFila + 1, idxColumna + 1])
    }

    celdasCopia = CELDAS
    let vivasAlr = 0
    celulasAlrededor.forEach((e) => {
        if (celdasCopia[e[0]][e[1]] == 1) {
            vivasAlr++
        }
    })

    return vivasAlr
}