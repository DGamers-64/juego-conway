// let CELULAS_RANDOM = false
// let PROBABILIDAD_DE_NACER = 20
// let FILAS_TOTALES = 40
// let COLUMNAS_TOTALES = 40
// let TIEMPO_CICLO = 500
// let INTERVALO_PAUSADO = true
// let CICLOS = 0

// let intervaloCiclos

// document.addEventListener("DOMContentLoaded", () => {
//     generarTablero()
    
    // document.getElementById("ciclos").innerHTML = CICLOS
    // document.getElementById("velocidad").innerHTML = TIEMPO_CICLO / 1000

    intervaloCiclos = setInterval(() => {
        if (!INTERVALO_PAUSADO) {
            nuevoCiclo()
        }
    }, TIEMPO_CICLO)

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
            nuevoCiclo()
        }

        if (e.key == "ArrowUp") {
            e.preventDefault()
            cambiarVelocidad("subir")
        }

        if (e.key == "ArrowDown") {
            e.preventDefault()
            cambiarVelocidad("bajar")
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
    })
// })

function generarTablero() {
    CICLOS = 0
    INTERVALO_PAUSADO = true
    FILAS_TOTALES = document.getElementById("filas").value
    COLUMNAS_TOTALES = document.getElementById("columnas").value
    PROBABILIDAD_DE_NACER = document.getElementById("prob-random").value
    const tabla = document.querySelector("table")
    tabla.innerHTML = ""
    for (let i = 0; i < FILAS_TOTALES; i++) {
        const fila = document.createElement("tr")
        for (let i = 0; i < COLUMNAS_TOTALES; i++) {
            const columna = document.createElement("td")
            fila.appendChild(columna)
        }
        tabla.appendChild(fila)        
    }

    const filas = document.querySelectorAll("tr")
    filas.forEach((e) => {
        const columnas = e.querySelectorAll("td")
        columnas.forEach((el) => {
            if (Math.floor(Math.random() * 100) < PROBABILIDAD_DE_NACER && CELULAS_RANDOM) {
                el.classList.add("vivo")
            } else {
                el.classList.add("muerto")
            }

            el.addEventListener("click", () => {
                if (el.classList[0] == "vivo") {
                    el.classList.replace("vivo", "muerto")
                } else {
                    el.classList.replace("muerto", "vivo")
                }
            })
        })
    })
}

function cambiarVelocidad(key) {
    if (key == "subir" && TIEMPO_CICLO > 100) {
        TIEMPO_CICLO -= 100
        clearInterval(intervaloCiclos)

    } else if (key == "bajar" && TIEMPO_CICLO < 2000) {
        TIEMPO_CICLO += 100
    }
    clearInterval(intervaloCiclos)
    intervaloCiclos = setInterval(() => {
        if (!INTERVALO_PAUSADO) {
            nuevoCiclo()
        }
    }, TIEMPO_CICLO)
    document.getElementById("velocidad").innerHTML = TIEMPO_CICLO / 1000
}

function nuevoCiclo() {
    CICLOS++
    document.getElementById("ciclos").innerHTML = CICLOS
    const tablaCopia = document.querySelector("table").cloneNode(true)
    const filas = document.querySelectorAll("tr")
    filas.forEach((fila, idxFila) => {
        const columnas = fila.querySelectorAll("td")
        columnas.forEach((columna, idxColumna) => {
            const celulasAlrededor = contarCelulasAlrededor(idxFila, idxColumna)
            let vivasAlr = 0
            let muertasAlr = 0
            celulasAlrededor.forEach((e) => {
                if (tablaCopia.querySelectorAll("tr")[e[0]].querySelectorAll("td")[e[1]].classList[0] == "vivo") {
                    vivasAlr++
                } else {
                    muertasAlr++
                }
            })
            if (columna.classList[0] == "muerto" && vivasAlr == 3) {
                columna.classList.replace("muerto", "vivo")
            } else if (columna.classList[0] == "vivo" && vivasAlr > 3) {
                columna.classList.replace("vivo", "muerto")
            } else if (columna.classList[0] == "vivo" && vivasAlr <= 1) {
                columna.classList.replace("vivo", "muerto")
            }
        })
    })
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

    return celulasAlrededor
}