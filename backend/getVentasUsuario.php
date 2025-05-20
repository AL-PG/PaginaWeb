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
    if (empty($_GET['idUsuario'])) {
        http_response_code(400);
        echo json_encode(["error" => "El parámetro idUsuario es requerido."]);
        exit();
    }

    $idUsuario = intval($_GET['idUsuario']);
    $conn = getDatabaseConnection();

    // Usar la tabla detalle_venta en vez de VentaDetalle
    $sql = "
        SELECT 
            v.idVenta,
            v.fecha,
            v.total,
            dv.cantidad,
            dv.precioUnitario AS precio_unitario,
            p.idProducto,
            p.nombre,
            p.precio,
            p.genero,
            p.composicion,
            p.cuidado,
            (
                SELECT pi.url_imagen
                FROM producto_imagenes pi
                WHERE pi.idProducto = p.idProducto
                ORDER BY pi.idImagen ASC
                LIMIT 1
            ) AS url_imagen
        FROM Venta v
        INNER JOIN detalle_venta dv ON v.idVenta = dv.idVenta
        INNER JOIN producto p ON dv.idProducto = p.idProducto
        WHERE v.idUsuario = ?
        ORDER BY v.fecha DESC, v.idVenta DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idUsuario);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $ventas = [];
        while ($row = $result->fetch_assoc()) {
            $ventas[] = $row;
        }
        echo json_encode($ventas);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener las ventas: " . $e->getMessage()]);
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
