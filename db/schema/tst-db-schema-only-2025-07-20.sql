--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: timesheet-tracker-db_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "timesheet-tracker-db_owner";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: timesheet-tracker-db_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: job_type; Type: TYPE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TYPE public.job_type AS ENUM (
    'service',
    'construction'
);


ALTER TYPE public.job_type OWNER TO "timesheet-tracker-db_owner";

--
-- Name: reported_by; Type: TYPE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TYPE public.reported_by AS ENUM (
    'self',
    'foreman'
);


ALTER TYPE public.reported_by OWNER TO "timesheet-tracker-db_owner";

--
-- Name: work_interval_type; Type: TYPE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TYPE public.work_interval_type AS ENUM (
    'active',
    'archived'
);


ALTER TYPE public.work_interval_type OWNER TO "timesheet-tracker-db_owner";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    title_id integer,
    email character varying(255),
    name character varying(64),
    nickname character varying(64),
    phone_number character varying(16),
    sign_up_complete boolean,
    CONSTRAINT email_check CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT employees_phone_number_check CHECK (((phone_number)::text ~ '^\+\d\(\d{3}\)\d{3}-\d{4}$'::text))
);


ALTER TABLE public.employees OWNER TO "timesheet-tracker-db_owner";

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO "timesheet-tracker-db_owner";

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: jobsite_descriptions_personal; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.jobsite_descriptions_personal (
    employee_id integer NOT NULL,
    personal_description character varying(255)
);


ALTER TABLE public.jobsite_descriptions_personal OWNER TO "timesheet-tracker-db_owner";

--
-- Name: projects; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.projects (
    id character varying(10) NOT NULL,
    type public.job_type,
    address character varying(100),
    supervisor_id integer,
    name character varying(255),
    default_work_start_time time without time zone,
    default_work_end_time time without time zone,
    default_break_start_time time without time zone,
    default_break_end_time time without time zone,
    status text DEFAULT 'current'::text NOT NULL,
    description character varying(255),
    CONSTRAINT projects_status_check CHECK ((status = ANY (ARRAY['current'::text, 'archived'::text])))
);


ALTER TABLE public.projects OWNER TO "timesheet-tracker-db_owner";

--
-- Name: session; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.session (
    sid text NOT NULL,
    sess json NOT NULL,
    expire timestamp with time zone NOT NULL
);


ALTER TABLE public.session OWNER TO "timesheet-tracker-db_owner";

--
-- Name: titles; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.titles (
    id integer NOT NULL,
    name character varying(64)
);


ALTER TABLE public.titles OWNER TO "timesheet-tracker-db_owner";

--
-- Name: titles_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE SEQUENCE public.titles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.titles_id_seq OWNER TO "timesheet-tracker-db_owner";

--
-- Name: titles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER SEQUENCE public.titles_id_seq OWNED BY public.titles.id;


--
-- Name: work_periods; Type: TABLE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE TABLE public.work_periods (
    id integer NOT NULL,
    project_id character varying(10),
    reported_by integer,
    employee_id integer,
    status public.work_interval_type,
    work_start timestamp without time zone,
    work_end timestamp without time zone,
    break_start timestamp without time zone,
    break_end timestamp without time zone,
    date date,
    temp_project_id character varying(10),
    temp_project_name character varying(255),
    temp_project_location character varying(255),
    temp_supervisor_name character varying(255),
    additional_notes text
);


ALTER TABLE public.work_periods OWNER TO "timesheet-tracker-db_owner";

--
-- Name: work_intervals_id_seq; Type: SEQUENCE; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE SEQUENCE public.work_intervals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_intervals_id_seq OWNER TO "timesheet-tracker-db_owner";

--
-- Name: work_intervals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER SEQUENCE public.work_intervals_id_seq OWNED BY public.work_periods.id;


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: titles id; Type: DEFAULT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.titles ALTER COLUMN id SET DEFAULT nextval('public.titles_id_seq'::regclass);


--
-- Name: work_periods id; Type: DEFAULT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.work_periods ALTER COLUMN id SET DEFAULT nextval('public.work_intervals_id_seq'::regclass);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: jobsite_descriptions_personal jobsite_employee_detail_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.jobsite_descriptions_personal
    ADD CONSTRAINT jobsite_employee_detail_notes_pkey PRIMARY KEY (employee_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: titles titles_pkey; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.titles
    ADD CONSTRAINT titles_pkey PRIMARY KEY (id);


--
-- Name: employees unique_email; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: projects unique_id; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT unique_id UNIQUE (id);


--
-- Name: work_periods work_intervals_pk; Type: CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.work_periods
    ADD CONSTRAINT work_intervals_pk PRIMARY KEY (id);


--
-- Name: session_expire_idx; Type: INDEX; Schema: public; Owner: timesheet-tracker-db_owner
--

CREATE INDEX session_expire_idx ON public.session USING btree (expire);


--
-- Name: employees employees_title_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_title_id_fkey FOREIGN KEY (title_id) REFERENCES public.titles(id);


--
-- Name: jobsite_descriptions_personal jobsite_descriptions_personal_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.jobsite_descriptions_personal
    ADD CONSTRAINT jobsite_descriptions_personal_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: work_periods project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.work_periods
    ADD CONSTRAINT project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: work_periods reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.work_periods
    ADD CONSTRAINT reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.employees(id);


--
-- Name: projects supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.employees(id);


--
-- Name: work_periods work_periods_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: timesheet-tracker-db_owner
--

ALTER TABLE ONLY public.work_periods
    ADD CONSTRAINT work_periods_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: timesheet-tracker-db_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

