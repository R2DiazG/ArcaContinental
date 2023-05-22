/* ******************************************************************* */
// DESCRIPCION:         Este archivo contiene el codigo para la visualizacion 
//                      de los datos de la base de datos en 3D.
//                      Se utiliza la libreria three.js para la visualizacion
//                      de los datos en 3D.
// AUTOR:               Denis David Euan Mendoza
//
// FECHA DE CREACIÓN:   2023-01-23
// FECHA DE MODIFICACIÓN: 2023-02-21
/* ******************************************************************* */
//import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';


//Se crea una constante para la API REST
const API_URL = 'http://localhost:8010/api/';

// standard global variables
var canvas, scene, camera, renderer, controls;

// custom global variables
var mouse = { x: 0, y: 0 }, INTERSECTED;
var mouseBlocked = false;

//creamos un grupo para los productos
const productionGroup = new THREE.Group();
const filteredGroup = new THREE.Group();
//Se asigna un id al grupo
productionGroup.name = 'products';

function main() {


    function showtoast() {
        // Se muestra el toast de simbología
        const toastLiveExample = document.getElementById('liveToast')
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    }
    showtoast();

    getWarehouseDimensions(setupCheck);

    function setupCheck(dimensiones) {
        if (dimensiones == null) {
            alert("No se ha creado el almacen");
            return;
        } else {
            var pasillos = dimensiones.X_LENGHT;
            var largoEspacios = dimensiones.Y_LENGHT;
            var pisos = dimensiones.Z_LENGHT;
            // Guardar en el local storage
            localStorage.setItem("pasillos", pasillos);
            localStorage.setItem("largoEspacios", largoEspacios);
            localStorage.setItem("pisos", pisos);
        }
    }

    //Se revisa si el local storage tiene la cantidad de pasillos
    if (localStorage.getItem("pasillos") == null) {
        // confirmación para ("Se creará un almacen con " + pasillos + " pasillos, " + largoEspacios + " espacios por pasillo y " + pisos + " pisos por pasillo");
        if (confirm("Se creará un almacen con 8 pasillos, 30 espacios por pasillo y 2 pisos por pasillo")) {// Se hace la petición a la API REST para crear la tabla layout
            var xhr = new XMLHttpRequest();
            xhr.open('GET', API_URL + 'createtablelayout', true);
            xhr.send();
            // Se hace la petición a la API REST para crear la tabla production
            xhr.open('GET', API_URL + 'createtableproduction', true);
            xhr.send();
            // Se hace la petición a la API REST para crear la tabla productionlayout
            xhr.open('GET', API_URL + 'createtableproductionlayout', true);
            xhr.send();
        }

        /*         //pedir al usuario que ingrese la cantidad de pasillos que desea
                var pasillos = parseInt(prompt("Ingrese la cantidad de pasillos que desea", 5));
                var largoEspacios = parseInt(prompt("Ingrese la cantidad de espacios por pasillo", 10));
                var pisos = parseInt(prompt("Ingrese la cantidad de pisos que desea en cada pasillo", 3));
         */
        var pasillos = 8;
        var largoEspacios = 30;
        var pisos = 2;
        //Se crea el layout
        createLayout(pasillos, largoEspacios, pisos, 0, 0, 0);
        //Se almacena la cantidad de pasillos, largoEspacios y pisos en el local storage
        localStorage.setItem("pasillos", pasillos);
        localStorage.setItem("largoEspacios", largoEspacios);
        localStorage.setItem("pisos", pisos);
    } else {
        //Se obtiene la cantidad de pasillos, largoEspacios y pisos del local storage
        var pasillos = localStorage.getItem("pasillos");
        var largoEspacios = localStorage.getItem("largoEspacios");
        var pisos = localStorage.getItem("pisos");
    }
    //Se crea un WEBGLRenderer
    canvas = document.querySelector('#c');
    //Se crea un renderer para la visualizacion
    renderer = new THREE.WebGLRenderer({ canvas });

    // funcion para crear el layout
    // recibe como parametros la cantidad de pasillos, largoEspacios y pisos
    // y las coordenadas minimas de cada uno
    async function createLayout(pasillos, largoEspacios, pisos, minX, minY, minZ) {
        // Arreglo con los nombres de los pasillos de la A a la Z
        var letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
            "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
        var espacioEntrePasillo = 0;
        xLoc = 0;
        yLoc = 0;
        zLoc = 0;
        // Se hace la petición a la API REST para crear rows en la tabla layout
        for (var i = minX; i <= pasillos; i++) {
            for (var j = minY; j < (largoEspacios); j++) {
                for (var k = minZ; k < pisos; k++) {
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

                    if (i != 0 && i < pasillos) {
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
                }
            }
            if (i == 0)
                espacioEntrePasillo += 80;
            else
                espacioEntrePasillo += 160;
        }
    }

    /* ******************************************************************* */
    /* *************         CONFIGURACION DE LA CAMARA   **************** */
    /* ******************************************************************* */
    //Se crea una camara
    const fov = 90;
    const aspect = 2.5;
    const near = 0.1;
    const far = 100000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //Se reubica la camara
    camera.position.z = 5500;
    camera.position.y = 2200;
    camera.position.x = 1250;
    camera.zoom = 5;
    //Se crea un controlador para la camara
    controls = new OrbitControls(camera, canvas);
    //Se reubica el controlador
    controls.target.set(0, 5, 0);
    //controls.minDistance = 1; // Establece la distancia mínima de la cámara a 10 unidades de distancia del centro de la escena
    //Se actualiza el controlador
    controls.update();

    /* ******************************************************************* */
    /* *************         CONFIGURACION DE LA ESCENA   **************** */
    /* ******************************************************************* */
    //Se crea una escena
    scene = new THREE.Scene();
    //Se configura el color de fondo de la escena
    scene.background = new THREE.Color('rgb(0, 0, 0)');
    //Se crea un ortoedro transparente y con bordes
    const xBig = 160 + 90 * (pasillos) + 120 * (pasillos - 1);
    const yBig = pisos * 60;
    const zBig = largoEspacios * 59 + 120;
    //Se crea una geometria para el contenedor
    const geometry = new THREE.BoxGeometry(xBig, yBig, zBig);
    //Se extraen los bordes del contenedor
    const edges = new THREE.EdgesGeometry(geometry);
    //Se crea un cubo transparente con los bordes
    const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 25 }));

    //Se reubica el cubo de acuerdo a las dimensiones del contenedor
    cube.position.set(xBig / 2 - 40, yBig / 2 - 27, zBig / 2 - 40);
    //Se agrega el cubo a la escena
    scene.add(cube);

    /* ******************************************************************* */
    /* *************         CONFIGURACION DEL PISO       **************** */
    /* ******************************************************************* */
    //Añadimos el piso
    const planeSize = xBig + 100;
    // Se crea una textura para el piso
    const loader = new THREE.TextureLoader();
    //Se carga la textura desde la ruta especificada
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    //Se repite la textura
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    //Se ajusta la textura
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    //Se crea una geometria plana para el piso
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    //Se crea un material para el piso
    const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    //Se crea el piso
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
    mesh.position.set(planeSize / 2 - 50, -28, planeSize / 2 - 50);

    /* ******************************************************************* */
    /* **********        EXTRAER DATOS DE DB PARA LAYOUT   *************** */
    /* ******************************************************************* */
    //Obtenemos los datos de la base de datos a traves del api rest con la peticion GET:http://localhost:3001/api/startup
    //Se crea un objeto XMLHttpRequest
    var xhr = new XMLHttpRequest();
    //Se crea una funcion para obtener los datos de la base de datos, su parametro es la funcion callback
    async function obtenerDatosLayout(callback) {
        //Se abre la peticion GET a la ruta http://localhost:3001/api/startup
        await xhr.open('GET', API_URL + 'startup', true);
        //Se envia la peticion
        xhr.send();
        //cuando la peticion se haya completado, se ejecuta la funcion callback
        xhr.onreadystatechange = function () {
            //Si la peticion se ha completado y la respuesta esta lista, se ejecuta la funcion callback
            // readyState 4: request finished and response is ready
            // status 200: "OK"
            if (xhr.readyState == 4 && xhr.status == 200) {
                //Se ejecuta la funcion callback con los datos de la base de datos
                let datos = JSON.parse(this.responseText);
                callback(datos);
            }
        }
    }
    async function procesarDatosLayout(datos) {
        //convertimos los datos de la base de datos en un arreglo de arreglos
        datos.map(d => {
            //Se llama makeInstance para crear los cubos en un arreglo de acuerdo a las ubicaciones
            const [x, y, z, boxWidth, boxHeight, boxDepth] = [d.X, d.Y, d.Z, d.WIDTH, d.HEIGHT, d.DEPTH];
            //Si el valor en x es menor a 230 * pasillos, se crea el cubo
            const cube = makeTransparentInstance(boxWidth, boxHeight, boxDepth, x, z, y);
            // Se agrega el cubo al arreglo cubes declarado al inicio de la extraccion de datos.
            //cubes.push(cube);

        });
    }
    // Se llama la funcion obtenerDatos para extraer los datos de la base de datos, 
    // su parametro es la funcion procesarDatos
    obtenerDatosLayout(procesarDatosLayout);


    //Se llama la funcion obtenerDatos para extraer los datos de la base de datos, su parametro es la funcion 
    //procesarDatos()
    obtenerDatosProductos(procesarDatosProductos);


    /* ******************************************************************* */
    /* *************                CUBOS           ********************** */
    /* ******************************************************************* */
    //funcion para crear Meshs transparentes
    function makeTransparentInstance(bW, bH, bD, x, y, z) {
        //Se crea una BoxGeometry
        const boxWidth = bW;
        const boxHeight = bH;
        const boxDepth = bD;
        //Se crea una geometria con los valores de la base de datos
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        //Se crea una geometria con los bordes de la geometria anterior
        const edges = new THREE.EdgesGeometry(geometry);
        // Se crea un cubo con la geometria y el material
        const cube = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xeeeeee }));
        // se agrega el cubo a la escena
        scene.add(cube);
        //se posiciona el cubo en los valores de x, y, z
        cube.position.set(x, y, z);
        return cube;
    }




    /* ******************************************************************* */
    /* *************                LUZ             ********************** */
    /* ******************************************************************* */

    //Se agregan cuatro luces desde diferentes direcciones
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 1);
    scene.add(light);

    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(1, 2, 1);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(color, intensity * 2 / 3);
    light3.position.set(1, 2, -1);
    scene.add(light3);

    const light4 = new THREE.DirectionalLight(color, intensity * 3 / 4);
    light4.position.set(-1, 2, -1);
    scene.add(light4);

    // initialize object to perform world/screen calculations
    // projector = new THREE.Projector();

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    /* ******************************************************************* */
    /* *************                RENDER            ******************* */
    /* ******************************************************************* */
    // Se crea una funcion para redimensionar el renderer
    function resizeRendererToDisplaySize(renderer) {
        //Se obtiene el tamaño del canvas
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        //Se crea una variable para saber si el renderer cambia de tamaño
        const needResize = canvas.width !== width || canvas.height !== height;
        //Si el renderer cambia de tamaño se actualiza el tamaño del renderer
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    //Se crea una funcion para renderizar la escena
    function render() {
        // Asegura que la cámara no esté por debajo de Y=0
        camera.position.y = Math.max(camera.position.y, -10);
        //Si la camara cambia de tamaño se actualiza la camara
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        //Se renderiza la escena y se actualiza la camara
        renderer.render(scene, camera);
        //Se llama a la funcion requestAnimationFrame para que se renderice la escena
        //cada vez que el navegador este listo para mostrar el siguiente frame
        requestAnimationFrame(render);
        update();
    }
    requestAnimationFrame(render);
}

