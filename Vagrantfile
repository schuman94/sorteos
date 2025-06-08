Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"

  config.vm.hostname = "sorteillo.local"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.network "public_network", bridge: nil

  config.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775", "fmode=664"]

  config.vm.provision "shell", inline: <<-SHELL
    set -eux

    sudo apt-get update
    sudo apt-get install -y software-properties-common lsb-release ca-certificates apt-transport-https curl unzip gnupg gnupg2

    # PHP 8.2 y dependencias Laravel
    sudo add-apt-repository ppa:ondrej/php -y
    sudo apt-get update
    sudo apt-get install -y php8.2 php8.2-cli php8.2-common php8.2-mbstring php8.2-xml php8.2-mysql php8.2-pgsql php8.2-curl php8.2-bcmath php8.2-zip php8.2-gd php8.2-readline

    # Apache
    sudo apt-get install -y apache2 libapache2-mod-php8.2
    sudo a2enmod rewrite

    # PostgreSQL 15
    sudo apt-get install -y postgresql postgresql-contrib
    sudo -u postgres psql -c "CREATE ROLE vagrant LOGIN PASSWORD 'vagrant';"
    sudo -u postgres psql -c "ALTER ROLE vagrant CREATEDB;"
    echo "local   all             all                                     trust" | sudo tee /etc/postgresql/15/main/pg_hba.conf > /dev/null
    sudo systemctl restart postgresql

    # Node 18 con NVM
    export NVM_DIR="/home/vagrant/.nvm"
    mkdir -p "$NVM_DIR"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm alias default 18
    echo 'export NVM_DIR="$HOME/.nvm"' >> /home/vagrant/.bashrc
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/vagrant/.bashrc

    # Mailpit
    curl -L https://github.com/axllent/mailpit/releases/latest/download/mailpit-linux-amd64 -o mailpit
    chmod +x mailpit
    sudo mv mailpit /usr/local/bin/mailpit
    sudo bash -c 'cat > /etc/systemd/system/mailpit.service <<EOF
[Unit]
Description=Mailpit
After=network.target

[Service]
ExecStart=/usr/local/bin/mailpit --listen :1025 --ui-port 8025
Restart=always
User=vagrant
WorkingDirectory=/home/vagrant

[Install]
WantedBy=multi-user.target
EOF'
    sudo systemctl daemon-reexec
    sudo systemctl enable --now mailpit

    # Apache VirtualHost
    sudo mkdir -p /var/www/sorteillo
    sudo chown -R vagrant:vagrant /var/www/sorteillo
    sudo ln -sf /vagrant /var/www/sorteillo

    echo '<VirtualHost *:80>
        ServerName sorteillo.local
        DocumentRoot /var/www/sorteillo/public
        <Directory /var/www/sorteillo/public>
            AllowOverride All
            Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/sorteillo_error.log
        CustomLog ${APACHE_LOG_DIR}/sorteillo_access.log combined
    </VirtualHost>' | sudo tee /etc/apache2/sites-available/sorteillo.conf

    sudo a2ensite sorteillo
    sudo systemctl reload apache2
  SHELL
end
