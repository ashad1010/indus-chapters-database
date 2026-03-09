# IHN Chapters Dashboard

**Contract Project for Indus Health Network**

An internal web application developed under contract for [Indus Health Network](https://www.indushealthnetwork.com/), a real-world nonprofit healthcare organization. This dashboard provides IHN staff with a centralized platform to store, manage, and maintain information about the organization's fundraising chapters and their yearly events across the globe.

---

## Project Overview

Indus Health Network operates fundraising chapters in cities and countries around the world. Prior to this system, chapter information — including leadership teams, yearly fundraising events, attendance figures, and financial data — was scattered across spreadsheets and informal records.

This application solves that problem by providing a structured, role-protected internal dashboard where authorized IHN staff can:

- Add and manage chapter records organized by country, city, and region
- Maintain team rosters for each chapter, including member roles and contact info
- Log yearly events and activities with details such as venue, attendance, funds collected, sponsors, and notable guests
- Store social media and communication links per chapter
- View and search all chapters globally with expandable detail cards
- Export chapter data to XLSX format for reporting purposes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React (via Vite) |
| Backend / Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Styling | Inline CSS / custom component styles |
| Build Tool | Vite |
| Data Export | SheetJS (XLSX) |
| Hosting | Configured for static deployment (e.g. Vercel, Netlify) |

---

## Features

### Chapter Management
- Multi-step form for adding new chapters (Location, Team, Links, Events, Review)
- Full chapter editing and deletion from the View Chapters page
- Expandable chapter cards with tabbed detail views

### Event and Activity Tracking
- Log multiple events per chapter per year
- Record venue, date, capacity, total attendance, ticket price, funds collected, sponsors, and celebrity or notable guests

### Team Roster Management
- Add team members with name, role, title, email, and status
- Associate members with their respective chapter

### Role-Based Access Control
Five permission tiers managed through Supabase:

| Role | Access Level |
|---|---|
| Super Admin | Full access, including user management |
| Admin | Manage chapters and users |
| Editor | Add and edit chapters within their assigned country |
| Read Only | View chapters only, no write access |
| Pending | Account created, awaiting role assignment |

### User Management Panel
- Admins and Super Admins can view all registered users
- Searchable and filterable user table
- Inline role and country assignment editing

### Data Export
- Authorized users can export the full chapter dataset to a formatted XLSX spreadsheet

---

## Project Structure

```
src/
├── AppLayout.jsx              # Global nav, auth controls, routing shell
├── AuthContext.jsx            # Supabase auth state + role/country context
├── supabaseClient.js          # Supabase client initialization
├── main.jsx                   # App entry point
├── components/
│   ├── ChapterLocationForm.jsx    # Step 1: Location details
│   ├── ChapterTeamForm.jsx        # Step 2: Team member entry
│   ├── ChapterLinksForm.jsx       # Step 3: WhatsApp and social links
│   ├── ChapterActivitiesForm.jsx  # Step 4: Events and activities
│   └── ChapterReviewForm.jsx      # Step 5: Review before submission
└── pages/
    ├── AddChapter.jsx         # Multi-step chapter creation page
    ├── ViewChapters.jsx       # Browse, search, edit, and export chapters
    └── UsersPanel.jsx         # User role management (admin only)
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A Supabase project with the appropriate tables and RLS policies configured

### Environment Variables

Create a `.env` file in the project root with the following:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## Database Schema (Supabase)

The primary table is `chapters`, which stores each chapter as a JSON document with the following top-level structure:

```json
{
  "location": {
    "chapterName": "",
    "selectedCountry": "",
    "selectedRegion": "",
    "city": "",
    "chapterDescription": ""
  },
  "team_members": [],
  "social_links": {
    "whatsappLink": "",
    "socialLinks": []
  },
  "events": [],
  "description": ""
}
```

A separate `user_roles` table maps Supabase Auth user IDs to a `role` and an optional `country` field for country-scoped editor access.

---

## Intended Use

This application is intended exclusively for internal use by authorized Indus Health Network staff. It is not a public-facing product. Access requires account registration and explicit role assignment by an administrator.

---

## Client

**Indus Health Network**
A nonprofit organization dedicated to providing quality healthcare and fundraising support across global communities.
Website: [https://indushospital.ca/](https://indushospital.ca/)

---

## License

This project was developed as contract work for Indus Health Network. All rights to the application and its design belong to Indus Health Network. Unauthorized distribution or reproduction is not permitted.