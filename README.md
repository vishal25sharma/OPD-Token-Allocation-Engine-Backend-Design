OPD Token Allocation Engine

A backend system that simulates OPD (Outpatient Department) token allocation for hospitals, handling priority-based scheduling, elastic capacity, emergency preemption, cancellations, and waitlists.

This project focuses on real-world OPD chaos — walk-ins, emergencies, paid priority patients, no-shows — and demonstrates how a backend system can handle them deterministically and fairly.

Features

 Slot-based scheduling per doctor

 Strict priority enforcement
EMERGENCY > PAID > FOLLOWUP > ONLINE > WALKIN

 Emergency preemption (bumps low-priority tokens if slot is full)

 Waitlist management with automatic reallocation

 Cancellation & no-show handling

 Dynamic reallocation without overbooking

 Full OPD day simulation (multiple doctors & slots)

 Tech Stack:

Backend: Node.js, Express

Architecture: REST APIs

Data Structures: Priority queues, in-memory state

Testing: Manual test runner using node-fetch

 Note: This implementation uses in-memory storage for clarity.
In production, this would be backed by a database with transactions.

 Project Structure:
.
├── src/
│   ├── index.js                  # Express server
│   ├── simulation/
│   │   └── day_simulation.js     # OPD day simulation
├── manual_test.js                # Manual API verification
├── DOCUMENTATION.md              # API & algorithm documentation
├── WALKTHROUGH.md                # Feature walkthrough with logs
├── package.json
└── package-lock.json

Setup & Run
Prerequisites

Node.js (v18+ recommended)

Installation
npm install

Start Server
node src/index.js


Server runs at:

http://localhost:3000

 API Overview
Initialize Doctor & Slots

POST /api/doctors

{
  "id": "doc1",
  "name": "Dr. House",
  "slots": [
    { "id": "slot1", "startTime": "09:00", "endTime": "10:00", "capacity": 2 }
  ]
}

Book Token

POST /api/book

{
  "doctorId": "doc1",
  "slotId": "slot1",
  "patientName": "John Doe",
  "type": "WALKIN"
}


Token Types

EMERGENCY

PAID

FOLLOWUP

ONLINE

WALKIN

Cancel Token

POST /api/cancel

{ "tokenId": "token_123" }

View Doctor Schedule

GET /api/doctors/:id

Prioritization Logic:
Token Type	Priority
EMERGENCY	50
PAID	40
FOLLOWUP	30
ONLINE	20
WALKIN	10
Emergency Handling

If slot is full:

Lowest-priority token is preempted

Preempted token is moved to waitlist

If no lower-priority token exists:

Emergency is waitlisted

Waitlist & Reallocation

On cancellation / no-show:

Highest-priority waitlisted token is promoted

FIFO applies when priorities are equal

Prevents starvation but favors safety & urgency

 Manual Testing:

Run the included test script:

node manual_test.js


This script demonstrates:

Slot filling

Waitlisting

Emergency preemption

Cancellation & reallocation

Simulation

Simulate a full OPD day with 3 doctors:

node src/simulation/day_simulation.js


Includes:

Random bookings

Emergencies

Preemption logs

Final slot states

 Documentation:

DOCUMENTATION.md
→ API design, prioritization rules, edge cases, failure handling

WALKTHROUGH.md
→ Step-by-step explanation with real simulation logs

Design Trade-offs

In-memory state for simplicity and clarity

Single-threaded safety via Node.js event loop

Strict priority enforcement over fairness

Easily extensible to:

Database-backed storage

Distributed locking

Slot aging / fairness tuning

 Why This Project?

This repository demonstrates:

Backend system design thinking

Real-world constraint handling

Priority queue–based algorithms

Clean API-driven architecture

Perfect for backend internships, system design evaluations, and hospital workflow simulations.
