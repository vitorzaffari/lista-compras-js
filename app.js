const alerta = document.querySelector('.alerta');
const form = document.querySelector('.form-container');
const compras = document.getElementById("compras");
const submitBtn = document.querySelector('.btn-submit');
const comprasContainer = document.querySelector('.compras-container');
const listaCompras = document.querySelector('.lista-compras');
const limpar = document.querySelector('.limpar-itens');


let editElement;
let editFlag = false;
let editID = "";


form.addEventListener('submit', addItem);

limpar.addEventListener('click', limparItem)
//load

window.addEventListener('DOMContentLoaded', setupItens);

//funções
function addItem(e) {
    e.preventDefault();
    const value = compras.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        criarItemLista(id, value);

        displayAlerta('Item adicionado a lista', 'sucesso');
        comprasContainer.classList.add('show-container');
        //local storage
        addToLocalStorage(id, value);
        //default
        setBackToDefault();



    }
    else if (value && editFlag) {

        editElement.innerHTML = value
        displayAlerta('Valor editado', 'sucesso');
        //editar local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else {
        displayAlerta("Valor inexistente", "perigo")
    }
}

//função display alerta
function displayAlerta(texto, acao) {
    alerta.textContent = texto
    alerta.classList.add(`alerta-${acao}`);

    //remover alerta
    setTimeout(function () {
        alerta.textContent = "";
        alerta.classList.remove(`alerta-${acao}`);
    }, 1500);
}

//limpar item
function limparItem() {
    const itens = document.querySelectorAll('.compras-item');

    if (itens.length > 0) {
        itens.forEach(function (item) {
            listaCompras.removeChild(item);
        })
    }
    comprasContainer.classList.remove('show-container');
    displayAlerta('Lista vazia', 'sucesso');
    setBackToDefault();
    localStorage.removeItem('listaCompras');
}


//default
function setBackToDefault() {
    compras.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Enviar";
}

//editar
function editarItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;;
    compras.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'Editar';
}


//deletar
function deletarItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    listaCompras.removeChild(element);
    if (listaCompras.children.length === 0) {
        comprasContainer.classList.remove('show-container');
    }
    displayAlerta('Item removido', 'perigo');
    setBackToDefault();
    //remover local storage
    removeFromLocalStorage(id);
}


//local storage
function addToLocalStorage(id, value) {
    const compra = { id: id, value: value };
    let itens = getLocalStorage();
    itens.push(compra);
    localStorage.setItem('listaCompras', JSON.stringify(itens));

}

function removeFromLocalStorage(id) { 
    let itens = getLocalStorage();
    
    itens = itens.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem('listaCompras', JSON.stringify(itens));
}


function editLocalStorage(id, value) {
    let itens = getLocalStorage();
    itens = itens.map(function(item){
        if(item.id=== id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('listaCompras', JSON.stringify(itens));

}

function getLocalStorage(){
    return localStorage.getItem('listaCompras')
     ? JSON.parse(localStorage.getItem('listaCompras')) 
     : [];
}

//setup load
function setupItens(){
    let itens = getLocalStorage();
    if(itens .length > 0){
    itens.forEach(function(item){
        criarItemLista(item.id, item.value)
    });
    comprasContainer.classList.add('show-container');
}}

function criarItemLista(id, value){
    const element = document.createElement('article');
    element.classList.add('compras-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p>${value}</p>
    <div class="container-btn">
        <button type="button" class="edit-icon editar">
            <i class="fa-solid fa-pen-to-square"></i>                 
        </button>
        <button type="button" class="edit-icon deletar">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>`


    const deletarBtn = element.querySelector('.deletar');
    const editarBtn = element.querySelector('.editar');
    deletarBtn.addEventListener('click', deletarItem);
    editarBtn.addEventListener('click', editarItem);


    //append
    listaCompras.appendChild(element);
}