/* ******************************************************************* */
/* ******  EXTRAER DATOS DE DB PARA UBICACIÓN DE PRODUCTOS      ****** */
/* ******************************************************************* */
//Obtenemos los datos de la base de datos a traves del api rest con la peticion 
// GET:http://localhost:3001/api/productslocation
//Se crea un objeto XMLHttpRequest
var xhr2 = new XMLHttpRequest();
//Se crea una funcion para obtener los datos de la base de datos, su parametro es la funcion callback
async function obtenerDatosProductos(callback) {
    //Se abre la peticion GET a la ruta http://localhost:3001/api/productslocation
    await xhr2.open('GET', API_URL + 'productslocation', true);
    //Se envia la peticion
    xhr2.send();
    //cuando la peticion se haya completado, se ejecuta la funcion callback
    xhr2.onreadystatechange = function () {
        //Si la peticion se ha completado y la respuesta esta lista, se ejecuta la funcion callback
        // readyState 4: request finished and response is ready
        // status 200: "OK"
        if (xhr2.readyState == 4 && xhr2.status == 200) {
            //Se ejecuta la funcion callback con los datos de la base de datos
            let datos = JSON.parse(this.responseText);
            callback(datos);
        }
    }
}
async function procesarDatosProductos(datos) {
    //convertimos los datos de la base de datos en un arreglo de arreglos
    datos.map(d => {
        //Se llama makeInstance para crear los cubos en un arreglo de acuerdo a las ubicaciones
        const [x, y, z, boxWidth, boxHeight, boxDepth, location_no, item_no, description, size, manufacturingDate, expiration, category]
            = [d.X, d.Y, d.Z, d.WIDTH, d.HEIGHT, d.DEPTH, d.LOCATION, d.ITEM_NO, d.ITEM_DESCRIPTION, d.SIZE, d.MANUFACTURING_DATE, d.EXPIRATION, d.CATEGORY];

        //Si el valor en x es menor a 230 * pasillos, se crea el cubo
        const color = getColorByFreshnessDate(manufacturingDate);
        const cube = makeColorInstance(boxWidth, boxHeight, boxDepth, color,
            x, z, y, location_no, item_no, description, size, manufacturingDate, expiration, category);
        // Se agrega el cubo al grupo de cubos
        productionGroup.add(cube);
    });
    checkNoItemCookie();
    //Se agrega el grupo a la escena
    scene.add(productionGroup);
}

