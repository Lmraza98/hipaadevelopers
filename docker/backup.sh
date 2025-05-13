#!/bin/bash

# Set backup directory relative to project root
BACKUP_DIR="./backups/wordpress"
BACKUP_RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get current date for backup file names
DATE=$(date +%Y%m%d_%H%M%S)

# Backup WordPress files
echo "Backing up WordPress files..."
docker compose exec -T wordpress tar czf - /var/www/html > "$BACKUP_DIR/wordpress_files_$DATE.tar.gz"

# Backup MariaDB database
echo "Backing up MariaDB database..."
docker compose exec -T mariadb mysqldump --no-tablespaces -u root -p"$MYSQL_ROOT_PASSWORD" wordpress > "$BACKUP_DIR/wordpress_db_$DATE.sql"
gzip "$BACKUP_DIR/wordpress_db_$DATE.sql"

# Remove backups older than retention period
echo "Cleaning up old backups..."
find $BACKUP_DIR -type f -name "wordpress_*" -mtime +$BACKUP_RETENTION_DAYS -exec rm {} \;

echo "Backup completed successfully!" 