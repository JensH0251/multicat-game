<?php
include_once "connection.php";

//Kijkt op welke plaats de tijd van de speler staat ten opzichte van de al-bestaande records door middel van
//een PDO-prepared statement
function getRanking(PDO $connection, $time){
    $query = "select * from scores order by tijd asc";
    $statement = $connection->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll();

    //Zolang de opgehaalde tijd uit de table onder de nieuwe tijd ligt, wordt $rank geïncrementeerd
    $rank = 1;
    foreach($result as $row){
        if($row["tijd"] <= $time){
            $rank++;
        }
    }

    echo $rank;
}


//Kijkt of alle benodigde POST-variabelen zijn opgegeven
if(isset($_POST["time"])){
    //Kijkt of de $connection-variabele bestaat
    if(!empty($connection)){
        $time = floatval(filter_var($_POST["time"], FILTER_SANITIZE_STRING));
        getRanking($connection, $time);
    }
    else{
        echo "PDO connection-variabele is incorrect of ontbreekt.";
    }
}
else{
    echo "Niet alle POST-variabelen zijn gegeven (time)";
}