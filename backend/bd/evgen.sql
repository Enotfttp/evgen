-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июл 26 2024 г., 01:50
-- Версия сервера: 10.3.22-MariaDB
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `evgen`
--

-- --------------------------------------------------------

--
-- Структура таблицы `acts`
--

CREATE TABLE `acts` (
  `id_act` int(5) NOT NULL,
  `num_document` int(11) NOT NULL,
  `organization` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_type` int(4) NOT NULL,
  `date_input` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_export` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_status_cp` int(4) NOT NULL,
  `id_status_ci` int(4) NOT NULL,
  `id_user` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `acts`
--

INSERT INTO `acts` (`id_act`, `num_document`, `organization`, `id_type`, `date_input`, `date_export`, `id_status_cp`, `id_status_ci`, `id_user`) VALUES
(1, 1, '1', 1, '1', '1', 4, 4, 1),
(3, 2, '2', 1, '2024-07-22T21:00:00.000Z', '2024-07-30T21:00:00.000Z', 1, 1, 7),
(4, 3, '3', 2, '2024-07-16T21:00:00.000Z', '2024-07-27T21:00:00.000Z', 1, 1, 7),
(5, 4, '4', 2, '2024-07-29T21:00:00.000Z', '2024-07-30T21:00:00.000Z', 1, 1, 7),
(6, 5, '5', 1, '2024-07-12T21:00:00.000Z', '2024-07-18T21:00:00.000Z', 2, 2, 7),
(7, 6, '6', 1, '2024-07-23T21:00:00.000Z', '2024-07-30T21:00:00.000Z', 3, 2, 7),
(8, 8, '8', 1, '2024-07-24T21:00:00.000Z', '2024-07-29T21:00:00.000Z', 1, 1, 7);

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id_role` int(11) NOT NULL,
  `name_role` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id_role`, `name_role`) VALUES
(1, 'Администратор'),
(2, 'Заказчик');

-- --------------------------------------------------------

--
-- Структура таблицы `statuses_ci`
--

CREATE TABLE `statuses_ci` (
  `id_status_ci` int(11) NOT NULL,
  `name_status_ci` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `statuses_ci`
--

INSERT INTO `statuses_ci` (`id_status_ci`, `name_status_ci`) VALUES
(1, 'В работе'),
(2, 'Отменён'),
(3, 'Выполнен'),
(4, 'Нет заказа');

-- --------------------------------------------------------

--
-- Структура таблицы `statuses_cp`
--

CREATE TABLE `statuses_cp` (
  `id_status_cp` int(11) NOT NULL,
  `name_status_cp` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `statuses_cp`
--

INSERT INTO `statuses_cp` (`id_status_cp`, `name_status_cp`) VALUES
(1, 'В работе'),
(2, 'Отменён'),
(3, 'Выполнен'),
(4, 'Нет заказа');

-- --------------------------------------------------------

--
-- Структура таблицы `type_work`
--

CREATE TABLE `type_work` (
  `id_type` int(4) NOT NULL,
  `name_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `type_work`
--

INSERT INTO `type_work` (`id_type`, `name_type`) VALUES
(1, 'СП'),
(2, 'СИ'),
(3, 'СП и СИ');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
  `login` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fio_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_user` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id_user`, `id_role`, `login`, `password`, `fio_user`, `phone_user`) VALUES
(7, 2, '123', '123', 'Евген', '12345'),
(8, 1, '1', '1', 'Евген-адм', '123');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `acts`
--
ALTER TABLE `acts`
  ADD PRIMARY KEY (`id_act`),
  ADD KEY `id_type` (`id_type`),
  ADD KEY `id_status_cp` (`id_status_cp`,`id_status_ci`,`id_user`),
  ADD KEY `id_status_ci` (`id_status_ci`),
  ADD KEY `id_user` (`id_user`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`);

--
-- Индексы таблицы `statuses_ci`
--
ALTER TABLE `statuses_ci`
  ADD PRIMARY KEY (`id_status_ci`);

--
-- Индексы таблицы `statuses_cp`
--
ALTER TABLE `statuses_cp`
  ADD PRIMARY KEY (`id_status_cp`);

--
-- Индексы таблицы `type_work`
--
ALTER TABLE `type_work`
  ADD PRIMARY KEY (`id_type`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `id_role` (`id_role`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `acts`
--
ALTER TABLE `acts`
  MODIFY `id_act` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `statuses_ci`
--
ALTER TABLE `statuses_ci`
  MODIFY `id_status_ci` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `statuses_cp`
--
ALTER TABLE `statuses_cp`
  MODIFY `id_status_cp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `type_work`
--
ALTER TABLE `type_work`
  MODIFY `id_type` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `acts`
--
ALTER TABLE `acts`
  ADD CONSTRAINT `acts_ibfk_1` FOREIGN KEY (`id_status_ci`) REFERENCES `statuses_ci` (`id_status_ci`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `acts_ibfk_2` FOREIGN KEY (`id_status_cp`) REFERENCES `statuses_cp` (`id_status_cp`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `acts_ibfk_3` FOREIGN KEY (`id_type`) REFERENCES `type_work` (`id_type`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `acts_ibfk_4` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `statuses_ci`
--
ALTER TABLE `statuses_ci`
  ADD CONSTRAINT `statuses_ci_ibfk_1` FOREIGN KEY (`id_status_ci`) REFERENCES `orders` (`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `statuses_cp`
--
ALTER TABLE `statuses_cp`
  ADD CONSTRAINT `statuses_cp_ibfk_1` FOREIGN KEY (`id_status_cp`) REFERENCES `orders` (`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
