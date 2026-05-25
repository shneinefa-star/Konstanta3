const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const dbPath = path.join(__dirname, '../db/app.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, user TEXT UNIQUE, pass TEXT, role TEXT DEFAULT 'user', created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY, name TEXT, desc TEXT, category TEXT, price INTEGER, img TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY, user_id INTEGER, service TEXT, quantity INTEGER, price INTEGER, status TEXT DEFAULT 'pending', created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS calculator_orders (
    id INTEGER PRIMARY KEY, name TEXT, phone TEXT, service TEXT, address TEXT, date TEXT, comment TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS actions (
    id INTEGER PRIMARY KEY, user TEXT, action_type TEXT, description TEXT, details TEXT, ip_address TEXT, created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


  db.get('SELECT id FROM users WHERE user = ?', ['admin'], (err, row) => {
    if (!row) {
      bcrypt.hash('admin123', 10, (err, hash) => {
        db.run('INSERT INTO users (user, pass, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'],
          () => console.log('✓ Admin user created: admin / admin123'));
      });
    }
  });

  db.get('SELECT COUNT(*) as cnt FROM services', (err, row) => {
    if (row.cnt === 0) {
      const services = [
        {name: 'Визитные карточки премиум', desc: 'Толстые визитки с золотым тиснением, матовая ламинация. Плотность 350 г/м². Размер 90х50мм.', category: 'cards', price: 450},
        {name: 'Визитные карточки стандарт', desc: 'Стандартные визитки 4+0 (односторонняя печать). Плотность 250 г/м². Размер 90х50мм.', category: 'cards', price: 250},
        {name: 'Пластиковые дисконтные карты', desc: 'Пластиковые карты из ПВХ с магнитной полосой, стоимость за 100 шт. Размер 85х55мм.', category: 'cards', price: 1200},
        {name: 'Листовка А5 цветная', desc: 'Двусторонняя цветная печать 4+4. Формат А5 (148х210мм). Бумага: мелованная 150г/м².', category: 'flyers', price: 180},
        {name: 'Баннер уличный 3x2м', desc: 'Баннер из ПВХ с укреплением. Размер 3х2 метра. Печать на сольвентных чернилах (долговечность 2-3 года на улице).', category: 'banners', price: 2500},
        {name: 'Баннер roll-up 2x0.8м', desc: 'Мобильный roll-up баннер с автоматическим механизмом. Размер 2х0.8м (в развернутом виде).', category: 'banners', price: 1800},
        {name: 'Брошюра А5 (32 страницы)', desc: 'Мягкая брошюра 32 стр. на скобе. Обложка 250г/м² мелованная, внутри 130г/м². Формат А5.', category: 'brochures', price: 780},
        {name: 'Брошюра А4 (64 страницы) на клею', desc: 'Брошюра 64 стр. с клеевым переплетом. Обложка твердая 300г/м². Формат А4. Высокое качество печати.', category: 'brochures', price: 1950},
        {name: 'Каталог 300 страниц', desc: 'Объемный каталог 300 стр., твердый переплёт, ламинация обложки. Полноцветная печать 4+4. Формат А4.', category: 'brochures', price: 8900},
        {name: 'Цветные наклейки квадратные', desc: 'Самоклеящиеся наклейки на прозрачной основе. Размер 50х50мм. Количество: 100 шт. Водостойкие чернила.', category: 'stickers', price: 320},
        {name: 'Этикетки на рулоне', desc: 'Этикетки на самоклеящейся бумаге на рулоне. Собственный цвет бумаги. Размер 100х60мм.', category: 'documents', price: 580},
        {name: 'Грамоты и сертификаты', desc: 'Красиво оформленные грамоты и сертификаты на дизайнерской бумаге 280г/м². Размер А4. Персональная печать.', category: 'documents', price: 420},
        {name: 'Приглашения на мероприятие', desc: 'Элегантные приглашения на фирменной бумаге с тиснением. Формат 10х21см. Конверт в комплекте.', category: 'documents', price: 850},
        {name: 'Плакат 50х70см', desc: 'Большой плакат для рекламы. Бумага матовая 200г/м² или глянцевая 250г/м². Полноцветная печать высочайшего качества.', category: 'flyers', price: 320},
        {name: 'Календари настольные', desc: 'Настольные календари на пружине. Размер 10х10см. 12 месяцев + ваш логотип. Плотная картонная основа.', category: 'documents', price: 950}
      ];

      services.forEach(s => {
        db.run('INSERT INTO services (name, desc, category, price, img) VALUES (?, ?, ?, ?, ?)',
          [s.name, s.desc, s.category, s.price, '📄']);
      });
      console.log('✓ Sample services added');
    }
  });
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:'key',resave:false,saveUninitialized:true}));
app.use(express.static('public'));

