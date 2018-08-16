DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) not null,
  last_name VARCHAR(255) not null,
  signature TEXT not null
);

INSERT INTO signatures (first_name, last_name, signature) VALUES ('Mario', 'Bros', 'Its me, maaaaaaario');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Joey', 'Tribbiani', 'How you doin');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Donatello', 'Turtle', 'pizza time!');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Garfield', 'Cat', 'meow');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Michelangelo', 'Turtle', 'yo!');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Mr', 'Sandman', 'I shall bring you a dream.');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Walter', 'White', 'Love ma pizzas');
INSERT INTO signatures (first_name, last_name, signature) VALUES ('Luigi', 'Bros', 'Hiiya');
