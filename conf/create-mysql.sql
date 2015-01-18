CREATE TABLE IF NOT EXISTS `menu_item` (
  `id_node` int(10) unsigned NOT NULL,
  `title` varchar(50) CHARACTER SET utf8 NOT NULL,
  `link` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `short_description` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8,
  `icon` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `order` int(10) unsigned DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `id_parent_node` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `menu_menu` (
  `id_node` int(10) unsigned NOT NULL,
  `group` varchar(75) CHARACTER SET utf8 NOT NULL DEFAULT 'public',
  `style` varchar(50) CHARACTER SET utf8 DEFAULT 'default',
  `title` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `link` varchar(255) CHARACTER SET utf8 DEFAULT '#',
  `image` varchar(255) CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS `menu_node` (
  `id` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

ALTER TABLE `menu_item`
 ADD PRIMARY KEY (`id_node`), ADD KEY `id_parent_node` (`id_parent_node`);

ALTER TABLE `menu_menu`
 ADD PRIMARY KEY (`id_node`);

ALTER TABLE `menu_node`
 ADD PRIMARY KEY (`id`);


ALTER TABLE `menu_node`
MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT;

ALTER TABLE `menu_item`
ADD CONSTRAINT `menu_item_ibfk_1` FOREIGN KEY (`id_parent_node`) REFERENCES `menu_node` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `menu_item_ibfk_2` FOREIGN KEY (`id_node`) REFERENCES `menu_node` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `menu_menu`
ADD CONSTRAINT `menu_menu_ibfk_1` FOREIGN KEY (`id_node`) REFERENCES `menu_node` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
