-- Erstellen der singles Tabelle
CREATE TABLE singles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255) NOT NULL,
    secondary_image VARCHAR(255)
);

-- Einfügen von Beispieldaten in singles
INSERT INTO singles (name, description, price, main_image, secondary_image) VALUES
('Pikachu V', 'Eine seltene Pikachu V Karte mit elektrischen Attacken.', 19.99, '/images/pikachu_v.jpg', '/images/pikachu_v_back.jpg'),
('Charizard GX', 'Eine mächtige Charizard GX Karte mit Feuerattacken.', 49.99, '/images/charizard_gx.jpg', '/images/charizard_gx_back.jpg'),
('Mewtu EX', 'Eine psychische Mewtu EX Karte mit hoher Angriffskraft.', 29.99, '/images/mewtwo_ex.jpg', '/images/mewtwo_ex_back.jpg'),
('Glurak VMAX', 'Eine ultra-seltene Glurak VMAX Karte mit enormer Stärke.', 89.99, '/images/charizard_vmax.jpg', '/images/charizard_vmax_back.jpg'),
('Schiggy Sammelkarte', 'Eine niedliche Schiggy Sammelkarte für Wasser-Pokémon Fans.', 2.99, '/images/squirtle_card.jpg', '/images/squirtle_card_back.jpg');

-- Erstellen der sealed_products Tabelle
CREATE TABLE sealed_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255) NOT NULL,
    secondary_image VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0
);

-- Einfügen von Beispieldaten in sealed_products
INSERT INTO sealed_products (name, description, price, main_image, secondary_image, stock) VALUES
('Evoli Sammelbox', 'Eine Sammelbox mit verschiedenen Evoli-Entwicklungen.', 39.99, '/images/eevee_box.jpg', '/images/eevee_box_contents.jpg', 50),
('Schwert & Schild Booster Pack', 'Ein Booster Pack aus der Schwert & Schild Serie.', 4.99, '/images/sword_shield_pack.jpg', '/images/sword_shield_pack_open.jpg', 100),
('Pokémon Trainer Kit', 'Ein Starter-Kit für neue Pokémon-Kartensammler.', 14.99, '/images/trainer_kit.jpg', '/images/trainer_kit_open.jpg', 30),
('Schwert & Schild Booster Box', 'Eine Box mit 36 Booster Packs aus der Schwert & Schild Serie.', 129.99, '/images/sword_shield_box.jpg', '/images/sword_shield_box_open.jpg', 20),
('Glänzendes Schicksal Elite Trainer Box', 'Elite Trainer Box aus der Glänzendes Schicksal Serie mit 10 Booster Packs.', 59.99, '/images/shining_fates_etb.jpg', '/images/shining_fates_etb_contents.jpg', 15);

-- Überprüfen der eingefügten Daten
SELECT * FROM singles;
SELECT * FROM sealed_products;
