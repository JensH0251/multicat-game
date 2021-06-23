//Importeer benodigde functies
import {createElements, createLevelProgressBar, addHintsMain} from "./init.js"; //Start
import {checkConditionsMain} from "./conditionChecks.js"; //Einde
import {getContinueDivOverlay, getScoreScreenOverlay, getScoresTable} from "./loadOverlays.js"; //Spel-overlays

$(document).ready(function() {
    //==================================================================================================================
    //      --==INITIALISATIE==--
    //==================================================================================================================

    //getJSON moet synchronous zijn omdat er anders geen value uit terug kan worden gegeven (de return zal plaatsvinden
    //voordat de functie klaar is, dus de return-value is dan "undefined"). Bovendien moet de "cache" standaard op false
    //staan omdat anders het object uit het JSON-bestand niet wordt geupdated in de browser
    console.log("Deze waarschuwing kan genegeerd worden.");
    $.ajaxSetup({
        async: false,
        cache: false
    });

    //Haalt het totale aantal beschikbare levels op
    function getTotalLevels(){
        let totalLevels = 0;

        $.getJSON("game_creation/levelCreation.json", function(levelData){
            totalLevels = Object.keys(levelData).length;
        });

        return totalLevels;
    }

    //Globale variabelen
    let timer, sec, msx10;
    let timerArray = [];
    let levelID = 0;
    let posArray = [];
    let totalLevels = getTotalLevels();

    //Beginscherm
    $("#overlayWrapper").append(getContinueDivOverlay("Klaar om te starten?"));

    //==================================================================================================================
    //      --==TIMER==--
    //==================================================================================================================

    //Timergedeelte: om op 2 decimalen af te ronden, wordt er elk interval 10 miliseconden bijgevoegd (vandaar de
    //variabelenaam "msx10": miliseconden x 10). Een waarde van msx10 van 100 is een seconde. De variabelewaarden worden
    //geüpdated afhankelijk hiervan en weergeven op de webpagina
    function runTimer(){
        sec = 0;
        msx10 = 0;
        timer = setInterval(function(){
            msx10++;

            if(msx10 === 100){
                sec++;
                msx10 = 0;
            }

            $("#timerTime").empty().append(sec + "." + msx10);
        }, 10);
    }


    //==================================================================================================================
    //      --==CONTROLEREN + LEVEL-UP==--
    //==================================================================================================================

    //"Controleren"-knop
    $("#finishedButton").on("click", function(eventData){
        eventData.preventDefault();

        const check = checkConditionsMain(levelID); //Kijkt of aan alle eisen wordt voldaan

        //Volgende level
        if(check){
            $("#finishedButton").prop("disabled", true); //Schakel knop uit

            clearInterval(timer); //Zet timer op 0
            timerArray.push(sec + "." + msx10); //Tijd

            createLevelProgressBar(levelID+1, timerArray); //Update levelvoortgang

            //Nog niet in het laatste level
            if(levelID !== totalLevels){

                //Deze interval zorgt ervoor dat er een korte pauze is tussen de melding dat alle containers op de juiste
                //plek staan en het scherm om verder te gaan (1.5s)
                const pause = setInterval(function(){
                    $("#overlayWrapper").empty().append(getContinueDivOverlay("Klaar voor het volgende level?")); //Overlay
                    $("#statusDiv").empty().removeAttr("class"); //Reset status-DIV
                    $("#finishedButton").prop("disabled", false); //Schakel knop weer in

                    clearInterval(pause); //Beëindig pause-interval
                }, 1500);
            }
            //Einde spel: roep scorescherm op
            else{
                let totalSec = 0, totalMsx10 = 0, totalTime; //Reset variabelen

                //Uiteindelijke tijd van alle levels bij elkaar
                timerArray.forEach(function(time){
                    const addSec = parseInt(time.split(".")[0]); //Seconden
                    const addMsx10 = parseInt(time.split(".")[1]); //Miliseconden x 10

                    totalSec = totalSec + addSec;
                    totalMsx10 = totalMsx10 + addMsx10;
                });

                //Seconden + miliseconden omgerekend naar seconden
                totalTime = (totalSec + (totalMsx10 / 100)).toFixed(2);

                //Roept scorescherm op
                $("#overlayWrapper").empty().append(getScoreScreenOverlay(totalTime));
                getScoresTable();
            }
        }
    });


    //==================================================================================================================
    //      --==CONTINUE-BUTTON - JA==--
    //==================================================================================================================

    //Start het nieuwe level
    $(document).on("click", "#continueButtonYes", function(eventData){
        eventData.preventDefault();

        levelID++;

        createElements(levelID); //Beweegbare elementen
        addHintsMain(levelID); //Hintsgeneratie
        createLevelProgressBar(levelID, timerArray); //Voortgangselement

        $("#overlayWrapper").empty(); //Verwijdert overlay

        runTimer(); //Start timer

        //Slaat de huidige positie van alle beweegbare (.draggableElement) elementen op (top, right, bottom & left in px)
        posArray = [];
        $(".draggableElement").each(function(index, element){
            //Numeriek ID van element (laatste teken van geheel ID)
            const elementID = $(element).attr("id").slice($(element).attr("id").length-1, $(element).attr("id").length);

            //Voegt ID en top/right/bottom/left toe in px aan de posArray
            posArray.push({
                elementID: elementID,
                elementPos: [
                    {top: $(element).css("top")},
                    {right: $(element).css("right")},
                    {bottom: $(element).css("bottom")},
                    {left: $(element).css("left")}
                ]
            })
        })
    });


    //==================================================================================================================
    //      --==ALGEMEEN: RESET LEVEL==--
    //==================================================================================================================

    //Reset het level
    $("#resetLevelButton").on("click", function(eventData){
        eventData.preventDefault();

        const resetLevelConfirmation = confirm("Weet je zeker dat je het level wilt resetten?");

        if(resetLevelConfirmation){
            clearInterval(timer);

            //Zet alle versleepbare elementen terug op de oorspronkelijke plek
            posArray.forEach(function(elementObject){
                elementObject.elementPos.forEach(function(attribute){
                    $("#draggableElement" + elementObject.elementID).css(Object.keys(attribute)[0], Object.values(attribute)[0])
                })
            });

            runTimer(); //Start timer
        }
    });


    //==================================================================================================================
    //      --==ALGEMEEN: RESET SPEL==--
    //==================================================================================================================

    //Functionaliteit om het spel opnieuw te laten beginnen
    function resetGame(){
        levelID = 0; //Reset levels
        timerArray = []; //Maak timerArray leeg

        clearInterval(timer); //Zet timer op 0
        $("#overlayWrapper").append(getContinueDivOverlay("Klaar om te starten?")); //Overlay
        $("#finishedButton").prop("disabled", false); //Maakt de "Controleren" knop weer beschikbaar
    }


    //Restart het gehele spel
    $("#resetGameButton").on("click", function(eventData){
        eventData.preventDefault();

        //Vraagt aan de gebruiker of deze werkelijk het spel wilt herstarten
        const resetGameConfirmation = confirm("Weet je zeker dat je het spel wilt resetten?");

        if(resetGameConfirmation){
            resetGame(); //Reset spel
        }
    });


    //==================================================================================================================
    //      --==EINDSCHERM: OPNIEUW==--
    //==================================================================================================================

    //Restart het gehele spel
    $(document).on("click", "#restartButton", function(eventData){
        eventData.preventDefault();

        resetGame(); //Reset spel
    });


    //==================================================================================================================
    //      --==EINDSCHERM: AFSLUITEN==--
    //==================================================================================================================

    //Stuurt de gebruiker door naar de volgende pagina, indien aanwezig. De pagina kan helaas niet gesloten worden
    //door middel van JavaScript
    $(document).on("click", "#closeButton", function(eventData){
        eventData.preventDefault();

        //Stuurt de gebruiker door naar een nieuwe pagina (kan van alles zijn)
        window.location.href = "https://www.maritiemcollegeijmuiden.nl/";
    })

});