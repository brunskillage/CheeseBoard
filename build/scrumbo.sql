-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql02.myhostcp.com
-- Generation Time: Jul 03, 2019 at 03:50 PM
-- Server version: 10.0.36-MariaDB-1~trusty
-- PHP Version: 5.6.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `scrumbo`
--

-- --------------------------------------------------------

--
-- Table structure for table `backlog`
--

CREATE TABLE `backlog` (
  `id` int(11) NOT NULL COMMENT 'The backlog id',
  `nameof` varchar(50) NOT NULL COMMENT 'the backlog name',
  `textof` varchar(200) NOT NULL COMMENT 'the backlog description',
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `binary_assets`
--

CREATE TABLE `binary_assets` (
  `id` int(11) NOT NULL COMMENT 'the id',
  `original_name` varchar(256) NOT NULL COMMENT 'hte original name',
  `stored_name` varchar(256) DEFAULT NULL COMMENT 'the file system stored name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE `boards` (
  `id` int(11) NOT NULL,
  `nameof` varchar(100) NOT NULL COMMENT 'Name of the board',
  `hash` varchar(12) NOT NULL COMMENT 'the unique hash of this board',
  `group_hash` varchar(60) DEFAULT NULL COMMENT 'the grouping hash',
  `extra_status_1` varchar(15) DEFAULT NULL COMMENT 'First extra column after todo',
  `extra_status_2` varchar(15) DEFAULT NULL COMMENT 'First extra column after status 1',
  `more_info` varchar(300) DEFAULT NULL COMMENT 'Additional information for the board',
  `row_header_name` varchar(30) DEFAULT NULL COMMENT 'The alternative name for a story',
  `custom_css` varchar(2000) DEFAULT NULL COMMENT 'The custom css'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lat` varchar(20) NOT NULL,
  `lng` varchar(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `date_modified` datetime NOT NULL,
  `source` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `log_items`
--

CREATE TABLE `log_items` (
  `id` int(11) NOT NULL COMMENT 'Log Id',
  `board_id` int(11) NOT NULL COMMENT 'The Board Id',
  `story_id` int(11) NOT NULL COMMENT 'The Story Id',
  `task_id` int(11) NOT NULL COMMENT 'The Task Id',
  `user_id` int(11) NOT NULL COMMENT 'The User Id',
  `textof` varchar(300) NOT NULL COMMENT 'The Log Item Text',
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The date created',
  `action` int(11) NOT NULL COMMENT 'The enum of the action'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `stories`
--

CREATE TABLE `stories` (
  `id` int(11) NOT NULL COMMENT 'story id',
  `textof` varchar(300) NOT NULL COMMENT 'story text',
  `board_id` int(11) NOT NULL COMMENT 'board id',
  `sort_order` int(11) NOT NULL COMMENT 'sorting order',
  `date_created` datetime NOT NULL,
  `date_modified` datetime DEFAULT NULL,
  `date_done` datetime DEFAULT NULL,
  `status` varchar(12) NOT NULL COMMENT 'The story status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `stories`
--
DELIMITER $$
CREATE TRIGGER `trigger__beforeUpdateStory` BEFORE UPDATE ON `stories` FOR EACH ROW BEGIN
    SET NEW.date_modified = UTC_TIMESTAMP();
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_beforeInsertStory` BEFORE INSERT ON `stories` FOR EACH ROW BEGIN
    SET NEW.date_created = UTC_TIMESTAMP(), NEW.date_modified=UTC_TIMESTAMP();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL COMMENT 'task id',
  `textof` varchar(500) NOT NULL COMMENT 'task text',
  `story_id` int(11) NOT NULL COMMENT 'parent story',
  `board_id` int(11) NOT NULL COMMENT 'parent board id',
  `sort_order` int(11) NOT NULL COMMENT 'sort order',
  `status` varchar(15) NOT NULL COMMENT 'the task status',
  `css_class` varchar(10) NOT NULL COMMENT 'The tasks css class',
  `user_id` int(11) NOT NULL COMMENT 'The User Id',
  `date_created` datetime NOT NULL COMMENT 'The date created',
  `date_modified` datetime DEFAULT NULL,
  `date_done` datetime DEFAULT NULL,
  `note_count` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `tasks`
--
DELIMITER $$
CREATE TRIGGER `trigger_beforeInsertTask` BEFORE INSERT ON `tasks` FOR EACH ROW BEGIN
    SET NEW.date_created = UTC_TIMESTAMP(), NEW.date_modified=UTC_TIMESTAMP();
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user_boards`
--

CREATE TABLE `user_boards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'the users id',
  `board_hash` varchar(12) NOT NULL COMMENT 'the board hash',
  `sort_order` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `backlog`
--
ALTER TABLE `backlog`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `binary_assets`
--
ALTER TABLE `binary_assets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash` (`hash`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ID` (`id`),
  ADD KEY `user_id` (`user_id`);
ALTER TABLE `links` ADD FULLTEXT KEY `Description` (`descof`);
ALTER TABLE `links` ADD FULLTEXT KEY `LinkURL` (`href`);
ALTER TABLE `links` ADD FULLTEXT KEY `Title` (`textof`);
ALTER TABLE `links` ADD FULLTEXT KEY `IDX_links_6` (`href`,`textof`,`descof`);

--
-- Indexes for table `link_history`
--
ALTER TABLE `link_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log_items`
--
ALTER TABLE `log_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_boards`
--
ALTER TABLE `user_boards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `backlog`
--
ALTER TABLE `backlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'The backlog id';

--
-- AUTO_INCREMENT for table `binary_assets`
--
ALTER TABLE `binary_assets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'the id';

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'The Link Id';

--
-- AUTO_INCREMENT for table `link_history`
--
ALTER TABLE `link_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `log_items`
--
ALTER TABLE `log_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Log Id';

--
-- AUTO_INCREMENT for table `stories`
--
ALTER TABLE `stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'story id';

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'task id';

--
-- AUTO_INCREMENT for table `user_boards`
--
ALTER TABLE `user_boards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
