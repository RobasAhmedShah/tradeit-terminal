param(
  [string]$BuildRoot = "C:\tradit-build"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReleaseOut = Join-Path $ProjectRoot "release"

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
npm install --legacy-peer-deps 2>&1 | Out-Host
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
                storeFile rootProject.file("../credentials/android/tradit-upload-keystore.jks")
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
if (-not (Select-String -Path $gradleProps -Pattern "libworklets" -Quiet)) {
  Add-Content -Path $gradleProps -Value "`nandroid.packagingOptions.pickFirsts=**/libworklets.so"
}

$propsPath = Join-Path $BuildRoot "credentials\android\keystore.properties"
if (Test-Path $propsPath) {
  $props = Get-Content $propsPath
  $props = $props -replace '^storeFile=.*', 'storeFile=../../credentials/android/tradit-upload-keystore.jks'
  Set-Content -Path $propsPath -Value $props
}

Write-Host "==> Copying signing credentials"
xcopy (Join-Path $ProjectRoot "credentials") (Join-Path $BuildRoot "credentials\") /E /I /Y | Out-Null

Write-Host "==> Building release APK"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
Push-Location (Join-Path $BuildRoot "android")
.\gradlew.bat assembleRelease
Pop-Location

$apk = Join-Path $BuildRoot "android\app\build\outputs\apk\release\app-release.apk"
if (-not (Test-Path $apk)) { throw "APK not found at $apk" }

New-Item -ItemType Directory -Force -Path $ReleaseOut | Out-Null
$version = (Get-Content (Join-Path $ProjectRoot "app.json") -Raw | ConvertFrom-Json).expo.version
$destApk = Join-Path $ReleaseOut "tradit2.0-v$version.apk"
Copy-Item $apk $destApk -Force

$sizeMb = [math]::Round((Get-Item $destApk).Length / 1MB, 2)
Write-Host ""
Write-Host "APK build complete!"
Write-Host "APK: $destApk ($sizeMb MB)"
