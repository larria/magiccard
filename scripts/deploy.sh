#!/usr/bin/env bash
# 手动部署 dist 到 gh-pages 分支。
# gh-pages 包在处理大量文件（4万+）时会因 spawn E2BIG 失败，故改用直接 git 推送。
set -e

cd "$(dirname "$0")/.."

# 1. 构建（GitHub Pages 子路径）
echo "==> 构建（BASE_PATH=/magiccard/）..."
BASE_PATH=/magiccard/ npm run build

# 2. 在 dist 内初始化独立仓库并提交
echo "==> 准备 gh-pages 提交..."
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git config user.name "larria"
git config user.email "larria@users.noreply.github.com"
git commit -q -m "deploy: PWA build to gh-pages"

# 3. 推送到 origin 的 gh-pages 分支
echo "==> 推送 gh-pages 分支..."
git remote add origin https://github.com/larria/magiccard.git
git push -f origin gh-pages

# 4. 清理
rm -rf .git
cd ..
echo "==> 部署完成。GitHub Pages 将在 https://larria.github.io/magiccard/ 生效（首次需在仓库 Settings → Pages 选择 gh-pages 分支）。"
