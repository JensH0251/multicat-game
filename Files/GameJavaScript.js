function allowDrop(ev) {
    ev.preventDefault();
}


//Allow to drag
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}


//Allow to drop
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
