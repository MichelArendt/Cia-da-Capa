# Navigate to the project directory (optional, adjust path as needed)
$ProjectPath = "D:\work\sites\cia_da_capa\xampp_8.2.12\htdocs\frontend"
Set-Location -Path $ProjectPath

# Run npm watch
Write-Host "🚀 Starting npm watch..."
npm run watch

# Keep the PowerShell window open (optional)
Read-Host "Press Enter to exit..."
