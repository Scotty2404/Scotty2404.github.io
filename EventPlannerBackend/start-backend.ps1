# --- Configuration ---
# relative path
$projectRoot = $PSScriptRoot
$backendPath=$projectRoot
$sqlFile=Join-Path $backendPath "event_management.sql"
$tempSqlFile = Join-Path $env:TEMP "mysql_init.sql"
$tempPsFile = Join-Path $env:TEMP "run_mysql_setup.ps1"


# --- Load .env file ---
Get-Content "$backendPath\.env" | ForEach-Object {
    if ($_ -match "^\s*([^#].*?)=(.*)$") {
        $envKey = $matches[1].Trim()
        $envValue = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($envKey, $envValue, "Process")
    }
}

$dbName = $env:DB_NAME
$dbUser = $env:DB_USER
$dbPassword = $env:DB_PASSWORD

# --- check for mysql ---
$mysqlPath = Get-Command "mysql.exe" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if(-not $mysqlPath) {
    Write-Error "❌ mysql.exe not found. Please ensure that mysql is installed and provided in PATH"
    Read-Host "Press enter to close"
    exit 1
}

# --- Try initializing MySQL ---
Write-Host "`nStarting MySQL initiation..."
$initResult = & ".\mysql_setup.ps1" -mysqlPath $mysqlPath -dbName $dbName -dbUser $dbUser -dbPassword $dbPassword -sqlFile $sqlFile

if($LASTEXITCODE -eq 0) {
    Write-Host "MySql initiation succeeded."
} else {
    Write-Error "Error while initiating MySQL. Abort."
    Read-Host "Press enter to close"
    exit 1
}

# --- start backend ---
Write-Host "`n Starting Server..."
Set-Location $backendPath
npm install
npm start 
