-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2016 at 04:31 PM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `microdraw`
--
CREATE DATABASE IF NOT EXISTS `microdraw` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `microdraw`;

-- --------------------------------------------------------

--
-- Table structure for table `keyvalue`
--

DROP TABLE IF EXISTS `keyvalue`;
CREATE TABLE `keyvalue` (
  `UniqueID` int(11) NOT NULL,
  `myTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `myOrigin` text COLLATE utf8_bin NOT NULL,
  `myKey` text COLLATE utf8_bin NOT NULL,
  `myValue` longtext COLLATE utf8_bin NOT NULL,
  `mySlice` int(6) NOT NULL,
  `mySliceName` varchar(255) COLLATE utf8_bin NOT NULL,
  `mySource` varchar(255) COLLATE utf8_bin NOT NULL,
  `myUser` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=100 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserID` int(25) NOT NULL,
  `Username` varchar(65) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `EmailAddress` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `keyvalue`
--
ALTER TABLE `keyvalue`
  ADD PRIMARY KEY (`UniqueID`),
  ADD UNIQUE KEY `UniqueID` (`UniqueID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `keyvalue`
--
ALTER TABLE `keyvalue`
  MODIFY `UniqueID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(25) NOT NULL AUTO_INCREMENT;
