# AI Family OS

**Capture everything. Organize nothing. AI does the rest.**

AI Family OS is a mobile-first family organization prototype designed to reduce the mental load of everyday life.

Families often manage appointments, tasks, medications, routines, school information, therapy schedules, and important messages across several different apps. AI Family OS brings these areas together in one calm and structured overview.

## Problem

Modern family life creates a constant mental load.

Parents and caregivers often have to remember:

- appointments
- school and kindergarten information
- therapy sessions
- medications
- routines
- household tasks
- important emails
- preparation steps
- last-minute changes

This information is often spread across calendars, email inboxes, task apps, paper notes, and memory.

## Solution

AI Family OS is designed as an intelligent second brain for families.

The main idea is simple:

1. Capture information quickly through a Brain Dump, chat, or voice input.
2. Let the system identify appointments, tasks, medications, routines, and missing information.
3. Show families one clear overview of what matters.
4. Connect with the tools families already use instead of replacing them.

## Current MVP Features

The current prototype includes:

- family member profiles
- seven-day calendar overview
- monthly calendar view
- event creation
- event editing
- event deletion
- assignment of events to family members
- multiple custom reminders
- separate final urgent alarm
- task overview
- task source labels
- medication section
- routines section
- inbox signal examples
- Brain Dump input
- local mock processing of Brain Dump content
- browser-based voice input prototype
- AI assistant demonstration
- future integration preview

## Calendar and Event Management

Users can:

- view upcoming events in a weekly overview
- open a monthly calendar
- select days with events
- add new events
- edit existing events
- delete events
- assign events to family members
- add several custom reminders
- configure a separate final alarm

Normal reminders are intended for preparation.

The final alarm is intended as the last urgent alert before an event.

## Brain Dump

The Brain Dump allows users to capture information without organizing it manually first.

Example:

> Jonas has a pediatrician appointment on Thursday at 10. Remind me to pack the therapy bag the evening before and give him Vitamin D after breakfast.

The current MVP uses local demonstration logic to show how information could later be classified into:

- appointments
- tasks
- medications
- routines
- follow-up questions

## Planned Integrations

AI Family OS is designed to connect with existing services such as:

- Google Calendar
- Apple Calendar
- Microsoft Outlook
- Gmail
- Todoist
- Apple Reminders
- Microsoft To Do
- voice input services

These integrations are shown as part of the product vision but are not yet connected in the current MVP.

## Technology

The current prototype uses:

- React
- Vite
- JavaScript
- CSS
- local browser state
- browser Web Speech API where supported
- GitHub for version control

No backend, database, authentication system, or external AI API is currently required to run the prototype.

## Run the Project Locally

### Requirements

Install a current version of Node.js.

### Installation

Clone the repository:

```bash
git clone https://github.com/piaoesterlind/ai-family-os.git
