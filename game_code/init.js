//==================================================================================================================
//      --==VOEG ELEMENTEN TOE AAN PAGINA==--
//==================================================================================================================

//Maakt elementen aan aan de hand van informatie die is gegeven in het levelCreation JSON-bestand
function createElements(levelID){
    //Leest JSON-bestand met leveldata uit
    $.getJSON("game_creation/levelCreation.json", function(levelDataRaw){
        const levelData = levelDataRaw["level" + levelID];
        const a = "draggableElement";

        //Verwijdert alle containers indien de waarde "true" is of wanneer het spel op het eerste level zit
        if(levelData.reset || levelID === 1){
            $(".draggableElement").remove();
        }

        //Verwijdert de gegeven elementen
        levelData.removeElements.forEach(function(elementID){
            const element = "#" + a + elementID;
            $(element).remove();
        });

        //Maakt alle beweegbare elementen aan per gebied
        $.each(levelData.areas, function(areaName, elementObject){

            //Maakt de werkelijke beweegbare elementen aan
            $.each(elementObject, function(index, values){
                //Maakt DIV aan
                const elementID = a + values.elementID;
                $("#" + areaName).append("<div class='draggableElement' id='" + elementID + "'></div>");

                //CSS-waarden
                $.each(values.cssValues, function(cssAttribute, cssValue){
                    $("#" + a + values.elementID).css(cssAttribute, cssValue)
                });

                //Maakt de elementen aan die daadwerkelijk met elkaar kunnen botsen
                createCollisionDiv("#" + a + values.elementID);
            })
        });

        //Zorgt ervoor dat de gemaakte elementen versleepbaar zijn
        $(".draggableElement").each(function(index, element){
            createDraggable(element);
        })
    })
}

//Zorgt ervoor dat het gegeven element kan worden versleept
function createDraggable(element) {
    //Element-ID (laatste teken van de gehele ID)
    const elementID = $(element).attr("id").slice($(element).attr("id").length-1, $(element).attr("id").length);

    //Maakt het element versleepbaar
    $(element).draggable({
        containment: $("#playingArea"),
        cursorAt: {top: $(element).height() / 2, left: $(element).width() / 2},
        obstacle: $(".collisionDetection").not("#collisionDetection" + elementID),
        preventCollision: true,
    })
}

//==================================================================================================================
//      --==VOORTGANG LEVELS==--
//==================================================================================================================

//Maakt de tabel aan met de levelvoortgang + levelindicatie
function createLevelProgressBar(levelID, timerArray){
    //Levelindicatie
    $("#currentLevel").empty().append("Level " + levelID);

    //Leest JSON-bestand met leveldata uit
    $.getJSON("game_creation/levelCreation.json", function(levelData){
        //Table-header met de colspan van het totale aantal levels
        $("#gameProgress").empty().append("<table id='gameProgressTable'><tr><th colspan='"
            + Object.keys(levelData).length + "'>Voortgang</th></tr><tr>");

        //Maakt de individuele cellen voor elk level aan
        for(let i = 1; i <= Object.keys(levelData).length; i++){

            //Afgemaakte levels
            if(i < levelID){
                $("#gameProgressTable").append("<td id='gameProgressCell" + i + "' class='levelDone'>" +
                    "<span class='finalTime'>(" + timerArray[i-1] + " seconden)</span> Level " + i + "</td>");
            }

            //Huidig level
            else if(i === levelID){
                $("#gameProgressTable").append("<td id='gameProgressCell" + i + "' class='levelActive'><span class='levelActiveIndicator'>[Huidig level]" +
                    "</span> Level " + i + "</td>");
            }

            //Komende levels
            else{
                $("#gameProgressTable").append("<td id='gameProgressCell" + i + "' class='levelTodo'>Level " + i + "</td>");
            }
        }

        //Sluit tabel af
        $("#gameProgressTable").append("</tr></table>");
    })
}


//==================================================================================================================
//      --==AANMAAK HINTS==--
//==================================================================================================================

