🌊 Dayflow — Modern HR & Workforce Management Platform

Every workday, perfectly aligned.

Dayflow is a modern, role-based Human Resources and workforce management platform designed to bring everyday employee operations into one clean and intuitive workspace.

It provides employees and HR administrators with a unified system for attendance, leave management, payroll, employee profiles, documents, notifications, analytics, and reports.

The project focuses on a practical HR workflow with a polished product-style interface rather than looking like a basic academic CRUD application.

🚀 What is Dayflow?

Managing employee information across spreadsheets, attendance systems, leave requests, payroll records, and documents can become difficult as an organization grows.

Dayflow solves this by bringing these workflows together in one platform.

For Employees

📊 Personal HR dashboard

🕘 Daily check-in and check-out

📅 Attendance history and weekly attendance view

🏖️ Leave balance and leave requests

💰 Payroll and compensation information

👤 Employee profile management

📁 HR/compliance document management

🔔 Notifications and activity updates

⚙️ Personal settings

For HR / Administrators

📈 HR analytics dashboard

👥 Employee directory

🔎 Employee detail and workforce information

🏖️ Leave request review and approval

💳 Payroll management

📊 Reports and workforce insights

🔔 Notifications and activity tracking

➕ Employee onboarding

📄 Employee document management

✨ Key Features

🏠 Smart Dashboard

Dayflow provides separate dashboards based on the user's role.

The employee dashboard focuses on the individual's workday, while the HR dashboard provides an organization-level view of workforce activity.

⏱️ Attendance Management

Check-in / check-out

Work mode tracking

Attendance history

Weekly attendance view

Present, leave and half-day status

Attendance analytics

🏖️ Leave Management

Employees can:

View leave balances

Submit leave requests

Track request status

Cancel pending requests

HR administrators can:

Review requests

Approve or reject leave

Add reviewer comments

Monitor organization-wide leave activity

💰 Payroll Management

Dayflow supports structured compensation information including:

Base salary

Housing allowance

Transport allowance

Medical allowance

Performance allowance

Tax deductions

Provident fund

Health insurance

Payroll status

Net salary calculation

👥 Employee Management

HR administrators can manage:

Employee profiles

Departments

Job titles

Employee IDs

Work modes

Access roles

Contact information

Employment status

📁 Document Management

Employees can upload HR/compliance documents through a simple drag-and-drop interface.

Supported document categories include identity and other HR-related records.

🔔 Notifications & Activity

The application includes notification handling and activity tracking to keep users informed about important HR events.

📊 Reports & Analytics

The reporting area provides workforce-level insights and analytics that can be used to understand:

Attendance trends

Workforce distribution

Department statistics

Leave activity

Payroll information

HR operational metrics

🎨 UI / UX

Dayflow is designed as a modern SaaS-style HR product.

Design goals

Clean and professional interface

Responsive layouts

Clear visual hierarchy

Role-specific navigation

Reusable UI components

Interactive cards and data views

Smooth page transitions

Useful empty/loading states

Toast notifications for actions

Accessible forms and dialogs

The interface uses Tailwind CSS, Lucide icons, Recharts, and Motion to create a responsive and polished experience.

🧠 Architecture

Dayflow follows a modular React architecture.

Dayflow
│
├── Authentication
│   ├── Sign In
│   ├── Sign Up
│   ├── Email Verification
│   └── Password Reset
│
├── Employee Portal
│   ├── Dashboard
│   ├── Attendance
│   ├── Leave
│   ├── Payroll
│   ├── Profile
│   └── Documents
│
├── HR / Admin Portal
│   ├── HR Dashboard
│   ├── Employee Directory
│   ├── Employee Details
│   ├── Leave Requests
│   ├── Payroll Management
│   └── Reports
│
├── Shared
│   ├── Notifications
│   └── Settings
│
└── Data / Services
    ├── Authentication Service
    ├── Attendance Service
    ├── Leave Service
    ├── Payroll Service
    ├── Employee Service
    ├── Document Service
    ├── Notification Service
    ├── Activity Service
    └── Analytics Service

🛠️ Technology Stack

Layer

Technology

Frontend

React 19

Language

TypeScript

Build Tool

Vite

Styling

Tailwind CSS

