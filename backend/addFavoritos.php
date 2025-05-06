<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // Handle preflight request
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    error_log("Received data: " . print_r($data, true)); // Debug received data

    if (empty($data['idUsuario']) || empty($data['idProducto'])) { // Validate parameters
        http_response_code(400);
        echo json_encode(["error" => "Los parámetros 'idUsuario' e 'idProducto' son requeridos."]);
        exit();
    }

    $idUsuario = intval($data['idUsuario']);
    $idProducto = intval($data['idProducto']);

    error_log("idUsuario: $idUsuario, idProducto: $idProducto"); // Debug variables

    $conn = getDatabaseConnection();

    $stmt = $conn->prepare("INSERT INTO Favoritos (idUsuario, idProducto) VALUES (?, ?)");
    $stmt->bind_param("ii", $idUsuario, $idProducto);

    try {
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Producto agregado a favoritos."]);
        exit();
    } catch (mysqli_sql_exception $e) {
        error_log("SQL Error: " . $e->getMessage()); // Debug SQL error
        if ($e->getCode() === 1062) { // Duplicate entry error
            http_response_code(409);
            echo json_encode(["error" => "El producto ya está en favoritos."]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error al agregar a favoritos: " . $e->getMessage()]);
        }
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
