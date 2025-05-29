$indexHtmlPath = "$PSScriptRoot/../build/index.html"

# Generate a Unix timestamp for the version
$version = [int][double]::Parse((Get-Date -UFormat %s))

# Load index.html
$html = Get-Content $indexHtmlPath -Raw

# Replace references to .js and .css files
$html = $html -replace '(?<=(href|src)="[^"]+\.(js|css))(\?v=\d+)?(?=")', "?v=$version"

# Save updated file
$html | Set-Content $indexHtmlPath

Write-Output "VERSIONING index.html with version: $version"

# Also write version.json for Blazor
$versionJsonPath = "$PSScriptRoot/../frontend/wwwroot/version.json"
"{`"CssVersion`": `"$version`"}" | Set-Content $versionJsonPath -Encoding UTF8

Write-Output "Wrote version.json with version: $version"