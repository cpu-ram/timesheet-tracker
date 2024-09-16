--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: job_type; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.job_type AS ENUM (
    'SVC',
    'RM'
);


ALTER TYPE public.job_type OWNER TO "user";

--
-- Name: reported_by; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.reported_by AS ENUM (
    'self',
    'foreman'
);


ALTER TYPE public.reported_by OWNER TO "user";

--
-- Name: work_interval_type; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.work_interval_type AS ENUM (
    'active',
    'archived'
);


ALTER TYPE public.work_interval_type OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: daily_supervisor_reports; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.daily_supervisor_reports (
    project_id character varying(10) NOT NULL,
    date date NOT NULL,
    supervisor_id integer NOT NULL,
    complete boolean NOT NULL,
    work_accomplished character varying(500),
    extras character varying(500),
    daily_supervisor_report_id integer NOT NULL
);


ALTER TABLE public.daily_supervisor_reports OWNER TO "user";

--
-- Name: daily_supervisor_reports_daily_supervisor_report_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.daily_supervisor_reports_daily_supervisor_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_supervisor_reports_daily_supervisor_report_id_seq OWNER TO "user";

--
-- Name: daily_supervisor_reports_daily_supervisor_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.daily_supervisor_reports_daily_supervisor_report_id_seq OWNED BY public.daily_supervisor_reports.daily_supervisor_report_id;


--
-- Name: daily_supervisor_reports_work_intervals; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.daily_supervisor_reports_work_intervals (
    daily_supervisor_report_id integer NOT NULL,
    work_interval_id integer NOT NULL
);


ALTER TABLE public.daily_supervisor_reports_work_intervals OWNER TO "user";

