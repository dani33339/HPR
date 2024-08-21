CREATE TABLE `search_requests` (
  `name` varchar(200) NOT NULL,
  `checkin_date` date NOT NULL,
  `checkout_date` date NOT NULL,
  `group_adults` INT NOT NULL,
  `no_rooms` INT NOT NULL,
  `children_ages` varchar(10),
  `sr_id` varchar(200) NOT NULL,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` varchar(40) NOT NULL,
  PRIMARY KEY (`sr_id`)
);
