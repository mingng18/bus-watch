# MRT Static Timetables Design

## Overview
Because official live GTFS-Realtime data and unofficial API endpoints for Prasarana's rail networks (MRT/LRT) are currently unavailable or highly unstable, `bus-watch` will implement rail tracking using **Static Timetables**. This feature will ingest official GTFS static data to display scheduled arrival times, sharing the same D1 infrastructure being developed for the bus tracking features.

## 1. Architecture & Data Storage (D1)
To avoid duplicating database infrastructure, the GTFS static rail data will be hosted in the Cloudflare D1 database.
The schema will include the following standard GTFS static tables:
- `stops` (Rail stations, e.g., Phileo Damansara)
- `routes` (Rail lines, e.g., Kajang Line)
- `trips` (Individual scheduled train runs)
- `stop_times` (The scheduled arrival/departure times at each station for each trip)

## 2. Data Ingestion Pipeline
A scheduled automated task will be required to keep the static schedule up to date:
- **Source:** Download the `rapid-rail-kl` GTFS static ZIP archive from `api.data.gov.my`.
- **Compute:** A Cloudflare Worker cron job (or equivalent backend script) running weekly to fetch, unzip, and parse the CSV files.
- **Storage:** Upsert the parsed data into the D1 database tables.

## 3. API Design
A new backend endpoint will serve the schedule data to the frontend UI.
- **Endpoint:** `GET /api/rail/schedule?station={station_id}`
- **Logic:** Queries the D1 `stop_times` table joined with `trips` to find all upcoming scheduled arrivals for the requested station within the next 60-120 minutes based on the current server time.
- **Response Example:**
  ```json
  {
    "station": "Phileo Damansara",
    "route": "Kajang Line",
    "upcoming_arrivals": [
      { "scheduled_time": "17:30", "headsign": "Kwasa Damansara" },
      { "scheduled_time": "17:35", "headsign": "Kajang" }
    ]
  }
  ```

## 4. Error Handling & Edge Cases
- **Stale Data:** If the cron job fails and the GTFS data expires, the API should still return the schedule but possibly attach a `warning: "Schedule data might be outdated"` flag.
- **Missing Data:** If a station ID is invalid, return a standard 404 response.

## 5. Transition to Real-Time
By building the UI components and API contracts to handle static scheduled times now, `bus-watch` will be perfectly positioned to integrate live ETAs the moment `data.gov.my` publishes the `rapid-rail-kl` GTFS-Realtime vehicle position feed.
