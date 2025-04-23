<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

ob_start(); // Inicia el buffer de salida
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'dbConfig.php'; // Include centralized configuration

$conn = getDatabaseConnection(); // Use the function from dbConfig.php

$nombre = $_POST['nombre'];
$apaterno = $_POST['apaterno'];
$amaterno = $_POST['amaterno'];
$email = $_POST['email'];
$contrasena = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash seguro

// Ajustar la consulta a 5 campos (eliminar género y fecha_nacimiento)
$stmt = $conn->prepare("INSERT INTO Usuario 
    (Nombre, Apaterno, Amaterno, Email, Contrasena) 
    VALUES (?, ?, ?, ?, ?)"); // 5 parámetros

$stmt->bind_param("sssss", 
    $nombre, 
    $apaterno, 
    $amaterno, 
    $email, 
    $contrasena
);


if ($stmt->execute()) {
    echo "Registro exitoso";
} else {
    http_response_code(500);
    echo "Error al ejecutar la consulta: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>