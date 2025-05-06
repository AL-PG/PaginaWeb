<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idProducto'])) {
        $idProducto = intval($_GET['idProducto']);
        $conn = getDatabaseConnection();

        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) AS numero_calificaciones,
                ROUND(AVG(calificacion), 1) AS promedio_calificacion
            FROM Calificacion
            WHERE idProducto = ?
        ");
        $stmt->bind_param("i", $idProducto);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Calificaciones no encontradas."]);
        }

        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "El parámetro 'idProducto' es requerido."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>
