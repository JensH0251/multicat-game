<?php
//PDO-connectie

$host = "localhost";
$db =  "container_spel"; //Naam van database
$user = "jens"; //Gebruikersnaam
$pass = "admin"; //Wachtwoord
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];


try{
    $connection = new PDO($dsn, $user, $pass, $options);
}
catch(PDOException $exception){
    echo $exception->getMessage();
}