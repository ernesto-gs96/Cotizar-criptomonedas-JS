const criptomonedasSelect =  document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: ""
};

// Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener("DOMContentLoaded",() => {
    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);

    criptomonedasSelect.addEventListener("change", leerValor);
    monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    // fetch(url)
    //     .then(resultado => resultado.json())
    //     .then(respuesta => obtenerCriptomonedas(respuesta.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas))

    try {
        const resultado = await fetch(url);
        const respuesta = await resultado.json();
        const criptomonedas = await respuesta.Data;
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;
        const option = document.createElement("option");
        
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
    // Como tienen el mismo nombre en el objeto y en el HTML se mapean
}

function submitFormulario(e){
    e.preventDefault();

    // Validar
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    // Consultar la API
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const existeError = document.querySelector(".error");

    if(!existeError){
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // fetch(url)
    //     .then(resultado => resultado.json())
    //     .then(respuesta => {
    //         console.log(respuesta);
    //         mostrarCotizacionHTML(respuesta.DISPLAY[criptomoneda][moneda]);
        // })

    try {
        const resultado = await fetch(url);
        const respuesta = await resultado.json();
        mostrarCotizacionHTML(respuesta.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function mostrarCotizacionHTML(cotizacion){

    limpiarResultado();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `El precio mas alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `El precio mas bajo del día: <span>${LOWDAY}</span>`;

    const variacion = document.createElement("p");
    variacion.innerHTML = `Variación en las últimas 24HRS: <span>${CHANGEPCT24HOUR} %</span>`;

    const actualizacion = document.createElement("p");
    actualizacion.innerHTML = `Ultima Actualización: <span>${LASTUPDATE}</span>`;
    
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(actualizacion);
}

function limpiarResultado(){
    while(resultado.firstChild)
        resultado.removeChild(resultado.firstChild);
}

function mostrarSpinner(){
    limpiarResultado();
    const spinner = document.createElement("div");
    spinner.classList.add("sk-cube-grid");
    spinner.innerHTML = `
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
    `;
    resultado.appendChild(spinner);
}