//funcion para crear Meshs con color
function makeColorInstance(bW, bH, bD, color, x, y, z, location_no, item_no, description, size, manufacturingDate, expiration, category) {
    //Se crea una BoxGeometry
    const boxWidth = bW;
    const boxHeight = bH;
    const boxDepth = bD;
    //Se crea una geometria con los valores de la base de datos
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    //Se crea un material con el color hexadecimal
    const material = new THREE.MeshBasicMaterial({ color: color });
    material.color.setHex(color);
    // Se crea un cubo con la geometria y el material
    const cube = new THREE.Mesh(geometry, material);

    //Se calcula la frescura del producto
    var date = new Date();
    var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    var todayDate = new Date(today);
    let fixDate = manufacturingDate.split('/');
    var manufacturingFixedDate = fixDate[2] + '/' + (parseInt(fixDate[1])) + '/' + fixDate[0];
    var manufacturing = new Date(manufacturingFixedDate);
    let diff = todayDate.getTime() - manufacturing.getTime();
    var freshness = Math.ceil(diff / (1000 * 3600 * 24));

    // Se agrega el nombre del producto al cubo con la informacion de la base de datos
    cube.name = "No. Item: " + item_no
        + "\nDescripción: " + description
        + "\nCategoria: " + category
        + "\nTamaño: " + size
        + "\nFrescura: " + freshness
        + " días \nFabricación: " + manufacturingDate
        + "\nCaducidad: " + expiration
        + "\nCódigo de la ubicación: " + location_no
        + "\n Pasillo: " + parseInt(x / 138 + 1)
        + "\n Anaquel: " + parseInt(z / 58 + 1)
        + "\n Piso: " + parseInt(y / 60 + 1) + "\n";
    //se posiciona el cubo en los valores de x, y, z
    cube.position.set(x, y, z);
    return cube;
}

function getColorByFreshnessDate(manufacturingDate) {
    var color = '#';
    var date = new Date();
    var today = date.getFullYear() + '/' + (date.getMonth()) + '/' + date.getDate();
    var todayDate = new Date(today);
    let fixDate = manufacturingDate.split('/');
    var manufacturingFixedDate = fixDate[2] + '/' + (parseInt(fixDate[1])) + '/' + fixDate[0];
    var manufacturing = new Date(manufacturingFixedDate);
    let diff = todayDate.getTime() - manufacturing.getTime();
    var days = Math.ceil(diff / (1000 * 3600 * 24));

    if (days <= 7) {
        color = '0x0e8c03'; //verde
    } else if (days > 7 && days <= 30) {
        color = '0x8c7d03'; //amarillo
    } else if (days > 30 && days <= 60) {
        color = '0xfa6e02'; //naranja
    } else if (days > 60) {
        color = '0xde0404'; //rojo
    }
    return color;
}

// Revisar las cookies para ver si hay alguna que indique un noItem que resaltar en color
function checkNoItemCookie() {
    var noItem = "";
    // Obtener el valor de la cookie noItem
    noItem = getCookieValueOf('noItem');
    if (noItem != "") {
        // Si hay una cookie, resaltar el noItem en color
        highlightNoItem(noItem);
        // Eliminar la cookie
        deleteCookie('noItem');

    }
}
function getCookieValueOf(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            console.log(c.substring(name.length, c.length));
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function deleteCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function highlightNoItem(noItem) {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        //  obtener el noItem del child
        var name = child.name;
        var line = name.split("\n")[0];
        var noItemChild = line.split(" ")[2].trim();
        // Si el noItem del child es igual al noItem que se quiere resaltar, cambiar el color
        if (noItemChild == noItem) {
            child.material.color.setHex(0xde0404);
        } else {
            child.material.color.setHex(0xffffff);
        }
    }
}

/* ******************************************************************* */
/* ********       OBTENER DIMENSIONES DEL ALMACÉN            ********* */
/* ******************************************************************* */
async function getWarehouseDimensions(callback) {
    // Se obtienen las dimensiones del almacen haciendo una peticion al servidor con xmlhttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("GET", API_URL + "getdimension", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Se obtiene la respuesta del servidor
            var response = xhr.responseText;
            // Se parsea la respuesta a un objeto JSON
            var warehouseDimensions = JSON.parse(response);
            // Guardar las dimensiones en localStorage
            localStorage.setItem("warehouseDimensions", JSON.stringify(warehouseDimensions));
            // Se llama a la funcion callback
            callback(warehouseDimensions);
        }
    }

}


