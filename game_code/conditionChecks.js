//==================================================================================================================
//      --==ELEMENT - CHECK EISEN==--
//==================================================================================================================

//Kijkt of de twee gegeven elementen naast elkaar staan (bool)
function checkCollision(element, conditionElement) {
    return $(element).collision(conditionElement).length > 0 || $(conditionElement).collision($(element)).length > 0;
}


//Kijkt of het gegeven element in de gegeven area staat (bool)
function checkArea(element, area) {
    return $(element).collision($("#" + area)).length > 0;
}


//Kijkt of geen element zich in het water bevindt: notInForbiddenAreaCheck moet op true blijven staan
function getNotInForbiddenAreaCheck(){
    let notInForbiddenAreaCheck = true;

    //Kijkt of dit geldt voor elk beweegbaar element
    $(".draggableElement").each(function(index, element){

        if($(element).collision($(".forbiddenArea")).length > 0){
            notInForbiddenAreaCheck = false;
        }
    });

    //console.log("notInForbiddenAreaCheck: " + notInForbiddenAreaCheck);
    return notInForbiddenAreaCheck;
}


//nextTo-check: nextToCheck moet op true blijven staan
function getNextToCheck(levelData, levelID){
    const a = "draggableElement";

    let nextToCheck = true;

    //Haalt de ID's van de containers op die naast elkaar moeten staan en looped hier doorheen voor elke container en
    //looped hier doorheen
    $.each(levelData["level" + levelID].finishingConditions.nextTo, function(elementID, conditionIDArray){
        const element = "#" + a + elementID; //Aanmaak juiste elementsnaam

        //Kijkt of deze eis bestaat
        if(conditionIDArray.length !== 0){

            //Containers die naast elkaar moeten staan per element
            conditionIDArray.forEach(function(conditionElementID){
                const condition = "#" + a + conditionElementID; //Aanmaak juiste elementsnaam
                const collisionCheck = checkCollision(element, condition);

                if(collisionCheck === false){
                    nextToCheck = false;
                }
            })
        }
    });

    //console.log("nextToCheck: " + nextToCheck);
    return nextToCheck
}


//notNextTo - check: notNextToCheck moet true blijven
function getNotNextToCheck(levelData, levelID){
    const a = "draggableElement";

    let notNextToCheck = true;

    //Haalt de ID's van de containers op die niet naast elkaar mogen staan en looped hier doorheen voor elke container
    //en looped hier doorheen
    $.each(levelData["level" + levelID].finishingConditions.notNextTo, function(elementID, conditionIDArray){
        const element = "#" + a + elementID; //Aanmaak juiste elementsnaam

        //Kijkt of deze eis bestaat
        if(conditionIDArray.length !== 0){

            //Containers die niet naast elkaar mogen staan per element
            conditionIDArray.forEach(function(conditionElementID){
                const condition = "#" + a + conditionElementID;
                const collisionCheck = checkCollision(element, condition);

                if(collisionCheck){
                    notNextToCheck = false;
                }
            })
        }
    });

    //console.log("notNextToCheck: " + notNextToCheck);
    return notNextToCheck;
}


//inArea - check: inAreaCheck moet true blijven
function getInAreaCheck(levelData, levelID){
    const a = "draggableElement";

    let inAreaCheck = true;

    //Haalt alle beweegbare containers op en kijkt per elementID of deze in de opgegeven area staan
    $.each(levelData["level" + levelID].finishingConditions.inArea, function(elementID, area){
        const element = "#" + a + elementID;

        const areaCheck = checkArea(element, area);

        if(areaCheck === false){
            inAreaCheck = false;
        }
    });

    //console.log("inAreaCheck: " + inAreaCheck);
    return inAreaCheck;
}

//==================================================================================================================

//Checkt of alle elementen voldoen aan de gegeven eisen die staan in het levelCreation JSON-bestand
function checkConditionsMain(levelID){
    //Kijkt of een draggableElement zich in een verboden gebied bevindt (in het water)
    const notInForbiddenArea = getNotInForbiddenAreaCheck();

    if(notInForbiddenArea){
        let checkArray = [];
        let check = true;

        $.getJSON("game_creation/levelCreation.json", function(levelData){
            //nextTo - check
            const nextToCheck = getNextToCheck(levelData, levelID);
            checkArray.push(nextToCheck);

            //notNextTo - check
            const notNextToCheck = getNotNextToCheck(levelData, levelID);
            checkArray.push(notNextToCheck);

            //inArea
            const inAreaCheck = getInAreaCheck(levelData, levelID);
            checkArray.push(inAreaCheck);


            //Kijkt of aan alle eisen wordt voldaan
            checkArray.forEach(function(bool){
                if(bool === false){
                    check = false
                }
            });

            //Statusbericht:
            //Juiste oplossing
            if(check){
                $("#statusDiv").empty().append("<span class='successSpan'>Alle containers bevinden zich op de juiste plek!</span>");
                $("#statusDiv").attr("class", "resultSuccess");
            }
            //Foute oplossing
            else{
                $("#statusDiv").empty().append("<span class='errorSpan'>Nog niet alle containers bevinden zich op de juiste plek</span>");
                $("#statusDiv").attr("class", "resultError");
            }
        });

        return check;
    }
    //Container bevindt zich nog over de rand van het schip
    else{
        $("#statusDiv").empty().append("<span class='errorSpan'>Een of meerdere containers bevinden zich (deels) in het water!</span>");
    }
}

//Exporteert benodigde functies
export {checkConditionsMain};