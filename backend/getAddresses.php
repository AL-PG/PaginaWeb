<?php
// 1. CORS + JSON
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// 5. Validate id_usuario
if (!isset($_GET['id_usuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el parámetro id_usuario"]);
    exit;
}

$id_usuario = (int) $_GET['id_usuario'];

// 6. Fetch query
$sql = "SELECT * FROM direccion WHERE id_usuario = $id_usuario";
$result = $conn->query($sql);

if ($result) {
    $addresses = [];
    while ($row = $result->fetch_assoc()) {
        $addresses[] = $row;
    }
    echo json_encode(["success" => true, "addresses" => $addresses]);
} else {
    exitWithError("Error al obtener las direcciones: " . $conn->error);
}

$conn->close();

// Helper
function exitWithError($msg) {
    http_response_code(500);
    echo json_encode(["error" => $msg]);
    error_log($msg);
    exit;
}
