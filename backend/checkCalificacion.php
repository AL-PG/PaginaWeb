<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Responder a las solicitudes preflight
}

require_once 'dbConfig.php'; // Incluir configuración de conexión

$conn = getDatabaseConnection(); // Usar función centralizada

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error); // Registrar error
    http_response_code(500);
    echo json_encode(["error" => "Error al conectar con la base de datos."]);
    exit();
}

$idUsuario = isset($_GET['idUsuario']) ? intval($_GET['idUsuario']) : 0;
$idProducto = isset($_GET['idProducto']) ? intval($_GET['idProducto']) : 0;

if (!$idUsuario || !$idProducto) {
    http_response_code(400); // Bad Request
    echo json_encode(['calificado' => false, 'error' => 'Parámetros inválidos']);
    $conn->close();
    exit();
}

$sql = "SELECT 1 FROM calificacion WHERE idUsuario = ? AND idProducto = ? LIMIT 1";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ii", $idUsuario, $idProducto);
    $stmt->execute();
    $stmt->store_result();

    $calificado = $stmt->num_rows > 0;

    echo json_encode(['calificado' => $calificado]);

    $stmt->close();
} else {
    error_log("Error en la preparación del statement: " . $conn->error);
    http_response_code(500);
    echo json_encode(['error' => 'Error al preparar la consulta']);
}

$conn->close();
