document.addEventListener('DOMContentLoaded', function () {
    const allProgramsData = JSON.parse(localStorage.getItem('allProgramsData')) || [];
    const trainingOptionsContainer = document.getElementById('trainingOptions');

    // Dynamically create training checkboxes based on allProgramsData
    allProgramsData.forEach(program => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = program.name;
        checkbox.name = 'training';
        checkbox.value = program.name;

        const label = document.createElement('label');
        label.htmlFor = program.name;
        label.textContent = `${program.type} - ${program.name}`;

        const lineBreak = document.createElement('br');

        trainingOptionsContainer.appendChild(checkbox);
        trainingOptionsContainer.appendChild(label);
        trainingOptionsContainer.appendChild(lineBreak);
    });

    // Populate form with existing user data for editing
    const editUserData = JSON.parse(localStorage.getItem('editUserData'));
    if (editUserData) {
        document.getElementById('name').value = editUserData.name;
        document.getElementById('nic').value = editUserData.nic;
        document.getElementById('phone').value = editUserData.phone;
        document.getElementById('address').value = editUserData.address;
        document.getElementById(editUserData.gender).checked = true;

        // Ensure the training array matches the checkbox IDs
        editUserData.training.forEach(training => {
            const trainingCheckbox = document.querySelector(`input[name="training"][value="${training}"]`);
            if (trainingCheckbox) {
                trainingCheckbox.checked = true;
            }
        });

        document.getElementById('subscription').checked = !!editUserData.annualFees;
        document.getElementById('fees').value = editUserData.annualFees || editUserData.monthlyFees + " per month";
        document.getElementById('password').value = editUserData.password;
    }

    // Handle form submission for updating the member
    document.getElementById('updateMemberForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const nic = document.getElementById('nic').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        const trainingElements = document.querySelectorAll('input[name="training"]:checked');
        const training = Array.from(trainingElements).map(el => el.value);

        const isAnnualSubscription = document.getElementById('subscription').checked;

        // Calculate the fees
        const fees = calculateFees();
        const monthlyFees = isAnnualSubscription ? null : fees;
        const annualFees = isAnnualSubscription ? fees : null;
        const password = document.getElementById('password').value;

        const updatedUserData = {
            gymId: editUserData.gymId, // Keep the existing Gym ID
            name: name,
            nic: nic,
            phone: phone,
            address: address,
            gender: gender,
            training: training,
            monthlyFees: monthlyFees,
            annualFees: annualFees,
            password: password,
            date: Date.now()
        };

        let allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || [];
        const userIndex = allUsersData.findIndex(u => u.gymId == editUserData.gymId);
        if (userIndex !== -1) {
            allUsersData[userIndex] = updatedUserData;
            localStorage.setItem('allUsersData', JSON.stringify(allUsersData));

            alert('Member information updated successfully!');

            // Clear form and fields
            document.getElementById('updateMemberForm').reset();
            document.getElementById('fees').value = '';

            // Redirect to MemberManagement page
            window.location.href = 'MemberManagement.html';
        } else {
            alert('Error: Member not found.');
        }
    });

    document.getElementById('goHome').addEventListener('click', function () {
        window.location.href = 'Adminhome.html'; // Change 'Adminhome.html' to your home page URL
    });

    const trainingElements = document.querySelectorAll('input[name="training"]');
    trainingElements.forEach(el => {
        el.addEventListener('change', calculateFees);
    });

    document.getElementById('subscription').addEventListener('change', calculateFees);

    function calculateFees() {
        let fees = 0;
        const trainingElements = document.querySelectorAll('input[name="training"]:checked');
        trainingElements.forEach(el => {
            const program = allProgramsData.find(p => p.name === el.value);
            if (program) {
                fees += parseInt(program.fee);
            }
        });

        const isAnnualSubscription = document.getElementById('subscription').checked;
        const totalFees = isAnnualSubscription ? (fees * 12 - 1000) : fees;

        // Update the fees field
        document.getElementById('fees').value = isAnnualSubscription ? totalFees + " rupees" : (fees + " per month");

        return totalFees;
    }
});
