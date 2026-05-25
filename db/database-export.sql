-- Экспорт базы данных ООО КОНСТАНТА
-- Дата создания: 24.05.2026, 16:37:35
-- ================================================================

-- ================================================================
-- Таблица: users
-- ================================================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY, user TEXT UNIQUE, pass TEXT, role TEXT DEFAULT 'user', created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- ================================================================
-- Таблица: actions
-- ================================================================
CREATE TABLE actions (
    id INTEGER PRIMARY KEY, user TEXT, action_type TEXT, description TEXT, details TEXT, ip_address TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- ================================================================
-- Таблица: services
-- ================================================================
CREATE TABLE services (
    id INTEGER PRIMARY KEY, name TEXT, desc TEXT, category TEXT, price INTEGER, img TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- ================================================================
-- Таблица: orders
-- ================================================================
CREATE TABLE orders (
    id INTEGER PRIMARY KEY, user_id INTEGER, service TEXT, quantity INTEGER, price INTEGER, status TEXT DEFAULT 'pending', created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

-- ================================================================
-- Таблица: calculator_orders
-- ================================================================
CREATE TABLE calculator_orders (
    id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, deadline TEXT, comment TEXT, price TEXT, service TEXT, quantity TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

INSERT INTO users (id, user, pass, role, created) VALUES (1, 'admin', '$2b$10$QQqwEuOrW2M.rIYoV1Hyke4l6oTKSAYREQqD9S7kJPWO.ZJR2KSgG', 'admin', '2026-04-06 19:23:22');
INSERT INTO users (id, user, pass, role, created) VALUES (2, 'ФРол', '$2b$10$6uKbqd4cuel8yas.YPF5f.z4POFPbqFHE14B3Eb7HR2O1OWuue572', 'user', '2026-04-06 19:26:42');
INSERT INTO users (id, user, pass, role, created) VALUES (3, 'Папатут', '$2b$10$9X51d2XFt2Jqdl2wO5968.PIvDibUdnbhHedpCD7DyYwwzJ6S4wfq', 'user', '2026-04-06 20:10:26');
INSERT INTO users (id, user, pass, role, created) VALUES (4, 'Лев Андреевич Вареников ', '$2b$10$VQz8bIn7Y22L9zzIRgTeR.hvUfOwwHmpCDx5Dct.hPXDHNt1rB.Vi', 'admin', '2026-04-08 19:29:13');
INSERT INTO users (id, user, pass, role, created) VALUES (5, 'testuser', '$2b$10$y/cEW0L.Tz54/KASJcpYb.sjFCpNyiL/2CXA.1l01kbLZQnTKbJj2', 'user', '2026-05-15 13:54:56');
INSERT INTO users (id, user, pass, role, created) VALUES (6, 'User', '$2b$10$5SSdsqwdokMNhVO1P3MEUeTPIWhv7NgL1FwFfEhQ/4qAKxkkiamci', 'user', '2026-05-16 13:48:35');

INSERT INTO services (id, name, desc, category, price, img, created) VALUES (1, 'Визитные карточки премиум', 'Толстые визитки с золотым тиснением, матовая ламинация. Плотность 350 г/м². Размер 90х50мм.', 'cards', 450, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (2, 'Визитные карточки стандарт', 'Стандартные визитки 4+0 (односторонняя печать). Плотность 250 г/м². Размер 90х50мм.', 'cards', 250, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (3, 'Баннер уличный 3x2м', 'Баннер из ПВХ с укреплением. Размер 3х2 метра. Печать на сольвентных чернилах (долговечность 2-3 года на улице).', 'banners', 2500, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (4, 'Листовка А5 цветная', 'Двусторонняя цветная печать 4+4. Формат А5 (148х210мм). Бумага: мелованная 150г/м².', 'flyers', 180, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (5, 'Брошюра А5 (32 страницы)', 'Мягкая брошюра 32 стр. на скобе. Обложка 250г/м² мелованная, внутри 130г/м². Формат А5.', 'brochures', 780, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (6, 'Баннер roll-up 2x0.8м', 'Мобильный roll-up баннер с автоматическим механизмом. Размер 2х0.8м (в развернутом виде).', 'banners', 1800, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (7, 'Пластиковые дисконтные карты', 'Пластиковые карты из ПВХ с магнитной полосой, стоимость за 100 шт. Размер 85х55мм.', 'cards', 1200, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (8, 'Цветные наклейки квадратные', 'Самоклеящиеся наклейки на прозрачной основе. Размер 50х50мм. Количество: 100 шт. Водостойкие чернила.', 'stickers', 320, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (9, 'Этикетки на рулоне', 'Этикетки на самоклеящейся бумаге на рулоне. Собственный цвет бумаги. Размер 100х60мм.', 'documents', 580, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (10, 'Грамоты и сертификаты', 'Красиво оформленные грамоты и сертификаты на дизайнерской бумаге 280г/м². Размер А4. Персональная печать.', 'documents', 420, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (11, 'Плакат 50х70см', 'Большой плакат для рекламы. Бумага матовая 200г/м² или глянцевая 250г/м². Полноцветная печать высочайшего качества.', 'flyers', 320, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (12, 'Брошюра А4 (64 страницы) на клею', 'Брошюра 64 стр. с клеевым переплетом. Обложка твердая 300г/м². Формат А4. Высокое качество печати.', 'brochures', 1950, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (13, 'Каталог 300 страниц', 'Объемный каталог 300 стр., твердый переплёт, ламинация обложки. Полноцветная печать 4+4. Формат А4.', 'brochures', 8900, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (14, 'Приглашения на мероприятие', 'Элегантные приглашения на фирменной бумаге с тиснением. Формат 10х21см. Конверт в комплекте.', 'documents', 850, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (15, 'Календари настольные', 'Настольные календари на пружине. Размер 10х10см. 12 месяцев + ваш логотип. Плотная картонная основа.', 'documents', 950, '📄', '2026-04-06 19:23:22');
INSERT INTO services (id, name, desc, category, price, img, created) VALUES (16, 'Пепе', '12', 'flyers', 111, '📇', '2026-04-08 18:58:16');

INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (1, 'admin', 'LOGIN', 'Пользователь вошел в систему', '{"username":"admin","role":"admin"}', '', '2026-05-24 11:02:23');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (2, 'admin', 'LOGOUT', 'Пользователь вышел из системы', '{"username":"admin"}', '', '2026-05-24 11:02:52');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (3, 'ФРол', 'LOGIN_FAILED', 'Попытка входа - неверный пароль', '{"username":"ФРол"}', '', '2026-05-24 11:02:56');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (4, 'ФРол', 'LOGIN_FAILED', 'Попытка входа - неверный пароль', '{"username":"ФРол"}', '', '2026-05-24 11:02:58');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (5, 'ФРол', 'LOGIN', 'Пользователь вошел в систему', '{"username":"ФРол","role":"user"}', '', '2026-05-24 11:03:00');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (6, 'ФРол', 'LOGOUT', 'Пользователь вышел из системы', '{"username":"ФРол"}', '', '2026-05-24 11:03:03');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (7, 'admin', 'LOGIN', 'Пользователь вошел в систему', '{"username":"admin","role":"admin"}', '', '2026-05-24 11:03:09');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (8, 'admin', 'LOGIN', 'Пользователь вошел в систему', '{"username":"admin","role":"admin"}', '', '2026-05-24 11:07:09');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (9, 'admin', 'LOGIN', 'Пользователь вошел в систему', '{"username":"admin","role":"admin"}', '', '2026-05-24 11:19:53');
INSERT INTO actions (id, user, action_type, description, details, ip_address, created) VALUES (10, 'admin', 'LOGIN', 'Пользователь вошел в систему', '{"username":"admin","role":"admin"}', '', '2026-05-24 11:24:04');

