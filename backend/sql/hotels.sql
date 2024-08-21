CREATE TABLE `hotels` (
  `name` varchar(200) NOT NULL,
  `rating` char(4) default NULL,
  `image_url` varchar(500) default NULL,
  `address` varchar(200) NOT NULL,
  `stars` char(4) default NULL,
  `skyscanner_id` varchar(40) default NULL,
  `hotelscombined_id` varchar(40) default NULL,
  `trivago_id` varchar(100) default NULL,
  `momondo_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`name`, `address`)
);
