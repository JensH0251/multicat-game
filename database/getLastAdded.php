<?php
include_once "connection.php";

//Haalt de hoogste ID uit de tabel op (ofwel de ID van de laatst toegevoegde record) door middel van een
//PDO-prepared statement
function getLastAddedID(PDO $connection){
    $query = "select max(id) as lastID from scores";
    $statement = $connection->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll();

    return $result[0]["lastID"];
}


//Kleine debug functie
function debug($var){
    print_r($var);
}


//Kijkt of de $connection-variabele bestaat
if(!empty($connection)){
    $lastAddedID = getLastAddedID($connection);
    echo $lastAddedID;
}
else{
    echo "PDO connection-variabele is incorrect of ontbreekt.";
}