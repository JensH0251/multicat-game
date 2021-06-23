//======================================================================================================================
//      --==OVERLAY: CONTINUE==--
//======================================================================================================================

//Overlay voor het scherm tussen de levels door
function getContinueDivOverlay(spanText){
    let continueDivOverlay = "";

    $.ajax({
        url: "overlay_presets/continueDiv.php",
        dataType: "text",
        method: "post",
        type: "post",
        data: {
            continueDivVerification: true
        },

        success: function(continueDivResponse){
            //console.log("continueDivResponse success:", continueDivResponse);
            continueDivOverlay = continueDivResponse;
        },

        error: function(continueDivResponse){
            console.log("continueDivResponse error:", continueDivResponse);
            continueDivOverlay = continueDivResponse;
        }
    });

    return continueDivOverlay.replace("SPAN_TEXT_REPLACE_CONTINUE", spanText);
}

//======================================================================================================================
//      --==OVERLAY: FINAL SCORE==--
//======================================================================================================================

//Haalt de plaats op van de huidige tijd die de speler heeft gehaald, ten opzichte van alle andere tijden die in de
//table staan
function getRanking(time){
    let rank = "Er is een fout opgetreden tijdens het ophalen van de plaats.";

    $.ajax({
        url: "database/getRanking.php",
        type: "post",
        method: "post",
        dataType: "text",
        data: {
            time: time
        },

        success: function(getRankingResponse){
            //console.log("getRankingResponse success:", getRankingResponse);
            rank = getRankingResponse;
        },

        error: function(getRankingResponse){
            console.log("getRankingResponse error:", getRankingResponse);
        }
    });

    return rank;
}


//Roept de overlay voor het eindscherm aan (scores en dergelijke)
function getScoreScreenOverlay(totalTimeFormatted){
    let scoreScreenOverlay = "";

    $.ajax({
        url: "overlay_presets/scoreScreen.php",
        dataType: "text",
        type: "post",
        method: "post",
        data: {
            scoreScreenVerification: true
        },

        success: function(scoreScreenResponse){
            //console.log("scoreScreenResponse success:", scoreScreenResponse);
            scoreScreenOverlay = scoreScreenResponse;
        },

        error: function(scoreScreenResponse){
            console.log("scoreScreenResponse error:", scoreScreenResponse);
            scoreScreenOverlay = scoreScreenResponse;
        }
    });

    //Plaats van de speler met de huidige tijd ten opzichte van alle andere tijden die in de database-table staan
    const rank = getRanking(totalTimeFormatted);

    //Vervangt de placeholders met de uiteindelijke tijd en met de uiteindelijke plaats van de speler (respectievelijk)
    scoreScreenOverlay = scoreScreenOverlay.replace("SPAN_TEXT_REPLACE_TIME", totalTimeFormatted);
    scoreScreenOverlay = scoreScreenOverlay.replace("SPAN_TEXT_REPLACE_RANKING", rank);

    return scoreScreenOverlay;
}


//Roept tabel met alle scores op en voegt deze toe aan de scoresBody
function getScoresTable(){
    $.ajax({
        url: "database/scoresTable.php",
        method: "post",
        type: "post",
        dataType: "text",
        data: {
            getScoresVerification: true
        },

        success: function(addScoreResponse){
            //console.log("addScoreResponse success:", addScoreResponse);
            $("#scoresBody").empty().append(addScoreResponse); //Voeg toe aan scoresBody
        },

        error: function(addScoreResponse){
            console.log("addScoreResponse error:", addScoreResponse);
        }
    })
}

//======================================================================================================================

//Exporteer benodigde functies
export {getContinueDivOverlay, getScoreScreenOverlay, getScoresTable};