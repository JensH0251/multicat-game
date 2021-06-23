<?php
    if(isset($_POST["continueDivVerification"])){ ?>

<!--Start/volgende level-->
<div class="backdrop" id='continueDivBackdrop'>
    <div id='continueDivWrapper'>
        <div id="continueDiv">
            <span id='continueSpan'>SPAN_TEXT_REPLACE_CONTINUE</span>
            <button class="continueButton" id='continueButtonYes'>Start!</button>
        </div>
    </div>
</div>
    <?php }
    else {
        //header("Location: ../index.php");
        header("Location: Fristi.html");
    } ?>