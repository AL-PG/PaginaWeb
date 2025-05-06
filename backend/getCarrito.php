<?php
require_once 'dbConfig.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idUsuario'])) {
        $idUsuario = intval($_GET['idUsuario']);
        $conn = getDatabaseConnection();

        $stmt = $conn->prepare("
            SELECT 
                c.idCarrito,
                c.idProducto, 
                c.cantidad,
                p.nombre, 
                p.precio, 
                (SELECT url_imagen FROM producto_imagenes WHERE idProducto = p.idProducto LIMIT 1) AS url_imagen
            FROM Carrito c
            JOIN Producto p ON c.idProducto = p.idProducto
            WHERE c.idUsuario = ?
        ");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $result = $stmt->get_result();

        $carrito = [];
        while ($row = $result->fetch_assoc()) {
            $carrito[] = $row;
        }

        echo json_encode($carrito);

        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        echo json_encode(["error" => "El parámetro 'idUsuario' es requerido."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>