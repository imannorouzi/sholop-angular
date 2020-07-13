create table hibernate_sequence
(
    next_val bigint null
)
    engine = MyISAM;

create table sh_comment
(
    id          int auto_increment
        primary key,
    user_id     int                                 not null,
    contact_id  int                                 not null,
    event_id    int                                 not null,
    text        varchar(200)                        not null,
    created     timestamp default CURRENT_TIMESTAMP not null,
    in_reply_to int                                 not null,
    status      varchar(10)                         not null,
    reported    int       default 0                 not null,
    modified    timestamp                           null
)
    collate = utf8_persian_ci;

create table sh_contact
(
    id          bigint unsigned auto_increment,
    type        varchar(10) default 'CONTACT'         null,
    name        varchar(100)                          null,
    email       varchar(50)                           not null,
    phone       varchar(15)                           null,
    address     text                                  null,
    image_url   text                                  null,
    valid       tinyint(1)                            not null,
    is_active   tinyint(1)  default 1                 not null,
    created     timestamp   default CURRENT_TIMESTAMP null,
    created_by  int                                   null,
    modified    timestamp                             null,
    modified_by int                                   null,
    user_id     int                                   not null,
    constraint id
        unique (id)
)
    collate = utf8_persian_ci;

create table sh_contact_event
(
    id          bigint unsigned auto_increment,
    contact_id  int                                   not null,
    event_id    int                                   not null,
    status      varchar(20) default 'UNKNOWN'         not null,
    uuid        varchar(50)                           null,
    qr_code_url varchar(200)                          null,
    created     timestamp   default CURRENT_TIMESTAMP null,
    created_by  int         default 0                 null,
    modified    timestamp                             null,
    modified_by int         default 0                 null,
    name        varchar(50)                           null,
    phone       varchar(15)                           null,
    email       varchar(50)                           null,
    constraint id
        unique (id)
)
    collate = utf8_persian_ci;

create table sh_event
(
    id             bigint unsigned auto_increment,
    title          varchar(100)                          not null,
    description    text                                  not null,
    venue_id       int                                   not null,
    chair_id       int                                   null,
    confirm_needed tinyint(1)                            not null,
    join_via_link  tinyint(1)                            not null,
    limit_guests   tinyint(1)                            not null,
    max_guests     int                                   not null,
    allow_comments int                                   not null,
    link           text                                  null,
    status         varchar(10) default 'draft'           not null,
    created        timestamp   default CURRENT_TIMESTAMP not null,
    created_by     int         default 0                 not null,
    modified       timestamp                             null,
    modified_by    int         default 0                 not null,
    tags           text                                  null,
    event_type     varchar(20)                           null,
    image_url      text                                  null,
    constraint id
        unique (id)
)
    collate = utf8_persian_ci;

create table sh_event_date
(
    id         bigint unsigned auto_increment,
    date       timestamp null,
    event_id   int       not null,
    start_time timestamp null,
    end_time   timestamp null,
    constraint id
        unique (id)
)
    collate = utf8_persian_ci;

create table sh_user
(
    id                bigint unsigned auto_increment,
    type              varchar(10) default 'PERSONAL'        null,
    full_name         varchar(50)                           null,
    username          varchar(50)                           not null,
    password          text                                  not null,
    google_password   varchar(200)                          null,
    email             varchar(50)                           not null,
    image_url         varchar(100)                          not null,
    phone             varchar(20)                           null,
    latitude          double                                null,
    longitude         double                                not null,
    persian_address_1 varchar(200)                          not null,
    persian_address_2 varchar(200)                          not null,
    description       text                                  not null,
    role              text                                  null,
    created           timestamp   default CURRENT_TIMESTAMP null,
    created_by        int         default 0                 null,
    modified          timestamp                             null,
    modified_by       int         default 0                 null,
    parent_id         int                                   null,
    constraint id
        unique (id)
)
    collate = utf8_persian_ci;

create table sh_venue
(
    id                bigint unsigned auto_increment,
    user_id           int                                  null,
    latitude          double                               not null,
    longitude         double                               not null,
    persian_address_1 text collate utf8_persian_ci         not null,
    persian_address_2 text collate utf8_persian_ci         null,
    english_address   text collate utf8_persian_ci         not null,
    title             varchar(100) collate utf8_persian_ci null,
    description       text                                 null,
    is_active         tinyint(1) default 1                 not null,
    map_url           varchar(300)                         not null,
    created           timestamp  default CURRENT_TIMESTAMP not null,
    created_by        int        default 0                 not null,
    modified          timestamp                            null,
    modified_by       int        default 0                 not null,
    farsi_address1    varchar(255)                         null,
    farsi_address2    varchar(255)                         null,
    constraint id
        unique (id)
)
    charset = utf8;