/* ******************************************************************* */
/* *************            MOUSE POSITION        ******************* */
/* ******************************************************************* */
function onDocumentMouseMove(event) {
    // Si mouseBlock es true, no se actualiza la posicion del mouse
    if (mouseBlocked) return;
    // Se actualiza la posicion del mouse
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

document.getElementById('c').addEventListener('dblclick', function (event) {
    if (mouseBlocked) mouseBlocked = false;
    else mouseBlocked = true;
}, false);

/* ******************************************************************* */
/* *************     UPDATE PANEL DE INFORMACIÓN   ******************* */
/* ******************************************************************* */

function update() {
    // Si mouseBlock es true, no se actualiza la posicion del mouse
    if (mouseBlocked) return;

    // Se crea un Ray con origen en la posicion del mouse
    // y direccion hacia la escena (direccion de la camara)
    var vector = new THREE.Vector3(mouse.x, mouse.y, 1);

    vector.unproject(camera);

    var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    ray.setFromCamera(mouse, camera);
    // Crear un array con todos los objetos de la escena con los que el rayo intersecta
    var intersects = ray.intersectObjects(productionGroup.children);

    // INTERSECTED = el objeto en la escena que esta mas cerca de la camara
    // y intersecta con el Ray proyectado desde la posicion del mouse	

    // Si hay una interseccion (o mas)
    if (intersects.length > 0) {
        // si el objeto mas cercano intersectado no es el objeto de interseccion actual
        if (intersects[0].object != INTERSECTED) {
            // restaura el color del objeto anteriormente intersectado (si existe)
            if (INTERSECTED)
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            // Se almacena una referencia al objeto mas cercano como el objeto de interseccion actual
            INTERSECTED = intersects[0].object;
            // Se almacena el color del objeto mas cercano (para restaurarlo despues)
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            // Se cambia el color del objeto mas cercano
            INTERSECTED.material.color.setHex(0x3b403a);

            // Se actualiza el texto del offCanvas, si el objeto intersectado tiene un campo "name"
            if (intersects[0].object.name) {
                var messageRaw = intersects[0].object.name;
                var message = messageRaw.split("\n");
                // Colocar los elementos del arreglo dentro de etiquetas <p> con color
                var messageFormatted = "";
                for (var i = 0; i < message.length; i++) {
                    // Colocar el formato dentro de una card list group de bootstrap
                    // los primeros 6 elementos dentro de un list-group-item y los siguientes
                    // dentro de otro, para que se vean separados
                    if (i == 0) {
                        messageFormatted += "<div class='card'><ul class='list-group list-group-flush'> <li class='list-group-item'>";
                    } else if (i == 7) {
                        messageFormatted += "</li> <li class='list-group-item'>";
                    }

                    // Si el elemento comienza con "Frescura" se cambia el color del texto al color del objeto INTERSECTED.currentHex
                    if (message[i].startsWith("Frescura")) {
                        let color = "rgba(" + (INTERSECTED.currentHex >> 16 & 255) + "," + (INTERSECTED.currentHex >> 8 & 255) + "," + (INTERSECTED.currentHex & 255) + ",1)";
                        messageFormatted += "<p style='color:" + color + ";'>" + message[i] + "</p>";
                    }// Si el elemento comienza con "No. Item" o "Nombre" el texto se pone en negrita
                    else if (message[i].startsWith("No. Item") || message[i].startsWith("Nombre")) {
                        messageFormatted += "<p style='font-weight:bold;'>" + message[i] + "</p>";
                    } else {
                        messageFormatted += "<p>" + message[i] + "</p>";
                    }
                }
                messageFormatted += "</li></ul></div>";
                //eliminamos el elemento HTML del offcanvasScrolling en el p con id="texto-offcanvas"
                document.getElementById("texto-offcanvas").innerHTML = null;
                //ahora agregamos el texto rawMessage al p con id="texto-offcanvas"
                document.getElementById("texto-offcanvas").innerHTML = messageFormatted;
            }
        }
    }
    else // no hay intersecciones
    {
        // Restaura el color del objeto anteriormente intersectado (si existe)
        if (INTERSECTED)
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        // Remueve la referencia al objeto de interseccion anterior
        //     al cambiar el objeto de interseccion actual a "nada"
        INTERSECTED = null;
    }
    controls.update();
}

main();



/* ******************************************************************* */
/* ***     CAMBIAR COLORES DE CUBOS EN PRODUCTION GROUP      ********* */
/* ******************************************************************* */

// Agregar un evento on click a los botones de las tabs de frescura-tab y categoria-tab
document.getElementById("frescura-tab").addEventListener("click", function () { changeActiveTab("frescura-tab") });
document.getElementById("categoria-tab").addEventListener("click", function () { changeActiveTab("categoria-tab") });

function changeActiveTab(id) {
    var frescuraTab = document.getElementById("frescura-tab");
    var categoriaTab = document.getElementById("categoria-tab");
    resetDefaultSubcategoriaSelector();
    if (id == "frescura-tab") {
        frescuraTab.classList.add("active");
        frescuraTab.classList.add("disabled");
        categoriaTab.classList.remove("active");
        categoriaTab.classList.remove("disabled");
        resetSelectors();
        tabFilterSelected(id)
    } else if (id == "categoria-tab") {
        frescuraTab.classList.remove("active");
        frescuraTab.classList.remove("disabled");
        categoriaTab.classList.add("active");
        categoriaTab.classList.add("disabled");
        resetSelectors();
        tabFilterSelected(id)
    }
}

function tabFilterSelected(selectedValue) {

    // Se muestra el toast de simbología
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    switch (selectedValue) {
        case "frescura-tab":
            changeAllColorsByFreshness();
            toast.show()
            break;
        case "categoria-tab":
            changeAllColorsByType();
            toast.show()
            break;
    }

}

// Función para cambiar el contenido del Toast de simbología en el div id = "simbology"
// recibe como parámetro el texto/html que se mostrará en el toast
function changeSimbologyToast(text) {
    document.getElementById("simbology").innerHTML = text;
}

/* ******************************************************************* */
/* *********************     POR TIPO     **************************** */
/* ******************************************************************* */

// Funcion para extraer el tipo de producto
// Recibe un cubo como paramtero
// Retorna un String con el tipo de producto
function getCategoryOf(cube) {
    // Obtener el nombre del objeto
    var name = cube.name;
    // Obtener el tipo de producto
    var line = name.split("\n")[2];
    // se hace un substring para obtener el tipo de producto despues del primer espacio
    var type = line.substring(line.indexOf(" ") + 1);
    return type;
}

const colorRefresco = "0x644685";
const colorAgua = "0x3498db";
const colorAguaPurificada = "0x2ecc71";
const colorBebidaFruta = "0xf1c40f";
const colorEnergetica = "0xe74c3c";
const colorTe = "0x9b59b6";
const colorVitaminadas = "0x1abc9c";
const colorCafe = "0x95a5a6";
const colorLeche = "0x34495e";
const colorYogurt = "0x27ae60";
const colorPapas = "0xf39c12";
const colorNachos = "0xd35400";
const colorPalo = "0xc0392b";
const colorCacahuates = "0xbdc3c7";
const colorChicharrones = "0x7f8c8d";
const colorSalsas = "0x8e44ad";
const colorDulces = "0x2c3e50";

//Funcion para obtener cual será el color de un cubo de acuerdo a su tipo
//Recibe un string con el tipo de producto como parámetro
//Retorna un String con el color correspondiente en formato hexadecimal
function getHexColorByType(type) {
    let color = "";
    if (type == "1" || type == "Refresco/Gaseosa") {
        color += colorRefresco;
    } else if (type == "2" || type == "Aguas Purificadas/Sabores") {
        color += colorAguaPurificada;
    } else if (type == "3" || type == "Bebidas fruta/soya/soja") {
        color += colorBebidaFruta;
    } else if (type == "4" || type == "Energéticas/Deportivas") {
        color += colorEnergetica;
    } else if (type == "5" || type == "Tés") {
        color += colorTe;
    } else if (type == "6" || type == "Vitaminadas") {
        color += colorVitaminadas;
    } else if (type == "7" || type == "Cafés Soluble") {
        color += colorCafe;
    } else if (type == "8" || type == "Leche Entera") {
        color += colorLeche;
    } else if (type == "9" || type == "Yogurt") {
        color += colorYogurt;
    } else if (type == "10" || type == "Papas/Harina Papa") {
        color += colorPapas;
    } else if (type == "11" || type == "Nachos/Tortillas") {
        color += colorNachos;
    } else if (type == "12" || type == "Palomitas") {
        color += colorPalo;
    } else if (type == "13" || type == "Cacahuates/Semillas") {
        color += colorCacahuates;
    } else if (type == "14" || type == "Chicharrones") {
        color += colorChicharrones;
    } else if (type == "15" || type == "Salsas/Dips") {
        color += colorSalsas;
    } else if (type == "16" || type == "Dulces") {
        color += colorDulces;
    } else {
        color += "0x000000";
    }
    return color;
}

// Función para cambiar el color de los cubos del productionGroup
// Los colores se asignan por el tipo de producto, esta información se encuentra en el nombre del objeto
function changeAllColorsByType() {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        //  obtener el tipo de producto despues del primer espacio
        var type = getCategoryOf(child);
        // Cambiar el color del material del objeto hijo
        var color = getHexColorByType(type);
        child.material.color.setHex(color);
    }


    // Hacemos un String con la nueva simbología basada el tipo de producto

    /*
        const colorRefresco = "0x644685";
const colorAgua = "0x3498db";
const colorAguaPurificada = "0x2ecc71";
const colorBebidaFruta = "0xf1c40f";
const colorEnergetica = "0xe74c3c";
const colorTe = "0x9b59b6";
const colorVitaminadas = "0x1abc9c";
const colorCafe = "0x95a5a6";
const colorLeche = "0x34495e";
const colorYogurt = "0x27ae60";
const colorPapas = "0xf39c12";
const colorNachos = "0xd35400";
const colorPalo = "0xc0392b";
const colorCacahuates = "0xbdc3c7";
const colorChicharrones = "0x7f8c8d";
const colorSalsas = "0x8e44ad";
const colorDulces = "0x2c3e50";
    */

    let newLegend = '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #644685;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Refresco/Gaseosa</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #3498db;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Aguas Purificadas/Sabores</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #2ecc71;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Bebidas fruta/soya/soja</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #f1c40f;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Energéticas/Deportivas</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #9b59b6;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Tés</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #1abc9c;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Vitaminadas</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #95a5a6;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Café</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #34495e;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Leche</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color:#27ae60;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Yogurt</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology"  style="background-color: #f39c12;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Papas fritas</p>'
        + '</div>'
        + '</div>'
        + '</div>'

    // Reemplazamos la simbología anterior por la nueva
    changeSimbologyToast(newLegend);
}



