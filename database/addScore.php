<?php
include_once "connection.php";


//Voegt de nieuwe record toe aan de tabel door middel van een PDO-prepared statement
function addRecord(PDO $connection, $name, $time){
    $query = "insert into scores (naam, tijd) values (?, ?)";
    $statement = $connection->prepare($query);
    $statement->execute([$name, $time]);

    echo "Record toegevoegd.";
}


//Kijkt of alle benodigde POST-variabelen zijn opgegeven
if(isset($_POST["name"]) && isset($_POST["time"])){
    if(!empty($connection)){
        $name = filter_var($_POST["name"], FILTER_SANITIZE_STRING); //Sanitize POST-name
        addRecord($connection, $name, $_POST["time"]);
    }
    //Kijkt of de $connection-variabele bestaat
    else{
        echo "PDO connection-variabele is incorrect of ontbreekt.";
    }
}
else{
    echo "Niet alle POST-variabelen zijn opgegeven (naam & tijd)";
}