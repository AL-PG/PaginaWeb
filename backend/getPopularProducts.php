<?php
require_once 'dbConfig.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $conn = getDatabaseConnection();

    $sql = "
        SELECT 
            p.idProducto,
            p.nombre AS nombre_producto,
            tp.nombre AS tipo_producto,
            c.nombre AS color,
            p.precio,
            p.genero,
            p.composicion,
            p.cuidado AS instrucciones_cuidado,
            (
                SELECT pi.url_imagen
                FROM producto_imagenes pi
                WHERE pi.idProducto = p.idProducto
                LIMIT 1
            ) AS url_imagen,
            SUM(dv.cantidad) AS total_vendido
        FROM detalle_venta dv
        JOIN producto p ON dv.idProducto = p.idProducto
        JOIN tipo_producto tp ON p.id_tipo = tp.idTipo
        JOIN color c ON p.id_color = c.idColor
        GROUP BY p.idProducto, p.nombre, tp.nombre, c.nombre, p.precio, p.genero, p.composicion, p.cuidado
        ORDER BY total_vendido DESC
        LIMIT 3
    ";

    try {
        $result = $conn->query($sql);
        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        echo json_encode($productos);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener los productos populares: " . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit();
}
?>
