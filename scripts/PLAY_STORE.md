# Play Store release build (Windows)

Builds a signed Android App Bundle (`.aab`) for Google Play upload.

## Prerequisites

- Java JDK 17+
- Android SDK (`ANDROID_HOME` set)
- Project copied to a short path (`C:\tradit`) to avoid Windows path-length errors

## Usage

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-play-store.ps1
```

## Output

- `release/play-store/tradit2.0-v1.0.0.aab` — upload this to Google Play Console
- `release/play-store/upload_certificate.pem` — upload key certificate (first-time setup)
- `credentials/android/` — keystore and passwords (keep private, never commit)

## Google Play Console (first upload)

1. Create app at [play.google.com/console](https://play.google.com/console)
2. Use package name: `com.tradit.tradit20`
3. When asked about app signing, choose **Google Play App Signing**
4. Upload `upload_certificate.pem` as your upload key certificate
5. Upload the `.aab` under **Release > Production** (or Internal testing first)
6. Complete store listing, privacy policy, content rating, and screenshots

## Future updates

Increment `versionCode` in `app.json` before each Play Store upload, then rebuild.
