import {getScoresTable} from "../game_code/loadOverlays.js";

$(document).ready(function(){
    let scoreAdded = false;

    function getLastAdded(){
        //Roept het PHP-bestand op om de laatst toegevoegde record terug te krijgen aan de hand van het hoogste ID. Op
        //basis hiervan kan de tablerow met de relevante ID worden geselecteerd
        let lastAddedID = "";

        $.ajax({
            url: "database/getLastAdded.php",
            dataType: "text",

            success: function(getLastAddedResponse){
                //console.log("getLastAddedResponse success:", getLastAddedResponse);
                lastAddedID = getLastAddedResponse;
            },

            error: function(getLastAddedResponse){
                console.log("getLastAddedResponse error:", getLastAddedResponse);
            }
        });

        return lastAddedID;
    }


    //Voegt nieuwe score toe aan database door middel van een PHP-file AJAX call
    function addScoreCall(name, time){
        $.ajax({
            url: "database/addScore.php",
            cache: -1,
            method: "post",
            type: "post",
            dataType: "text",
            data: {
                name: name,
                time: time
            },

            success: function(addScoreResponse){
                //console.log("addScoreResponse success:", addScoreResponse);
                $("#addScore").empty().append("<span id='scoreAdded'>Je score van " + time + " seconden is toegevoegd!</span>");
                getScoresTable();
            },

            error: function(addScoreResponse){
                console.log("addScoreResponse error:", addScoreResponse);
            }
        });

        //Opmaak voor nieuw toegevoegde record (aan de hand van het nieuwst toegevoegde ID, zie getLastAdded())
        const lastAddedID = getLastAdded();
        $("#scoreRowID" + lastAddedID + " td").css("background", "#afffa6");
    }


    //Detecteert wanneer het formulier om de nieuwe score op te geven is verzonden
    $(document).on("submit", "#addScoreForm", function(eventData){
        eventData.preventDefault();

        const getName = $("#nameInput").val(); //Naam
        const getTime = $("#timeTotal").text(); //Tijd

        //Invoerveld voor de naam mag niet leeg zijn
        if(getName.replace(" ", "") !== ""){
            //Zorgt ervoor dat de speler niet meerdere scores kan toevoegen als deze weer het formulier in de HTML-code
            //copy-pasted door middel van Element Inspecteren in de browser
            if(scoreAdded === false){
                scoreAdded = true;
                addScoreCall(getName, getTime);
            }
            else{
                $("#addScoreStatus").empty().append("Leuk geprobeerd, maar je kan maar één score toevoegen.");
            }
        }
        else{
            $("#addScoreStatus").empty().append("Dit veld mag niet leeg zijn.");
        }
    });


    //Zorgt ervoor dat er nog een score kan worden toegevoegd wanneer het spel wordt gereset:
    //Reset spel button (in-game)
    $("#resetGameButton").on("click", function(eventData){
        eventData.preventDefault();

        scoreAdded = false;
    });

    //Opnieuw-knop (eindscherm)
    $(document).on("click", "#restartButton", function(eventData){
        eventData.preventDefault();

        scoreAdded = false;
    });
});