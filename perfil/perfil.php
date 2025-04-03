﻿<?php
session_start();

if (!isset($_SESSION['user'])) {
    header("Location: ../login.html");
    exit();
}

$user = $_SESSION['user'];
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de Usuario</title>
    <link rel="stylesheet" href="estiloperfil.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        header {
            margin-top: 0;
            padding: 10px 20px;
        }

        .perfil-contenedor {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            align-items: flex-start;
        }

        .perfil-contraseña-preferencias {
            display: flex;
            justify-content: space-between;
            width: 100%;
        }

        .perfil-contraseña {
            width: 60%;
        }

        .preferencias {
            width: 35%;
        }
    </style>
</head>

<body>
    <div class="top-bar">
        <a href="#">Ayuda</a>
        <a href="#">Pedidos y devoluciones</a>
        <a href="#">Únete al club</a>
    </div>

    <header>
        <div class="logo">
            <a href="../main/index.php"> <img src="img/logo.png" alt="logo"> </a>
        </div>
        <nav>
            <ul>
                <li href="#">OFERTAS</li>
                <li href="#">MUJER</li>
                <li href="#">HOMBRE</li>
                <li href="#">LO NUEVO</li>
            </ul>
        </nav>
        <div class="icons">
            <div class="search-box">
                <input type="text" placeholder="Buscar">
                <i class="fas fa-search"></i>
            </div>
            <i class="fas fa-shopping-cart"></i>
            <i class="fas fa-user"></i>
        </div>
    </header>

    <section class="perfil">
        <h1>Perfil</h1>
        <div class="perfil-contenedor">
            <div class="perfil-info">
                <h2>Información de la cuenta</h2>
                <div class="campo">
                    <label>Nombre</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['nombre']); ?>">
                </div>
                <div class="campo">
                    <label>Apellido Paterno</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['apaterno']); ?>">
                </div>
                <div class="campo">
                    <label>Apellido Materno</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['amaterno']); ?>">
                </div>
                <div class="campo">
                    <label>Correo electrónico</label>
                    <input type="text" value="<?php echo htmlspecialchars($user['email']); ?>">
                </div>
                <button class="guardar">Guardar</button>
            </div>
            <div class="perfil-contraseña-preferencias">
                <div class="perfil-contraseña">
                    <h2>Contraseña</h2>
                    <div class="campo">
                        <label>Contraseña actual</label>
                        <input type="password">
                    </div>
                    <div class="campo">
                        <label>Nueva contraseña</label>
                        <input type="password">
                    </div>
                    <div class="campo">
                        <label>Repite la contraseña</label>
                        <input type="password">
                    </div>
                    <button class="guardar">Guardar</button>
                </div>
                <div class="preferencias">
                    <h2>Preferencias</h2>
                    <p>¿Para quién compras?</p>
                    <label><input type="checkbox" checked> Para hombre</label>
                    <label><input type="checkbox"> Para mujer</label>
                    <label><input type="checkbox"> Niño</label>
                    <label><input type="checkbox"> Niña</label>
                </div>
            </div>
        </div>
    </section>
</body>

</html>