const requireAuth = (req, res, next) => {
  if(!req.session.user) return res.redirect('/auth');
  next();
};

// Helper function to log actions
const logAction = (user, actionType, description, details = {}, ip = '') => {
  db.run(
    'INSERT INTO actions (user, action_type, description, details, ip_address) VALUES (?, ?, ?, ?, ?)',
    [user || 'Guest', actionType, description, JSON.stringify(details), ip],
    (err) => {
      if (err) console.error('Action log error:', err);
    }
  );
};

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/auth', (req,res) => {
  if(req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, '../public/auth.html'));
});
app.get('/profile', requireAuth, (req,res) => res.sendFile(path.join(__dirname, '../public/profile.html')));
app.get('/about', (req,res) => res.sendFile(path.join(__dirname, '../public/about.html')));
app.get('/services', (req,res) => res.sendFile(path.join(__dirname, '../public/services.html')));
app.get('/calculator', (req,res) => res.sendFile(path.join(__dirname, '../public/calculator.html')));
app.get('/order', (req,res) => res.sendFile(path.join(__dirname, '../public/order.html')));
app.get('/contacts', (req,res) => res.sendFile(path.join(__dirname, '../public/contacts.html')));
app.get('/admin', (req,res) => {
  if(!req.session.user || req.session.role!=='admin') return res.redirect('/auth');
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/admin/users', (req,res) => {
  if(!req.session.user || req.session.role!=='admin') return res.redirect('/auth');
  res.sendFile(path.join(__dirname, '../public/admin-users.html'));
});

app.get('/admin/actions', (req,res) => {
  if(!req.session.user || req.session.role!=='admin') return res.redirect('/auth');
  res.sendFile(path.join(__dirname, '../public/admin-actions.html'));
});

app.post('/api/register', (req,res) => {
  const {user,pass} = req.body;
  if(!user||!pass) return res.json({ok:0,msg:'Fill all'});
  bcrypt.hash(pass, 10, (err, hash) => {
    db.run('INSERT INTO users (user, pass) VALUES (?, ?)', [user, hash], (e) => {
      if(!e) {
        logAction(user, 'REGISTER', `Новый пользователь зарегистрирован`, {username: user});
      }
      res.json({ok:e?0:1,msg:e?'User exists':'OK'});
    });
  });
});

app.post('/api/login', (req,res) => {
  const {user,pass} = req.body;
  db.get('SELECT * FROM users WHERE user = ?', [user], (err, u) => {
    if(!u) {
      logAction(user, 'LOGIN_FAILED', `Попытка входа - пользователь не найден`, {username: user});
      return res.json({ok:0,msg:'User not found'});
    }
    bcrypt.compare(pass, u.pass, (err, ok) => {
      if(ok) {
        req.session.user = user;
        req.session.role = u.role;
        logAction(user, 'LOGIN', `Пользователь вошел в систему`, {username: user, role: u.role});
        res.json({ok:1,msg:'Logged in'});
      } else {
        logAction(user, 'LOGIN_FAILED', `Попытка входа - неверный пароль`, {username: user});
        res.json({ok:0,msg:'Wrong pass'});
      }
    });
  });
});

app.get('/api/logout', (req,res) => {
  const user = req.session.user;
  logAction(user, 'LOGOUT', `Пользователь вышел из системы`, {username: user});
  req.session.destroy();
  res.json({ok:1});
});

app.get('/api/user', (req,res) => {
  res.json({user:req.session.user||null,role:req.session.role||null});
});

app.get('/api/products', (req,res) => {
  db.all('SELECT * FROM services', (err,rows) => {
    res.json(rows||[]);
  });
});

app.post('/api/product-add', (req,res) => {
  if(req.session.role!=='admin') return res.json({ok:0});
  const {name,desc,img} = req.body;
  db.run('INSERT INTO services (name,desc,img) VALUES (?,?,?)', [name,desc,img], (e) => {
    res.json({ok:e?0:1});
  });
});

app.get('/api/admin/users', (req,res) => {
  if(!req.session.user || req.session.role!=='admin') return res.json({ok:0});
  db.all('SELECT id, user, role, created FROM users', (err,rows) => {
    res.json(rows||[]);
  });
});

app.get('/api/admin/services', (req,res) => {
  if(!req.session.user || req.session.role!=='admin') return res.json({ok:0});
  db.all('SELECT id, name, desc, category, price, img FROM services', (err,rows) => {
    res.json(rows||[]);
  });
});