// Función para resaltar SOLO el color de los cubos de un tipo del productionGroup
// Los colores se asignan por el tipo de producto que se encuentra en el nombre del objeto
function highlightColorByType(elemento) {
    let type = elemento.value;
    if (type == "TODOS") {
        changeAllColorsByType();
        return;
    }
    // Obtener el color del tipo de elemento actual
    let color = getHexColorByType(type);
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener el tipo de producto despues del primer espacio
        var productType = getCategoryOf(child);
        // Si el tipo del producto es igual al tipo que se está buscando
        if (productType == type) {
            // Cambiar el color del material del objeto hijo
            child.material.color.setHex(color);
        } else {
            // Cambiar el color del material del objeto hijo a otro color
            child.material.color.setHex(0xd6d6d6);
        }
    }
}

/* ******************************************************************* */
/* ********************     POR  DE FRESCURA     ********************* */
/* ******************************************************************* */

// Función para cambiar el color de los cubos del productionGroup
// Los colores se asignan por la frescura del producto, esta información se calcula en base
// a la fecha de fabricación que se encuentra en el nombre del objeto
function changeAllColorsByFreshness() {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la frescura del producto
        let days = getFreshnessDaysOf(child);
        let color = getColorByFreshnesDays(days);
        child.material.color.setHex(color);
    }

    // Hacemos un String con la nueva simbología basada en la frescura del producto
    var newLegend = '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #adff99;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Frescura menor a 7 d&iacute;as.</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #e8f558;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Frescura entre 8 a 30 d&iacute;as.</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #fa6e02;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Frescura entre 31 a 60 d&iacute;as.</p>'
        + '</div>'
        + '</div>'
        + '<div class="row">'
        + '<div class="col-2">'
        + '<div class="color-symbology" style="background-color: #de0404;"></div>'
        + '</div>'
        + '<div class="col-10">'
        + '<p class="hidden">Frescura mayor a 61 d&iacute;as.</p>'
        + '</div>'
        + '</div>';

    // Reemplazamos la simbología anterior por la nueva
    changeSimbologyToast(newLegend);
}


