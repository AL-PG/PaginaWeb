<?php
require_once 'dbConfig.php';

// Permitir solicitudes CORS (si el frontend está en localhost:5173)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Si la solicitud es de tipo OPTIONS, respondemos y terminamos el script
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idUsuario'])) {
        $idUsuario = intval($_GET['idUsuario']);
        $conn = getDatabaseConnection();

        // Consulta para obtener los productos favoritos del usuario
        $stmt = $conn->prepare("
            SELECT 
                p.idProducto, 
                p.nombre, 
                p.precio, 
                (SELECT url_imagen FROM producto_imagenes WHERE idProducto = p.idProducto LIMIT 1) AS url_imagen
            FROM Favoritos f
            JOIN Producto p ON f.idProducto = p.idProducto
            WHERE f.idUsuario = ?
        ");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $result = $stmt->get_result();

        // Almacenar los productos favoritos en un array
        $favoritos = [];
        while ($row = $result->fetch_assoc()) {
            $favoritos[] = $row;
        }

        // Devolver los productos favoritos en formato JSON
        echo json_encode($favoritos);

        $stmt->close();
        $conn->close();
    } else {
        // Si no se proporciona 'idUsuario', devolver error 400
        http_response_code(400);
        echo json_encode(["error" => "El parámetro 'idUsuario' es requerido."]);
    }
} else {
    // Si el método no es GET, devolver error 405 (Método no permitido)
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
}
?>
