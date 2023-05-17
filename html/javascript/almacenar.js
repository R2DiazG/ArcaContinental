/* ******************************************************************* */
// DESCRIPCION:             Este archivo contiene las funciones para 
//                          registrar el almacenamiento de un producto en 
//                          una ubicación
//
// FECHA DE CREACIÓN:       2023-01-23
// FECHA DE MODIFICACIÓN:   2023-01-28
/* ******************************************************************* */
//Se crea una constante para la API REST
const API_URL = 'http://localhost:3001/api/';
//funcion para cambiar el boton registrar por uno desactivado hasta que los 
//campos noItem y idLocation esten llenos
function desactivarBoton() {
    var noItem = document.getElementById("noItem").value;
    var idLocation = document.getElementById("idLocation").value;
    if (noItem == "" || idLocation == "") {
        document.getElementById("registrarBtn").disabled = true;
    } else {
        document.getElementById("registrarBtn").disabled = false;
    }
}


//función para consultar en la base de datos con el noItem con httpRequest
function consultarNoItem(noItem) {
    //creamos el objeto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    //creamos la variable para guardar los datos de la consulta
    var datos;
    //abrimos la conexión
    //((La petición será cambiada a otra API REST))
    xhr.open('GET', API_URL + 'production/' + noItem, true);
    //enviamos la solicitud
    xhr.send();
    //cuando la solicitud se complete
    xhr.onreadystatechange = function () {
        //si la solicitud se completo
        if (xhr.readyState == 4) {
            //si la solicitud fue exitosa
            if (xhr.status == 200) {
                //guardamos los datos de la consulta en la variable datos
                datos = JSON.parse(xhr.responseText);
                //si la consulta no arrojo resultados
                if (datos.length == 0) {
                    //mostramos un mensaje de error
                    alert('No se encontraron resultados');
                } else {
                    //si la consulta arrojo resultados
                    //mostramos los datos en la tabla
                    mostrarDatos(datos);
                }
            }
        }
    }
}
//función para mostrar los datos en un div
function mostrarDatos(datos) {

    //creamos la variable para guardar el html
    var html = '';
    //recorremos los datos
    for (var i = 0; i < datos.length; i++) {
        //agregamos los datos a la variable html
        html += '<table class="table table-bordered mt-2">';
        html += '<thead>';
        html += '<th>' + "ITEM_NO" + '</th>';
        html += '<th>' + "ITEM_DESCRIPTION" + '</th>';
        html += '<th>' + "PACK" + '</th>';
        html += '<th>' + "SIZE" + '</th>';
        html += '<th>' + "ITEM_WGT" + '</th>';;
        html += '</thead>';

        html += '<tr>';
        html += '<td>' + datos[i].ITEM_NO + '</td>';
        html += '<td>' + datos[i].ITEM_DESCRIPTION + '</td>';
        html += '<td>' + datos[i].PACK + '</td>';
        html += '<td>' + datos[i].SIZE + '</td>';
        html += '<td>' + datos[i].ITEM_WGT + '</td>';
        html += '</tr>';
        html += '</table>';
    }
    //INSERTAMOS LA TABLA en el div
    document.getElementById('datos1').innerHTML = html;
    desactivarBoton();
}


//función para consultar en la base de datos con el location con httpRequest
function consultarLocation(location) {
    //creamos el objeto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    //creamos la variable para guardar los datos de la consulta
    var datos;
    //abrimos la conexión
    xhr.open('GET', API_URL + 'layout/' + location, true);
    //enviamos la solicitud
    xhr.send();
    //cuando la solicitud se complete
    xhr.onreadystatechange = function () {
        //si la solicitud se completo
        if (xhr.readyState == 4) {
            //si la solicitud fue exitosa
            if (xhr.status == 200) {
                //guardamos los datos de la consulta en la variable datos
                datos = JSON.parse(xhr.responseText);
                //si la consulta no arrojo resultados
                if (datos.length == 0) {
                    //mostramos un mensaje de error
                    alert('No se encontraron resultados');
                } else {
                    //si la consulta arrojo resultados
                    //mostramos los datos en la tabla
                    mostrarDatos2(datos);
                }
            }
        }
    }
}

//función para mostrar los datos en un div
function mostrarDatos2(datos) {

    //creamos la variable para guardar el html
    var html = '';
    //recorremos los datos
    for (var i = 0; i < datos.length; i++) {
        //agregamos los datos a la variable html
        html += '<table class="table table-bordered mt-2">';
        html += '<thead>';
        html += '<th>' + "LOCATION" + '</th>';
        html += '<th>' + "X" + '</th>';
        html += '<th>' + "Y" + '</th>';
        html += '<th>' + "Z" + '</th>';
        html += '<th>' + "AREA" + '</th>';
        html += '<th>' + "LEVEL" + '</th>';;
        html += '</thead>';

        html += '<tr>';
        html += '<td>' + datos[i].LOCATION + '</td>';
        html += '<td>' + datos[i].X + '</td>';
        html += '<td>' + datos[i].Y + '</td>';
        html += '<td>' + datos[i].Z + '</td>';
        html += '<td>' + datos[i].AREA + '</td>';
        html += '<td>' + datos[i].LEVEL + '</td>';
        html += '</tr>';
        html += '</table>';
    }
    //INSERTAMOS LA TABLA en el div
    document.getElementById('datos2').innerHTML = html;
    desactivarBoton();
}

//función para obtener el valor del input noItem y location del formulario, y enviarlos a la función almacenar
function enviarDatos() {
    //obtenemos el valor del input noItem
    var noItem = document.getElementById('noItem').value;
    //obtenemos el valor del input location
    var location = document.getElementById('idLocation').value;

    console.log(noItem, location);
    //enviamos los datos a la función almacenar
    almacenar(noItem, location);
}

//función para almacenar los datos en la base de datos dando como parametros el noItem y el location
function almacenar(noItem, location) {
    console.log(noItem, location);
    //creamos el objeto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    //abrimos la conexión
    xhr.open('POST', API_URL + 'almacenar', true);
    //enviamos la solicitud
    xhr.setRequestHeader('Content-Type', 'application/json');
    let data = `{ "noItem" :`+noItem+`, "location": "`+location+`" }`;
    xhr.onload = () => console.log(xhr.responseText);
    xhr.send(data);
    //cuando la solicitud se complete
    xhr.onreadystatechange = function () {
        //si la solicitud se completo
        if (xhr.readyState == 4) {
            //si la solicitud fue exitosa
            if (xhr.status == 200) {
                //mostramos un mensaje de exito y redireccionamos al index
                alert('Datos almacenados correctamente');
                window.location.href = 'index.html';
            }
        }
    }
}



