#!/bin/sh
# Setup
bundle install
npm install
# Build JS
./node_modules/.bin/gulp
# Build HTML
JEKYLL_ENV=production bundle exec jekyll build
# Localization
./node_modules/.bin/yaml2json _locales/ --recursive --save
mkdir -p _site/locales
cp ./_locales/*.json _site/locales/
# Build the one page app
npm run build
