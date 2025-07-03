#!/bin/bash

# Define source directories
source_dirs=(
    "/var/www/html/config"
    "/var/www/html/misc"
    "/var/www/html/js"
)

# Define target directory
target_dir="/mnt/efs/backups"

# Loop through each source directory and duplicate it to the target directory
for src in "${source_dirs[@]}"; do
    # Extract the directory name from the source path
    dir_name=$(basename "$src")
    
    # Create the target directory if it doesn't exist
    mkdir -p "$target_dir/$dir_name"
    
    # Use tar to duplicate the directory
    tar -cf - -C "$src" . | tar -xf - -C "$target_dir/$dir_name"
done

echo "Directories have been successfully duplicated to $target_dir."

cp -a "/var/www/html/matomo.js" "$target_dir/matomo.js"
cp -a "/var/www/html/piwik.js" "$target_dir/piwik.js"

# finally, make sure everything is www-data:www-data
chown -R www-data:www-data "$target_dir"
