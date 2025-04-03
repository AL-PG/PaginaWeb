<?php
session_start();

$conn = new mysqli("localhost", "root", "260403", "Trendify", 3307);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$email = $_POST['email'];
$password = $_POST['password'];

// Seleccionar todos los campos necesarios
$stmt = $conn->prepare("
    SELECT 
        idUsuario, 
        nombre, 
        apaterno, 
        amaterno, 
        email, 
        genero, 
        fechaNacimiento, 
        contrasena 
    FROM Usuario 
    WHERE email = ?
");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();
    
    if (password_verify($password, $usuario['contrasena'])) {
        // Guardar todos los datos en la sesión
        $_SESSION['user'] = [
            'id' => $usuario['idUsuario'],
            'nombre' => $usuario['nombre'],
            'apaterno' => $usuario['apaterno'],
            'amaterno' => $usuario['amaterno'],
            'email' => $usuario['email'],
            'genero' => $usuario['genero'],
            'fechaNacimiento' => $usuario['fechaNacimiento']
        ];
        
        header("Location: ../main/index.php");
        exit();
    } else {
        $_SESSION['error'] = "Contraseña incorrecta";
        header("Location: ../login.html");
    }
} else {
    $_SESSION['error'] = "Usuario no encontrado";
    header("Location: ../login.html");
}

$stmt->close();
$conn->close();
?>