/* ******************************************************************* */
/* **********    FILTER SELECTOR      *************** */
/* ******************************************************************* */
// funcion para cambiar el color de los cubos del productionGroup a blanco
function changeAllColorsToWhite() {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Cambiar el color del material del objeto hijo
        child.material.color.setHex(0xffffff);
    }
}

const colorHighlight = '0x53a842'; //verde

// Función para cambiar el color de los cubos del productionGroup de acuerdo al filtro de caducidad
function highlightByExpiration(selectedValue) {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener los días falta para que el producto caduque
        var days = getExpirationDays(child);
        // Cambiar el color del material del objeto hijo
        var color = colorHighlight; //verde
        if (selectedValue == 1 && days <= 0) {
            child.material.color.setHex(color);
        } else if (selectedValue == 2 && days > 0 && days <= 7) {
            child.material.color.setHex(color);
        } else if (selectedValue == 3 && days > 7 && days <= 30) {
            child.material.color.setHex(color);
        } else if (selectedValue == 4 && days > 30 && days <= 60) {
            child.material.color.setHex(color);
        } else if (selectedValue == 5 && days > 60) {
            child.material.color.setHex(color);
        }
    }
}

// Colores de los cubos de acuerdo al filtro de frescura
const colorsByFreshness = {
    1: '0x0e8c03', //verde
    2: '0x8c7d03', //amarillo
    3: '0xfa6e02', //naranja
    4: '0xde0404', //rojo
}
// Función para obtener el color de los cubos del productionGroup de acuerdo al filtro de frescura
function getColorByFreshnesDays(value) {
    var color = '0xffffff';
    if (value <= 7) {
        color = colorsByFreshness[1] //verde
    } else if (value > 7 && value <= 30) {
        color = colorsByFreshness[2] //amarillo
    } else if (value > 30 && value <= 60) {
        color = colorsByFreshness[3] //naranja
    } else if (value > 60) {
        color = colorsByFreshness[4] //rojo
    }
    return color;

}

// Función para cambiar el color de los cubos del productionGroup de acuerdo al filtro de frescura
function highlightByFreshness(selectedValue) {
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la frescura del producto
        var freshness = getFreshnessDaysOf(child);
        // Cambiar el color del material del objeto hijo
        var color = getColorByFreshnesDays(freshness);
        if (selectedValue == 1 && freshness <= 7) {
            child.material.color.setHex(color);
        } else if (selectedValue == 2 && freshness > 7 && freshness <= 30) {
            child.material.color.setHex(color);
        } else if (selectedValue == 3 && freshness > 30 && freshness <= 60) {
            child.material.color.setHex(color);
        } else if (selectedValue == 4 && freshness > 60) {
            child.material.color.setHex(color);
        }
    }
}

function getFreshnessLimits(selectedValue) {
    let minFreshDays = -Infinity;
    let maxFreshDays = Infinity;
    if (selectedValue == 1) {
        minFreshDays = 0;
        maxFreshDays = 7;
    } else if (selectedValue == 2) {
        minFreshDays = 8;
        maxFreshDays = 30;
    } else if (selectedValue == 3) {
        minFreshDays = 31;
        maxFreshDays = 60;
    } else if (selectedValue == 4) {
        minFreshDays = 61;
        maxFreshDays = Infinity;
    }
    return [minFreshDays, maxFreshDays];
}

function getExpirationLimits(selectedValue) {
    let minExpDays = 0;
    let maxExpDays = 0;
    if (selectedValue == 1) {
        minExpDays = 0;
        maxExpDays = 0;
    } else if (selectedValue == 2) {
        minExpDays = 1;
        maxExpDays = 7;
    } else if (selectedValue == 3) {
        minExpDays = 8;
        maxExpDays = 30;
    } else if (selectedValue == 4) {
        minExpDays = 31;
        maxExpDays = 60;
    } else if (selectedValue == 5) {
        minExpDays = 61;
        maxExpDays = Infinity;
    }
    return [minExpDays, maxExpDays];
}

// Función para cambiar el color de los cubos del productionGroup de acuerdo al filtro de categoría
function highlightByCategory(categoryName) {
    categoryName = getCategoryById(categoryName);
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la categoría del producto
        var category = getCategoryOf(child);
        // Cambiar el color del material del objeto hijo
        var color = colorHighlight; //verde
        if (categoryName == category) {
            child.material.color.setHex(color);
        }
    }
}

// Función para resaltar los cubos de cierta categoría y subcategoría
function highlightByCategoryAndSubcategory(subcategoryValue, categorySelectedValue) {
    var categoryName = getCategoryById(categorySelectedValue); //obtener el nombre de la categoría
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la categoría del producto
        var category = getCategoryOf(child);
        // Obtener la subcategoría del producto (Size)
        var line = child.name.split("\n")[3];
        var subcategory = line.substring(line.indexOf(" ") + 1);
        subcategory.trim();
        // Cambiar el color del material del objeto hijo
        var color = colorHighlight;
        if (category == categoryName && subcategory === subcategoryValue) {
            child.material.color.setHex(color);
        }
    }
}

function highlightByFreshnessAndCategory(freshnessValue, categoryValue) {
    // determinar los días de frescura
    let [minFreshDays, maxFreshDays] = getFreshnessLimits(freshnessValue);
    // obtener la categoría por su id
    var categoryValue = getCategoryById(categoryValue);
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la frescura del producto
        var freshness = getFreshnessDaysOf(child);
        // Obtener la categoría del producto
        var category = getCategoryOf(child);
        // Cambiar el color del material del objeto hijo
        var color = colorHighlight; //verde
        if (freshness > minFreshDays && freshness <= maxFreshDays && category == categoryValue) {
            child.material.color.setHex(color);
        }
    }
}

