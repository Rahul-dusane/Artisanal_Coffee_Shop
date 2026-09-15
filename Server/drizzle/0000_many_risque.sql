CREATE TABLE `recipes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`request_id` int unsigned NOT NULL,
	`dish_name` varchar(255) NOT NULL,
	`prep_time` varchar(50) NOT NULL,
	`difficulty` varchar(50) NOT NULL,
	`full_output_instructions` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recipes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`ingredients_input` text NOT NULL,
	`craving_vibe` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_request_id_user_requests_id_fk` FOREIGN KEY (`request_id`) REFERENCES `user_requests`(`id`) ON DELETE cascade ON UPDATE no action;