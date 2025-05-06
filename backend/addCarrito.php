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

    error_log("Received data: " . print_r($data, true));

    if (empty($data['idUsuario']) || empty($data['idProducto'])) {
        http_response_code(400);
        echo json_encode(["error" => "Los parámetros 'idUsuario' e 'idProducto' son requeridos."]);
        exit();
    }

    $idUsuario = intval($data['idUsuario']);
    $idProducto = intval($data['idProducto']);
    $cantidad = isset($data['cantidad']) ? intval($data['cantidad']) : 1;

    $conn = getDatabaseConnection();

    // Intenta actualizar si ya existe, sino inserta nuevo
    $stmt = $conn->prepare("
        INSERT INTO Carrito (idUsuario, idProducto, cantidad) 
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
    ");
    $stmt->bind_param("iii", $idUsuario, $idProducto, $cantidad);

    try {
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Producto agregado al carrito."]);
        exit();
    } catch (mysqli_sql_exception $e) {
        error_log("SQL Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Error al agregar al carrito: " . $e->getMessage()]);
        exit();
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