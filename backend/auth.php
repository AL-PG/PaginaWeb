<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();

require_once 'dbConfig.php'; // Include centralized configuration

$conn = getDatabaseConnection(); // Use the function from dbConfig.php

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit();
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $conn->prepare("
    SELECT 
        idUsuario, 
        nombre, 
        apaterno, 
        amaterno, 
        email, 
        genero, 
        fechaNacimiento, 
        contrasena 
    FROM Usuario 
    WHERE email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();

    if (password_verify($password, $usuario['contrasena'])) {
        $_SESSION['user'] = [
            'id' => $usuario['idUsuario'],
            'nombre' => $usuario['nombre'],
            'apaterno' => $usuario['apaterno'],
            'amaterno' => $usuario['amaterno'],
            'nombreCompleto' => $usuario['nombre'] . ' ' . $usuario['apaterno'] . ' ' . $usuario['amaterno'],
            'email' => $usuario['email'],
            'genero' => $usuario['genero'], // Include genero
            'fechaNacimiento' => $usuario['fechaNacimiento']
        ];

        echo json_encode(["success" => true, "user" => $_SESSION['user']]);
    } else {
        http_response_code(401); // No autorizado
        echo json_encode(["error" => "Contraseña incorrecta"]);
    }
} else {
    http_response_code(404); // No encontrado
    echo json_encode(["error" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
