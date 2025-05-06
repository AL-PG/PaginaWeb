<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);

    error_log("Datos recibidos: " . print_r($data, true));

    if (empty($data['idUsuario']) || empty($data['idProducto'])) {
        http_response_code(400);
        echo json_encode(["error" => "Se requieren ambos parámetros: idUsuario e idProducto"]);
        exit();
    }

    $idUsuario = intval($data['idUsuario']);
    $idProducto = intval($data['idProducto']);

    $conn = getDatabaseConnection();

    $stmt = $conn->prepare("DELETE FROM Carrito WHERE idUsuario = ? AND idProducto = ?");
    $stmt->bind_param("ii", $idUsuario, $idProducto);

    try {
        $stmt->execute();
        
        if ($stmt->affected_rows === 0) {
            http_response_code(404);
            echo json_encode(["error" => "El producto no estaba en el carrito"]);
        } else {
            echo json_encode(["success" => true, "message" => "Producto eliminado del carrito"]);
        }
        exit();
    } catch (mysqli_sql_exception $e) {
        error_log("Error SQL: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Error al eliminar del carrito: " . $e->getMessage()]);
        exit();
    } finally {
        $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}
?>