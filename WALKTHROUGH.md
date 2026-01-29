# OPD Token Allocation Engine - Walkthrough

This document provides a step-by-step walkthrough of the **OPD Token Allocation Engine**, demonstrating its core features: **Elastic Capacity**, **Prioritization**, and **Preemption**.

## 1. Setup and Installation

### Prerequisites
- Node.js installed.

### Installation
```bash
npm install
```

### Running the Server
```bash
node src/index.js
```
*Server runs on `http://localhost:3000`*

## 2. Core Features Demonstration

### A. Elastic Capacity & Preemption
The core feature of this engine is the ability to handle **Emergency** patients comfortably even when slots are full, by preempting (bumping) lower-priority patients.

**Scenario**:
1.  **Dr. Jones** has a slot at **10:00** with **Capacity 3**.
2.  The slot is fully booked with:
    - `Pat_10_FOLLOWUP` (Priority 30)
    - `Pat_17_EMERGENCY` (Priority 50)
    - `Pat_9_FOLLOWUP` (Priority 30)
3.  A new **Emergency** patient (`Pat_19_EMERGENCY`) arrives.
4.  **Action**: The system identifies that `Pat_9_FOLLOWUP` (Priority 30) is the lowest priority candidate (or one of them).
5.  **Result**: `Pat_9` is moved to the **Waitlist**, and `Pat_19` is allocated.

**Simulation Log Evidence**:
```text
[Event 19] Booking Pat_19_EMERGENCY -> Dr. Jones (Neurology) (10:00)
   -> SUCCESS: Allocated (Preempted Pat_9_FOLLOWUP)
```

### B. Waitlist Management
When a slot is full and the new patient has lower or equal priority than existing tokens, they are waitlisted.

**Scenario**:
- **Dr. Ray** has a full slot at **9:00**.
- A new `ONLINE` patient (Priority 20) requests booking.
- All existing tokens have Priority >= 20.
- **Result**: Patient is added to waitlist.

**Simulation Log Evidence**:
```text
[Event 20] Booking Pat_20_ONLINE -> Dr. Ray (General) (9:00)
   -> WAITLISTED: Slot full, added to waitlist
```

## 3. Running the Simulation
We have provided a simulation script that generates a random day of traffic for 3 doctors.

```bash
node src/simulation/day_simulation.js
```

## 4. Manual Testing
You can manually interact with the API using the provided `manual_test.js` or `curl` commands found in `DOCUMENTATION.md`.

```bash
# Run manual verification script
node manual_test.js
```
