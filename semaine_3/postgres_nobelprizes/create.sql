DROP TABLE IF EXISTS "category" cascade;
CREATE TABLE category (
    id SERIAL NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_category_id
                   PRIMARY KEY (id)
);

DROP TABLE IF EXISTS "prize" cascade;
CREATE TABLE prize (
    id  SERIAL NOT NULL,
    year INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT pk_prize_id
               PRIMARY KEY (id),
    CONSTRAINT fk_prize_category_id
               FOREIGN KEY (category_id)
                    REFERENCES category (id)
                    ON DELETE NO ACTION
                    ON UPDATE NO ACTION
);

DROP TABLE IF EXISTS "laureate" cascade;
CREATE TABLE laureate (
    id INT NOT NULL,
    firstname VARCHAR(250),
    surname VARCHAR(250),
    CONSTRAINT pk_laureate_id
                   PRIMARY KEY (id)
);

DROP TABLE IF EXISTS "prize_laureate" cascade;
CREATE TABLE prize_laureate (
    id SERIAL NOT NULL,
    prize_id INT REFERENCES prize(id) ON DELETE CASCADE,
    laureate_id INT REFERENCES laureate(id) ON DELETE CASCADE,
    motivation TEXT,
    CONSTRAINT pk_prize_laureate_id
                   PRIMARY KEY (id)
);