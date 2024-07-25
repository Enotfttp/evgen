const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const host = "localhost";
const port = 5000;
const server = express();

server.use("/public", express.static("public"));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "pre_diplom",
  password: "root",
});

server.set("view engine", "hbs");

server.listen(port, host, (error) => {
  error
    ? console.error("error = ", error)
    : console.log(`Server is running on http://${host}:${port}`);
});

// Авторизация
server.post("/api/signIn/:login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const { login, password } = req.body;

  pool.query(
    `Select * from users INNER JOIN roles ON roles.id_role = users.id_role where login = '${login}' AND password = '${password}'`,
    (err, data) => {
      if (err) return console.error(err);
      if (!data.length) return res.sendStatus(400);
      const newData = data[0];
      return res.json({
        role: newData.name_role,
        id: newData.id_user,
        fio: newData.fio_user,
      });
    }
  );
});

// Регистрация
server.post("/api/signUp/:login", (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const { fio, phoneNumber, login, password, kindergarten } = req.body;
  pool.query(
    `INSERT INTO kindergartens (id_kindergarten, name_kindergarten, id_order, id_status) VALUES (NULL, '${kindergarten}', NULL, 4);`,
    (err, dataKindergarten) => {
      if (err) return console.error(err);
      pool.query(
        `INSERT INTO users (id_user, fio_user, id_role, phone_user, login, password, id_kindergarten) VALUES (NULL, '${fio}', '2', '${phoneNumber}', '${login}', '${password}', '${dataKindergarten.insertId}');`,
        (err, data) => {
          if (err) return console.error(err);
          return res.json({ login, password });
        }
      );
    }
  );
});

// Получение всех пользователей
server.get("/api/users", function (req, res) {
  pool.query(
    "SELECT fio_user, phone_user, name_role, id_user FROM users INNER JOIN roles ON users.id_role = roles.id_role",
    function (err, data) {
      if (err) return console.error(err);
      if (!data.length) return res.sendStatus(400);
      res.json(data);
    }
  );
});

// Получение всех ролей
server.get("/api/roles", function (req, res) {
  pool.query("SELECT * FROM roles", function (err, data) {
    if (err) return console.error(err);
    if (!data.length) return res.sendStatus(400);
    const newData = data.map((elem) => {
      let index = 0;
      let role;
      /* 
                Костыль
            */
      for (let value of Object.values(elem)) {
        index++;
        if (index === 2) role = value;
      }
      return { id: elem.idДолжности, role };
    });
    res.json(newData);
  });
});

// Удаление пользователя
server.delete("/api/user/delete/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(`Delete From users where id_user = '${id}'`, function (err, data) {
    if (err) return console.error(err);
    res.json("delete user");
  });
});

// Редактирование пользователя
server.put("/api/user/edit/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id, fio, idRole, phoneNumber } = req.body;
  pool.query(
    `UPDATE \`users\` SET \`fio_user\` = '${fio}', \`id_role\` = '${idRole}', \`phone_user\` = '${phoneNumber}' WHERE users.id_user = '${id}'`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("user updated");
    }
  );
});

// Получение всех заказов
server.get("/api/orders", function (req, res) {
  pool.query(
    "SELECT orders.`id_order`, `date_order`, `full_price`, `comment`, kindergartens.name_kindergarten,  statuses.name_status FROM ((orders INNER JOIN kindergartens ON orders.id_kindergarten = kindergartens.id_kindergarten) INNER JOIN statuses ON orders.id_status = statuses.id_status)",
    function (err, data) {
      if (err) return console.error(err);
      res.json(data);
    }
  );
});

// Удаление заказа
server.delete("/api/order/delete/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(
    `Delete From orders where id_order = '${id}'`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("delete order");
    }
  );
});

