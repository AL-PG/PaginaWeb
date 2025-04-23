<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();

if (isset($_SESSION['user'])) {
    echo json_encode(["user" => $_SESSION['user']]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Usuario no autenticado"]);
}
?>
