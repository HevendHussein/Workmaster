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

-- Exportiere Struktur von Tabelle user.adressen
CREATE TABLE IF NOT EXISTS `adressen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adr` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle user.adressen: ~10 rows (ungefähr)
INSERT INTO `adressen` (`id`, `adr`) VALUES
	(1, 'Messeschnellweg undefined, 30625, Hannover, Niedersachsen, Deutschland'),
	(2, 'Anna-von-Borries-Straße undefined, 30625, Hannover, Niedersachsen, Deutschland'),
	(3, 'Ohedamm undefined, 30169, Hannover, Niedersachsen, Deutschland'),
	(4, 'Distelkamp undefined, 30459, Hannover, Niedersachsen, Deutschland'),
	(5, 'Lotte - Burghardt - Weg undefined, 30419, Hannover, Niedersachsen, Deutschland'),
	(6, 'Roesebeckstraße undefined, 30449, Hannover, Niedersachsen, Deutschland'),
	(7, 'Sven-Hedin-Straße undefined, 30555, Hannover, Niedersachsen, Deutschland'),
	(8, 'Davenstedter Straße undefined, 30455, Hannover, Niedersachsen, Deutschland'),
	(9, 'Vahrenwalder Straße undefined, 30165, Hannover, Niedersachsen, Deutschland'),
	(10, 'Plathnerstraße undefined, 30175, Hannover, Niedersachsen, Deutschland');

-- Exportiere Struktur von Tabelle user.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(50) DEFAULT NULL,
  `password` char(50) DEFAULT NULL,
  `steps` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `stepsLastDay` int(11) DEFAULT NULL,
  `dmgPoints` int(11) DEFAULT NULL,
  `lastClick` int(11) DEFAULT NULL,
  `numberOfDebuff` int(11) DEFAULT NULL,
  `poisened` int(11) DEFAULT NULL,
  `singed` int(11) DEFAULT NULL,
  `potionClick` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportiere Daten aus Tabelle user.user: ~2 rows (ungefähr)
INSERT INTO `user` (`id`, `name`, `password`, `steps`, `level`, `stepsLastDay`, `dmgPoints`, `lastClick`, `numberOfDebuff`, `poisened`, `singed`, `potionClick`) VALUES
	(9, '99', '99', 3001, 3, 1, NULL, 1, NULL, 1, 10, 1),
	(10, '1', '1', 1, NULL, 1, NULL, NULL, 0, NULL, NULL, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
