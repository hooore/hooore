ALTER TABLE "user" 
    ALTER COLUMN password_hash DROP NOT NULL,
    ADD COLUMN github_id INTEGER UNIQUE;