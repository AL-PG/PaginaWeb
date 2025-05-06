<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idProducto']) && isset($_GET['idTalla'])) {
        $idProducto = intval($_GET['idProducto']);
        $idTalla = intval($_GET['idTalla']);
        $conn = getDatabaseConnection();

        $stmt = $conn->prepare("SELECT stock FROM Stock WHERE idProducto = ? AND idTalla = ?");
        $stmt->bind_param("ii", $idProducto, $idTalla);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Stock no encontrado."]);
        }

        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Los parámetros 'idProducto' y 'idTalla' son requeridos."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>