function highlightByFreshnessAndCategoryAndSubcategory(subcategoryValue, freshnessValue, categoryValue) {
    // determinar los días de frescura
    let [minFreshDays, maxFreshDays] = getFreshnessLimits(freshnessValue);
    // obtener la categoría por su id
    var categoryName = getCategoryById(categoryValue);
    // Recorrer los hijos del productionGroup
    for (var i = 0; i < productionGroup.children.length; i++) {
        // Obtener el objeto hijo
        var child = productionGroup.children[i];
        // Obtener la frescura del producto
        var freshness = getFreshnessDaysOf(child);
        // Obtener la categoría del producto
        var category = getCategoryOf(child);
        // Obtener la subcategoría del producto (Size)
        var line = child.name.split("\n")[3];
        var subcategory = line.substring(line.indexOf(" ") + 1);
        subcategory.trim();
        // Cambiar el color del material del objeto hijo
        var color = '0x53a842'; //verde
        if (category == categoryName && freshness > minFreshDays && freshness <= maxFreshDays && subcategory === subcategoryValue) {
            child.material.color.setHex(color);
        }
    }

}


// Agregar un evento change al select del filtro de caducidad de la barra de navegación
document.getElementById("subcategoriaSelector").addEventListener("change", function () {
    // Obtener el valor seleccionado
    var subcategoriaSelectedValue = this.value;
    // Obtener el valor del select frescuraSelector
    var freshnessSelectorVal = document.getElementById("frescuraSelector").value;
    // Obtener el valor del select categoriaSelector
    var freshnessRange = getFreshnessLimits(freshnessSelectorVal);
    var categorySelectorVal = document.getElementById("categoriaSelector").value;
    var categoryName = getCategoryById(categorySelectorVal);
    // Obtener el toast de simbología
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)

    if (subcategoriaSelectedValue == 0) {
        if (freshnessSelectorVal == 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByCategory(categorySelectorVal);
        }
        else if (freshnessSelectorVal != 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByFreshnessAndCategory(freshnessSelectorVal, categorySelectorVal);
        }
    } else {
        // Se oculta el toast de simbología
        toast.hide();
        if (freshnessSelectorVal == 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByCategoryAndSubcategory(subcategoriaSelectedValue, categorySelectorVal);
        } else if (freshnessSelectorVal != 0 && categorySelectorVal == 0) {
            changeAllColorsToWhite();
            //Cambiar el subcategoriaSelector a la opcion 0
            document.getElementById("subcategoriaSelector").value = 0;
            highlightByFreshness(freshnessSelectorVal);
        } else if (freshnessSelectorVal != 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByFreshnessAndCategoryAndSubcategory(subcategoriaSelectedValue, freshnessSelectorVal, categorySelectorVal);
        }

    }
});

// Agregar un evento change al select del filtro de FRESCURA de la barra de navegación
document.getElementById("frescuraSelector").addEventListener("change", function () {
    // Obtener el valor seleccionado
    var freshnesSelectedValue = this.value;
    // Obtener el valor del select subcategoriaSelector
    var subcategoriaSelectorVal = document.getElementById("subcategoriaSelector").value;
    // Obtener el valor del select categoriaSelector
    var categorySelectorVal = document.getElementById("categoriaSelector").value;
    // Obtener el toast de simbología
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)

    // Si la opción seleccionada es por frescura la opcion debe ser mayor a 0
    if (freshnesSelectedValue == 0) {
        if (subcategoriaSelectorVal == 0 && categorySelectorVal == 0) {
            changeAllColorsByFreshness();
            toast.show();
        } else if (subcategoriaSelectorVal == 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByCategory(categorySelectorVal);
        } else if (subcategoriaSelectorVal != 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByCategoryAndSubcategory(subcategoriaSelectorVal, categorySelectorVal);
        }
    } else {
        if (subcategoriaSelectorVal == 0 && categorySelectorVal == 0) {
            changeAllColorsToWhite();
            highlightByFreshness(freshnesSelectedValue);
        } else if (subcategoriaSelectorVal == 0 && categorySelectorVal != 0) {
            changeAllColorsToWhite();
            highlightByFreshnessAndCategory(freshnesSelectedValue, categorySelectorVal);
        } else if (subcategoriaSelectorVal != 0 && categorySelectorVal == 0) {
            changeAllColorsToWhite();
            // Subcategoría selector a la opcion 0
            document.getElementById("subcategoriaSelector").value = 0;
            highlightByFreshness(freshnesSelectedValue);
        } else {
            if (subcategoriaSelectorVal != 0 && categorySelectorVal != 0) {
                changeAllColorsToWhite();
                highlightByFreshnessAndCategoryAndSubcategory(subcategoriaSelectorVal, freshnesSelectedValue, categorySelectorVal);
            }
        }
        // Se oculta el toast de simbología
        toast.hide();

    }
});

