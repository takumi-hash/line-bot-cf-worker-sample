DROP TABLE IF EXISTS conversations;
CREATE TABLE conversations (
  id INTEGER PRIMARY KEY,
  my_message TEXT NOT NULL,
  bot_message TEXT NOT NULL
);
INSERT INTO conversations (my_message, bot_message)
VALUES
('お元気ですか？', '調子はいいですよ'),
('いまなにしているの？', 'あなたとお話ししています。');