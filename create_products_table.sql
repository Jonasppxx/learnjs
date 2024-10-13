-- Erstellen der products Tabelle
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255) NOT NULL,
    secondary_image VARCHAR(255)
);

-- Einfügen von Beispieldaten
INSERT INTO products (name, description, price, main_image, secondary_image) VALUES
('Pikachu V', 'Eine seltene Pikachu V Karte mit elektrischen Attacken.', 19.99, '/images/pikachu_v.jpg', '/images/pikachu_v_back.jpg'),
('Charizard GX', 'Eine mächtige Charizard GX Karte mit Feuerattacken.', 49.99, '/images/charizard_gx.jpg', '/images/charizard_gx_back.jpg'),
('Mewtu EX', 'Eine psychische Mewtu EX Karte mit hoher Angriffskraft.', 29.99, '/images/mewtwo_ex.jpg', '/images/mewtwo_ex_back.jpg'),
('Evoli Sammelbox', 'Eine Sammelbox mit verschiedenen Evoli-Entwicklungen.', 39.99, '/images/eevee_box.jpg', '/images/eevee_box_contents.jpg'),
('Schwert & Schild Booster Pack', 'Ein Booster Pack aus der Schwert & Schild Serie.', 4.99, '/images/sword_shield_pack.jpg', '/images/sword_shield_pack_open.jpg'),
('Pokémon Trainer Kit', 'Ein Starter-Kit für neue Pokémon-Kartensammler.', 14.99, '/images/trainer_kit.jpg', '/images/trainer_kit_open.jpg'),
('Glurak VMAX', 'Eine ultra-seltene Glurak VMAX Karte mit enormer Stärke.', 89.99, '/images/charizard_vmax.jpg', '/images/charizard_vmax_back.jpg'),
('Schiggy Sammelkarte', 'Eine niedliche Schiggy Sammelkarte für Wasser-Pokémon Fans.', 2.99, '/images/squirtle_card.jpg', '/images/squirtle_card_back.jpg');

-- Überprüfen der eingefügten Daten
SELECT * FROM products;