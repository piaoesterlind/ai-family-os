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

git clone https://github.com/piaoesterlind/ai-family-os.git

Open the project folder:

cd ai-family-os

Install the dependencies:

npm install

Start the development server:

npm run dev

Open the local address shown by Vite, usually:

http://localhost:5173

On Windows PowerShell, if npm is blocked by the execution policy, use:

npm.cmd install

npm.cmd run dev

## Testing the MVP

After starting the app, reviewers can test the following:

1. Open the family profile menu.
2. Add or edit a family member.
3. Open an event from the weekly calendar.
4. Open the monthly calendar.
5. Add, edit, or delete an event.
6. Add several reminders.
7. Enable or disable the final alarm.
8. Complete a task.
9. Enter information in the Brain Dump.
10. Process the Brain Dump with the local demo logic.
11. Ask the demonstration assistant a planning question.

## Current Limitations

This project is a hackathon MVP.

The following features are currently simulated or planned:

- AI processing is local mock logic.
- The app does not yet call the OpenAI API at runtime.
- Calendar, email, and task integrations are not yet connected.
- Data is not stored in a production database.
- Authentication and multiple-user accounts are not implemented.
- Voice recognition depends on browser support and may not work reliably in every browser.
- Push notifications and real alarms are not yet implemented.

## How Codex and GPT-5.6 Were Used

I developed the product concept, target audience, feature priorities, and interaction flow for AI Family OS.

I documented the product vision, MVP scope, and technical direction before implementation.

I then used Codex powered by GPT-5.6 to translate these requirements into a React and Vite prototype.

Codex supported the implementation and iteration of features including:

- mobile-first layout
- weekly and monthly calendars
- family member management
- event creation and editing
- custom reminders
- separate final alarm
- Brain Dump demonstration logic
- browser voice-input fallback
- responsive styling

I reviewed and tested each version locally and provided detailed follow-up requirements.

The product decisions and feature priorities were human-directed. Codex and GPT-5.6 accelerated the implementation process.

The current runtime MVP uses local demo processing and does not yet call the GPT-5.6 API.

## Product Direction

The long-term goal is to build an intelligent family operating system that connects calendars, email, tasks, routines, medications, and family information.

Instead of asking parents to organize everything manually, the system should help convert unstructured information into useful actions and clear priorities.

## Documentation

Additional project documentation is available in:

- docs/vision.md
- docs/mvp.md
- docs/technical-plan.md

## Author

Built by Pia Österlind as part of her transition into software development and AI-powered applications.

## License

This project is licensed under the MIT License.
