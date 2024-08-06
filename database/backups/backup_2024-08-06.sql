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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: daily_supervisor_reports; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.daily_supervisor_reports (
    job_id integer,
    date date,
    supervisor integer,
    complete boolean,
    work_accomplished character varying(500),
    extras character varying(500)
);


ALTER TABLE public.daily_supervisor_reports OWNER TO "user";

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
-- Name: jobs; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.jobs (
    job_id integer NOT NULL,
    job_type public.job_type NOT NULL,
    job_address character varying(100)
);


ALTER TABLE public.jobs OWNER TO "user";

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
-- Name: work_intervals; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.work_intervals (
    id integer NOT NULL,
    job_id integer,
    reported_by public.reported_by,
    work_period tsrange,
    break_period tsrange
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

ALTER SEQUENCE public.work_intervals_id_seq OWNED BY public.work_intervals.id;


--
-- Name: employees employee_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees ALTER COLUMN employee_id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: titles id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.titles ALTER COLUMN id SET DEFAULT nextval('public.titles_id_seq'::regclass);


--
-- Name: work_intervals id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals ALTER COLUMN id SET DEFAULT nextval('public.work_intervals_id_seq'::regclass);


--
-- Data for Name: daily_supervisor_reports; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.daily_supervisor_reports (job_id, date, supervisor, complete, work_accomplished, extras) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.employees (employee_id, title_id, email) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.jobs (job_id, job_type, job_address) FROM stdin;
\.


--
-- Data for Name: titles; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.titles (id, name) FROM stdin;
\.


--
-- Data for Name: work_intervals; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.work_intervals (id, job_id, reported_by, work_period, break_period) FROM stdin;
\.


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.employees_id_seq', 1, false);


--
-- Name: titles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.titles_id_seq', 1, false);


--
-- Name: work_intervals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.work_intervals_id_seq', 1, false);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (job_id, job_type);


--
-- Name: titles titles_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.titles
    ADD CONSTRAINT titles_pkey PRIMARY KEY (id);


--
-- Name: jobs unique_id; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT unique_id UNIQUE (job_id);


--
-- Name: work_intervals work_intervals_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT work_intervals_pkey PRIMARY KEY (id);


--
-- Name: daily_supervisor_reports daily_supervisor_reports_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT daily_supervisor_reports_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id);


--
-- Name: daily_supervisor_reports daily_supervisor_reports_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.daily_supervisor_reports
    ADD CONSTRAINT daily_supervisor_reports_supervisor_fkey FOREIGN KEY (supervisor) REFERENCES public.employees(employee_id);


--
-- Name: employees employees_title_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_title_id_fkey FOREIGN KEY (title_id) REFERENCES public.titles(id);


--
-- Name: work_intervals work_intervals_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.work_intervals
    ADD CONSTRAINT work_intervals_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id);


--
-- PostgreSQL database dump complete
--

