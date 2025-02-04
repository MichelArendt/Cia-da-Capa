# Cia da Capa - Company Website

This project is the official **website for Cia da Capa**, a company specializing in the **manufacture of bags, backpacks, folders, and other organizational products**. The website serves as both a presentation platform for the company and a client-facing portal for product inquiries and brand information.

## About Cia da Capa

Cia da Capa is a trusted name in custom manufacturing, creating practical and durable products for organizations and individuals. From backpacks to folders, every product is crafted with care, ensuring a balance between style and function.

## Project Structure

- **/api/**: Contains the PHP backend code using FlightPHP for API routing.
- **/frontend/**: Contains the .NET 9 Blazor WASM frontend code, including SCSS files.
- **/build/**: Contains the build output for deployment.

## Dependencies
- **Frontend**: .NET 9 SDK, Node.js, and NPM for SCSS compilation.
- **Backend**: MySQL and PHP 8+.

# Getting Started

## 1. Clone the repository.
Clone the repository to your local machine:

```bash
git clone https://github.com/MichelArendt/Cia-da-Capa.git
```

## 2. Create a file named **database.php** inside **/api/flight/config/**. Example below:


```php
<?php
return [
    'host' => 'localhost',
    'dbname' => 'mydb',
    'username' => 'root',
    'password' => 'mypw',
    'charset' => 'utf8'
];

```
Replace the values (**mydb**, **root**, **mypw**) with your actual database credentials.

## 3. Launch Options

### 3.1. Deploy the App (OPTION 1)
To deploy the application, navigate to the `/frontend/` directory and run the following command:

```bash
dotnet publish -c Debug /p:NoIncremental=true /p:PublishTrimmed=false
```

This will publish the app in Debug mode without incremental compilation or trimming. It wil also flatten the output to deploy it into a single folder.

If you wish to change the deployment directory not to be **/build/** change:

#### - frontend/wwwroot/index.html

Either remove or change base at **head** tag:

```html
<base href="/build/" />
```

## Modifying SCSS (Optional)

### Frontend SCSS Autocompile
If you are modifying the frontend and working with `.SCSS` files, run the following NPM command under the `/frontend/` directory to automatically compile changes and replace the files on the build folder:

```bash
npm run watch
```

The command above will also run BrowserSync on http://localhost:3000, so you can connect through that and modify the SCSS to your liking with hot-reload.

#### - frontend/frontend.csproj

Also change **PublishDir** to match the directory of **index.html** (step above):

```xml
<PublishDir>..\build\</PublishDir>
```


### 3.2 Run on .NET Development Server (OPTION 1)
To run the app on the .NET development server, use the following command:

```bash
dotnet run
```