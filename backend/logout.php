<?php
session_start();
session_unset();
session_destroy();
header("Location: ../main/index.php"); // Redirige a la página de inicio de sesión
exit();
?>