// Редактирование заказа
server.put("/api/order/edit/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id, name_material, count_material, price_material } = req.body;
  pool.query(
    `UPDATE \`materials\` SET \`name_material\` = '${name_material}', \`count_material\` = '${count_material}', \`price_material\` = '${price_material}' WHERE id_material = ${id} `,
    function (err, data) {
      if (err) return console.error(err);
      res.json("order updated");
    }
  );
});

// Добавление заказа
server.post("/api/order/add", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const {
    id_order,
    id_kindergarten,
    date_order,
    id_status,
    full_price,
    comment,
  } = req.body;
  pool.query(
    `INSERT INTO orders (id_order, id_kindergarten, date_order, id_status, full_price, comment) VALUES ('${id_order}', '${id_kindergarten}', '${date_order}', '${id_status}', '${full_price}', '${comment}');`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("order updated");
    }
  );
});

// Получение всех статусов
server.get("/api/statuses", function (req, res) {
  pool.query("SELECT * FROM statuses", function (err, data) {
    if (err) return console.error(err);
    if (!data.length) return res.sendStatus(400);
    res.json(data);
  });
});

// Получение всех материалов
server.get("/api/materials", function (req, res) {
  pool.query("SELECT * FROM materials", function (err, data) {
    if (err) return console.error(err);
    if (!data.length) return res.sendStatus(400);
    res.json(data);
  });
});

// Удаление материала
server.delete("/api/material/delete/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(
    `Delete From materials where id_material = '${id}'`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("delete material");
    }
  );
});

// Редактирование материала
server.put("/api/material/edit/:idKindergarten", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id, name_material, count_material, price_material } = req.body;
  pool.query(
    `UPDATE \`materials\` SET \`name_material\` = '${name_material}', \`count_material\` = '${count_material}', \`price_material\` = '${price_material}' WHERE id_material = ${id} `,
    function (err, data) {
      if (err) return console.error(err);
      res.json("material updated");
    }
  );
});

// Добавление материала
server.post("/api/material/add", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { name_material, count_material, price_material } = req.body;
  pool.query(
    `INSERT INTO materials (id_material, name_material, count_material, price_material) VALUES (NULL, '${name_material}', '${count_material}', '${price_material}');`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("kindergartens updated");
    }
  );
});

// Получение всех садиков
// FIX Расширить добалвение и редактирование
server.get("/api/kindergartens", function (req, res) {
  pool.query(
    "SELECT name_kindergarten, statuses.name_status, id_order FROM ( kindergartens INNER JOIN statuses ON kindergartens.id_status = statuses.id_status)",
    function (err, data) {
      if (err) return console.error(err);
      if (!data.length) return res.sendStatus(400);

      res.json(data);
    }
  );
});

// Удаление садика
server.delete("/api/kindergarten/delete/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(
    `Delete From kindergartens where id_kindergarten = '${id}'`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("delete kindergarten");
    }
  );
});

// Редактирование садика
server.put("/api/kindergarten/edit/:idKindergarten", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id, kindergarten, id_order } = req.body;
  pool.query(
    `UPDATE kindergartens
        JOIN orders ON kindergartens.id_kindergarten = orders.id_kindergarten
        SET kindergartens.name_kindergarten = '${kindergarten}', orders.id_order = '${id_order}'
        WHERE id_kindergarten = ${id}`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("kindergarten updated");
    }
  );
});

// Добавление садика
server.post("/api/kindergarten/add", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { kindergarten } = req.body;
  pool.query(
    `INSERT INTO kindergartens (id_kindergarten, name_kindergarten, id_order) VALUES (NULL, '${kindergarten}', NULL);`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("kindergartens updated");
    }
  );
});

// Редактирование авиакомпании
// CHECK
server.put("/api/airline/edit/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id, nameCompany, createYears, countPlanes } = req.body;
  pool.query(
    `UPDATE \`airlines\` SET \`Название авиакомпании\` = '${nameCompany}', \`Год основания\` = '${createYears}', \`Количество самолётов\` = '${countPlanes}' WHERE \`airlines\`.\`idАвиакомпании\` = ${id}`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("airline updated");
    }
  );
});
