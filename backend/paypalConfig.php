<?php
// Credenciales de PayPal Sandbox
define('PAYPAL_CLIENT_ID', 'AbRZrANfmlch8C1v-BcDTBQVa8dsTRnNarMwclCmdbg1f1Sk6Vm60duPcYCdzLqVnKA7xmNGvt3t6PpX');
define('PAYPAL_SECRET', 'EG45h1sY4TyWkvWX3neKSB_kE2Zl057ztCTmSogQMpIyxfeHjO-Srt2EdymEfOAh-a58Z5kFr63VMa2t');

/**
 * Función para obtener el token de acceso desde PayPal.
 */
function getPaypalAccessToken() {
    $url = "https://api.sandbox.paypal.com/v1/oauth2/token";
    $headers = [
        'Accept: application/json',
        'Accept-Language: en_US'
    ];
    $postFields = "grant_type=client_credentials";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_USERPWD, PAYPAL_CLIENT_ID . ":" . PAYPAL_SECRET);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        curl_close($ch);
        return null;
    }
    curl_close($ch);
    $data = json_decode($response, true);
    return $data['access_token'] ?? null;
}
?>
