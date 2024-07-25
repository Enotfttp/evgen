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
  database: "evgen",
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
  const { fio, phoneNumber, login, password } = req.body;
  pool.query(
    `INSERT INTO users (id_user, fio_user, id_role, phone_user, login, password) VALUES (NULL, '${fio}', '2', '${phoneNumber}', '${login}', '${password}');`,
    (err, data) => {
      if (err) return console.error(err);
      return res.json({ login, password });
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

// Получение всех статусов
server.get("/api/statuses_ci", function (req, res) {
  pool.query("SELECT * FROM statuses_ci", function (err, data) {
    if (err) return console.error(err);
    if (!data.length) return res.sendStatus(400);
    res.json(data);
  });
});

// Получение всех статусов
server.get("/api/statuses_cp", function (req, res) {
  pool.query("SELECT * FROM statuses_cp", function (err, data) {
    if (err) return console.error(err);
    if (!data.length) return res.sendStatus(400);
    res.json(data);
  });
});

// Получение всех типо работ
server.get("/api/type_work", function (req, res) {
  pool.query("SELECT * FROM type_work", function (err, data) {
    if (err) return console.error(err);
    res.json(data);
  });
});

// Получение всех заказов под ролью админа
server.get("/api/acts_adm", function (req, res) {
  pool.query(
    `SELECT acts.id_act, acts.num_document, acts.organization, acts.date_input, acts.date_export, statuses_cp.name_status_cp, statuses_ci.name_status_ci, type_work.name_type, users.fio_user FROM (((( acts
        INNER JOIN statuses_cp ON acts.id_status_cp = statuses_cp.id_status_cp)
        INNER JOIN statuses_ci ON acts.id_status_ci = statuses_ci.id_status_ci)
        INNER JOIN type_work ON acts.id_type = type_work.id_type)
        INNER JOIN users ON acts.id_user = users.id_user)`,
    function (err, data) {
      if (err) return console.error(err);
      res.json(data);
    }
  );
});

// Получение всех заказов
server.get("/api/acts", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(
    `SELECT acts.id_act, acts.num_document, acts.organization, acts.date_input, acts.date_export, statuses_cp.name_status_cp, statuses_ci.name_status_ci, type_work.name_type, users.fio_user FROM (((( acts
        INNER JOIN statuses_cp ON acts.id_status_cp = statuses_cp.id_status_cp)
        INNER JOIN statuses_ci ON acts.id_status_ci = statuses_ci.id_status_ci)
        INNER JOIN type_work ON acts.id_type = type_work.id_type)
        INNER JOIN users ON acts.id_user = users.id_user)
        WHERE acts.id_user='${id}'`,
    function (err, data) {
      if (err) return console.error(err);
      res.json(data);
    }
  );
});

// Удаление заказа
server.delete("/api/act/delete/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const { id } = req.body;
  pool.query(`Delete From acts where id_act = '${id}'`, function (err, data) {
    if (err) return console.error(err);
    res.json("act deleted");
  });
});

// Редактирование заказа
server.put("/api/act/edit/:id", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const {
    id,
    num_document,
    organization,
    date_input,
    date_export,
    id_type,
    id_status_cp,
    id_status_ci,
  } = req.body;
  pool.query(
    `UPDATE acts 
       SET acts.num_document = '${num_document}', acts.organization = '${organization}', acts.date_input = '${date_input}', acts.date_export = '${date_export}', acts.id_type ='${id_type}', acts.id_status_cp = '${id_status_cp}' ,acts.id_status_ci = '${id_status_ci}'
       WHERE acts.id_act = ${id}`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("act updated");
    }
  );
});

// Добавление заказа
server.post("/api/act/add", function (req, res) {
  if (!req.body) return res.sendStatus(400);
  const {
    num_document,
    organization,
    date_input,
    date_export,
    id_type,
    id_status_cp,
    id_status_ci,
    id_user,
  } = req.body;
  pool.query(
    `INSERT INTO acts (id_act, num_document, organization, id_type, date_input, date_export, id_status_cp, id_status_ci, id_user) 
        VALUES (NULL, '${num_document}', '${organization}', '${id_type}','${date_input}', '${date_export}', '${id_status_cp}', '${id_status_ci}', '${id_user}');`,
    function (err, data) {
      if (err) return console.error(err);
      res.json("act updated");
    }
  );
});
