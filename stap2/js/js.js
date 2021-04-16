$(document).ready(function(){
    //==================================================================================================================
    //  Hoofdfunctie: hierin wordt er voor gezorgd dat de meegegeven "element"-div versleepbaar is
    //==================================================================================================================
    function moveDiv(element, container){
        //Aanmaak benodigde variabelen
        let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0

        //Events
        $(container).on("mousedown", function(event){
            initialX = event.clientX - xOffset;
            initialY = event.clientY - yOffset;

            if (event.target === element) {
                active = true;
            }
        });

        $(container).on("mousemove", function(event){
            if (active) {
                currentX = event.clientX - initialX;
                currentY = event.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                element.style.transform = "translate(" + currentX + "px, " + currentY + "px)";
                //element.style.margin = currentX + "px " + currentY + "px";
                //element.style.padding = currentX + "px " + currentY + "px";
            }
        });

        $(container).on("mouseup", function(event){
            initialX = currentX;
            initialY = currentY;

            active = false;
        });
    }


    moveDiv(document.getElementById("boxElement1"), document.getElementById("containerDiv"));
    //moveDiv(document.getElementById("boxElement2"), document.getElementById("containerDiv"));
});