//variables y Selectores
const formulario = document.querySelector("#agregar-gasto"); //1
const gastoListado = document.querySelector("#gastos ul");  //2

//Eventos
eventListeners();
function eventListeners () {  //3
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto); //7
} 



//Clases

class Presupuesto { //5
 constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
 }

 nuevoGasto (gasto) { //10
    this.gastos = [...this.gastos, gasto]
    this.calcularRestante();
 }
 calcularRestante() { //15
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante =this.presupuesto - gastado;
    
 }
 eliminarGasto(id) {  //17.3
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
 }
}

class UI {
    insertarPresupuesto (cantidad) {  //6

        //Extrae los valores 6.2
        const {presupuesto, restante} = cantidad;

        //Agrega al HTML 6.3
        document.querySelector("#total").innerHTML = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta (mensaje, tipo) { //8
        //crea el div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }  
        //mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML
        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        //quita la alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos (gastos) { //13.1
        //elimina el html previo 14.1
        this.limpiarHtml();

        //iterar sobre los gastos
        gastos.forEach(gasto => {
           const {cantidad, nombreGasto, id} = gasto; 

        //Crear un li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id; //dataset inserta nuevo atributo(data-id)
            

        //Agregar el html del gasto
            nuevoGasto.innerHTML = ` ${nombreGasto} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

        //Boton para borrar el gasto
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times";
            btnBorrar.onclick = () => {  //17
                eliminarGasto(id);
            }  
            nuevoGasto.appendChild(btnBorrar);

        //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);


        })
    }

    limpiarHtml() {  //14
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante (restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {  //16.1
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector(".restante");
        
        //comprueba el 25%
        if((presupuesto / 4) > restante) {
           restanteDiv.classList.remove("alert-success", "alert-warning");
           restanteDiv.classList.add("alert-danger"); 
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning")
        }else {
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success"); 
        }
        
        //si el restante es menor o igual a cero
        if(restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");

            formulario.querySelector("button[type='submit']").disabled = true;
        } 
    }

}


// Instanciar
let presupuesto; //5.1 variable global
const ui = new UI();


//Funciones

function preguntarPresupuesto () {  //4 
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?")
    // console.log(presupuestoUsuario);
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();
    }
// Presupuesto valido  5.2
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);  //6.1

}

function agregarGasto (e) {  //7.1
    e.preventDefault();
//Leer los datos del formulario
    const nombreGasto = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);

    //Validaciones
    if(nombreGasto === "" || cantidad === 0) {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error"); //8.1
        return;
    } 
    else if(cantidad <=0 || isNaN(cantidad)) {
        ui.imprimirAlerta("Cantidad no valida", "error");
        return;
    }
//Genear un objeto con los datos de gasto y cantidad //9
const gasto = {nombreGasto, cantidad, id: Date.now()}
/*tambien se puede usar este:

const gasto = {
nombre:nombreGasto,
cantidad:cantidad
} 
*/

//Añade un nuevo gasto 10.1
presupuesto.nuevoGasto(gasto);

//Mensaje de agregado correcto 11
ui.imprimirAlerta("Gasto agregado correctamente");

//Imprimir los gastos 13
const {gastos, restante} = presupuesto;  //destructuring
ui.mostrarGastos(gastos);

ui.actualizarRestante(restante); //15.1

ui.comprobarPresupuesto(presupuesto)  //16

//Reinicia el formulario 12
formulario.reset();


}

function eliminarGasto (id) {  //17.1
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gastos del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante); 

    ui.comprobarPresupuesto(presupuesto)

}
