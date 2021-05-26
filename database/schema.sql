set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";


create table "public"."hosts" (
  "hostId"    serial,
  "name"      text    not null,
  "poolId"    serial,
  primary key ("hostId")
);


create table "public"."pools" (
  "poolId"      serial,
  "location"    text     not null,
  "price"       integer  not null,
  "description" text     not null,
  "rules"       text     not null,
  "amenities"   text     not null,
  "image"       text     not null,
  "hostId"      serial,
  primary key ("poolId")
);
