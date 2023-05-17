//Se crea una constante para la API REST
const API_URL = 'http://localhost:3001/api/';

// Los valores minimos se toman del localstorage
var xMin = localStorage.getItem("pasillos");
var yMin = localStorage.getItem("largoEspacios");
var zMin = localStorage.getItem("pisos");


// Funcion para insertar datos en la tabla layout de acuerdo a los datos pasillos, largo y alto del formulario
function insertarLayout() {
    event.preventDefault();
    console.log("insertLayout");
    var pasillos = document.getElementById("pasillos").value;
    var largo = document.getElementById("largo").value;
    var alto = document.getElementById("alto").value;

    // Se hace la petición a la API REST para crear los nuevos rows en la tabla layout
    // Solo si los valores del formulario son mayores a los del localstorage
    if (pasillos > xMin || largo > yMin || alto > zMin) {
        createLayout(pasillos, largo, alto, xMin, yMin, zMin);
        // Se actualizan los valores del localstorage
        localStorage.setItem("pasillos", pasillos);
        localStorage.setItem("largoEspacios", largo);
        localStorage.setItem("pisos", alto);

        // Se actualizan los valores en la tabla Dimensions de la base de datos con el API
        var xhr = new XMLHttpRequest();
        //post request
        xhr.open('POST', API_URL + 'updatedimension', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            X_LENGTH: pasillos,
            Y_LENGTH: largo,
            Z_LENGTH: alto
        }));
        // Alerta de que se actualizaron los valores y se redirecciona a la pagina de inicio
        alert("Se actualizaron los valores");
        window.location.href = "index.html";
    } else {
        alert("Los valores ingresados son menores a los existentes");
    }
}

// funcion para crear el layout
// recibe como parametros la cantidad de pasillos, largoEspacios y pisos
// y las coordenadas minimas de cada uno
async function createLayout(pasillos, largoEspacios, pisos, minX, minY, minZ) {
    // Arreglo con los nombres de los pasillos de la A a la Z
    var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
        "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    console.log("createLayout extra...");
    var espacioEntrePasillo = 0;
    xLoc = 0;
    yLoc = 0;
    zLoc = 0;
    // Se hace la petición a la API REST para crear rows en la tabla layout
    for (var i = 0; i <= pasillos; i++) {
        for (var j = 0; j < (largoEspacios); j++) {
            for (var k = 0; k < pisos; k++) {
                // Si i es mayor que minX, j es mayor que minY o k es mayor que minZ
                if (i > minX - 1 || j > minY - 1 || k > minZ - 1) {
                    try{
                        console.log("createLayout extra... Pasillo: " + i + " Largo: " + j + " Piso: " + k);
                    // Se hace la petición a la API REST para crear rows en la tabla layout con la ruta /insertlayout
                    // Recibe como parametros: [req.body.LOCATION, req.body.WIDTH, req.body.HEIGHT, req.body.DEPTH, req.body.X, req.body.Y, req.body.Z, req.body.AISLE, req.body.AREA, req.body.LEVEL]
                    var xLoc = (i * 58 + espacioEntrePasillo);
                    var yLoc = j * 58;
                    var zLoc = k * 60;
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', API_URL + 'insertlayout', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({
                        LOCATION: letras[i] + "-" + j + "-" + k,
                        WIDTH: 48,
                        HEIGHT: 55,
                        DEPTH: 48,
                        X: xLoc,
                        Y: yLoc,
                        Z: zLoc,
                        AISLE: letras[i],
                        AREA: i,
                        LEVEL: k
                    }));

                    if (i > 0 && i < pasillos) {
                        var xhr2 = new XMLHttpRequest();
                        var xLoc2 = xLoc + 58;
                        xhr2.open('POST', API_URL + 'insertlayout', true);
                        xhr2.setRequestHeader('Content-Type', 'application/json');
                        xhr2.send(JSON.stringify({
                            LOCATION: letras[i] + "-" + j + "-" + k + "-R",
                            WIDTH: 48,
                            HEIGHT: 55,
                            DEPTH: 48,
                            X: xLoc2,
                            Y: yLoc,
                            Z: zLoc,
                            AISLE: letras[i],
                            AREA: i,
                            LEVEL: k
                        }
                        ));
                    }
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        }
        if (i == 0)
            espacioEntrePasillo += 80;
        else
            espacioEntrePasillo += 160;
    }
}