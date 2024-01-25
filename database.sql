--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-01-25 11:24:23 +07

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
-- TOC entry 5 (class 2615 OID 17072)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 842 (class 1247 OID 17074)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 17097)
-- Name: Reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reports" (
    id text NOT NULL,
    "revenueId" character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    "checkIn" character varying(10) NOT NULL,
    "checkOut" character varying(10) NOT NULL,
    target real NOT NULL,
    "createAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(6) without time zone,
    "timeWorked" real NOT NULL
);


ALTER TABLE public."Reports" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 17089)
-- Name: Revenues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Revenues" (
    id text NOT NULL,
    revenue real NOT NULL,
    "createAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateAt" timestamp(6) without time zone
);


ALTER TABLE public."Revenues" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17079)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id text NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    email character varying(50),
    active boolean DEFAULT true NOT NULL,
    "createAt" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "updateAt" timestamp(6) without time zone
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 3612 (class 0 OID 17097)
-- Dependencies: 217
-- Data for Name: Reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Reports" VALUES ('cd5b983f-1e8b-4115-9c34-865cb6676d42', '8182b192-2829-460d-a2d9-e586269df809', 'Hoàng Tuấn', '9:0', '12:0', 1.0275e+07, '2024-01-25 01:08:10.079', NULL, 3);
INSERT INTO public."Reports" VALUES ('59cfeac6-373a-4c87-b786-80cddc5e1249', '8182b192-2829-460d-a2d9-e586269df809', 'Quỳnh Như', '9:30', '12:0', 1.0275e+07, '2024-01-25 01:08:10.079', NULL, 2.5);


--
-- TOC entry 3611 (class 0 OID 17089)
-- Dependencies: 216
-- Data for Name: Revenues; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Revenues" VALUES ('8182b192-2829-460d-a2d9-e586269df809', 2.055e+07, '2024-01-25 01:08:10.067', NULL);


--
-- TOC entry 3610 (class 0 OID 17079)
-- Dependencies: 215
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Users" VALUES ('9ea4d9b1-2da5-4ed4-ae07-7cd5eb535735', 'Binayu1', '$2b$10$GraEQjyzwP9caW6TCeFRp.JEpHBuCejR9Qo3s4gKsJEF4j6fSBAhG', 'mail1@gmail.com', true, '2024-01-25 00:19:39.946', 'USER', NULL);
INSERT INTO public."Users" VALUES ('48dfda73-ed8b-49cf-acb6-6616683b6d5c', 'Binayu2', '$2b$10$ymaPIDsdxdmS9rmnsML95.yVLL4CAn573nH.E2k1/i0gjnxGuuLWe', 'mail2@gmail.com', true, '2024-01-25 02:35:54.289', 'USER', NULL);
INSERT INTO public."Users" VALUES ('6209d6da-be3a-4ee5-b99d-5c13f6be7c9e', 'binayu2', '$2b$10$C8erqTGOX2QxCSbaPJROouByIjDEqIK5zCb0TXmHwGoVncyK.Wzz.', 'nhtuan2@gmail.com', true, '2024-01-25 02:40:03.928', 'USER', NULL);


--
-- TOC entry 3465 (class 2606 OID 17104)
-- Name: Reports Reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);


--
-- TOC entry 3463 (class 2606 OID 17096)
-- Name: Revenues Revenues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Revenues"
    ADD CONSTRAINT "Revenues_pkey" PRIMARY KEY (id);


--
-- TOC entry 3460 (class 2606 OID 17088)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- TOC entry 3458 (class 1259 OID 17106)
-- Name: Users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Users_email_key" ON public."Users" USING btree (email);


--
-- TOC entry 3461 (class 1259 OID 17105)
-- Name: Users_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Users_username_key" ON public."Users" USING btree (username);


--
-- TOC entry 3466 (class 2606 OID 17112)
-- Name: Reports Reports_revenueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_revenueId_fkey" FOREIGN KEY ("revenueId") REFERENCES public."Revenues"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2024-01-25 11:24:24 +07

--
-- PostgreSQL database dump complete
--

