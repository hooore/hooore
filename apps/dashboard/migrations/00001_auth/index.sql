CREATE TABLE "user" (
    id varchar NOT NULL PRIMARY KEY,
    email varchar NOT NULL UNIQUE,
    role varchar NOT NULL DEFAULT '',
    password_hash varchar DEFAULT '',
    google_sub varchar UNIQUE DEFAULT NULL
);

CREATE TABLE session (
    id varchar NOT NULL PRIMARY KEY,
    expires_at timestamp with time zone NOT NULL,
    user_id varchar NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);