<?php
session_start();

// Verificar si 'user' está definida en la sesión antes de asignarla
$user = isset($_SESSION['user']) ? $_SESSION['user'] : null;
?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trendify</title>
    <link rel="icon" type="image/png" href="img/isotipo.png">
    <link rel="stylesheet" href="main.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Konkhmer+Sleokchher&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>

<body>


    <div class="top-bar">

    </div>

    <header>
        <div class="logo">
            <img src="img/logo.png" alt="logo">
        </div>
        <nav>
            <ul>
                <li><a href="../productos/productos.html">OFERTAS</a></li>
                <li><a href="../productos/productos.html">MUJER</a></li>
                <li><a href="../productos/productos.html">HOMBRE</a></li>
                <li><a href="../productos/productos.html">LO NUEVO</a></li>
            </ul>
        </nav>
        
        <div class="icons">
            <div class="search-box">
                <input type="text" placeholder="Buscar">
                <i class="fas fa-search"></i>
            </div>
            <i class="fas fa-shopping-cart"></i>
            <div class="user-icon-container">
            <i class="fas fa-user" id="userIcon"></i>
            <div class="user-dropdown" id="userDropdown">
                <?php if (isset($_SESSION['user'])): ?>
                    <a href="#"><i class="far fa-heart"></i> Favoritos</a>
                    <a href="#"><i class="fas fa-shopping-bag"></i> Mis compras</a>
                    <a href="#"><i class="fas fa-credit-card"></i> Método de pago</a>
                    <a href="../perfil/perfil.php"><i class="fas fa-user-circle"></i> Mis datos</a>
                    <div class="dropdown-divider"></div>
                    <a href="../backend/logout.php"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</a>
                <?php else: ?>
                    <a href="../login/login.html"><i class="fas fa-sign-in-alt"></i> Iniciar sesión</a>
                    <a href="../signup/signup.html"><i class="fas fa-user-plus"></i> Registrarse</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
    </header>

    <main>
        <section class="first-section">

            <div class="principal">
                <h1 class="titulo">TRENDIFY</h1>
                <div class="blur-effect"></div>
                <div class="main-div">

                    <div class="info-img">
                        <h2>Nuevo</h2>
                        <h2>Modelo</h2>
                        <p>Descubre nuestra nueva chamarra, diseñada para combinar estilo, comodidad y funcionalidad.
                            Fabricada con materiales de alta calidad, ofrece la protección ideal contra el
                            frío sin sacrificar ligereza y movilidad.</p>
                    </div>

                    <img src="../img/portada.png" alt="Una persona utilizando una prenda de TRENDIFY" class="img-portada">

                    <div class="div-imagen-main">
                        <div>
                            <a href="#">
                                <img src="../img/chaqueta-port.png" alt="chaqueta de TRENDIFY">
                            </a>
                        </div>
                        <span>Comprala ahora!</span>
                    </div>

                </div>
            </div>
        </section>

        <section class="carrusel-main-uno" data-carousel>
            <h1>explora nuestros estilos</h1>

            <ul class="carrusel-img" data-slides>
                <li class="carrusel-img-izquierda">
                    <img src="../img/carrusel2.svg" alt="imagen del carrusel">
                </li>

                <li class="carrusel-img-central" data-active>
                    <img src="../img/carrusel1.svg" alt="imagen del carrusel">
                </li>

                <li class="carrusel-img-derecha">
                    <img src="../img/carrusel3.svg" alt="imagen del carrusel">
                </li>
            </ul>

            <div class="boton-carrusel">
                <button type="button" class="boton-carrusel-direccion" data-carousel-button="prev"><i class="fa-solid fa-arrow-left"></i></button>
                <button type="button" class="boton-carrusel-direccion" data-carousel-button="next"><i class="fa-solid fa-arrow-right"></i></button>

            </div>
        </section>

        <section class="section-conjunto">

            <div class="section-conjunto-uno">
                <a href="#">
                    <img src="../img/conjunto1.svg" alt="">
                </a>
                <div class="div-conjunto-uno">
                    <h2>Conjunto Especial</h2>
                </div>
            </div>

            <div class="section-conjunto-dos">
                <a href="#">
                    <img src="../img/conjunto2.svg" alt="">
                </a>
                <div class="div-conjunto-dos">
                    <h2>Conjunto Especial</h2>
                </div>
            </div>

            <div class="section-conjunto-tres">
                <a href="#">
                    <img src="../img/conjunto3.svg" alt="">
                </a>
                <div class="div-conjunto-tres">
                    <h2>Conjunto Especial</h2>
                </div>
            </div>

        </section>

        <section class="carrusel-main-dos">

            <h1>Lo mas popular</h1>

            <div class="carrusel-dos-img">

                <div>
                    <a href="">
                        <img src="../img/camisa2.svg" alt="imagen del carrusel">
                    </a>
                    <p>Camiseta Y2K para hombre</p>
                    <p>$199.00</p>
                </div>

                <div>
                    <a href="">
                        <img src="../img/Chamarra.svg" alt="imagen del carrusel">
                    </a>
                    <p>Chamarra para hombre</p>
                    <p>$199.00</p>
                </div>

                <div>
                    <a href="">
                        <img src="../img/camisa1.svg" alt="imagen del carrusel">
                    </a>
                    <p>Camiseta Y2K para hombre</p>
                    <p>$199.00</p>
                </div>
            </div>
        </section>

        <section class="section-about_us">

            <img src="../img/img-about_us.svg" alt="Imagen de la sección sobre nosotros">

            <div class="section-about_us-div"> >
                <h1>Sobre nosotros</h1>
                <div class="section-about_us-div_texto">
                    <p>En Trendify la moda es más que ropa: es una forma de expresión. Nacimos con la misión de ofrecer tendencias frescas,
                        auténticas y accesibles para jóvenes que quieren destacar con su propio estilo. </p>
                    <p>
                        Nos inspiramos en la cultura urbana, las últimas tendencias globales y el espíritu libre de nuestra generación.
                        Cada prenda en nuestra tienda está cuidadosamente seleccionada para que puedas combinar comodidad, actitud y originalidad en cada outfit.
                        Creemos en la moda sin reglas, en la creatividad sin límites y en la libertad de ser quien quieras ser.
                    </p>
                    <p>
                        Ya sea que busques un look casual, streetwear o algo más atrevido, aquí encontrarás las piezas perfectas para hacerlo realidad.
                    </p>
                </div>
            </div>
        </section>

        <div class="top-bar"></div>

        <footer class="main-footer">
            <div class="footer-div">
                <div>
                    <div><i class="fa-solid fa-location-dot"></i></div>
                    <span>Av. Madero Poniente #123, Col. Centro, C.P. 58000, Morelia, Michoacán, México.</span>
                </div>

                <div>
                    <div><i class="fa-solid fa-phone"></i></div>
                    <span>Teléfono: 01 800 123 4567</span>
                </div>

                <div>
                    <div><i class="fa-solid fa-envelope"></i></i></div>
                    <span>soporte@trendify.com.mx</span>
                </div>
            </div>

            <div class="footer-div-dos">
                <div>
                    <h2>Siguenos en:</h2>
                    <div class="redes-sociales">
                        <a href="#"><i class="fa-brands fa-facebook"></i></a>
                        <a href="#"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#"><i class="fa-brands fa-pinterest"></i></a>
                    </div>
                </div>

                <div>
                    <p>© [2025] Trendify.
                        Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    </main>
    <script src='script.js'></script>
</body>

</html>