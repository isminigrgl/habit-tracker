USE habit_tracker;

INSERT INTO users (username, email, password_hash)
VALUES ('testuser', 'test@example.com', 'placeholder_hash');

INSERT INTO categories (user_id, name, color)
VALUES (1, 'Health', '#4A8C5C'),
       (1, 'Work',   '#B26A2F');

INSERT INTO habits (user_id, category_id, name, frequency, target_count, start_date)
VALUES (1, 1, 'Drink 2L of water', 'daily', 1, CURDATE()),
       (1, 2, 'Review code daily', 'daily', 1, CURDATE());