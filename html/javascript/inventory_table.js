/* ******************************************************************* */
// DESCRIPCION:         Este archivo contiene el codigo para la tabla de
//                      inventario
//                      
//                      
// AUTOR:               Denis David Euan Mendoza
//
// FECHA DE CREACIÓN:   2023-03-01
// FECHA DE MODIFICACIÓN: 2023-03-01
/* ******************************************************************* */

//Se crea una constante para la API REST
const API_URL = 'http://localhost:3001/api/';

// Funcion para obtener la informacion de la tabla de invetory_layout
function getInventoryLayout(callback) {
    // Se obtiene la información de las ubicaciones de los productos con una peticion GET al API con httprequest en la ruta productslocation
    // y se almacena en el arreglo variable inventory_layout
    var inventory_layout = [];
    var xhr = new XMLHttpRequest();
    xhr.open('GET', API_URL + 'productslocation', true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            inventory_layout = JSON.parse(this.responseText);
            callback(inventory_layout);
        }
    }
}
// Funcion para callback de getInventoryLayout que crea los tr del tbody de la tabla con id inventory_table
// Se muestran 10 productos en la tabla a la vez
function createInventoryTable(inventory_layout) {
    var table = document.getElementById('inventory_table');
    $(document).ready(function () {
        $('#inventory_table_registry').DataTable({
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por página",
                "zeroRecords": "No se encontraron registros",
                "info": "Mostrando página _PAGE_ de _PAGES_",
                "infoEmpty": "No hay registros disponibles",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "search": "Buscar:",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                },
            }
        });
    });
    for (var i = 0; i < inventory_layout.length; i++) {
    //for (var i = 0; i < 100; i++) {
        var tr = document.createElement('tr');
        tr.setAttribute('id', 'tr_' + inventory_layout[i].ITEM_NO);
        var td1 = document.createElement('td');
        td1.setAttribute('id', 'td1_' + inventory_layout[i].ITEM_NO);
        td1.innerHTML = inventory_layout[i].ITEM_NO;
        var td2 = document.createElement('td');
        td2.setAttribute('id', 'td2_' + inventory_layout[i].ITEM_NO);
        td2.innerHTML = inventory_layout[i].LOCATION;
        var td3 = document.createElement('td');
        td3.setAttribute('id', 'td3_' + inventory_layout[i].ITEM_NO);
        td3.innerHTML = inventory_layout[i].ITEM_DESCRIPTION;
        var td4 = document.createElement('td');
        td4.setAttribute('id', 'td4_' + inventory_layout[i].ITEM_NO);
        td4.innerHTML = inventory_layout[i].X;
        var td5 = document.createElement('td');
        td5.setAttribute('id', 'td5_' + inventory_layout[i].ITEM_NO);
        td5.innerHTML = inventory_layout[i].Y;
        var td6 = document.createElement('td');
        td6.setAttribute('id', 'td6_' + inventory_layout[i].ITEM_NO);
        td6.innerHTML = inventory_layout[i].Z;
        var td7 = document.createElement('td');
        td7.setAttribute('id', 'td7_' + inventory_layout[i].ITEM_NO);
        // Botones para editar y eliminar el producto de la ubicacion
        // Boton para editar
        var edit_button = document.createElement('button');
        edit_button.setAttribute('id', 'edit_button_' + inventory_layout[i].ITEM_NO);
        edit_button.setAttribute('class', 'btn btn-primary m-1');
        edit_button.setAttribute('onclick', 'editProductLocation(' + inventory_layout[i].ITEM_NO + ')');
        edit_button.innerHTML = 'Editar';
        // Boton para eliminar
        var delete_button = document.createElement('button');
        delete_button.setAttribute('id', 'delete_button_' + inventory_layout[i].ITEM_NO);
        delete_button.setAttribute('class', 'btn btn-danger');
        delete_button.setAttribute('onclick', 'deleteProductLocation(' + inventory_layout[i].ITEM_NO + ')');
        delete_button.innerHTML = 'Eliminar';
        //<button type="button" class="btn btn-danger">Ver en 3D</button>
        // Boton para ver en la vista 3D
        var view3d_button = document.createElement('button');
        view3d_button.setAttribute('id', 'view3d_button_' + inventory_layout[i].ITEM_NO);
        view3d_button.setAttribute('class', 'btn btn-success m-1');
        view3d_button.setAttribute('onclick', 'view3dProductLocation(' + inventory_layout[i].ITEM_NO + ')');
        view3d_button.innerHTML = 'Ver';

        // Boton para guardar la edicion del producto de la ubicacion
        // Ocultos por defecto
        var save_button = document.createElement('button');
        save_button.setAttribute('id', 'save_button_' + inventory_layout[i].ITEM_NO);
        save_button.setAttribute('class', 'btn btn-primary m-1');
        save_button.setAttribute('onclick', 'saveProductLocation(' + inventory_layout[i].ITEM_NO + ')');
        save_button.style.display = 'none';
        save_button.innerHTML = 'Guardar';
        // Boton para cancelar la edicion del producto de la ubicacion
        var cancel_button = document.createElement('button');
        cancel_button.setAttribute('id', 'cancel_button_' + inventory_layout[i].ITEM_NO);
        cancel_button.setAttribute('class', 'btn btn-outline-danger');
        cancel_button.setAttribute('onclick', 'cancelEditProductLocation(' + inventory_layout[i].ITEM_NO + ')');
        cancel_button.style.display = 'none';
        cancel_button.innerHTML = 'Cancelar';


        // Se añaden los botones al td7
        td7.appendChild(edit_button);
        td7.appendChild(delete_button);
        td7.appendChild(view3d_button);
        td7.appendChild(save_button);
        td7.appendChild(cancel_button);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);;
        table.appendChild(tr);
    }  
}
getInventoryLayout(createInventoryTable);




