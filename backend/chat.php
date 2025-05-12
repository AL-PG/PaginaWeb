<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include 'dbConfig.php'; // Incluye la función getDatabaseConnection()

// API Key de OpenRouter
$apiKey = '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';

// Conexión a la BD
$conexion = getDatabaseConnection();

// Leer input
$data    = json_decode(file_get_contents('php://input'), true);
$message = strtolower(trim($data['message'] ?? ''));

// Debug array
$debug = [];

// 1) Palabras clave para detectar si es una recomendación
$keywords = ['recomiéndame', 'recomendame', 'sugerencia', 'sugieres', 'muéstrame', 'tienes', 'ofreces', 'quiero', 'busco'];

$isReco = false;
foreach ($keywords as $kw) {
    if (strpos($message, $kw) !== false) {
        $isReco = true;
        $debug[] = "Keyword detected: $kw";
        break;
    }
}

// 2) Detectar tipo y color
$tipos = ['camiseta', 'pantalón', 'falda', 'blusa', 'chaqueta'];
$colores = ['blanco', 'negro', 'rojo', 'azul', 'verde', 'amarillo', 'rosa'];

$tipoFiltro = null;
$colorFiltro = null;

foreach ($tipos as $t) {
    if (strpos($message, $t) !== false) {
        $tipoFiltro = $t;
        $debug[] = "Tipo detected: $t";
        break;
    }
}

foreach ($colores as $c) {
    if (strpos($message, $c) !== false) {
        $colorFiltro = $c;
        $debug[] = "Color detected: $c";
        break;
    }
}

if ($isReco) {
    // 3) Consulta productos
    $sql = "SELECT 
                p.idProducto, 
                p.nombre AS nombre_producto, 
                p.precio, 
                p.genero, 
                tp.nombre AS tipo, 
                c.nombre AS color, 
                MIN(pi.url_imagen) AS url_imagen
            FROM producto p
            INNER JOIN tipo_producto tp ON p.id_tipo = tp.idTipo
            INNER JOIN color c ON p.id_color = c.idColor
            LEFT JOIN producto_imagenes pi ON p.idProducto = pi.idProducto
            WHERE 1";

    if ($tipoFiltro) {
        $sql .= " AND tp.nombre LIKE '%$tipoFiltro%'";
    }
    if ($colorFiltro) {
        $sql .= " AND c.nombre LIKE '%$colorFiltro%'";
    }

    $sql .= " GROUP BY p.idProducto, p.nombre, p.precio, p.genero, tp.nombre, c.nombre
              ORDER BY RAND()
              LIMIT 3";

    $debug[] = "Executing SQL: $sql";
    $result = mysqli_query($conexion, $sql);
    if (!$result) {
        $err = mysqli_error($conexion);
        error_log("MySQL error: $err");
        $debug[] = "MySQL error: $err";
        echo json_encode(['response' => 'Lo siento, error al consultar la base de datos.', 'productos' => [], 'debug' => $debug]);
        exit;
    }

    $productos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $productos[] = $row;
}
$debug[] = "Productos fetched: " . count($productos);

// Responder según el número de productos encontrados
if (count($productos) > 0) {
    $mensajeRespuesta = "¡Aquí tienes algunas opciones basadas en tu búsqueda! 😊\n";
    
    foreach ($productos as $producto) {
        // Personalización dependiendo del tipo y genero del producto
        $mensajeRespuesta .= "\n🔹 **" . $producto['nombre_producto'] . "** - MXN " . $producto['precio'] . " (Color: " . $producto['color'] . ")";

        // Agregar una recomendación según el tipo o genero
        if ($producto['genero'] === 'Hombre') {
            $mensajeRespuesta .= "\n🎩 ¡Perfecto para combinar con unos jeans y unas zapatillas deportivas!";
        } elseif ($producto['genero'] === 'Mujer') {
            $mensajeRespuesta .= "\n👗 Ideal para un look casual con falda o jeans. ¡Te hará lucir increíble!";
        }

        // Sugerencia para camisetas (si el producto es una camiseta, por ejemplo)
        if (strpos(strtolower($producto['tipo']), 'camiseta') !== false) {
            $mensajeRespuesta .= "\n🌸 Esta camiseta es ideal para días soleados, ¡una prenda básica y cómoda!";
        }
    }

    // Mensaje final
    $mensajeRespuesta .= "\n\n¿Qué opinas? Si deseas ver más opciones o necesitas ayuda, ¡solo dímelo! 👚✨";

    $debug[] = "Response message: $mensajeRespuesta";

    // Responder con los productos y el mensaje dinámico
    echo json_encode([
        'response'  => $mensajeRespuesta,
        'productos' => $productos,
        'debug'     => $debug
    ]);
    exit;
} else {
    // Si no se encontraron productos
    $debug[] = "No products found";
    echo json_encode([
        'response' => 'Lo siento, no encontré productos que coincidan con tu búsqueda.',
        'productos' => [],
        'debug'     => $debug
    ]);
    exit;
}
}

// Caso general: mensaje normal al modelo
$debug[] = "General GPT call with message: $message";
$gptReply = llamarOpenRouter($message);
echo json_encode(['response' => $gptReply, 'debug' => $debug]);
exit;

/**
 * Llama a OpenRouter completions endpoint
 */
function llamarOpenRouter($mensaje) {
    global $apiKey;

    $prompt = 
        "Eres un asistente para una tienda de ropa llamada Trendify. " .
        "Hablas en español y ayudas a los clientes a encontrar el outfit perfecto basado en sus preferencias.\n\n" .
        "Cliente: $mensaje\n" .
        "Asistente:";

    $postData = json_encode([
        'model'       => 'deepseek/deepseek-v3-base:free',
        'prompt'      => $prompt,
        'temperature' => 0.7,
        'max_tokens'  => 120,
        'stop'        => ["\nCliente:"]
    ]);

    $url = 'https://openrouter.ai/api/v1/completions';

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $postData,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => 30,
    ]);

    $result   = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        error_log("OpenRouter CURL error: $curlErr");
        return "Lo siento, hubo un problema de conexión: $curlErr";
    }

    $data = json_decode($result, true);
    if ($httpCode !== 200 || isset($data['error'])) {
        $msg = $data['error']['message'] ?? "HTTP $httpCode";
        error_log("OpenRouter API error: $msg — Response: $result");
        return "Lo siento, la API respondió con un error: $msg";
    }

    $text = $data['choices'][0]['text'] ?? '';
    return trim($text) ?: 'Lo siento, la respuesta no tenía contenido.';
}
?>
