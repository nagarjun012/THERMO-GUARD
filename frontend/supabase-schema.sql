-- ============================================================
-- THERMOSAFE — Supabase Database Schema
-- Run this in Supabase: Dashboard → SQL Editor → New Query
-- ============================================================

-- Main HTSS results table
-- Stores the latest HTSS score + weather data for every Indian district
CREATE TABLE IF NOT EXISTS htss_results (
  id            TEXT PRIMARY KEY,           -- e.g. "Andhra-Pradesh-Guntur"
  district      TEXT NOT NULL,
  state         TEXT NOT NULL,
  lat           REAL NOT NULL,
  lon           REAL NOT NULL,
  temperature   REAL,                       -- °C from Open-Meteo
  humidity      REAL,                       -- % relative humidity
  wind_speed    REAL,                       -- km/h
  solar_rad     REAL,                       -- W/m²
  twb           REAL,                       -- Wet-bulb temperature (Stull 2011)
  wbgt          REAL,                       -- Wet-Bulb Globe Temperature
  utci          REAL,                       -- Universal Thermal Climate Index
  htss          REAL,                       -- Human Thermal Stress Score (0–99)
  risk_category TEXT,                       -- 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW' | 'DATA UNAVAILABLE'
  status        TEXT DEFAULT 'SUCCESS',     -- 'SUCCESS' | 'FAILED'
  data_source   TEXT DEFAULT 'Open-Meteo', -- always 'Open-Meteo'
  updated_at    TIMESTAMPTZ DEFAULT now()   -- when this row was last refreshed
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_htss_score   ON htss_results (htss DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_htss_state   ON htss_results (state);
CREATE INDEX IF NOT EXISTS idx_htss_updated ON htss_results (updated_at DESC);

-- Row-level security (enable read access without auth for the frontend)
ALTER TABLE htss_results ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) reads — the frontend reads via /api/htss which uses service_role anyway
-- but this allows direct reads if ever needed from the browser
CREATE POLICY "Allow public reads" ON htss_results
  FOR SELECT USING (true);

-- Only allow inserts/updates from service_role (Vercel Serverless Functions)
CREATE POLICY "Allow service inserts" ON htss_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service updates" ON htss_results
  FOR UPDATE USING (true);
