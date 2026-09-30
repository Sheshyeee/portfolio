<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Dark by default: runs before anything paints, so there is no light flash.
             Only an explicit saved "light" choice keeps the light theme. --}}
    <script>
        (function() {
            try {
                if (localStorage.getItem('appearance') !== 'light') {
                    document.documentElement.classList.add('dark');
                }
            } catch (e) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    {{-- Matches --paper / --night in app.css so the first paint is never white --}}
    <style>
        html {
            background-color: #f7f4ec;
        }

        html.dark {
            background-color: #0e0d0b;
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800" rel="stylesheet" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
