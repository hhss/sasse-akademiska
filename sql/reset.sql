/*
Resets and rebuilds schema. Run it on a database using psql:

    psql -X -q database -f init.sql

when in db/. Creates everything in the schema "akademiska".
*/

DROP SCHEMA IF EXISTS akademiska CASCADE;

CREATE SCHEMA akademiska;
SET search_path TO akademiska, public;

\i schema.sql
\i seed.sql