UI Icons

Lucide React

Animation

Motion

Charts

Recharts

Backend/API Layer

Service-based architecture

Database Integration

Supabase

AI Integration

Google Gemini API

Runtime

Node.js

State / Local Persistence

Browser localStorage + application store

🔐 Data & Persistence

Dayflow is structured with a service layer so the UI does not directly depend on database implementation details.

The project includes:

Authentication services

Employee services

Attendance services

Leave services

Payroll services

Document services

Notification services

Activity services

Analytics services

The application also contains a local persistence/store layer using browser storage, making the project easy to run and demonstrate locally.

Supabase configuration is supported through environment variables for database-backed deployments.

🤖 AI Integration

Dayflow includes Google Gemini integration capability for AI-powered functionality.

The project expects the following environment variable when AI functionality is enabled:

GEMINI_API_KEY=your_gemini_api_key

AI functionality can be extended for areas such as:

HR insights

Workforce summaries

Report generation

Attendance analysis

Employee productivity insights

📁 Project Structure

src/
│
├── components/
│   ├── brand/
│   ├── features/
│   ├── layout/
│   └── ui/
│
├── context/
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
│
├── lib/
│   └── utils.ts
│
├── pages/
│   ├── auth/
│   ├── employee/
│   ├── admin/
│   └── shared/
│
├── services/
│   ├── api.ts
│   ├── store.ts
│   ├── supabase.ts
│   └── backend/
│
├── types/
│   └── index.ts
│
├── App.tsx
└── index.css

⚙️ Getting Started

Prerequisites

Make sure you have installed:

Node.js 18+

npm

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd dayflow

2. Install dependencies

npm install

3. Configure environment variables

Create a .env.local file:

GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key

Only add the keys required by the features you are using.

4. Start the development server

npm run dev

The application will be available at:

http://localhost:3000

5. Create a production build

npm run build

6. Preview the production build

npm run preview

7. Type-check the project

npm run lint

🧪 Testing

The project contains a test runner and can be executed with:

npm test

👨‍💻 Team

Dayflow is developed by a 3-member team with dedicated responsibilities across frontend, backend, database, and testing.

Member

Role

Responsibility

Contact

Nivash

Team Leader · Frontend Developer

UI/UX, React frontend, component architecture, application flow

nivashvash1@gmail.com

Nithish

Team Member · Database & Tester

Database/persistence, data validation, testing and quality assurance

rnithish18122006@gmail.com

Pranesh

Team Member · Backend Developer

Backend services, API/service architecture and server-side integration

pranesh2598@gmail.com

👑 Team Leadership

Nivash — Team Leader & Frontend

Responsible for coordinating the team and leading the frontend implementation, UI/UX direction, reusable components, and user-facing application experience.

🗄️ Database & QA

Nithish — Database & Tester

Responsible for persistence design, data handling, validation, testing workflows, bug identification, and ensuring the application behaves correctly across different use cases.

⚙️ Backend

Pranesh — Backend Developer

Responsible for backend/service implementation, API integration, business logic, and connecting application features with the data layer.

🗺️ Future Improvements

Possible future enhancements include:

🤖 AI-powered HR assistant

📊 Advanced workforce analytics

📅 Automated monthly HR reports

📈 Predictive attendance insights

🧑‍💼 Employee performance tracking

🔐 Stronger authentication and role-based access control

☁️ Full production Supabase deployment

📱 Progressive Web App support

📧 Automated HR email notifications

📄 PDF report generation

🔄 Real-time updates

🧩 More HR workflow integrations

🎯 Project Vision

Dayflow aims to make HR operations simpler, more transparent, and easier to manage by combining everyday workforce workflows into a single platform.

Instead of treating attendance, leave, payroll, employee information, documents, and reports as separate systems, Dayflow brings them together into one connected experience.

Dayflow — One workspace for the entire workday.

📄 License

This project is developed as a team project for educational, demonstration, and hackathon purposes.

⭐ Support the Project

If you find Dayflow useful or interesting:

⭐ Star the repository

🍴 Fork the project

🐛 Report issues

💡 Suggest improvements

🤝 Contribute to the project

Built with React, TypeScript, Supabase, Gemini, and a lot of teamwork.
