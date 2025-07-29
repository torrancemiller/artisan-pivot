#!/bin/bash

# Laravel Cloud Deployment Script
# This script prepares the application for read-only deployment

echo "🚀 Preparing Artisan Pivot for Laravel Cloud deployment..."

# Clear any existing cache to start fresh
echo "Clearing existing cache..."
php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

# Generate package discovery (needed for read-only filesystem)
echo "Generating package discovery cache..."
php artisan package:discover --ansi

# Pre-generate Laravel caches for production
echo "Pre-generating production caches..."
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true

# Optimize composer autoloader
echo "Optimizing composer autoloader..."
composer dump-autoload --optimize --no-dev

echo "✅ Deployment preparation complete!"
echo "📦 Ready to deploy to Laravel Cloud" 