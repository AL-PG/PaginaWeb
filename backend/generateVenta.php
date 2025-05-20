<?php
require_once 'dbConfig.php';
require_once 'paypalConfig.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Función de log para debug
function log_debug($mensaje) {
    $fecha = date('Y-m-d H:i:s');
    file_put_contents('log_ventas.txt', "[$fecha] $mensaje\n", FILE_APPEND);
}

log_debug("Inicio del script insertVenta.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    log_debug("Datos recibidos: " . json_encode($data));

    if (empty($data['idUsuario']) || empty($data['metodo_pago_id'])) {
        log_debug("Faltan parámetros obligatorios");
        http_response_code(400);
        echo json_encode(["error" => "Los parámetros 'idUsuario' y 'metodo_pago_id' son requeridos."]);
        exit();
    }

    $idUsuario = intval($data['idUsuario']);
    $metodo_pago_id = intval($data['metodo_pago_id']);

    $conn = getDatabaseConnection();

    try {
        $conn->begin_transaction();
        log_debug("Transacción iniciada para usuario ID: $idUsuario");

        // Obtener productos del carrito
        $stmt = $conn->prepare("SELECT c.idProducto, c.cantidad, p.precio FROM Carrito c JOIN producto p ON c.idProducto = p.idProducto WHERE c.idUsuario = ?");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $result = $stmt->get_result();

        log_debug("Productos en carrito: " . $result->num_rows);

        if ($result->num_rows === 0) {
            log_debug("El carrito está vacío");
            http_response_code(400);
            echo json_encode(["error" => "El carrito está vacío."]);
            exit();
        }

        $total = 0;
        $items = [];
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
            $total += $row['cantidad'] * $row['precio'];
        }
        $stmt->close();

        // Sumar el costo de envío (99.00)
        $envio = 99.00;
        $total += $envio;

        log_debug("Total calculado (incluyendo envío): $total");
        log_debug("Items: " . json_encode($items));

        // Insertar en venta
        $stmt = $conn->prepare("INSERT INTO venta (idUsuario, total, metodo_pago_id) VALUES (?, ?, ?)");
        $stmt->bind_param("idi", $idUsuario, $total, $metodo_pago_id);
        $stmt->execute();
        $ventaId = $stmt->insert_id;
        $stmt->close();

        log_debug("Venta insertada con ID: $ventaId");

        // Insertar productos en detalle_venta
        $stmt = $conn->prepare("INSERT INTO detalle_venta (idVenta, idProducto, cantidad, precioUnitario) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $stmt->bind_param("iiid", $ventaId, $item['idProducto'], $item['cantidad'], $item['precio']);
            $stmt->execute();
        }
        $stmt->close();

        log_debug("Detalle de venta insertado para venta ID: $ventaId");

        // Eliminar carrito
        $stmt = $conn->prepare("DELETE FROM Carrito WHERE idUsuario = ?");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $stmt->close();

        log_debug("Carrito eliminado para usuario ID: $idUsuario");

        $conn->commit();

        log_debug("Venta registrada exitosamente.");

        echo json_encode(["success" => true, "ventaId" => $ventaId, "total" => $total]);
        exit();
    } catch (mysqli_sql_exception $e) {
        $conn->rollback();
        log_debug("Error en la transacción: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => "Error al generar la venta: " . $e->getMessage()]);
        exit();
    } finally {
        $conn->close();
        log_debug("Conexión cerrada.");
    }
} else {
    log_debug("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."]);
    exit();
}
?>
