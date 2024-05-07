const minButton = document.querySelector(".minusButton");
const moreButton = document.querySelector("-addButton");

function minus(){
    event.preventDefault();
    var cantInput = document.getElementById("input_cant");
    var cant = parseInt(cantInput.value,10);
    if(cant > 1){
        cantInput.value = cant - 1;
    }
}

function more(){
    event.preventDefault();
    var cantInput = document.getElementById("input_cant");
    var cant = parseInt(cantInput.value,10);
    cantInput.value = cant + 1;
    
}