app.post('/api/admin/service-add', (req,res) => {
  if(req.session.role!=='admin') return res.json({ok:0});
  const {name,desc,category,price,img} = req.body;
  db.run('INSERT INTO services (name,desc,category,price,img) VALUES (?,?,?,?,?)', 
    [name,desc,category,price,img], (e) => {
    res.json({ok:e?0:1});
  });
});

app.post('/api/admin/role', (req,res) => {
  if(req.session.role!=='admin') return res.json({ok:0});
  const {userId, newRole} = req.body;
  db.run('UPDATE users SET role=? WHERE id=?', [newRole, userId], (e) => {
    res.json({ok:e?0:1});
  });
});

app.post('/api/admin/delete-user', (req,res) => {
  if(req.session.role!=='admin') return res.json({ok:0});
  const {userId} = req.body;
  if(userId == req.session.user) return res.json({ok:0,msg:'Cannot delete yourself'});
  db.run('DELETE FROM users WHERE id=?', [userId], (e) => {
    res.json({ok:e?0:1});
  });
});

app.post('/api/admin/delete-service', (req,res) => {
  if(req.session.role!=='admin') return res.json({ok:0});
  const {serviceId} = req.body;
  db.run('DELETE FROM services WHERE id=?', [serviceId], (e) => {
    res.json({ok:e?0:1});
  });
});

app.post('/api/orders', (req,res) => {
  if(!req.session.user) return res.status(401).json({ok:0});
  const {name, phone, service, address, date, comment} = req.body;
  db.run('INSERT INTO calculator_orders (name, phone, service, address, date, comment) VALUES (?, ?, ?, ?, ?, ?)',
    [name, phone, service, address, date, comment], (e) => {
    if(!e) {
      logAction(req.session.user, 'ORDER_CREATED', `Создан новый заказ`, 
        {name, phone, service, address, date, comment});
    }
    res.json({ok:e?0:1});
  });
});

app.get('/api/users-list', (req,res) => {
  if(req.session.role !== 'admin') return res.status(403).json({ok:0, msg:'Access denied'});
  db.all('SELECT id, user as email, pass as password_hash, role, created FROM users', (err, rows) => {
    if(err) return res.json({ok:0});
    res.json({ok:1, users: rows});
  });
});

// Get all actions (admin only)
app.get('/api/admin/actions', (req,res) => {
  if(req.session.role !== 'admin') return res.status(403).json({ok:0, msg:'Access denied'});
  db.all('SELECT * FROM actions ORDER BY created DESC LIMIT 500', (err, rows) => {
    if(err) return res.json({ok:0});
    res.json({ok:1, actions: rows});
  });
});

// Get actions for specific user (admin only or own user)
app.get('/api/admin/actions/:username', (req,res) => {
  const {username} = req.params;
  if(req.session.role !== 'admin' && req.session.user !== username) {
    return res.status(403).json({ok:0, msg:'Access denied'});
  }
  db.all('SELECT * FROM actions WHERE user = ? ORDER BY created DESC LIMIT 200', 
    [username], (err, rows) => {
    if(err) return res.json({ok:0});
    res.json({ok:1, actions: rows});
  });
});

// Get action statistics
app.get('/api/admin/statistics', (req,res) => {
  if(req.session.role !== 'admin') return res.status(403).json({ok:0, msg:'Access denied'});
  
  db.all(`SELECT action_type, COUNT(*) as count FROM actions GROUP BY action_type`, (err, stats) => {
    if(err) return res.json({ok:0});
    
    db.all(`SELECT user, COUNT(*) as count FROM actions GROUP BY user ORDER BY count DESC LIMIT 10`, 
      (err, topUsers) => {
      if(err) return res.json({ok:0});
      
      res.json({
        ok:1, 
        stats: stats,
        topUsers: topUsers
      });
    });
  });
});

// Chat API endpoint for Ollama integration
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.json({ ok: 0, msg: 'Message is required' });
  }

  try {
    const systemPrompt = `Ты - помощник службы поддержки сайта компании "ООО КОНСТАНТА" по услугам полиграфии и печати. 
Отвечай ТОЛЬКО на вопросы, связанные с:
- Услугами печати на сайте (визитки, баннеры, брошюры, листовки, наклейки, этикетки и т.д.)
- Описанием сервисов
- Ценами на услуги
- Процессом оформления заказа
- Техническими вопросами о сайте

Если вопрос не связан с этим, вежливо откажи и предложи перейти на страницу контактов для других вопросов.
Отвечай на русском языке. Будь дружелюбен и помогай.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:3b',
        prompt: `${systemPrompt}\n\nВопрос пользователя: ${message}\n\nОтвет:`,
        stream: false,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.response.trim();

    res.json({ ok: 1, response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    res.json({ ok: 0, msg: 'Ошибка при обработке вопроса. Попробуйте позже.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