--
-- Name: employees; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.employees (
    employee_id integer NOT NULL,
    title_id integer,
    email character varying(255),
    CONSTRAINT email_check CHECK (((email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text))
);


ALTER TABLE public.employees OWNER TO "user";

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO "user";

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.employee_id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.projects (
    project_id character varying(10) NOT NULL,
    project_type public.job_type NOT NULL,
    project_address character varying(100),
    supervisor_id integer NOT NULL
);


ALTER TABLE public.projects OWNER TO "user";

--
-- Name: titles; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.titles (
    id integer NOT NULL,
    name character varying(64)
);


ALTER TABLE public.titles OWNER TO "user";

--
-- Name: titles_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.titles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.titles_id_seq OWNER TO "user";

--
-- Name: titles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.titles_id_seq OWNED BY public.titles.id;


--
-- Name: weekly_employee_reports; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.weekly_employee_reports (
    weekly_employee_report_id integer NOT NULL,
    date date,
    submitted boolean
);


ALTER TABLE public.weekly_employee_reports OWNER TO "user";

--
-- Name: weekly_employee_reports_weekly_employee_report_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.weekly_employee_reports_weekly_employee_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weekly_employee_reports_weekly_employee_report_id_seq OWNER TO "user";

--
-- Name: weekly_employee_reports_weekly_employee_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.weekly_employee_reports_weekly_employee_report_id_seq OWNED BY public.weekly_employee_reports.weekly_employee_report_id;


--
-- Name: weekly_employee_reports_work_intervals; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.weekly_employee_reports_work_intervals (
    weekly_employee_report_id integer NOT NULL,
    work_interval_id integer NOT NULL
);


ALTER TABLE public.weekly_employee_reports_work_intervals OWNER TO "user";

--
-- Name: work_intervals; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.work_intervals (
    work_interval_id integer NOT NULL,
    project_id character varying(10),
    work_period tsrange,
    break_period tsrange,
    reported_by integer,
    employee_id integer,
    status public.work_interval_type
);


ALTER TABLE public.work_intervals OWNER TO "user";

--
-- Name: work_intervals_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.work_intervals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_intervals_id_seq OWNER TO "user";

--
-- Name: work_intervals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.work_intervals_id_seq OWNED BY public.work_intervals.work_interval_id;


--
-- Name: daily_supervisor_reports daily_supervisor_report_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports ALTER COLUMN daily_supervisor_report_id SET DEFAULT nextval('public.daily_supervisor_reports_daily_supervisor_report_id_seq'::regclass);


--
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: titles id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.titles ALTER COLUMN id SET DEFAULT nextval('public.titles_id_seq'::regclass);


--
-- Name: weekly_employee_reports weekly_employee_report_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.weekly_employee_reports ALTER COLUMN weekly_employee_report_id SET DEFAULT nextval('public.weekly_employee_reports_weekly_employee_report_id_seq'::regclass);


--
-- Name: work_intervals work_interval_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals ALTER COLUMN work_interval_id SET DEFAULT nextval('public.work_intervals_id_seq'::regclass);


--
-- Name: daily_supervisor_reports daily_supervisor_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT daily_supervisor_reports_pkey PRIMARY KEY (daily_supervisor_report_id);


--
-- Name: daily_supervisor_reports_work_intervals daily_supervisor_reports_work_intervals_unique; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports_work_intervals
    ADD CONSTRAINT daily_supervisor_reports_work_intervals_unique UNIQUE (daily_supervisor_report_id, work_interval_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: titles titles_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.titles
    ADD CONSTRAINT titles_pkey PRIMARY KEY (id);


--
-- Name: projects unique_id; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT unique_id UNIQUE (project_id);


--
-- Name: weekly_employee_reports weekly_employee_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.weekly_employee_reports
    ADD CONSTRAINT weekly_employee_reports_pkey PRIMARY KEY (weekly_employee_report_id);


--
-- Name: weekly_employee_reports_work_intervals weekly_employee_reports_work_intervals_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.weekly_employee_reports_work_intervals
    ADD CONSTRAINT weekly_employee_reports_work_intervals_pkey PRIMARY KEY (weekly_employee_report_id, work_interval_id);


--
-- Name: work_intervals work_intervals_pk; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT work_intervals_pk PRIMARY KEY (work_interval_id);


--
-- Name: daily_supervisor_reports daily_supervisor_reports_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT daily_supervisor_reports_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id);


--
-- Name: daily_supervisor_reports daily_supervisor_reports_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT daily_supervisor_reports_supervisor_fkey FOREIGN KEY (supervisor_id) REFERENCES public.employees(employee_id);


--
-- Name: daily_supervisor_reports_work_intervals daily_supervisor_reports_work_i_daily_supervisor_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports_work_intervals
    ADD CONSTRAINT daily_supervisor_reports_work_i_daily_supervisor_report_id_fkey FOREIGN KEY (daily_supervisor_report_id) REFERENCES public.daily_supervisor_reports(daily_supervisor_report_id);


--
-- Name: daily_supervisor_reports_work_intervals daily_supervisor_reports_work_intervals_work_interval_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports_work_intervals
    ADD CONSTRAINT daily_supervisor_reports_work_intervals_work_interval_id_fkey FOREIGN KEY (work_interval_id) REFERENCES public.work_intervals(work_interval_id);


--
-- Name: employees employees_title_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_title_id_fkey FOREIGN KEY (title_id) REFERENCES public.titles(id);


--
-- Name: work_intervals fk_reported_by; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT fk_reported_by FOREIGN KEY (reported_by) REFERENCES public.employees(employee_id);


--
-- Name: daily_supervisor_reports fk_supervisor_id; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT fk_supervisor_id FOREIGN KEY (supervisor_id) REFERENCES public.employees(employee_id);


--
-- Name: projects jobs_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT jobs_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.employees(employee_id);


--
-- Name: weekly_employee_reports_work_intervals weekly_employee_reports_work_int_weekly_employee_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.weekly_employee_reports_work_intervals
    ADD CONSTRAINT weekly_employee_reports_work_int_weekly_employee_report_id_fkey FOREIGN KEY (weekly_employee_report_id) REFERENCES public.weekly_employee_reports(weekly_employee_report_id);


--
-- Name: weekly_employee_reports_work_intervals weekly_employee_reports_work_intervals_work_interval_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.weekly_employee_reports_work_intervals
    ADD CONSTRAINT weekly_employee_reports_work_intervals_work_interval_id_fkey FOREIGN KEY (work_interval_id) REFERENCES public.work_intervals(work_interval_id);


--
-- Name: work_intervals work_intervals_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT work_intervals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: work_intervals work_intervals_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT work_intervals_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id);


--
-- PostgreSQL database dump complete
--

