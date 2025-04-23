<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'dbConfig.php'; // Include centralized configuration

$conn = getDatabaseConnection(); // Use the function from dbConfig.php

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error); // Log the error for debugging
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Error al conectar con la base de datos."]);
    exit();
}

$query = "
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
    ) AS url_imagen
FROM 
    producto p
JOIN tipo_producto tp ON p.id_tipo = tp.idTipo
JOIN color c ON p.id_color = c.idColor
WHERE p.genero IN ('Hombre', 'Unisex')
ORDER BY p.idProducto;
";

$result = $conn->query($query);

if ($result) {
    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    error_log("Fetched products: " . json_encode($productos)); // Debug: Log fetched products
    echo json_encode($productos);
} else {
    error_log("Query error: " . $conn->error); // Log the error for debugging
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Error al obtener los productos."]);
}

$conn->close();
