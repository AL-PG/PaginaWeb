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
                T.Talla,
                M.pecho,
                M.cintura,
                M.largo,
                M.ancho
            FROM Medidas M
            JOIN Talla T ON M.idTalla = T.idTalla
            WHERE M.idProducto = ?
        ");
        $stmt->bind_param("i", $idProducto);
        $stmt->execute();
        $result = $stmt->get_result();

        $medidas = [];
        while ($row = $result->fetch_assoc()) {
            $medidas[] = $row;
        }

        echo json_encode($medidas);

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
