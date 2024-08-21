CREATE TABLE `deals` (
  `sr_id` varchar(200) NOT NULL,
  `channel` varchar(40) NOT NULL,
  `partner` varchar(60) NOT NULL,
  `price` decimal(9,2) NOT NULL,
  `url` varchar(4000) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sr_id`, `channel`, `partner`)
);