// Agregar un evento change al select del filtro de CATEGORIA de la barra de navegación
document.getElementById("categoriaSelector").addEventListener("change", function () {

    // Obtener el valor seleccionado
    var catSelectedValue = this.value;
    // Obtener el valor del select subcategoriaSelector
    var subcategorySelectVal = document.getElementById("subcategoriaSelector").value;
    // Obtener el valor del select frescuraSelector
    var freshnessSelectorVal = document.getElementById("frescuraSelector").value;
    // Obtener el toast de simbología
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)

    // Remover todas las opciones del select de subcategoriaSelector
    resetDefaultSubcategoriaSelector();

    // La opción seleccionada debe ser mayor a 0
    if (catSelectedValue == 0) {

        if (freshnessSelectorVal == 0 && subcategorySelectVal == 0) {
            changeAllColorsByFreshness();
            toast.show();
        } else if (freshnessSelectorVal == 0 && subcategorySelectVal != 0) {
            changeAllColorsByFreshness();
        } else if (freshnessSelectorVal != 0 && subcategorySelectVal == 0) {
            changeAllColorsToWhite();
            highlightByFreshness(freshnessSelectorVal);
        } else if (freshnessSelectorVal != 0 && subcategorySelectVal != 0) {
            changeAllColorsToWhite();
            highlightByFreshness(freshnessSelectorVal);
        }

    } else {
        // Se oculta el toast de simbología
        toast.hide();
        if (freshnessSelectorVal == 0 && subcategorySelectVal == 0) {
            updateSubcategoriaSelector(appendSubcategoryOptions, catSelectedValue);
        } else if (freshnessSelectorVal == 0 && subcategorySelectVal != 0) {
            resetDefaultSubcategoriaSelector();
            updateSubcategoriaSelector(appendSubcategoryOptions, catSelectedValue);
            changeAllColorsToWhite();
            highlightByCategory(catSelectedValue);
        } else if (freshnessSelectorVal != 0 && subcategorySelectVal == 0) {
            updateSubcategoriaSelector(appendSubcategoryOptions, catSelectedValue);
            changeAllColorsToWhite();
            highlightByFreshnessAndCategory(freshnessSelectorVal, catSelectedValue);
        } else if (freshnessSelectorVal != 0 && subcategorySelectVal != 0) {
            resetDefaultSubcategoriaSelector();
            updateSubcategoriaSelector(appendSubcategoryOptions, catSelectedValue);
            changeAllColorsToWhite();
            highlightByFreshnessAndCategory(freshnessSelectorVal, catSelectedValue);
        }
    }
});

function updateSubcategoriaSelector(callback, catSelectedValue) {
    // Se consultan los SIZE de los productos de la categoria seleccionada
    var categoryName = getCategoryById(catSelectedValue);
    // Se obtienen los SIZE de la categoria en la base de datos con xmlhttprequest
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", API_URL + "/getsize", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({
        CATEGORY: categoryName
    }));
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var size = [];
            size = JSON.parse(this.responseText);
            callback(size);
        }
    }
    changeAllColorsToWhite();
    highlightByCategory(catSelectedValue);
}

// Función para eliminar los elementos de un select subcategoriaSelector y agregar la opción "Seleccionar"
function resetDefaultSubcategoriaSelector() {
    // Remover todas las opciones del select de subcategoriaSelector
    document.getElementById("subcategoriaSelector").value = 0;
    document.getElementById("subcategoriaSelector").options.length = 1;
}


// Funcion para recuperar los SIZE de los productos de una categoria
// Recibe un numero la categoria
function getCategoryById(category) {
    // Se determina la categoria a partir del numero
    let nameCategory = "";
    switch (category) {
        case "1":
            nameCategory = "Refresco/Gaseosa";
            break;
        case "2":
            nameCategory = "Aguas Purificadas/Sabores";
            break;
        case "3":
            nameCategory = "Bebidas fruta/soya/soja";
            break;
        case "4":
            nameCategory = "Energéticas/Deportivas";
            break;
        case "5":
            nameCategory = "Tés";
            break;
        case "6":
            nameCategory = "Vitaminadas";
            break;
        case "7":
            nameCategory = "Cafés Soluble";
            break;
        case "8":
            nameCategory = "Leche Entera";
            break;
        case "9":
            nameCategory = "Yogurt";
            break;
        case "10":
            nameCategory = "Papas/Harina Papa";
            break;
        case "11":
            nameCategory = "Nachos/Tortillas";
            break;
        case "12":
            nameCategory = "Palomitas";
            break;
        case "13":
            nameCategory = "Cacahuates/Semillas";
            break;
        case "14":
            nameCategory = "Chicharrones";
            break;
        case "15":
            nameCategory = "Salsas/Dips";
            break;
        case "16":
            nameCategory = "Dulces";
            break;
    }
    return nameCategory;

}
function appendSubcategoryOptions(sizes) {
    var select = document.getElementById("subcategoriaSelector");

    // Regresar el select a su valor por defecto
    select.value = 0;

    // por cada size se añade un option al select de subcategoriaSelector
    for (var i = 0; i < sizes.length; i++) {
        var option = document.createElement("option");
        option.text = sizes[i].SIZE;
        option.value = sizes[i].SIZE;
        select.appendChild(option);
    }
}
// Funcion para reiniciar los selectores de la barra de navegación a su valor por defecto
function resetSelectors() {
    // Obtener el select de caducidad
    var expirationSelector = document.getElementById("subcategoriaSelector");
    // Obtener el select de frescura
    var freshnessSelector = document.getElementById("frescuraSelector");
    // Obtener el select de categoria
    var categorySelector = document.getElementById("categoriaSelector");
    // Reiniciar los selectores
    expirationSelector.value = 0;
    freshnessSelector.value = 0;
    categorySelector.value = 0;
}


// Funcion para extraer la frescura de un producto
// Recibe un cubo como paramtero
// Retorna un int con la frescura del producto
function getFreshnessDaysOf(cubo) {
    // Obtener el nombre del objeto
    var name = cubo.name;
    // Obtener la fecha de fabricación
    var line = name.split("\n")[5];
    var manufacturingDate = line.split(" ")[1].trim();
    // Calcular la frescura del producto
    var date = new Date();
    var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    var todayDate = new Date(today);
    let fixDate = manufacturingDate.split('/');
    var manufacturingFixedDate = fixDate[2] + '/' + (parseInt(fixDate[1])) + '/' + fixDate[0];
    var manufacturing = new Date(manufacturingFixedDate);
    let diff = todayDate.getTime() - manufacturing.getTime();
    var days = Math.ceil(diff / (1000 * 3600 * 24));

    return days;
}

//Funcion para extraer la los días faltantes para la caducidad de un producto
// Recibe un cubo como paramtero
// Retorna un int con los días faltantes para la caducidad del producto
function getExpirationDays(cubo) {
    // Obtener el nombre del objeto
    var name = cubo.name;
    // Obtener la fecha de caducidad
    var line = name.split("\n")[5];
    var expirationDate = line.split(" ")[1].trim();
    // Calcular los días faltantes para la caducidad del producto
    var date = new Date();
    var today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    var todayDate = new Date(today);
    let fixDate = expirationDate.split('/');
    var expirationFixedDate = fixDate[2] + '/' + fixDate[1] + '/' + fixDate[0];
    var expiration = new Date(expirationFixedDate);
    let diff = expiration.getTime() - todayDate.getTime();
    var days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
}