# Cia da Capa - Company Website

This project is the official **website for Cia da Capa**, a company specializing in the **manufacture of bags, backpacks, folders, and other organizational products**. The website serves as both a presentation platform for the company and a client-facing portal for product inquiries and brand information.

## About Cia da Capa

Cia da Capa is a trusted name in custom manufacturing, creating practical and durable products for organizations and individuals. From backpacks to folders, every product is crafted with care, ensuring a balance between style and function.

## Features

-   **React Frontend**: Dynamic, responsive SPA (Single Page Application) built with React.
-   **Laravel API Backend**: Secure API endpoints to manage product data and handle administrative tasks.
-   **Authentication System**: Admin login using Laravel Sanctum for secure access.
-   **Design and Layout**: Uses CSS Grid and Flexbox for flexible and modern layout structures.
-   **Shared Hosting Setup**: Configured for deployment on shared hosting with Apache.

## Folder Structure

-   **Frontend**: React app with SCSS styles for UI/UX design.
-   **API**: Laravel backend to serve API endpoints and handle business logic.

# Getting Started


1.  Clone the repository.
2.  Create a file named **database_config.php** inside **api/config**. Example below.
3.  Run `npm install` in the frontend folder to set up the frontend.
4.  Use `composer install` on the server to set up Laravel.
5.  Configure the environment variables in `.env` for database and API connections.
6.  Build the front-end with **npm run build**. It outputs to /build folder which this project is configured to be able to serve such as https://localhost/build.
7.  On `/api` run the commands (shown below) to create the admin user to access `./manage`
9.  On `/api` run **php artisan serve** to serve the API.
10.  Visit https://localhost/build

### Files you need to manually create
You must create a file named **database_config.php** inside **api/config**. Example:

```
<?php
return [
	'default' => env('DB_CONNECTION', 'mysql'),
		'connections' => [
			'mysql' => [
			'driver' => 'mysql',
			'url' => env('DATABASE_URL'),
			'host' => env('DB_HOST', '127.0.0.1'),
			'port' => env('DB_PORT', '3306'),
			'database' => env('DB_DATABASE', 'ciadacapa'),
			'username' => env('DB_USERNAME', 'root'),
			'password' => env('DB_PASSWORD', ''),
			'unix_socket' => env('DB_SOCKET', ''),
			'charset' => 'utf8mb4',
			'collation' => 'utf8mb4_unicode_ci',
			'prefix' => '',
			'prefix_indexes' => true,
			'strict' => true,
			'engine' => null,
			'options' => extension_loaded('pdo_mysql') ? array_filter([
			PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
			]) : [],
		],
	],
];
```


### Creating admin user
On `/api` run the commands:
```
use Illuminate\Support\Facades\Hash;
$user = new \App\Models\User();
$user->name = 'admin';
$user->email = 'admin@example.com';
$user->password = Hash::make('admin');
$user->save();
exit
```
This creates **admin** for both user and password