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
    if (empty($_GET['idProducto'])) {
        http_response_code(400);
        echo json_encode(["error" => "El parámetro idProducto es requerido."]);
        exit();
    }

    $idProducto = intval($_GET['idProducto']);
    $conn = getDatabaseConnection();

    // Selecciona productos relacionados por color, tipo de prenda y que no sea el mismo producto
    $sql = "
        SELECT 
            p.idProducto,
            p.nombre AS nombre_producto,
            tp.nombre AS tipo_producto,
            c.nombre AS color,
            p.precio,
            (
                SELECT pi.url_imagen
                FROM producto_imagenes pi
                WHERE pi.idProducto = p.idProducto
                LIMIT 1
            ) AS url_imagen
        FROM producto p
        JOIN tipo_producto tp ON p.id_tipo = tp.idTipo
        JOIN color c ON p.id_color = c.idColor
        WHERE (
            p.id_color = (SELECT id_color FROM producto WHERE idProducto = ?) 
            OR p.id_tipo = (SELECT id_tipo FROM producto WHERE idProducto = ?)
        )
        AND p.idProducto <> ?
        LIMIT 4
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $idProducto, $idProducto, $idProducto);

    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        echo json_encode($productos);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener productos relacionados: " . $e->getMessage()]);
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
