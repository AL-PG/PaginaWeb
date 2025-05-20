<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data['idUsuario']) ||
        empty($data['idProducto']) ||
        !isset($data['calificacion'])
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan parámetros requeridos."]);
        exit();
    }

    $idUsuario = intval($data['idUsuario']);
    $idProducto = intval($data['idProducto']);
    $calificacion = floatval($data['calificacion']);

    $conn = getDatabaseConnection();

    // Si ya existe una calificación de este usuario para este producto, actualizarla. Si no, insertarla.
    $stmt = $conn->prepare("
        INSERT INTO calificacion (idUsuario, idProducto, calificacion)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE calificacion = VALUES(calificacion)
    ");
    $stmt->bind_param("iid", $idUsuario, $idProducto, $calificacion);

    try {
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Calificación guardada correctamente."]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al guardar la calificación: " . $e->getMessage()]);
    } finally {
        $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit();
}
?>
