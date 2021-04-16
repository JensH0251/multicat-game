<html lang="en">
<head>
    <title>JavaScript project</title>
    <link rel="stylesheet" type="text/css" href="indexStyling.css">
    <meta charset="utf8">
</head>

<body>
<div id="mainDiv">
    <div id="mainListDiv">
        <div id="mainTitle">
            Project JavaScript - overzicht
        </div>

        <div id="linkListDiv">
            <ul id="linkList">
                <?php
                //Scant de map waar dit bestand in staat
                $dirArray = scandir(getcwd());

                //Looped door alle bestanden die in de bovenstaande gescande map staan
                foreach(array_splice($dirArray, 2) as $folder){

                    //Als het individuele onderdeel een map is waar zich een bestand genaamd "index.php" in bevindt,
                    //zal deze als link worden weergeven op de pagina.
                    if(is_dir($folder) && in_array("index.php", scandir($folder))){
                        echo "<li class='link'><a target='_blank' href='" . $folder . "'>" . $folder . "</a></li><br>";
                    }
                }
                ?>
            </ul>
        </div>
    </div>
    <div id="footer">
        Jay Jansen – Jens Hollenberg – Niels Lute
    </div>
</div>
</body>
</html>