# 🚀 Laravel Cloud Deployment Guide

## 📋 Pre-Deployment Checklist

✅ **Files Required for Deployment:**
- `index.html` (main game file)
- `game.js` (game logic)
- `phaser.min.js` (local Phaser.js library)
- `assets/images/artisan.jpg`
- `assets/images/pivot.jpg`
- `README.md` (documentation)
- `bootstrap/cache/packages.php` (pre-generated for read-only deployment)
- `bootstrap/cache/services.php` (pre-generated for read-only deployment)

## 🔧 Laravel Cloud Read-Only Filesystem Fix

### **Issue:** Laravel Cloud has a read-only filesystem that prevents writing cache files during deployment.

### **Solution:** Pre-generate cache files locally and commit them to the repository.

✅ **Fixed with:**
1. **Modified `composer.json`**: Removed `package:discover` from post-autoload-dump
2. **Updated `.gitignore`**: Allow essential cache files to be committed
3. **Pre-generated cache**: Run `php artisan package:discover` locally
4. **Deployment script**: Created `deploy.sh` for easy preparation

## 🌐 Laravel Cloud Deployment Steps

### Method 1: Git Deployment (Recommended)

1. **Prepare for Deployment**:
   ```bash
   # Run the deployment script
   ./deploy.sh
   
   # Or manually:
   php artisan package:discover --ansi
   git add bootstrap/cache/packages.php bootstrap/cache/services.php
   git commit -m "Update cache for read-only deployment"
   ```

2. **Push to GitHub/GitLab**:
   ```bash
   git push origin main
   ```

3. **Deploy on Laravel Cloud**:
   - Trigger redeploy in Laravel Cloud dashboard
   - The build will now succeed without cache write errors

### Method 2: Direct Upload

1. **Create Deployment Package**:
   ```bash
   # Run deployment prep first
   ./deploy.sh
   
   # Create package
   zip -r artisan-pivot-deploy.zip . -x "*.git*" "vendor/*" "node_modules/*"
   ```

2. **Upload to Laravel Cloud**:
   - Upload the zip file
   - Extract in web root

## 🔍 Troubleshooting Laravel Cloud Specific Issues

### Error: "bootstrap/cache directory must be present and writable"
**Cause:** Laravel Cloud read-only filesystem
**Solution:** ✅ Fixed with pre-generated cache files

### Error: "Package discovery failed"
**Cause:** Can't write package manifest on read-only filesystem
**Solution:** ✅ Removed from composer scripts, pre-generated locally

### Error: "Config cache not writable"
**Cause:** Read-only filesystem prevents cache generation
**Solution:** Use array-based cache in production (see `.laravel-cloud.yml`)

## 📱 Laravel Cloud Configuration

The `.laravel-cloud.yml` file handles read-only deployment:

```yaml
name: artisan-pivot

build:
  commands:
    - composer install --no-dev --optimize-autoloader
    - php artisan package:discover --ansi || true

environment:
  CACHE_DRIVER: array
  SESSION_DRIVER: array
  QUEUE_CONNECTION: sync
```

## 🎯 Laravel Cloud Specific Tips

1. **Read-Only Filesystem**: Use array/memory-based drivers for cache/sessions
2. **Pre-generate Cache**: Commit essential cache files to repository
3. **Error Handling**: Use `|| true` for commands that might fail on read-only filesystem
4. **Asset Serving**: Static files in `public/` are served automatically
5. **Environment**: Configuration via `.laravel-cloud.yml` and environment variables

## 🚨 If Deployment Still Fails

1. **Check Build Logs**:
   - Look for cache/write permission errors
   - Verify all required cache files are committed

2. **Verify Cache Files**:
   ```bash
   git ls-files | grep bootstrap/cache
   # Should show packages.php and services.php
   ```

3. **Test Locally**:
   ```bash
   ./deploy.sh
   # Should complete without errors
   ```

4. **Clear Laravel Cloud Cache**:
   - Use Laravel Cloud dashboard to clear deployment cache
   - Try fresh deployment

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ No "bootstrap/cache" errors in build logs
- ✅ Game loads at your Laravel Cloud URL
- ✅ All vaporwave styling appears correctly
- ✅ Game mechanics work (drag, connect, timer)
- ✅ No console errors in browser developer tools

---

**🚀 Ready to deploy your neural matrix crafting experience to production!**