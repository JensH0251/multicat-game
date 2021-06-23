<?php
include_once "connection.php";


//Haalt alle records op uit de tabel door middel van een PDO-prepared statement
function getScores(PDO $connection){
    $query = "select * from scores order by tijd asc";
    $statement = $connection->prepare($query);
    $statement->execute();

    return $statement->fetchAll();
}


//Genereert een tabel met alle records aan de hand van de gegeven resultaten afkomstig uit de PDO-query
function createTable($result){
    $table = "<table id='scoresTable'>";

    //Table headers
    $table = $table . "<tr>";
    $table = $table . "<th>Plaats</th>";
    $table = $table . "<th>Naam</th>";
    $table = $table . "<th>Tijd</th>";
    $table = $table . "</tr>";

    //Table cells
    $place = 0;
    foreach($result as $row){
        $place++;

        $table = $table . "<tr id='scoreRowID" . $row["id"] . "'>";
        $table = $table . "<td class='placeCell'>" . $place . "</td>";
        $table = $table . "<td class='naamCell'>" . $row["naam"] . "</td>"  . "</td>";
        $table = $table . "<td class='tijdCell'>" . $row["tijd"] . "</td>";
        $table = $table . "</tr>";
    }

    $table = $table . "</table>";
    return $table;
}


//Kleine debug functie
function debug($var){
    print_r($var);
}


//Hoofdfunctie die andere benodigde functies chronologisch aanroept
function getScoresMain(PDO $connection){
    $result = getScores($connection);
    $table = createTable($result);
    echo $table;
}


//Kijkt of alle benodigde POST-variabelen zijn opgegeven
if(isset($_POST["getScoresVerification"])){
    //Kijkt of de $connection-variabele bestaat
    if(!empty($connection)){
        getScoresMain($connection);
    }
    else{
        echo "PDO connection-variabele is incorrect of ontbreekt.";
    }
}
else{
    echo "Niet alle POST-variabelen zijn opgegeven (getScoresVerification)";
}
