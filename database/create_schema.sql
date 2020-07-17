CREATE SCHEMA IF NOT EXISTS parity_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SET SCHEMA 'parity_dev';

CREATE TABLE parity_games (
	id UUID DEFAULT uuid_generate_v4(),
	name VARCHAR(64) NOT NULL,
	description VARCHAR(1024) NULL,

	PRIMARY KEY(id)
);

CREATE TABLE positions (
	id UUID DEFAULT uuid_generate_v4(),
	name VARCHAR(64) NOT NULL,
	fk_parity_game UUID NOT NULL,

	initial BOOLEAN NOT NULL,
	player_0 BOOLEAN NOT NULL,
	parity INTEGER NOT NULL,

	PRIMARY KEY(id),
	FOREIGN KEY(fk_parity_game) REFERENCES parity_games(id),
	UNIQUE(name, fk_parity_game)
);

CREATE TABLE edges (
	id UUID DEFAULT uuid_generate_v4(),
	name VARCHAR(64) NOT NULL,
	fk_parity_game UUID NOT NULL,
	fk_source UUID NOT NULL,
	fk_target UUID NOT NULL,

	PRIMARY KEY(id),
	FOREIGN KEY(fk_parity_game) REFERENCES parity_games(id),
	FOREIGN KEY(fk_source) REFERENCES positions(id),
	FOREIGN KEY(fk_target) REFERENCES positions(id),
	UNIQUE(name, fk_source, fk_target)
);
