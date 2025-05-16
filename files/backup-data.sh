#!/bin/bash

target_dir="/mnt/efs"

mkdir -p "$target_dir/config"
tar -cf - -C "/var/www/html/config" . | tar -xf - -C "$target_dir/config"

mkdir -p "$target_dir/misc"
tar -cf - -C "/var/www/html/misc" . | tar -xf - -C "$target_dir/misc"

mkdir -p "$target_dir/js"
tar -cf - -C "/var/www/html/js" . | tar -xf - -C "$target_dir/js"

cp -a "/var/www/html/matomo.js" "$target_dir/matomo.js"
cp -a "/var/www/html/piwik.js" "$target_dir/piwik.js"
