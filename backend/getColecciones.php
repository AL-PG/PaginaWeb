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
            c.idColeccion,
            c.nombre,
            c.descripcion,
            c.banner,
            c.sexo,
            COUNT(pc.idProducto) AS total_productos
        FROM coleccion c
        LEFT JOIN producto_coleccion pc ON c.idColeccion = pc.idColeccion
        GROUP BY c.idColeccion, c.nombre, c.descripcion, c.banner, c.sexo
        ORDER BY c.idColeccion DESC
    ";

    try {
        $result = $conn->query($sql);
        $colecciones = [];
        while ($row = $result->fetch_assoc()) {
            $colecciones[] = $row;
        }
        echo json_encode($colecciones);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Error al obtener las colecciones: " . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit();
}
?>
