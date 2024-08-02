CREATE TABLE project_social (
    id varchar NOT NULL PRIMARY KEY,
    username varchar NOT NULL DEFAULT '',
    project_id varchar NOT NULL,
    social_id varchar NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(id),
    FOREIGN KEY (social_id) REFERENCES social(id)
)