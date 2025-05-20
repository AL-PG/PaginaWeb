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

    if (!isset($data['productos']) || !is_array($data['productos'])) {
        http_response_code(400);
        echo json_encode(["error" => "Se requiere un arreglo de productos."]);
        exit();
    }

    $conn = getDatabaseConnection();
    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("UPDATE stock SET stock = stock - ? WHERE idProducto = ? AND idTalla = ?");

        foreach ($data['productos'] as $producto) {
            if (
                !isset($producto['idProducto']) ||
                !isset($producto['idTalla']) ||
                !isset($producto['cantidad'])
            ) {
                throw new Exception("Faltan datos en uno de los productos.");
            }
            $idProducto = intval($producto['idProducto']);
            $idTalla = intval($producto['idTalla']);
            $cantidad = intval($producto['cantidad']);

            $stmt->bind_param("iii", $cantidad, $idProducto, $idTalla);
            $stmt->execute();

            if ($stmt->affected_rows === 0) {
                throw new Exception("No se pudo actualizar el stock para el producto $idProducto, talla $idTalla.");
            }
        }

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Stock actualizado correctamente."]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar el stock: " . $e->getMessage()]);
    } finally {
        if (isset($stmt)) $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit();
}
?>
