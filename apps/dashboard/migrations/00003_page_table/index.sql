CREATE TABLE page (
    id varchar NOT NULL PRIMARY KEY,
    name varchar NOT NULL DEFAULT '',
    slug varchar NOT NULL DEFAULT '',
    published boolean NOT NULL DEFAULT TRUE,
    last_edited timestamp with time zone NOT NULL DEFAULT now(),
    create_date timestamp with time zone NOT NULL DEFAULT now(),
    type varchar NOT NULL DEFAULT '',
    is_home boolean NOT NULL DEFAULT false,
    deletable boolean NOT NULL DEFAULT true,
    project_id varchar NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id)
);