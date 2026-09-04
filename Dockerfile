FROM php:7.3-cli-buster

# 1. Point the old Debian Buster repositories to the archive "attic"
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list && \
    sed -i 's|security.debian.org/debian-security|archive.debian.org/debian-security|g' /etc/apt/sources.list && \
    sed -i '/buster-updates/d' /etc/apt/sources.list

# 2. Install needed utilities
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Bring in Composer 2.2 (LTS for PHP 7)
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

# 4. Set our workspace directory
WORKDIR /app

# 5. Copy current project files
COPY . /app

# 6. Default shell
CMD ["bash"]