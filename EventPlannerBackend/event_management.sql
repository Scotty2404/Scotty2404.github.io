-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Mai 2025 um 17:19
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `event_management`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `answer`
--

CREATE TABLE `answer` (
  `answer_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `offered_answers_id` int(11) DEFAULT NULL,
  `text_answer` text DEFAULT NULL,
  `scale_answer` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `answer`
--

INSERT INTO `answer` (`answer_id`, `survey_id`, `question_id`, `offered_answers_id`, `text_answer`, `scale_answer`, `user_id`) VALUES
(3, 2, 1, 1, NULL, NULL, 2),
(4, 17, 24, 69, NULL, NULL, 2),
(5, 17, 25, 73, NULL, NULL, 2),
(15, 19, 28, 80, NULL, NULL, 2),
(16, 19, 28, 81, NULL, NULL, 2),
(17, 19, 29, 83, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `event`
--

CREATE TABLE `event` (
  `event_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `venue_id` int(11) DEFAULT NULL,
  `playlist_id` int(11) DEFAULT NULL,
  `qr_id` int(11) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `startdate` datetime NOT NULL,
  `enddate` datetime NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `max_guests` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `survey_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `event`
--

INSERT INTO `event` (`event_id`, `title`, `description`, `venue_id`, `playlist_id`, `qr_id`, `access_token`, `startdate`, `enddate`, `active`, `max_guests`, `image`, `survey_id`) VALUES
(21, 'asd', 'asdasdas', 21, NULL, 9, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDU5NjU0NDA4MzEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDU5NjU0NDB9.PpoUCTvhEno_V03_cyDMoZx5ZPkgzyMcfmK9mKexN2o', '2025-05-08 00:00:00', '2025-05-08 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 22),
(22, 'sdf', 'sdfsdf', 23, NULL, 10, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTEzMjI5OTYsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTEzMjJ9.z38LKVha7XgyJiyzHf7g6VhaxvmJ-3zdl017f_qqUgI', '2025-06-13 00:00:00', '2025-06-13 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 23),
(23, 'dfg', 'zdrrg', 24, NULL, 11, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE0OTg5NTIsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE0OTh9.xFMeqGqRA1Aj4_y9ZgELft6Dr6BJAzMqM5qW5A7FSuQ', '2025-06-26 00:00:00', '2025-06-26 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 24),
(24, 'sdfsdf', 'fsdsdfsdfsdfsdf', 25, NULL, 12, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNCwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE2MDA1MzUsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE2MDB9.ViNJrpuXS1gFaKemTjnGP3TDrt8pB1a-SG4Y9bJ3n9E', '2025-06-21 00:00:00', '2025-06-21 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 25),
(25, 'asdasdasd', 'asdasdasd', 26, NULL, 13, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMTAyNDEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMTB9.rLmQNLzdHYfu0dseAyKaSDAb-TR0Tad2pKL-WZlj5no', '2025-05-16 00:00:00', '2025-05-16 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 26),
(26, 'asdas', 'asdasdasd', 27, NULL, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMjUwOTksInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMjV9.I-XItwNt97y_1bWUiByqfmbKCoegQNcNydO_ZipGWSU', '2025-06-14 00:00:00', '2025-06-14 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 27),
(27, 'sdfsdf', 'dfsdfsdf', 28, NULL, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIyNjQxODcsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIyNjR9.SAB55k0rQj0_bW5ePr5xrttne4ELNP7lE-_Rs2LGKCo', '2025-05-08 00:00:00', '2025-05-08 23:59:59', 1, 0, '/auswahl/hochzeit.jpg', 28);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `extra_guests`
--

CREATE TABLE `extra_guests` (
  `extra_guests_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `offeredanswers`
--

CREATE TABLE `offeredanswers` (
  `offered_answers_id` int(11) NOT NULL,
  `answer_text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `offeredanswers`
--

INSERT INTO `offeredanswers` (`offered_answers_id`, `answer_text`) VALUES
(1, 'yxcy'),
(2, 'sdfsdf'),
(3, 'sdfsdf'),
(4, 'sdfsdf'),
(5, 'sfdsdfsd'),
(6, 'fsdf'),
(7, 'sdfsdfsdfsdf'),
(8, 'sdfsdfsdfs'),
(9, 'fsdf'),
(10, 'sdfsdfsdfsdf'),
(11, 'sdfsdfsdfs'),
(12, 'sdfsdfsdfsdf'),
(13, 'sdfsdfsdfsdf'),
(14, 'dsfsdfsdfsdf'),
(15, 'fsdf'),
(16, 'sdfsdfsdfsdf'),
(17, 'sdfsdfsdfs'),
(18, 'sdfsdfsdfsdf'),
(19, 'sdfsdfsdfsdf'),
(20, 'dsfsdfsdfsdf'),
(21, 'fsdf'),
(22, 'sdfsdfsdfsdf'),
(23, 'sdfsdfsdfs'),
(24, 'sdfsdfsdfsdf'),
(25, 'sdfsdfsdfsdf'),
(26, 'dsfsdfsdfsdf'),
(27, 'fsdf'),
(28, 'sdfsdfsdfsdf'),
(29, 'sdfsdfsdfs'),
(30, 'sdfsdfsdfsdf'),
(31, 'sdfsdfsdfsdf'),
(32, 'dsfsdfsdfsdf'),
(33, 'fsdf'),
(34, 'sdfsdfsdfsdf'),
(35, 'sdfsdfsdfs'),
(36, 'sdfsdfsdfsdf'),
(37, 'sdfsdfsdfsdf'),
(38, 'dsfsdfsdfsdf'),
(39, 'fsdf'),
(40, 'sdfsdfsdfsdf'),
(41, 'sdfsdfsdfs'),
(42, 'sdfsdfsdfsdf'),
(43, 'sdfsdfsdfsdf'),
(44, 'dsfsdfsdfsdf'),
(45, 'fsdf'),
(46, 'sdfsdfsdfsdf'),
(47, 'sdfsdfsdfs'),
(48, 'sdfsdfsdfsdf'),
(49, 'sdfsdfsdfsdf'),
(50, 'dsfsdfsdfsdf'),
(51, 'fsdf'),
(52, 'sdfsdfsdfsdf'),
(53, 'sdfsdfsdfs'),
(54, 'sdfsdfsdfsdf'),
(55, 'sdfsdfsdfsdf'),
(56, 'dsfsdfsdfsdf'),
(57, 'fsdf'),
(58, 'sdfsdfsdfsdf'),
(59, 'sdfsdfsdfs'),
(60, 'sdfsdfsdfsdf'),
(61, 'sdfsdfsdfsdf'),
(62, 'dsfsdfsdfsdf'),
(63, 'fsdf'),
(64, 'sdfsdfsdfsdf'),
(65, 'sdfsdfsdfs'),
(66, 'fsdf'),
(67, 'sdfsdfsdfsdf'),
(68, 'sdfsdfsdfs'),
(69, 'asdasdasd'),
(70, 'asdasdasd'),
(71, 'asdasdas'),
(72, 'adsasdasdasd'),
(73, 'asdasdasd'),
(74, 'asdasdas'),
(75, 'sdasd'),
(76, 'asdasd'),
(77, 'sdasda'),
(78, 'asda'),
(79, 'asda'),
(80, 'asdasdasd'),
(81, 'sdasdasf'),
(82, 'fasfasf'),
(83, 'sdasd'),
(84, 'asdasd'),
(85, 'asdasdas'),
(86, 'asdasd'),
(87, 'asdasd'),
(88, 'asdasd'),
(89, 'asdasd'),
(90, 'sdasd'),
(91, 'dasdasd'),
(92, 'asdasd'),
(93, 'asdasdasdas'),
(94, 'asdassd'),
(95, 'sdf'),
(96, 'dfsdfsdf'),
(97, 'sdfsdf');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `playlist`
--

CREATE TABLE `playlist` (
  `playlist_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `playlist`
--

INSERT INTO `playlist` (`playlist_id`) VALUES
(1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `qr_code`
--

CREATE TABLE `qr_code` (
  `qr_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `qr_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `qr_code`
--

INSERT INTO `qr_code` (`qr_id`, `url`, `access_token`, `qr_image`) VALUES
(9, 'EventPlannerFrontend/event/21?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDU5NjU0NDA4MzEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDU5NjU0NDB9.PpoUCTvhEno_V03_cyDMoZx5ZPkgzyMcfmK9mKexN2o', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDU5NjU0NDA4MzEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDU5NjU0NDB9.PpoUCTvhEno_V03_cyDMoZx5ZPkgzyMcfmK9mKexN2o', '/qr-codes/event-21-1745965440832.png'),
(10, 'EventPlannerFrontend/event/22?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTEzMjI5OTYsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTEzMjJ9.z38LKVha7XgyJiyzHf7g6VhaxvmJ-3zdl017f_qqUgI', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTEzMjI5OTYsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTEzMjJ9.z38LKVha7XgyJiyzHf7g6VhaxvmJ-3zdl017f_qqUgI', '/qr-codes/event-22-1746111322997.png'),
(11, 'EventPlannerFrontend/event/23?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE0OTg5NTIsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE0OTh9.xFMeqGqRA1Aj4_y9ZgELft6Dr6BJAzMqM5qW5A7FSuQ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyMywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE0OTg5NTIsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE0OTh9.xFMeqGqRA1Aj4_y9ZgELft6Dr6BJAzMqM5qW5A7FSuQ', '/qr-codes/event-23-1746111498952.png'),
(12, 'EventPlannerFrontend/event/24?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNCwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE2MDA1MzUsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE2MDB9.ViNJrpuXS1gFaKemTjnGP3TDrt8pB1a-SG4Y9bJ3n9E', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNCwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTE2MDA1MzUsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTE2MDB9.ViNJrpuXS1gFaKemTjnGP3TDrt8pB1a-SG4Y9bJ3n9E', '/qr-codes/event-24-1746111600536.png'),
(13, 'EventPlannerFrontend/event/25?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMTAyNDEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMTB9.rLmQNLzdHYfu0dseAyKaSDAb-TR0Tad2pKL-WZlj5no', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNSwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMTAyNDEsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMTB9.rLmQNLzdHYfu0dseAyKaSDAb-TR0Tad2pKL-WZlj5no', '/qr-codes/event-25-1746112110241.png'),
(14, 'EventPlannerFrontend/event/26?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMjUwOTksInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMjV9.I-XItwNt97y_1bWUiByqfmbKCoegQNcNydO_ZipGWSU', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNiwiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIxMjUwOTksInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIxMjV9.I-XItwNt97y_1bWUiByqfmbKCoegQNcNydO_ZipGWSU', '/qr-codes/event-26-1746112125099.png'),
(15, 'EventPlannerFrontend/event/27?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIyNjQxODcsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIyNjR9.SAB55k0rQj0_bW5ePr5xrttne4ELNP7lE-_Rs2LGKCo', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldmVudElkIjoyNywiY3JlYXRlZEJ5IjoyLCJjcmVhdGVkQXQiOjE3NDYxMTIyNjQxODcsInR5cGUiOiJldmVudC1hY2Nlc3MiLCJpYXQiOjE3NDYxMTIyNjR9.SAB55k0rQj0_bW5ePr5xrttne4ELNP7lE-_Rs2LGKCo', '/qr-codes/event-27-1746112264188.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `question`
--

CREATE TABLE `question` (
  `question_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `type` enum('multiple','scale','text') NOT NULL DEFAULT 'text',
  `min_value` int(11) DEFAULT NULL,
  `max_value` int(11) DEFAULT NULL,
  `max_length` int(11) DEFAULT 500,
  `multiple_selection` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `question`
--

INSERT INTO `question` (`question_id`, `question_text`, `type`, `min_value`, `max_value`, `max_length`, `multiple_selection`) VALUES
(1, 'yxc', 'multiple', NULL, NULL, 500, 0),
(2, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(3, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(4, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(5, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(6, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(7, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(8, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(9, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(10, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(11, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(12, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(13, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(14, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(15, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(16, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(17, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(18, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(19, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(20, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(21, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(22, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(23, 'sdfsdf', 'multiple', NULL, NULL, 500, 0),
(24, 'asdasdasdasd', 'multiple', NULL, NULL, 500, 1),
(25, 'asdasdasd', 'multiple', NULL, NULL, 500, 1),
(26, 'asda', 'multiple', NULL, NULL, 500, 0),
(27, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(28, 'asdasd', 'multiple', NULL, NULL, 500, 1),
(29, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(30, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(31, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(32, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(33, 'asdasd', 'multiple', NULL, NULL, 500, 0),
(34, 'asda', 'multiple', NULL, NULL, 500, 0),
(35, 'asdasdasd', 'multiple', NULL, NULL, 500, 0),
(36, 'sdfsd', 'multiple', NULL, NULL, 500, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `question_offeredanswers`
--

CREATE TABLE `question_offeredanswers` (
  `question_offered_answers_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `offered_answers_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `question_offeredanswers`
--

INSERT INTO `question_offeredanswers` (`question_offered_answers_id`, `question_id`, `offered_answers_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 2, 3),
(4, 2, 4),
(5, 2, 5),
(6, 3, 6),
(7, 3, 7),
(8, 3, 8),
(9, 4, 9),
(10, 4, 10),
(11, 4, 11),
(12, 5, 12),
(13, 5, 13),
(14, 5, 14),
(15, 6, 15),
(16, 6, 16),
(17, 6, 17),
(18, 7, 18),
(19, 7, 19),
(20, 7, 20),
(21, 8, 21),
(22, 8, 22),
(23, 8, 23),
(24, 9, 24),
(25, 9, 25),
(26, 9, 26),
(27, 10, 27),
(28, 10, 28),
(29, 10, 29),
(30, 11, 30),
(31, 11, 31),
(32, 11, 32),
(33, 12, 33),
(34, 12, 34),
(35, 12, 35),
(36, 13, 36),
(37, 13, 37),
(38, 13, 38),
(39, 14, 39),
(40, 14, 40),
(41, 14, 41),
(42, 15, 42),
(43, 15, 43),
(44, 15, 44),
(45, 16, 45),
(46, 16, 46),
(47, 16, 47),
(48, 17, 48),
(49, 17, 49),
(50, 17, 50),
(51, 18, 51),
(52, 18, 52),
(53, 18, 53),
(54, 19, 54),
(55, 19, 55),
(56, 19, 56),
(57, 20, 57),
(58, 20, 58),
(59, 20, 59),
(60, 21, 60),
(61, 21, 61),
(62, 21, 62),
(63, 22, 63),
(64, 22, 64),
(65, 22, 65),
(66, 23, 66),
(67, 23, 67),
(68, 23, 68),
(69, 24, 69),
(70, 24, 70),
(71, 24, 71),
(72, 25, 72),
(73, 25, 73),
(74, 25, 74),
(75, 26, 75),
(76, 26, 76),
(77, 26, 77),
(78, 27, 78),
(79, 28, 79),
(80, 28, 80),
(81, 28, 81),
(82, 28, 82),
(83, 29, 83),
(84, 29, 84),
(85, 29, 85),
(86, 30, 86),
(87, 31, 87),
(88, 32, 88),
(89, 33, 89),
(90, 34, 90),
(91, 34, 91),
(92, 34, 92),
(93, 35, 93),
(94, 35, 94),
(95, 36, 95),
(96, 36, 96),
(97, 36, 97);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `survey`
--

CREATE TABLE `survey` (
  `survey_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `active` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `survey`
--

INSERT INTO `survey` (`survey_id`, `title`, `description`, `created_by`, `active`, `created_at`) VALUES
(1, '', 'Hier wird später die Art der Umfrage hinterlegt', 0, 1, '2025-04-24 22:25:40'),
(2, 'Umfrage für yxc', 'Event-Umfrage', 2, 1, '2025-04-24 23:25:41'),
(3, 'Umfrage für gfevsf', 'Event-Umfrage', 2, 1, '2025-04-27 13:03:00'),
(4, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:03:50'),
(5, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:20'),
(6, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:39'),
(7, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:42'),
(8, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:44'),
(9, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:51'),
(10, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:51'),
(11, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:51'),
(12, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:51'),
(13, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:51'),
(14, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:04:57'),
(15, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:05:04'),
(16, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-04-27 13:05:05'),
(17, 'Umfrage für sdasdasdasd', 'Event-Umfrage', 2, 1, '2025-04-27 13:31:07'),
(18, 'Umfrage für asdas', 'Event-Umfrage', 2, 1, '2025-04-27 13:35:34'),
(19, 'Umfrage für asda', 'Event-Umfrage', 2, 1, '2025-04-27 14:01:15'),
(20, 'Umfrage für sdfsdf', 'Event-Umfrage', 2, 1, '2025-04-30 00:10:13'),
(21, 'Umfrage für dasd', 'Event-Umfrage', 2, 1, '2025-04-30 00:11:25'),
(22, 'Umfrage für asd', 'Event-Umfrage', 2, 1, '2025-04-30 00:24:00'),
(23, 'Umfrage für sdf', 'Event-Umfrage', 2, 1, '2025-05-01 16:55:22'),
(24, 'Umfrage für dfg', 'Event-Umfrage', 2, 1, '2025-05-01 16:58:18'),
(25, 'Umfrage für sdfsdf', 'Event-Umfrage', 2, 1, '2025-05-01 17:00:00'),
(26, 'Umfrage für asdasdasd', 'Event-Umfrage', 2, 1, '2025-05-01 17:08:30'),
(27, 'Umfrage für asdas', 'Event-Umfrage', 2, 1, '2025-05-01 17:08:45'),
(28, 'Umfrage für sdfsdf', 'Event-Umfrage', 2, 1, '2025-05-01 17:11:04');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `survey_question`
--

CREATE TABLE `survey_question` (
  `survey_question_id` int(11) NOT NULL,
  `survey_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `survey_question`
--

INSERT INTO `survey_question` (`survey_question_id`, `survey_id`, `question_id`) VALUES
(1, 2, 1),
(2, 3, 2),
(3, 5, 3),
(4, 6, 4),
(5, 6, 5),
(6, 7, 6),
(7, 7, 7),
(8, 8, 8),
(9, 8, 9),
(10, 9, 10),
(11, 9, 11),
(12, 10, 12),
(13, 10, 13),
(14, 11, 14),
(15, 11, 15),
(16, 12, 16),
(17, 12, 17),
(18, 13, 18),
(19, 13, 19),
(20, 14, 20),
(21, 14, 21),
(22, 15, 22),
(23, 16, 23),
(24, 17, 24),
(25, 17, 25),
(26, 18, 26),
(27, 18, 27),
(28, 19, 28),
(29, 19, 29),
(30, 20, 30),
(31, 21, 31),
(32, 22, 32),
(33, 22, 33),
(34, 25, 34),
(35, 26, 35),
(36, 28, 36);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`user_id`, `firstname`, `lastname`, `email`, `password`) VALUES
(1, 'Max', 'Mustermann', 'max.mustermann@beispiel.de', '$2b$10$roR7Tb1Y/pwnAs314HSjHeh0I.1NI5i8Um.eaN8VzWL0t7v2lEsfW'),
(2, 'georg', 'kaiser', 'test@test.de', '$2b$10$RltcURzbshmUWHzSvQiLP.GLUc3zgL5bKdEeP72yYu61YUmWCaub6');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_event`
--

CREATE TABLE `user_event` (
  `user_event_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `confirmation` tinyint(1) DEFAULT 0,
  `owner` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user_event`
--

INSERT INTO `user_event` (`user_event_id`, `user_id`, `event_id`, `confirmation`, `owner`) VALUES
(9, 2, 21, 1, 1),
(10, 2, 22, 1, 1),
(11, 2, 23, 1, 1),
(12, 2, 24, 1, 1),
(13, 2, 25, 1, 1),
(14, 2, 26, 1, 1),
(15, 2, 27, 1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `venue`
--

CREATE TABLE `venue` (
  `venue_id` int(11) NOT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `postal_code` int(11) NOT NULL,
  `google_maps_link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `venue`
--

INSERT INTO `venue` (`venue_id`, `street`, `city`, `postal_code`, `google_maps_link`) VALUES
(1, 'Dippold', 'asda', 41216, NULL),
(2, 'yxc', 'yxc', 12345, NULL),
(3, 'sdfsdf', 'sdfsdf', 11235, NULL),
(4, 'asdasdas', 'dasdasd', 12345, NULL),
(5, 'asdasd', 'asd', 21314, NULL),
(6, 'asda', 'asda', 12345, NULL),
(7, 'asdasd', 'asdasd', 12345, 'https://www.google.com/maps/place?q=asdasd%2C%20asdasd%2C%20undefined'),
(8, 'sdfsd', 'fsdf', 12345, 'https://www.google.com/maps/place/sdfsd%2C%2012345%20fsdf'),
(9, 'ssdfsdf', 'asdasdasd', 12345, 'https://www.google.com/maps/place/ssdfsdf%2C%2012345%20asdasdasd'),
(10, 'sfddsf', 'sdfsdf', 12345, 'https://www.google.com/maps/place/sfddsf%2C%2012345%20sdfsdf'),
(11, 'sfddsf', 'sdfsdf', 12345, 'https://www.google.com/maps/place/sfddsf%2C%2012345%20sdfsdf'),
(12, 'sdfsdfs', 'dfsdfs', 12345, 'https://www.google.com/maps/place/sdfsdfs%2C%2012345%20dfsdfs'),
(13, 'asdasd', 'asd', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20asd'),
(14, 'sdfsdf', 'sdfsdf', 12345, 'https://www.google.com/maps/place/sdfsdf%2C%2012345%20sdfsdf'),
(15, 'sdfsdf', 'sdfsdf', 12345, 'https://www.google.com/maps/place/sdfsdf%2C%2012345%20sdfsdf'),
(16, 'sdfsdf', 'sdfs', 12345, 'https://www.google.com/maps/place/sdfsdf%2C%2012345%20sdfs'),
(17, 'sdfsdf', 'sdfs', 12345, 'https://www.google.com/maps/place/sdfsdf%2C%2012345%20sdfs'),
(18, 'asdasd', 'dsdasd', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20dsdasd'),
(19, 'asdasd', 'dsdasd', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20dsdasd'),
(20, 'asdasd', 'asda', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20asda'),
(21, 'asdasd', 'asda', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20asda'),
(22, 'sdfsdf', 'sdf', 12345, 'https://www.google.com/maps/place?q=sdfsdf%2C%20sdf%2C%20undefined'),
(23, 'sdfsd', 'fsdf', 12345, 'https://www.google.com/maps/place/sdfsd%2C%2012345%20fsdf'),
(24, 'dfgdf', 'gdfgd', 12345, 'https://www.google.com/maps/place/dfgdf%2C%2012345%20gdfgd'),
(25, 'sdfsdf', 'sdf', 12345, 'https://www.google.com/maps/place/sdfsdf%2C%2012345%20sdf'),
(26, 'asdas', 'dasd', 13245, 'https://www.google.com/maps/place/asdas%2C%2013245%20dasd'),
(27, 'asdasd', 'asd', 12345, 'https://www.google.com/maps/place/asdasd%2C%2012345%20asd'),
(28, 'sdf', 'sdfsdf', 12345, 'https://www.google.com/maps/place/sdf%2C%2012345%20sdfsdf');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`answer_id`),
  ADD UNIQUE KEY `unique_answer` (`survey_id`,`question_id`,`user_id`,`offered_answers_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `offered_answers_id` (`offered_answers_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_answer_user_survey` (`user_id`,`survey_id`);

--
-- Indizes für die Tabelle `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `venue_id` (`venue_id`),
  ADD KEY `playlist_id` (`playlist_id`),
  ADD KEY `qr_id` (`qr_id`),
  ADD KEY `survey_id` (`survey_id`);

--
-- Indizes für die Tabelle `extra_guests`
--
ALTER TABLE `extra_guests`
  ADD PRIMARY KEY (`extra_guests_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indizes für die Tabelle `offeredanswers`
--
ALTER TABLE `offeredanswers`
  ADD PRIMARY KEY (`offered_answers_id`);

--
-- Indizes für die Tabelle `playlist`
--
ALTER TABLE `playlist`
  ADD PRIMARY KEY (`playlist_id`);

--
-- Indizes für die Tabelle `qr_code`
--
ALTER TABLE `qr_code`
  ADD PRIMARY KEY (`qr_id`);

--
-- Indizes für die Tabelle `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `idx_question_type` (`type`);

--
-- Indizes für die Tabelle `question_offeredanswers`
--
ALTER TABLE `question_offeredanswers`
  ADD PRIMARY KEY (`question_offered_answers_id`),
  ADD UNIQUE KEY `question_id` (`question_id`,`offered_answers_id`),
  ADD KEY `offered_answers_id` (`offered_answers_id`);

--
-- Indizes für die Tabelle `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`survey_id`),
  ADD KEY `idx_survey_created_by` (`created_by`);

--
-- Indizes für die Tabelle `survey_question`
--
ALTER TABLE `survey_question`
  ADD PRIMARY KEY (`survey_question_id`),
  ADD UNIQUE KEY `survey_id` (`survey_id`,`question_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indizes für die Tabelle `user_event`
--
ALTER TABLE `user_event`
  ADD PRIMARY KEY (`user_event_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indizes für die Tabelle `venue`
--
ALTER TABLE `venue`
  ADD PRIMARY KEY (`venue_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `answer`
--
ALTER TABLE `answer`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `event`
--
ALTER TABLE `event`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT für Tabelle `extra_guests`
--
ALTER TABLE `extra_guests`
  MODIFY `extra_guests_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `offeredanswers`
--
ALTER TABLE `offeredanswers`
  MODIFY `offered_answers_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT für Tabelle `playlist`
--
ALTER TABLE `playlist`
  MODIFY `playlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `qr_code`
--
ALTER TABLE `qr_code`
  MODIFY `qr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT für Tabelle `question`
--
ALTER TABLE `question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT für Tabelle `question_offeredanswers`
--
ALTER TABLE `question_offeredanswers`
  MODIFY `question_offered_answers_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT für Tabelle `survey`
--
ALTER TABLE `survey`
  MODIFY `survey_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT für Tabelle `survey_question`
--
ALTER TABLE `survey_question`
  MODIFY `survey_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `user_event`
--
ALTER TABLE `user_event`
  MODIFY `user_event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT für Tabelle `venue`
--
ALTER TABLE `venue`
  MODIFY `venue_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`),
  ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  ADD CONSTRAINT `answer_ibfk_3` FOREIGN KEY (`offered_answers_id`) REFERENCES `offeredanswers` (`offered_answers_id`),
  ADD CONSTRAINT `answer_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints der Tabelle `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`),
  ADD CONSTRAINT `event_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`playlist_id`),
  ADD CONSTRAINT `event_ibfk_3` FOREIGN KEY (`qr_id`) REFERENCES `qr_code` (`qr_id`),
  ADD CONSTRAINT `event_ibfk_4` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`);

--
-- Constraints der Tabelle `extra_guests`
--
ALTER TABLE `extra_guests`
  ADD CONSTRAINT `extra_guests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `extra_guests_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`);

--
-- Constraints der Tabelle `question_offeredanswers`
--
ALTER TABLE `question_offeredanswers`
  ADD CONSTRAINT `question_offeredanswers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`),
  ADD CONSTRAINT `question_offeredanswers_ibfk_2` FOREIGN KEY (`offered_answers_id`) REFERENCES `offeredanswers` (`offered_answers_id`);

--
-- Constraints der Tabelle `survey`
--
ALTER TABLE `survey`
  ADD CONSTRAINT `fk_survey_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`);

--
-- Constraints der Tabelle `survey_question`
--
ALTER TABLE `survey_question`
  ADD CONSTRAINT `survey_question_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey` (`survey_id`),
  ADD CONSTRAINT `survey_question_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `question` (`question_id`);

--
-- Constraints der Tabelle `user_event`
--
ALTER TABLE `user_event`
  ADD CONSTRAINT `user_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `user_event_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
