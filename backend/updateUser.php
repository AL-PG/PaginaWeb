<?php
// 1. CORS + JSON
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json");

// 2. Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Errores
ini_set('display_errors', 0);
error_reporting(E_ALL);
set_error_handler(fn($s,$m,$f,$l) => exitWithError("Error interno del servidor"));
set_exception_handler(fn($e) => exitWithError("Excepción no manejada"));

// 4. Conexión
require_once 'dbConfig.php'; // Include centralized configuration
$conn = getDatabaseConnection(); // Use the function from dbConfig.php

// 5. Body + logging
$data = json_decode(file_get_contents("php://input"), true);
if ($data === null) {
    error_log("JSON inválido: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(["error" => "JSON inválido"]);
    exit;
}
error_log("Datos recibidos: " . print_r($data, true));

if (!isset($data['id'], $data['nombre'], $data['email'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios"]);
    exit;
}

// 6. Sanitizar y preparar fecha
$id = (int) $data['id'];
$nombre = $conn->real_escape_string($data['nombre']);
$apaterno = $conn->real_escape_string($data['apaterno'] ?? "");
$amaterno = $conn->real_escape_string($data['amaterno'] ?? "");
$email = $conn->real_escape_string($data['email']);
$genero = $conn->real_escape_string($data['genero'] ?? "O"); // Default to "O" if not provided

if (!empty($data['fechaNacimiento'])) {
    $fn = "'" . $conn->real_escape_string($data['fechaNacimiento']) . "'";
} else {
    $fn = "NULL";
}

// 7. Consulta dinámica
$sql = "";
if (!empty($data['password'])) {
    $hashed = password_hash($data['password'], PASSWORD_DEFAULT);
    $sql = "
      UPDATE usuario SET
        Nombre='$nombre',
        Apaterno='$apaterno',
        Amaterno='$amaterno',
        Email='$email',
        FechaNacimiento=$fn,
        Genero='$genero',
        Contrasena='$hashed'
      WHERE idUsuario=$id
    ";
} else {
    $sql = "
      UPDATE usuario SET
        Nombre='$nombre',
        Apaterno='$apaterno',
        Amaterno='$amaterno',
        Email='$email',
        FechaNacimiento=$fn,
        Genero='$genero'
      WHERE idUsuario=$id
    ";
}

error_log("SQL a ejecutar: $sql");

// 8. Ejecutar y responder
if ($conn->query($sql)) {
    $result = $conn->query("SELECT * FROM usuario WHERE idUsuario = $id");
    $updatedData = $result->fetch_assoc();
    echo json_encode(["success" => true, "message" => "Datos actualizados correctamente", "updatedData" => $updatedData]);
} else {
    exitWithError("Error al actualizar: " . $conn->error);
}
$conn->close();

// Helper
function exitWithError($msg) {
    http_response_code(500);
    echo json_encode(["error" => $msg]);
    error_log($msg);
    exit;
}
