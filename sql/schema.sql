/*
SASSE Akademiska uses PostgreSQL for storing data. We do not treat the database
like an anonymous back-end but wish it be a powerful database in its own right.

This file can be fed to `psql` to create the appropriate tables. No assumptions
are made regarding schemas -- but it's probably a good idea if we let
Akademiska have its own.

Everything follows the typical SASSE SQL conventions (which are currently
documented in another, private, repository). In short: Singular, English names;
usage of NULL where sensible and heavy usage of `COMMENT ON` for documentation.

NOTE: I'm a strong believer in highly normalized and clean schemas with sensible
primary keys. Currently, this means that users are PRIMARILY identified by e-mail,
and courses by course numbers (which can be alphanumeric, e.g. NDH1302).

The belief that every table must have an integer autoincrement primary key is
silly and non-helpful.

Note that this schema does not directly address how JSON representations of REST
resources are constructed.
*/

/*
A course on Akademiska.
*/
CREATE TABLE course (
  id text PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  url_sse text
);

COMMENT ON TABLE course IS 'A course offered at SSE';
COMMENT ON COLUMN course.id IS 'Course No./Identifier';
COMMENT ON COLUMN course.name IS 'Course name (in English)';
COMMENT ON COLUMN course.url_sse IS 'SSE Course Web URL; NULL means "guess automatically"';

/*
A user on Akademiska.

We keep some essential information about the users, for access control and
authorship information. In the future, this should generally be available from
a central membership database and merely cached by the local service.
*/
CREATE TABLE "user" (
  id text PRIMARY KEY,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  dropbox_access text
);

COMMENT ON TABLE "user" IS 'A user of Akademiska';
COMMENT ON COLUMN "user".name IS 'Known name of user, or should be id';
COMMENT ON COLUMN "user".role IS 'Access role to Akademiska';
COMMENT ON COLUMN "user".dropbox_access IS 'Dropbox OAuth URL-encoded tokens';

/*
A page for a course on Akademiska.

Each course SHOULD have an associated page, which should give a basic
presentation of the course. It is highly likely that a future schema will
support revisions in this table.
*/
CREATE TABLE course_page (
  course_id text PRIMARY KEY REFERENCES course ON DELETE CASCADE,
  updated_at timestamp NOT NULL DEFAULT now(),
  body text NOT NULL DEFAULT ''
);

COMMENT ON TABLE course_page IS 'A page about a course.';
COMMENT ON COLUMN course_page.body IS 'Markdown source of the page';

/*
User contributions to a page.
*/
CREATE TABLE course_contribution (
  course_id text NOT NULL REFERENCES course,
  user_id text NOT NULL REFERENCES "user",
  contribution integer NOT NULL DEFAULT 0,

  PRIMARY KEY (course_id, user_id)
);

COMMENT ON TABLE course_contribution IS 'How a user contributed to a course';
COMMENT ON COLUMN course_contribution.contribution IS 'Contribution score';
