# Lunexa AI 

Next-generation video conferencing powered by AI: smarter, more productive, and effortlessly organized.

---

## Features


| Core Functionality      | AI Capabilities         |
| ----------------------- | ----------------------- |
| AI-Powered Video Calls  | Custom Real-time Agents |
| Smart Meeting Summaries | AI Q&A                  |
| Meeting Recordings      | OpenAI Integration      |
| Transcript Search       | Smart Transcripts       |

---

## Technical Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js 16, React 19, Tailwind CSS v4         |
| UI Components | shadcn/ui                                     |
| Auth          | Clerk                                         |
| Real-time     | Stream Video SDK, Stream Chat SDK             |
| Background    | Inngest (background jobs)                     |                        |
| DB/ORM        | MongoDB                                       |
| Package Mgmt  | Npm, or yarn                             |
| Deploy        | Vercel                                        |

---


## API Endpoints

| Endpoint                      | Method | Description                      |
| ----------------------------- | ------ | -------------------------------- |
| `/api/auth/sign-in`           | POST   | Login User                       |
| `/api/auth/sign-up`           | POST   | Register User                    |
| `/api/meetings`               | GET    | List meetings                    |
| `/api/meetings`               | POST   | Create meeting                   |
| `/api/meetings/:id`           | GET    | Get meeting details              |
| `/api/meetings/:id/summary`   | GET    | Get meeting transcription        |
| `/api/agents`                 | GET    | Get Agents                       |
| `/api/agents`                 | POST   | Post Agent                       |

---
