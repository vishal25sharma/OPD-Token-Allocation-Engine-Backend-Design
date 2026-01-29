// manual_test.js
const fetch = require('node-fetch'); // Need to install node-fetch or use generic fetch if node 18+

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
    console.log('=== Starting Manual Verification ===\n');

    // 1. Initialize Doctor
    console.log('1. Initializing Doctor (Dr. House)...');
    const initRes = await fetch(`${BASE_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: 'doc1',
            name: 'Dr. House',
            slots: [
                { id: 'slot1', startTime: '09:00', endTime: '10:00', capacity: 2 }
            ]
        })
    });
    console.log('Status:', initRes.status, await initRes.json());
    console.log('--------------------------------------------------\n');

    // 2. Book Walk-in (P1)
    console.log('2. Booking Walk-in Patient (P1)...');
    const p1Res = await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P1-Walkin', type: 'WALKIN' })
    });
    console.log('Status:', p1Res.status, await p1Res.json());
    console.log('--------------------------------------------------\n');

    // 3. Book Online (P2)
    console.log('3. Booking Online Patient (P2)...');
    const p2Res = await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P2-Online', type: 'ONLINE' })
    });
    console.log('Status:', p2Res.status, await p2Res.json());
    console.log('--------------------------------------------------\n');

    // 4. Try Booking Walk-in (P3) - Should be Waitlisted (Slot Full, Capacity 2)
    console.log('4. Attempting Booking Walk-in (P3) into FULL slot...');
    const p3Res = await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P3-Walkin', type: 'WALKIN' })
    });
    console.log('Status:', p3Res.status, await p3Res.json());
    console.log('--------------------------------------------------\n');

    // 5. Book Emergency (P4) - Should Preempt P1 (Walkin) since P1 < P2 (Online)
    console.log('5. Booking EMERGENCY Patient (P4)... EXPECT PREEMPTION of P1');
    const p4Res = await fetch(`${BASE_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P4-Emergency', type: 'EMERGENCY' })
    });
    console.log('Status:', p4Res.status, await p4Res.json());
    console.log('--------------------------------------------------\n');

    // 6. Check Schedule
    console.log('6. Checking Schedule - Should have P2 and P4');
    const schedRes = await fetch(`${BASE_URL}/doctors/doc1`);
    const sched = await schedRes.json();
    console.log(JSON.stringify(sched, null, 2));
    console.log('--------------------------------------------------\n');

    // 7. Cancel Emergency P4
    console.log('7. Canceling Emergency Patient (P4)...');
    // Note: In a real app we'd need the token ID returned from step 5. 
    // I didn't capture it above dynamically for simplicity in this artifact write, 
    // but let's assume I can't easily capture it without parsing response in this static string.
    // Actually, I can use a helper variable in the function scope.
    // For this `manual_test.js`, I'll rely on the previous logs to show what happened.
    // But to make it work, I need to parse the response from step 5.

    // Rerunning logic to capture IDs properly won't work in a static string unless I write the code to do it.
    // I will improve this script to capture IDs.
}

// Improved runner with state
(async () => {
    try {
        console.log('=== Starting Manual Verification ===\n');

        // 1. Init
        console.log('1. Initializing Doctor...');
        await fetch(`${BASE_URL}/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: 'doc1', name: 'Dr. House', slots: [{ id: 'slot1', startTime: '09:00', endTime: '10:00', capacity: 2 }] })
        });
        console.log('Doctor Initialized.\n');

        // 2. Book P1
        let res = await fetch(`${BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P1-Walkin', type: 'WALKIN' })
        });
        const p1 = await res.json();
        console.log('Booked P1:', p1);

        // 3. Book P2
        res = await fetch(`${BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P2-Online', type: 'ONLINE' })
        });
        const p2 = await res.json();
        console.log('Booked P2:', p2);

        // 4. Book P3 (Waitlist)
        res = await fetch(`${BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P3-Walkin', type: 'WALKIN' })
        });
        const p3 = await res.json();
        console.log('Booked P3 (Should be waitlisted):', p3);

        // 5. Book P4 (Emergency)
        res = await fetch(`${BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctorId: 'doc1', slotId: 'slot1', patientName: 'P4-Emergency', type: 'EMERGENCY' })
        });
        const p4 = await res.json();
        console.log('Booked P4 (Should preempt P1):', p4);

        // 6. Check Schedule
        res = await fetch(`${BASE_URL}/doctors/doc1`);
        const sched = await res.json();
        console.log('\nSchedule Status:');
        console.log('Slot Tokens:', sched.slots[0].tokens.map(t => `${t.patientName} (${t.priority})`));

        // 7. Cancel P4 (Emergency)
        if (p4.token && p4.success) {
            console.log('\n7. Canceling P4...');
            res = await fetch(`${BASE_URL}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenId: p4.token.id })
            });
            console.log('Cancel Result:', await res.json());

            // 8. Check Schedule again (Should have P2 and potentially P3 or P1 moved back in?)
            // If P1 was preempted, it was moved to waitlist.
            // If P4 is canceled, processWaitlist is called.
            // Waitlist has P3 (Walkin) and P1 (Walkin).
            // Both have priority 10. FIFO or simple sort order will decide.
            res = await fetch(`${BASE_URL}/doctors/doc1`);
            const finalSched = await res.json();
            console.log('Slot Tokens after Cancel:', finalSched.slots[0].tokens.map(t => `${t.patientName} (${t.priority})`));
        }

    } catch (e) {
        console.error('Error:', e);
    }
})();
