-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               11.3.2-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank-Struktur für nodedb
CREATE DATABASE IF NOT EXISTS `nodedb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `nodedb`;

-- Exportiere Struktur von Tabelle nodedb.adressen
CREATE TABLE IF NOT EXISTS `adressen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adr` char(100) DEFAULT NULL,
  `place` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle nodedb.adressen: ~10 rows (ungefähr)
INSERT INTO `adressen` (`id`, `adr`, `place`) VALUES
	(1, 'Messeschnellweg undefined, 30625, Hannover, Niedersachsen, Deutschland', NULL),
	(2, 'Anna-von-Borries-Straße undefined, 30625, Hannover, Niedersachsen, Deutschland', NULL),
	(3, 'Ohedamm undefined, 30169, Hannover, Niedersachsen, Deutschland', NULL),
	(4, 'Brühlstraße undefined, 35683, Dillenburg, Niedersachsen, Deutschland', NULL),
	(5, 'Lotte - Burghardt - Weg undefined, 30419, Hannover, Niedersachsen, Deutschland', NULL),
	(6, 'Roesebeckstraße undefined, 30449, Hannover, Niedersachsen, Deutschland', NULL),
	(7, 'Sven-Hedin-Straße undefined, 30655, Hannover, Niedersachsen, Deutschland', NULL),
	(8, 'Davenstedter Straße undefined, 30455, Hannover, Niedersachsen, Deutschland', NULL),
	(9, 'Vahrenwalder Straße undefined, 30165, Hannover, Niedersachsen, Deutschland', NULL),
	(10, 'Plathnerstraße undefined, 30175, Hannover, Niedersachsen, Deutschland', NULL);

-- Exportiere Struktur von Tabelle nodedb.customers
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `steps` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT 1,
  `stepsLastDay` int(11) DEFAULT NULL,
  `dmgPoints` int(11) DEFAULT NULL,
  `lastClick` int(11) DEFAULT NULL,
  `numberOfDebuff` int(11) DEFAULT NULL,
  `poisened` int(11) DEFAULT NULL,
  `singed` int(11) DEFAULT NULL,
  `potionClick` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle nodedb.customers: ~17 rows (ungefähr)
INSERT INTO `customers` (`id`, `name`, `password`, `steps`, `level`, `stepsLastDay`, `dmgPoints`, `lastClick`, `numberOfDebuff`, `poisened`, `singed`, `potionClick`) VALUES
	(1, '1', '1', 86753, 24, 1, 2400, 0, 5, 0, 1000, 1),
	(74, 'c', 'c', 24748, 11, 0, 0, 1, 0, 0, 1000, 1),
	(75, 'a', 'a', 146065, 32, 0, 3201, 0, 93, 1, 74, 0),
	(76, 'B', 'b', 5111, NULL, 0, NULL, 0, 0, 1, 82, 0),
	(77, 'q', 'q', 7656, 7, 0, 775, 0, 62, 1, 82, 0),
	(78, 'w', 'w', NULL, NULL, 0, NULL, 0, NULL, 1, 82, 0),
	(79, 'p', 'p', 0, 1, 0, 725, 0, 993, 1, 89, 0),
	(80, 'o', 'o', 700, 1, 0, 313, 0, 0, 1, 82, 1),
	(81, 'Hevend', 'Hevend', 22495, 13, 0, 1307, 0, 18, 0, 1000, 0),
	(82, 'Nali', 'nali', 1001, 2, 1, 0, 1, 993, 1, 84, 1),
	(83, '2', '2', NULL, 1, 0, 102, 0, 0, 1, 82, 0),
	(84, 'Hemen', 'Hemen', NULL, NULL, 0, NULL, 0, NULL, 1, 82, 0),
	(86, 'E', 'e', 23272, 13, 0, 1300, 0, 97, 0, 1000, 0),
	(87, 'Heveeee', 'Heve', 0, 1, 0, 200, 0, 1, 1, 80, 1),
	(88, '', '', NULL, 1, 0, 100, 0, NULL, 1, 79, 0),
	(89, 'Mouna', '8', 0, 1, 6, 0, 0, 0, 1, 90, 1),
	(90, 'Merhat', 'machete', 24, 1, 24, 0, 1, 0, 1, 81, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
