--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.6 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: salary; Type: TABLE; Schema: public; Owner: postgres_dev
--

CREATE TABLE public.salary (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    bonus integer DEFAULT 0 NOT NULL,
    salary integer DEFAULT 0 NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(6) without time zone,
    working_hours real DEFAULT 0 NOT NULL,
    start_date timestamp(6) without time zone NOT NULL,
    end_date timestamp(6) without time zone NOT NULL,
    target integer DEFAULT 0 NOT NULL,
    lunch_allowance_per_day integer DEFAULT 0 NOT NULL,
    gasoline_allowance_per_day integer DEFAULT 0 NOT NULL,
    working_days integer DEFAULT 0 NOT NULL,
    actual_working_days integer DEFAULT 0 NOT NULL,
    paid_leave integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.salary OWNER TO postgres_dev;

--
-- Data for Name: salary; Type: TABLE DATA; Schema: public; Owner: postgres_dev
--

COPY public.salary (id, staff_id, name, bonus, salary, description, created_at, updated_at, working_hours, start_date, end_date, target, lunch_allowance_per_day, gasoline_allowance_per_day, working_days, actual_working_days, paid_leave) FROM stdin;
55168d0d-a2a8-4914-914e-3a82d9abe0dd	71311923-6802-480a-a7b9-380369ec580b	Kỳ lương	0	20000		2025-10-06 02:28:32.266155	\N	11.5	2025-09-01 00:00:00	2025-09-30 00:00:00	22439	0	0	24	1	0
90bd208b-85f0-493a-9549-5676d4278687	8e1f5dac-ae02-457a-a2d6-f9573c3bdbc2	Kỳ lương	150000	22000	2/9 => 4 giờ = 80k\nThưởng: 70k	2025-10-06 02:30:41.844524	\N	108	2025-09-01 00:00:00	2025-09-30 00:00:00	324389	0	0	24	17	0
cdae630f-987e-498f-951c-c9e741729ad0	30a5bf4b-50ab-4a6c-8210-2fa6f386cdf0	Kỳ lương	180000	30000	2/9: 150k\nThưởng nóng: 30k	2025-10-06 02:34:18.194008	\N	108	2025-09-01 00:00:00	2025-09-30 00:00:00	291877	0	0	24	19	0
23bb595a-66df-4c09-8a98-43627d186cb1	53987d95-7407-4f3d-9043-13e75aa61cc1	Kỳ lương	323000	23000	Sửa đồ: 194k\n2/9: 69k\nThưởng nóng: 60k	2025-10-06 02:35:36.244727	\N	101.5	2025-09-01 00:00:00	2025-09-30 00:00:00	232717	0	0	24	17	0
435b94f7-c42d-4bcb-9504-b50092b0590a	4a101c23-d94f-476b-ac03-26fff16f79f7	Kỳ lương	96500	19000	2/9 (3.5 giờ): 66.5k\nThưởng: 30k	2025-10-06 02:36:16.477523	\N	111	2025-09-01 00:00:00	2025-09-30 00:00:00	276725	0	0	24	21	0
fd4e626f-c27b-4e68-af86-a658ad0b3ac8	61d38db3-69a2-4b5d-9ae0-a12f44a0155d	Kỳ lương	0	8000000		2025-10-06 04:44:06.41804	\N	180	2025-09-01 00:00:00	2025-09-30 00:00:00	0	30000	30000	24	24	1
\.


--
-- Name: salary salary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres_dev
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_pkey PRIMARY KEY (id);


--
-- Name: salary salary_staff_id_staff_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres_dev
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_staff_id_staff_id_fk FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

