<?php
function getDatabaseConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "260403";
    $dbname = "Trendify";
    $port = 3307;

    $conn = new mysqli($servername, $username, $password, $dbname, $port);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Error de conexión a la base de datos: " . $conn->connect_error]);
        exit();
    }

    return $conn;
}
?>
