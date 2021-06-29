set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

create table "public"."users" (
  "userId"     serial,
  "name"       text   not null,
  "username"   text   not null,
  "password"   text   not null,
  primary key ("userId"),
  unique      ("username")
);


create table "public"."pools" (
  "poolId"      serial,
  "location"    text     not null,
  "price"       integer  not null,
  "description" text     not null,
  "rules"       text     not null,
  "amenities"   text     not null,
  "image"       text     not null,
  "hostId"      integer  not null,
  primary key ("poolId"),
  index ("hostId")
);

create table "public"."bookingRequests" (
  "bookingId"     serial,
  "swimmerId"     integer not null,
  "poolId"        integer not null,
  "hostId"        integer not null,
  "date"          text    not null,
  "startTime"     text    not null,
  "endTime"       text    not null,
  "status"        text    not null,
  primary key ("bookingId"),
  index ("swimmerId"),
  index ("poolId")
);
