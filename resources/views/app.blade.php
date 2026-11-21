<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Wishes.com - Gifts For Every Moment</title>
        <link rel="icon" type="image/png" href="/logo.png">
        <link rel="shortcut icon" href="/logo.png">
        <link rel="apple-touch-icon" href="/logo.png">

        <!-- PWA Meta Tags -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#dc2626">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

        <!-- Vite Scripts -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        <meta name="google-site-verification" content="SGMhydo1mWAsqqgt675gg8Rh8SXeGA9qVS3coZhUnQU" />
    </head>
    <body class="antialiased">
        <div id="app"></div>

        <script>
            if ('serviceWorker' in navigator && !window.location.pathname.startsWith('/admin')) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }).catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }
        </script>
    </body>
</html>
