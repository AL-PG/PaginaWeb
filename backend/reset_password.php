<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getDatabaseConnection();
$data = json_decode(file_get_contents("php://input"), true);

// Verifica si los datos requeridos están presentes
if (empty($data['email']) || empty($data['codigo']) || empty($data['nuevaContrasena'])) {
    http_response_code(400);
    echo json_encode(["error" => "Datos incompletos"]);
    exit();
}

$email = $data['email'];
$codigo = $data['codigo'];
$nuevaContrasena = $data['nuevaContrasena'];

// Verificar código en la base de datos
$stmt = $conn->prepare("
    SELECT * FROM CodigosRecuperacion 
    WHERE email = ? 
    AND codigo = ? 
    AND usado = 0 
    AND fecha_expiracion > NOW()
");
$stmt->bind_param("ss", $email, $codigo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode([
        "error" => "Código inválido, ya fue usado o ha expirado",
        "debug" => [
            "email" => $email,
            "codigo" => $codigo,
            "hora_actual" => date('Y-m-d H:i:s')
        ]
    ]);
    exit();
}

// Si llegamos aquí, el código es válido
$row = $result->fetch_assoc();

// Actualizar contraseña del usuario
$hash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);
$updateUser = $conn->prepare("UPDATE Usuario SET contrasena = ? WHERE email = ?");
$updateUser->bind_param("ss", $hash, $email);
$updateUser->execute();

// Marcar código como usado
$updateCode = $conn->prepare("UPDATE CodigosRecuperacion SET usado = 1 WHERE id = ?");
$updateCode->bind_param("i", $row['id']);
$updateCode->execute();

http_response_code(200);
echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente"]);

$conn->close();
?>