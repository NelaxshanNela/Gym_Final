
const Programslist = document.getElementById("program-list");
const paymentHistoryList = document.getElementById('payment-history-list');

const programsArray = [];
const paymentArray=[]
const user = JSON.parse(sessionStorage.getItem("userInfo"));

const getProgramsApi = "http://localhost:5297/api/Entrollment/Get-Entrolled-Programs-By-MemberId/" + user.id;

console.log(user);

const GetAllPrograms = async (url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json(); // Parse the JSON from the response
        programsArray.push(...result); // Add the fetched programs to the array
        console.log("Success:", result); // Log the actual data

        renderPrograms(programsArray); // Render programs after data is fetched
    } catch (error) {
        console.error("Error:", error);
    }
};

GetAllPrograms(getProgramsApi);

function renderPrograms(programs) {
    Programslist.innerHTML = ''; // Clear the list before rendering
    programs.forEach(program => {
        const listItem = document.createElement('li');
        // Access a specific property of the program, e.g., program.name
        listItem.textContent = `program name:  ${program.programName}        Fees: ${program.totalFee
        }` ; // Adjust this based on your data structure
        Programslist.appendChild(listItem);
    });
}




//const res =  fetch(`http://localhost:5297/api/Payment/Get-Payment-By-ID/${user.id}`);

 const PayMentApi="http://localhost:5297/api/Payment/Get-Payment-By-ID/" + user.id
   // Populate payment history
   const GetAllPayments = async (url) => {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json(); 
        paymentArray.push(result); 
        console.log("Success:", result); 

        renderPayments(paymentArray); // Render programs after data is fetched
    } catch (error) {
        console.error("Error:", error);
    }
};

GetAllPayments(PayMentApi);

function renderPayments(payments) {
    Programslist.innerHTML = ''; // Clear the list before rendering
    payments.forEach(payment => {
        const listItem = document.createElement('li');
        // Access a specific property of the program, e.g., program.name
        listItem.textContent = `program name:  ${payment.paidDate}        amount: ${payment.amount
        }` ; // Adjust this based on your data structure
        paymentHistoryList.appendChild(listItem);
    });
}










 
   
   const goHomeButton = document.getElementById('goHome');
   goHomeButton.addEventListener('click', function () {
      window.location.href = 'Traineehome.html'; 
   });