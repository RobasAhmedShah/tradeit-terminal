param(
  [string]$BuildRoot = "C:\tradit"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$PlayStoreOut = Join-Path $ProjectRoot "release\play-store"

Write-Host "==> Syncing project to $BuildRoot"
if (Test-Path $BuildRoot) {
  try {
    Remove-Item -Recurse -Force $BuildRoot -ErrorAction Stop
  } catch {
    Write-Host "Could not remove $BuildRoot (in use). Reusing existing folder."
  }
}
if (-not (Test-Path $BuildRoot)) { New-Item -ItemType Directory -Force -Path $BuildRoot | Out-Null }
robocopy $ProjectRoot $BuildRoot /E /XD android node_modules android\.cxx android\app\build android\build .expo node_modules\.cache /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE" }

Write-Host "==> Installing dependencies"
Push-Location $BuildRoot
npm install --prefer-offline 2>&1 | Out-Host
Pop-Location

Write-Host "==> Running expo prebuild"
Push-Location $BuildRoot
npx expo prebuild --platform android --no-install | Out-Host
Pop-Location

$buildGradle = Join-Path $BuildRoot "android\app\build.gradle"
$content = Get-Content $buildGradle -Raw

$signingBlock = @'
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            def keystorePropertiesFile = rootProject.file("../credentials/android/keystore.properties")
            def keystoreProperties = new Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
'@

$content = $content -replace '(?s)    signingConfigs \{.*?\n    \}', $signingBlock
$content = $content -replace 'signingConfig signingConfigs\.debug\r?\n            def enableShrinkResources', 'signingConfig signingConfigs.release
            def enableShrinkResources'

Set-Content -Path $buildGradle -Value $content -NoNewline

$gradleProps = Join-Path $BuildRoot "android\gradle.properties"
Add-Content -Path $gradleProps -Value "`nandroid.packagingOptions.pickFirsts=**/libworklets.so"

# Fix keystore path relative to android/app/
$propsPath = Join-Path $BuildRoot "credentials\android\keystore.properties"
$props = Get-Content $propsPath
$props = $props -replace '^storeFile=.*', 'storeFile=../../credentials/android/tradit-upload-keystore.jks'
Set-Content -Path $propsPath -Value $props

Write-Host "==> Building release AAB"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
Push-Location (Join-Path $BuildRoot "android")
.\gradlew.bat bundleRelease
Pop-Location

$aab = Join-Path $BuildRoot "android\app\build\outputs\bundle\release\app-release.aab"
if (-not (Test-Path $aab)) { throw "AAB not found at $aab" }

New-Item -ItemType Directory -Force -Path $PlayStoreOut | Out-Null
$version = (Get-Content (Join-Path $ProjectRoot "app.json") -Raw | ConvertFrom-Json).expo.version
$destAab = Join-Path $PlayStoreOut "tradit2.0-v$version.aab"
Copy-Item $aab $destAab -Force
Copy-Item (Join-Path $ProjectRoot "credentials\android\upload_certificate.pem") (Join-Path $PlayStoreOut "upload_certificate.pem") -Force
Copy-Item (Join-Path $ProjectRoot "credentials\android\KEYSTORE_PASSWORD.txt") (Join-Path $PlayStoreOut "KEYSTORE_PASSWORD.txt") -Force

$sizeMb = [math]::Round((Get-Item $destAab).Length / 1MB, 2)
Write-Host ""
Write-Host "Play Store build complete!"
Write-Host "AAB: $destAab ($sizeMb MB)"
Write-Host "Certificate: $(Join-Path $PlayStoreOut 'upload_certificate.pem')"