//Genereert hints voor naast welke containers de gegeven container mag staan en naast welke niet. Looped door alle
//eisen heen om een correct geforumleerde hint te genereren, door middel aan de hand van de gegeven substrings
function generateNextToHints(element, condition, substring1, substring2){
    //Element-ID (laatste teken van de gehele naam)
    const elementID = element.slice(element.length-1, element.length);


    // //Geen eisen
    // if(condition.length === 0){
    //     $("#hintArea").append("<span class='originalContainer'>Container " + elementID + "</span> " + substring1 +
    //         " <span class='conditionContainer'> alle containers </span> " + substring2 + "<br>");
    // }
    //Éen eis
    if(condition.length === 1){
        //ID van element die wel/niet naast de opgegeven container mag staan
        const conditionElementID = condition[0].slice(element.length-1, element.length);

        //Formuleren en appenden hint
        $("#hintArea").append("<span class='originalContainer'>Container " + elementID + "</span> " + substring1 +
            " <span class='conditionContainer'> container " + conditionElementID + "</span> " + substring2 + "<br>");
    }
    //Meerdere eisen
    else if(condition.length > 1){
        const arrayCount = condition.length-1; //Aantal eisen
        let currentArrayCount = 0; //Houdt bij op welke eis de each-loop momenteel is

        //Formuleert start van de hint
        $("#hintArea").append("<span class='originalContainer'>Container " + elementID + "</span> " + substring1 +
            " <span class='conditionContainer'>container</span> ");

        //Voegt de containers waar de opgegeven container wel/niet naast mag staan en formuleert deze in goed
        //Nederlands aan de hand van de gegeven substrings
        condition.forEach(function(conditionElement){
            currentArrayCount++; //Incrementeert huidige positie van de array met eisen (conditions)

            //ID van element die naast de opgegeven container (niet) moet staan
            const conditionElementID = conditionElement.slice(conditionElement.length-1, conditionElement.length);

            //Eerste containers
            if(currentArrayCount < arrayCount){
                $("#hintArea").append("<span class='conditionContainer'>" + conditionElementID + "</span>, ")
            }
            //Een-na-laatste container
            else if(currentArrayCount === arrayCount){
                $("#hintArea").append("<span class='conditionContainer'>" + conditionElementID + "</span>")
            }
            //Laatste container
            else{
                $("#hintArea").append(" en <span class='conditionContainer'>" + conditionElementID + "</span> ");
            }
        });

        //Sluit hint af
        $("#hintArea").append(substring2 + "<br>");
    }
}


//Geneert hints over in welk gebied de containers moeten komen te staan
function generateAreaHints(elementID, condition){

    //In de finishingArea (ofwel op de boot)
    if(condition.toLowerCase() === "finishingarea"){
        $("#hintArea").append("<span class='originalContainer'>Container " + elementID + "</span> moet op het schip staan.<br>");
    }
    //In de startArea (ofwel op de kade)
    else if(condition.toLowerCase() === "startingarea"){
        $("#hintArea").append("<span class='originalContainer'>Container " + elementID + "</span> moet op de kade staan.<br>");
    }
    //Error
    else{
        $("#hintArea").append("<span class='error'>Er is een fout opgetreden met container " + elementID + " :(</span>");
    }
}


//Roept andere functies met relevante data aan om automatisch hints te genereren
function addHintsMain(levelID){
    //Leegt hint-area
    $("#hintArea").empty();

    //Leest JSON-bestand met leveldata uit
    $.getJSON("game_creation/levelCreation.json", function(levelDataRaw){
        const levelConditions = levelDataRaw["level" + levelID].finishingConditions;

        //nextTo hints (mits er meer dan 1 is)
        if(Object.keys(levelConditions.nextTo).length !== 0){
            //Individuele eisen
            $.each(levelConditions.nextTo, function(element, condition){
                generateNextToHints(element, condition, "moet naast", "staan.");
            });

            $("#hintArea").append("<br>");
        }

        //notNextTo hints (mits er meer dan 1 is)
        if(Object.keys(levelConditions.notNextTo).length !== 0) {
            //Individuele eisen
            $.each(levelConditions.notNextTo, function(element, condition){
                generateNextToHints(element, condition, "mag niet naast", "staan.");
            });

            $("#hintArea").append("<br>");
        }

        //inArea hints (mits er meer dan 1 is)
        if(Object.keys(levelConditions.inArea).length !== 0) {
            //Individuele eisen
            $.each(levelConditions.inArea, function(element, condition){
                generateAreaHints(element, condition);
            })
        }
    })
}


//==================================================================================================================
//      --==COLLISION DIV AANMAAK==--
//==================================================================================================================

//Maakt een collision-detection div aan binnen het versleepbare element
function createCollisionDiv(element) {
    //Element-ID (laatste teken van de gehele opgegeven element-naam)
    const elementID = element.slice(element.length-1, element.length);

    //Maakt de daadwerkelijke DIV aan en voegt hier de benodigde CSS aan toe
    if ($("#collisionDetection" + elementID).length === 0 && parseInt(elementID)) {
        $(element).append("<div class='collisionDetection' id='collisionDetection" + elementID + "'></div>");

        $("#collisionDetection" + elementID).css("position", "absolute");
        $("#collisionDetection" + elementID).css("width", $(element).width() - 3); //3px speling - horizontaal
        $("#collisionDetection" + elementID).css("height", $(element).height() - 3); //3px speling - verticaal
        $("#collisionDetection" + elementID).css("border", "3px solid black");

        //Maakt de collisionDetection-div dezelfde achtergrondkleur als de draggableElement-div en maakt de
        //draggableElement-div ontzichtbaar
        //$("#collisionDetection" + elementID).css("background-image", "URL"); //TODO: achtergrond container
        $("#collisionDetection" + elementID).css("background", $("#draggableElement" + elementID).css("background"));
        $("#draggableElement" + elementID).css("background", "none");

        $("#collisionDetection" + elementID).empty().append("<p>" + elementID + "</p>");
    }
}

//Exporteer benodigde functies
export {createElements, createLevelProgressBar, addHintsMain, createCollisionDiv};