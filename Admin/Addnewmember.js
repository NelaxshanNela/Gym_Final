document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const subscriptionCheckbox = document.getElementById('subscription');
    const initialfeeCheckbox = document.getElementById('initialfee');
    const feesInput = document.getElementById('fees');
    const trainingOptionsContainer = document.getElementById('trainingOptions');

    const addNewMember_url = "http://localhost:5297/api/Member/Add-Member";
    const viewAllPrograms_url = "http://localhost:5297/api/Program/Get-All-Programs";
    const getProgrmById_url = "http://localhost:5297/api/Program/Get-Progr-By-ID";
    const addEntrollments_url = "http://localhost:5297/api/Entrollment/Add-Enrollment";

    const paymentUrl = 'http://localhost:5297/api/Payment/Add-Payment';

    let programs = [];

    // Load programs on page load
    loadPrograms();

    // Load programs from the backend
    async function loadPrograms() {
        try {
            const response = await fetch(viewAllPrograms_url);
            if (!response.ok) {
                throw new Error('Failed to fetch programs');
            }

            programs = await response.json();
            trainingOptionsContainer.innerHTML = ''; // Clear existing options
            // console.log(programs);

            // Add checkboxes for each program
            programs.forEach(program => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${program.id}`;
                checkbox.name = 'training';
                checkbox.value = program.id;

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${program.programName} - ${program.totalFee} rupees (${program.type})`;

                trainingOptionsContainer.appendChild(checkbox);
                trainingOptionsContainer.appendChild(label);
                trainingOptionsContainer.appendChild(document.createElement('br'));
            });

            document.querySelectorAll('input[name="training"]').forEach(checkbox => {
                checkbox.addEventListener('change', calculateFees);
            });
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    }



    // Calculate total fees based on selected programs
    async function calculateFees() {
        const selectedTrainings = document.querySelectorAll('input[name="training"]:checked');
        const isSubscriptionSelected = subscriptionCheckbox.checked;
        const subscriptionDiscount = isSubscriptionSelected ? 2000 : 0;

        let totalFees = 0; // Initialize total fees

        for (let checkbox of selectedTrainings) {
            const programId = checkbox.value;
            // console.log(programId);

            try {
                const response = await fetch(`${getProgrmById_url}/${programId}`);
                if (response.ok) {
                    const program = await response.json();
                    // console.log(program);
                    totalFees += parseInt(program.totalFee, 10);  // Add program fee
                } else {
                    console.error(`Failed to fetch program data for ID: ${programId}`);
                }
            } catch (error) {
                console.error(`Error fetching program data: ${error}`);
            }
        }

        // Apply subscription logic if selected
        if (isSubscriptionSelected) {
            totalFees = totalFees * 12 - subscriptionDiscount;
        }

        feesInput.value = totalFees;  // Update the fees input
        console.log(`Total Fees after subscription: ${totalFees}`);
    }

    // Submit form to register the member
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const firstname = document.getElementById('fname').value;
        const lastname = document.getElementById('lname').value;
        const nic = document.getElementById('nic').value;
        const dob = document.getElementById('dob').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;
        const selectedTrainings = Array.from(document.querySelectorAll('input[name="training"]:checked')).map(cb => cb.value);
        const subscription = subscriptionCheckbox.checked;
        const initialfee = initialfeeCheckbox.checked;
        const fees = feesInput.value;
        const address = document.getElementById('address').value;


        const memberData = {
            Nic: nic,
            FirstName: firstname,
            LastName: lastname,
            Password: password,
            DOB: dob,
            ContactNumber: phone,
            Email: email,
            Address: address,
            Age: age,
            Gender: gender,
            Height: height,
            Weight: weight,
            CreationDate: new Date().toISOString().substring(0,10),
            is_initalfeePaid: initialfee,
            Membershiptype: subscription ? 'Annual' : 'Monthly',
            Fee: fees,

        };
       
        try {
            // Send member data to the backend
            const response = await fetch(addNewMember_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const memberResponse = await response.json();
            const memberId = memberResponse.id;

            const enrollmentsData = {
                memberId: memberId,
                programId: selectedTrainings
            };
            console.log("Enrollments data:", enrollmentsData);

            const enrollmentsResponse = await fetch(addEntrollments_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollmentsData)
            });
            console.log(enrollmentsResponse);

            if (!enrollmentsResponse.ok) {
                throw new Error('Program enrollment failed');
            }
            var isoDate = new Date().toISOString().substring(0,10);
            const paymentData = {
                memberId: memberId,
                paidDate: isoDate,
                amount: Number(fees)
            };
            console.log(paymentData)
            const paymentsResponce = await fetch(paymentUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            console.log(paymentsResponce);

            if (!paymentsResponce.ok) {
                throw new Error('Program enrollment failed');
            }

            alert('Registration and program enrollment successful!');
            form.reset();
            feesInput.value = ""; // Reset fees input manually if calculateFees() is not triggered

            // Redirect to Member Management page
            window.location.href = 'MemberManagement.html';
        } catch (error) {
            console.error('Error during registration or enrollment:', error);
            alert('Registration failed. Please try again.');
        }
    });

    // Go home button
    document.getElementById('goHome').addEventListener('click', function () {
        window.location.href = 'Adminhome.html'; // Update path as needed
    });
});