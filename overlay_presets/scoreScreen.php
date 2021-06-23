<?php
    if(isset($_POST["scoreScreenVerification"])){ ?>
<div class="backdrop" id="scoreScreenBackdrop">
    <!--Wrapper-->
    <div id="scoreScreenWrapper">

        <!--Main header-->
        <div id="scoreScreenHeader">
            <span class="mainText">Je hebt het spel afgemaakt in <span id="timeTotal">SPAN_TEXT_REPLACE_TIME</span> seconden!</span><br>
            <span class="subText">Daarmee sta je op plaats <span id="ranking">SPAN_TEXT_REPLACE_RANKING</span>!</span>
        </div>

        <!--Main body-->
        <div id="scoreScreenBody">
            <!--Body - header-->
            <div id="scoresHeader">Scores:</div>

            <!--Body - scores-->
            <div id="scoresBody"></div>

            <!--Body - addScore form status-->
            <div id="addScoreStatus"></div>

            <!--Body - addScore form-->
            <div id="addScore">
                <form method="post" id="addScoreForm">
                    <label id="nameInputLabel" for="nameInput">Naam: </label>
                    <input type="text" name="nameInput" id="nameInput" placeholder="Voeg hier je naam toe">
                    <input type="submit" name="submitNameButton" id="submitNameButton" value="Voeg je score toe">
                </form>
            </div>

            <!--Body - opnieuw & afsluiten buttons-->
            <div id="scoreButtonDiv">
                <button class="scoreButton" id="restartButton">Opnieuw</button>
                <button class="scoreButton" id="closeButton">Afsluiten</button>
            </div>
        </div>
    </div>
</div>

<?php }
    else {
        //header("Location: ../index.php");
        header("Location: Fristi.html");
    } ?>