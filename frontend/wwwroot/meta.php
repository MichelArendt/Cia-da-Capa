<?php
// meta.php: Injects dynamic meta tags into SPA index.html for social sharing

file_put_contents(__DIR__ . '/meta-debug.log', "meta.php HIT at " . date('c') . "\n", FILE_APPEND);
echo "META PHP WAS HIT";

file_put_contents(__DIR__ . '/meta-debug.log', print_r($_GET, true), FILE_APPEND);

// Get parameters from URL
$folder = $_GET['folder'] ?? 'build';        // e.g., 'build', 'novo', etc.
$type   = $_GET['type']   ?? null;           // e.g., 'produto'
$id     = $_GET['id']     ?? null;           // product ID

// Path to the correct index.html for this SPA folder
$htmlPath = __DIR__ . "/$folder/index.html";

if (!file_exists($htmlPath)) {
    http_response_code(404);
    echo "index.html not found for folder: $htmlPath";
    file_put_contents(__DIR__ . '/meta-debug.log', "htmlPath: $htmlPath\n", FILE_APPEND);
    exit;
}

// Load SPA template HTML
$html = file_get_contents($htmlPath);

// Default meta tags (used if nothing is injected)
$meta = '';

// Build base URL dynamically
$host = $_SERVER['HTTP_HOST'];
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';

// Inject meta tags for product pages
if ($type === 'produto' && $id) {
    // Fetch product info from API (adjust endpoint as needed)
    $apiUrl = "$protocol://$host/api/public/products/$id";
    $product = @json_decode(@file_get_contents($apiUrl), true);

    if ($product && !empty($product['title'])) {
        $meta = buildMetaTags([
            'type'        => 'product',
            'url'         => "$protocol://$host/$folder/produto/$id",
            'title'       => "{$product['title']} - Cia da Capa",
            'description' => $product['short_description'] ?? '',
            'image'       => $product['image_url'] ?? "$protocol://$host/$folder/images/default.jpg"
        ]);
    } else {
        $meta = buildMetaTags([
            'type'        => 'website',
            'url'         => "$protocol://$host/$folder/produto/$id",
            'title'       => "Produto não encontrado - Cia da Capa",
            'description' => "Este produto não está disponível.",
            'image'       => "$protocol://$host/$folder/images/default.jpg"
        ]);
    }
}

// --- Inject meta tags (replace <!-- META_INJECT --> in your index.html) ---
$html = str_replace('<!-- META_INJECT -->', $meta, $html);

// Output final HTML
header('Content-Type: text/html; charset=utf-8');
echo $html;


// --- Helper: Build Meta Tags ---
function buildMetaTags($data) {
    $type  = htmlspecialchars($data['type'] ?? 'website');
    $url   = htmlspecialchars($data['url'] ?? '');
    $title = htmlspecialchars($data['title'] ?? '');
    $desc  = htmlspecialchars($data['description'] ?? '');
    $image = htmlspecialchars($data['image'] ?? '');

    return <<<HTML
    <meta property="og:type" content="$type">
    <meta property="og:url" content="$url">
    <meta property="og:title" content="$title">
    <meta property="og:description" content="$desc">
    <meta property="og:image" content="$image">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="$url">
    <meta name="twitter:title" content="$title">
    <meta name="twitter:description" content="$desc">
    <meta name="twitter:image" content="$image">
HTML;
}
