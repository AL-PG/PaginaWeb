<?php
ob_start(); // Inicia el buffer de salida
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost";
$username = "root";
$password = "260403";
$dbname = "trendify";

// Eliminar la coma sobrante en los parámetros
$conn = new mysqli($servername, $username, $password, $dbname, 3307);

if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}

$nombre = $_POST['nombre'];
$apaterno = $_POST['apaterno'];
$amaterno = $_POST['amaterno'];
$email = $_POST['email'];
$contrasena = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash seguro

// Ajustar la consulta a 5 campos (eliminar género y fecha_nacimiento)
$stmt = $conn->prepare("INSERT INTO Usuario 
    (Nombre, Apaterno, Amaterno, Email, Contrasena) 
    VALUES (?, ?, ?, ?, ?)"); // 5 parámetros

// Vincular solo las variables existentes (5 's' en lugar de 7)
$stmt->bind_param("sssss", 
    $nombre, 
    $apaterno, 
    $amaterno, 
    $email, 
    $contrasena
);

// Ejecutar y verificar
if ($stmt->execute()) {
    header("Location: ../login/login.html");
    exit();
} else {
    // Muestra el error en el navegador
    die("Error al ejecutar la consulta: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>