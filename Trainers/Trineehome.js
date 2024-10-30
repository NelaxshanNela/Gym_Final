
const gymId = JSON.parse(sessionStorage.getItem("userInfo"));
//const user = allUsersData.find(s => s.gymId == gymId);
const user = JSON.parse(sessionStorage.getItem("userInfo"));

console.log(user);

document.addEventListener("DOMContentLoaded", () => {
  if (user) {
    // Mohan's modification starting

    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("address").value = user.address;
    document.getElementById("phonenumber").value = user.contactNumber;
    document.getElementById("email").value = user.email;
    document.getElementById("weight").value = user.weight;
    document.getElementById("height").value = user.height;
  }

  document.getElementById("update-button").addEventListener("click", () => {
    document.getElementById("firstName").disabled = false;
    document.getElementById("lastName").disabled = false;
    document.getElementById("address").disabled = false;
    document.getElementById("phonenumber").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("weight").disabled = false;
    document.getElementById("height").disabled = false;

    document.getElementById("update-button").style.display = "none";
    document.getElementById("save-button").style.display = "block";
    document.getElementById("Cancel-button").style.display = "block";
  });

  document.getElementById("save-button").addEventListener("click", () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const email = document.getElementById("email").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;

    user.firstName = firstName;
    user.lastName = lastName;
    user.address = address;
    user.contactNumber = phonenumber;
    user.email = email;
    user.weight = weight;
    user.height = height;

    UpdateModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      contactNumber: user.contactNumber,
      email: user.email,
      address: user.address,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      membershiptype: user.membershiptype,
      fee: user.fee,
    };

    console.log(UpdateModel);

    const updateUSerApi =
      "http://localhost:5297/api/Member/Update-Member/" + user.id;

    const updateuserData = async (url, editeduser) => {
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editeduser),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response;
        console.log("Success:", result);
        alert("Your data updated");

        setTimeout(() => {
          window.location.href = "Traineelogin.html";
        }, 1000);

      } catch (error) {
        console.error("Error:", error);
      }
    };

    updateuserData(updateUSerApi, UpdateModel);

    document.getElementById("firstName").disabled = true;
    document.getElementById("lastName").disabled = true;
    document.getElementById("address").disabled = true;
    document.getElementById("phonenumber").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("weight").disabled = true;
    document.getElementById("height").disabled = true;

    document.getElementById("update-button").style.display = "block";
    document.getElementById("save-button").style.display = "none";
    document.getElementById("Cancel-button").style.display = "none";

   
  });

  document.getElementById("Cancel-button").addEventListener("click", () => {
    document.getElementById("firstName").disabled = true;
    document.getElementById("lastName").disabled = true;
    document.getElementById("address").disabled = true;
    document.getElementById("phonenumber").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("weight").disabled = true;
    document.getElementById("height").disabled = true;

    document.getElementById("update-button").style.display = "block";
    document.getElementById("save-button").style.display = "none";
    document.getElementById("Cancel-button").style.display = "none";
  });
});

// Mohan's modification ending

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  document.getElementById("update-password").addEventListener("click", () => {
    const oldPasswordInput = document
      .getElementById("oldPassword")
      .value.trim();
    const newPasswordInput = document
      .getElementById("newPassword")
      .value.trim();
    const confirmPasswordInput = document
      .getElementById("confirmPassword")
      .value.trim();

    console.log("Entered Old Password:", oldPasswordInput);
    console.log(
      "Stored User Password:",
      user ? user.password : "User not found"
    );
    console.log("Entered New Password:", newPasswordInput);
    console.log("Entered Confirm Password:", confirmPasswordInput);

    if (user) {
      if (user.password === oldPasswordInput) {
        if (newPasswordInput === confirmPasswordInput) {
          user.password = newPasswordInput;

          const updatePassword =
            "http://localhost:5297/api/Member/Update-Password/" + user.id;
          passwordModel = {
            oldPassword: oldPasswordInput,
            newPassword: newPasswordInput,
          };

          const updateuserPassword = async (url, req) => {
            try {
              const response = await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
              });

              if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
              }

              const result = await response;
              console.log("Success:", result);
              setTimeout(() => {
                window.location.href = "Traineelogin.html";
              }, 1000);

            } catch (error) {
              console.error("Error:", error);
            }
          };

          updateuserPassword(updatePassword, passwordModel);

          alert("Password Changed Successfully");
        } else {
          alert("New Password and Confirm Password do not match");
        }
      } else {
        alert("Old Password is incorrect");
      }
    } else {
      alert("User not found");
    }
  });
});

//Notification

// document.addEventListener("DOMContentLoaded", () => {
//   const notificationIcon = document.getElementById("messageimg");
//   const notificationModal = document.getElementById("notificationModal");
//   const notificationList = document.getElementById("notification-list");
//   const closeModalButton = document.querySelector(".modal .close");

//   function loadNotifications() {
//     const notifications =
//       JSON.parse(localStorage.getItem("Notifications")) || [];
//     const gymId = JSON.parse(sessionStorage.getItem("gymId")); // Get the current user's gym ID
//     notificationList.innerHTML = "";

//     notifications.forEach((notification) => {
//       if (notification.gymId == gymId) {
//         const listItem = document.createElement("li");
//         listItem.textContent = notification.message;
//         notificationList.appendChild(listItem);
//       }
//     });

//     // Show modal if there are notifications
//     if (notificationList.children.length > 0) {
//       notificationModal.style.display = "block";
//     }
//   }

//   // Show notifications modal
//   notificationIcon.addEventListener("click", () => {
//     loadNotifications();
//   });

//   // Close the modal
//   closeModalButton.addEventListener("click", () => {
//     notificationModal.style.display = "none";
//   });

//   // Close the modal if the user clicks outside of it
//   window.addEventListener("click", (event) => {
//     if (event.target === notificationModal) {
//       notificationModal.style.display = "none";
//     }
//   });
// });
