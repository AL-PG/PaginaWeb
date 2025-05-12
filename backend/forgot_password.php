<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'dbConfig.php';
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = getDatabaseConnection();

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

// Verificar si el email existe
$stmt = $conn->prepare("SELECT idUsuario, nombre FROM Usuario WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Email no registrado"]);
    exit();
}

$usuario = $result->fetch_assoc();
$codigo = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$expiracion = date('Y-m-d H:i:s', strtotime('+30 minutes'));
$token = bin2hex(random_bytes(32));

// Eliminar códigos previos
$conn->query("DELETE FROM CodigosRecuperacion WHERE email = '$email'");

// Insertar nuevo código
$stmt = $conn->prepare("
    INSERT INTO CodigosRecuperacion 
    (email, codigo, fecha_expiracion, token) 
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("ssss", $email, $codigo, $expiracion, $token);
$stmt->execute();

// Enviar email con PHPMailer
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'sistema.sgiproject@gmail.com';
    $mail->Password = 'xhvy winj fzko izaa';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('sistema.sgiproject@gmail.com', 'Trendify');
    $mail->addAddress($email, $usuario['nombre']);
    
    $mail->isHTML(true);
    $mail->Subject = 'Restablece tu contraseña en Trendify';
    
    // HTML mejorado con estilos inline
    $mail->Body = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Restablece tu contrasenia en Trendify</title>
    <style type="text/css">
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap");
        @font-face {
            font-family: "Konkhmer Sleokchher";
            src: url("https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&display=swap");
        }
    </style>
</head>
<body style="font-family: \'Montserrat\', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f8f8;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
                <h1 style="color: #333; font-size: 24px; margin: 0; font-family: \'Konkhmer Sleokchher\', sans-serif; font-weight: 400;">TRENDIFY</h1>
            </td>
        </tr>
        
        <!-- Contenido principal -->
        <tr>
            <td style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="color: #333; font-size: 20px; margin-top: 0; font-weight: 500;">Hola '.htmlspecialchars($usuario['nombre'], ENT_QUOTES, 'UTF-8').',</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Hemos recibido una solicitud para restablecer tu contraseña en Trendify.
                </p>
                
                <!-- Código de verificación -->
                <div style="margin: 30px 0; text-align: center;">
                    <p style="color: #555; font-size: 16px; margin-bottom: 10px;">Tu código de verificación es:</p>
                    <div style="display: inline-block; padding: 15px 30px; background-color: #f0f0f0; border-radius: 50px; font-size: 24px; font-weight: 500; color: #c08b5c; font-family: \'Konkhmer Sleokchher\', sans-serif;">
                        '.$codigo.'
                    </div>
                </div>
                
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Este código es válido por <strong>30 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje.
                </p>
                
                <!-- Botón -->
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="http://localhost:5173/recuperar?token='.$token.'" style="display: inline-block; padding: 12px 30px; background-color: #c08b5c; color: #ffffff; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 500; font-family: \'Montserrat\', sans-serif;">Restablecer contraseña</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f0f0f0; font-size: 14px; color: #777;">
                <p style="margin: 0;">© '.date('Y').' Trendify. Todos los derechos reservados.</p>
                <p style="margin: 10px 0 0 0;">Este es un mensaje automático, por favor no respondas a este correo.</p>
            </td>
        </tr>
    </table>
</body>
</html>
';

// Versión alternativa en texto plano con codificación correcta
$mail->AltBody = "Hola ".htmlspecialchars($usuario['nombre'], ENT_QUOTES, 'UTF-8').",\n\n"
               . "Para restablecer tu contraseña en Trendify, usa el siguiente código:\n\n"
               . $codigo . "\n\n"
               . "Este código es válido por 30 minutos.\n\n"
               . "Si no solicitaste este cambio, ignora este mensaje.\n\n"
               . "Saludos,\nEl equipo de Trendify";
    
    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado con éxito"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al enviar el correo", "debug" => $mail->ErrorInfo]);
}
?>