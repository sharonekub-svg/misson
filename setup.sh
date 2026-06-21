#!/usr/bin/env bash
#
# One-time setup: generate the native Android/iOS/web folders around the app
# code, then fetch packages. Safe to re-run — it preserves lib/ and pubspec.yaml.
#
set -e

if ! command -v flutter >/dev/null 2>&1; then
  echo "❌ Flutter isn't installed yet."
  echo "   Install it first: https://docs.flutter.dev/get-started/install"
  exit 1
fi

echo "📦 Backing up app code..."
rm -rf .upm_backup
mkdir -p .upm_backup
cp pubspec.yaml .upm_backup/pubspec.yaml
cp -r lib .upm_backup/lib

echo "🛠  Generating native platform folders..."
flutter create --org com.upmission --project-name up_mission \
  --platforms=android,ios,web .

echo "♻️  Restoring app code..."
cp .upm_backup/pubspec.yaml pubspec.yaml
rm -rf lib
cp -r .upm_backup/lib lib
rm -rf .upm_backup

echo "⬇️  Fetching packages..."
flutter pub get

echo ""
echo "✅ Done! Now run the app:"
echo "   flutter run        # on a plugged-in phone or simulator"
