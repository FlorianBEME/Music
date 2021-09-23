SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
SET GLOBAL time_zone = '+1:00';
SET FOREIGN_KEY_CHECKS = 0;
SET GROUP_CONCAT_MAX_LEN=32768;
SET @tables = NULL;
SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables
  FROM information_schema.tables
  WHERE table_schema = (SELECT DATABASE());
SELECT IFNULL(@tables,'dummy') INTO @tables;
SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `currentsongs` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `artist` varchar(255) NOT NULL,
  `countVote` varchar(255) NOT NULL,
  `unavailable` boolean NOT NULL, 
  `isValid` boolean NOT NULL, 
  `isNew` boolean NOT NULL
);

CREATE TABLE `events` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bg_music` varchar(255) NULL
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL
);

CREATE TABLE `songInCurrent` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL
);

INSERT INTO users ( user_name , user_password ) VALUES ("Admin","$2b$10$dH1ZvM2SRCwGBwWxl/CDlurofNaiTIAOW5f0kx7XY0Ej.kknFf9j2");
INSERT INTO users ( user_name , user_password ) VALUES ("Alek","$2b$10$vr613HdUrNoPVQ//USyxgOPtA3RKB1jzYz0EDBsBNY/D0wzj0mE42");

INSERT INTO app (text, type) VALUEs ("Anniversaire de Valentin" , "Name");
