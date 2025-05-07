# init mysql

# paramters
param(
    [string]$mysqlPath,
    [string]$dbName,
    [string]$dbUser,
    [string]$dbPassword,
    [string]$sqlFile,
    [string]$testdbName
)

Write-Host "`n --- MySQL-SetUP ---"

# Get MySQL-Root-password
$rootPassword = Read-Host -AsSecureString -Prompt "Enter MySQL Root Password"
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))

# initialize Database and user if they dont exist
Write-Host "`n Initialize Database and User if neccesarry..."

# check if database already exitsts
$dbExists = & "$mysqlPath" -u root --password=$plainPassword -e "SHOW DATABASES LIKE '$dbName';"
if ($dbExists -match $dbName) {
    Write-Host "`nDatabase '$dbName' already exists."
    $tableExists = & "$mysqlPath" -u root --password=$plainPassword -D $dbName -e "SHOW TABLES LIKE 'event';"
    if($tableExists -match "event") {
        Write-Host  "`nStruckture already exists on Database '$dbName'"
    } else {
        Write-Host "`nInsersting Table structure into '$dbName' ..."
        Get-Content "$sqlFile" | & "$mysqlPath" -u root --password=$plainPassword $dbName
    }
} else {
    Write-Host "`nCreating Database '$dbName' ..."
    & "$mysqlPath" -u root --password=$plainPassword -e "CREATE DATABASE $dbName;"
    Write-Host "`nInsersting Table structure into '$dbName' ..."
    Get-Content "$sqlFile" | & "$mysqlPath" -u root --password=$plainPassword $dbName
}

# check if user already exitsts
$userExists = & "$mysqlPath" -u root --password=$plainPassword -e "SELECT User FROM mysql.user WHERE User = '$dbUser';"
if ($userExists -match $dbUser) {
    Write-Host "`nUser '$dbUser' already exists."
} else {
    Write-Host "`nCreating User '$dbUser' ..."
    & "$mysqlPath" -u root --password=$plainPassword -e "CREATE USER '$dbUser'@'localhost' IDENTIFIED BY '$dbPassword'; GRANT ALL PRIVILEGES ON $dbName.* TO '$dbUser'@'localhost'; FLUSH PRIVILEGES;"
}

# optionally create test Database
$additionalDatabase = Read-Host -Prompt "`n Do you want to create an additional test database for development purposes? [y/n]"
if($additionalDatabase -eq 'y') {
    Write-Host "Initiating additional test-database..."
    # check if database already exitsts
    $dbExists = & "$mysqlPath" -u root --password=$plainPassword -e "SHOW DATABASES LIKE '$testdbName';"
    if ($dbExists -match $testdbName) {
        Write-Host "`nDatabase '$testdbName' already exists."
        $tableExists = & "$mysqlPath" -u root --password=$plainPassword -D $testdbName -e "SHOW TABLES LIKE 'event';"
        if($tableExists -match "event") {
            Write-Host  "`nStruckture already exists on Database '$testdbName'"
        } else {
            Write-Host "`nInsersting Table structure into '$testdbName' ..."
            Get-Content "$sqlFile" | & "$mysqlPath" -u root --password=$plainPassword $testdbName
        }
    } else {
        Write-Host "`nCreating Database '$testdbName' ..."
        & "$mysqlPath" -u root --password=$plainPassword -e "CREATE DATABASE $testdbName;"
        Write-Host "`nInsersting Table structure into '$testdbName' ..."
        Get-Content "$sqlFile" | & "$mysqlPath" -u root --password=$plainPassword $testdbName
    }

    # Grant rights to user for test-database
    Write-Host "`n Grant Privileges to User for test-db"
    & "$mysqlPath" -u root --password=$plainPassword -e "GRANT ALL PRIVILEGES ON $testdbName.* TO '$dbUser'@'localhost'; FLUSH PRIVILEGES;"
} else {
    Write-Host "Skip initiation of additional Database"
}

Write-Host "Finalize"
# finalize
exit 0