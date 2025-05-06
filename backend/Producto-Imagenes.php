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

        $stmt = $conn->prepare("SELECT idImagen, url_imagen FROM producto_imagenes WHERE idProducto = ?");
        $stmt->bind_param("i", $idProducto);
        $stmt->execute();
        $result = $stmt->get_result();

        $imagenes = [];
        while ($row = $result->fetch_assoc()) {
            $imagenes[] = $row;
        }

        echo json_encode($imagenes);

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
