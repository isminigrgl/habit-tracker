-- USERS
CREATE TABLE users (
  user_id        INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(50)  NOT NULL UNIQUE,
  email          VARCHAR(100) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CATEGORIES (US6)
CREATE TABLE categories (
  category_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  name         VARCHAR(50) NOT NULL,
  color        VARCHAR(7),
  icon         VARCHAR(50),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- HABITS (US1, US6)
CREATE TABLE habits (
  habit_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  category_id   INT,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  frequency     ENUM('daily','weekly','monthly') NOT NULL,
  target_count  INT DEFAULT 1,
  start_date    DATE NOT NULL,
  end_date      DATE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(user_id)         ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- HABIT LOGS (US1, feeds US4)
CREATE TABLE habit_logs (
  log_id           INT AUTO_INCREMENT PRIMARY KEY,
  habit_id         INT NOT NULL,
  completion_date  DATE NOT NULL,
  status           ENUM('completed','skipped','missed') NOT NULL DEFAULT 'completed',
  notes            TEXT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_habit_date (habit_id, completion_date),
  FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE CASCADE
);

-- GOALS (US5)
CREATE TABLE goals (
  goal_id        INT AUTO_INCREMENT PRIMARY KEY,
  habit_id       INT NOT NULL,
  user_id        INT NOT NULL,
  title          VARCHAR(100) NOT NULL,
  description    TEXT,
  target_value   INT NOT NULL,
  target_period  ENUM('daily','weekly','monthly','custom') NOT NULL,
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  status         ENUM('active','achieved','failed','paused') NOT NULL DEFAULT 'active',
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE
);