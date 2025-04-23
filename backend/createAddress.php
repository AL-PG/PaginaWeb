<?php
// 1. CORS + JSON
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json");

// 2. Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Error handling
ini_set('display_errors', 0);
error_reporting(E_ALL);
set_error_handler(fn($s, $m, $f, $l) => exitWithError("Error interno del servidor"));
set_exception_handler(fn($e) => exitWithError("Excepción no manejada"));

// 4. Database connection
require_once 'dbConfig.php'; // Include centralized configuration
$conn = getDatabaseConnection(); // Use the function from dbConfig.php

// 5. Body + validation
$data = json_decode(file_get_contents("php://input"), true);
if ($data === null) {
    error_log("JSON inválido: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(["error" => "JSON inválido"]);
    exit;
}

if (!isset($data['calle'], $data['numero'], $data['colonia'], $data['ciudad'], $data['estado'], $data['cp'], $data['id_usuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios"]);
    exit;
}

// 6. Sanitize input
$calle = $conn->real_escape_string($data['calle']);
$numero = $conn->real_escape_string($data['numero']);
$colonia = $conn->real_escape_string($data['colonia']);
$ciudad = $conn->real_escape_string($data['ciudad']);
$estado = $conn->real_escape_string($data['estado']);
$cp = $conn->real_escape_string($data['cp']);
$id_usuario = (int) $data['id_usuario'];

// 7. Insert query
$sql = "
    INSERT INTO direccion (calle, numero, colonia, ciudad, estado, cp, id_usuario)
    VALUES ('$calle', '$numero', '$colonia', '$ciudad', '$estado', '$cp', $id_usuario)
";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Dirección creada correctamente", "idDireccion" => $conn->insert_id]);
} else {
    exitWithError("Error al crear la dirección: " . $conn->error);
}

$conn->close();

// Helper
function exitWithError($msg) {
    http_response_code(500);
    echo json_encode(["error" => $msg]);
    error_log($msg);
    exit;
}
?>
