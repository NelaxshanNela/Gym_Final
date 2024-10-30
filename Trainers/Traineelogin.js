document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Tlogin-form').addEventListener('submit', async (event) => {
        event.preventDefault();


        var foundUser;
        // Get username and password from front end
        var username = document.getElementById("username-input").value;
        const password = document.getElementById("password-input").value;

        console.log("Password:", password);

        // Convert username to integer
        username = parseInt(username);
        console.log("Username:", username);
        // Assign input to an object
        const userinfo = {
            userid: username,
            pass: password
        };

        // Fetch user data from backend
        const getUserInfo_apiurl = `http://localhost:5297/api/Member/Get-Member-By-ID/${username}`;
       

        try {
            // Pass ID and get member info
            const response = await fetch(getUserInfo_apiurl, {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json(); // Parse the response as JSON
                foundUser = data;
                console.log('User Data:', data);
            } else {
                console.error('Failed to fetch user data:', response.status);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

      

        if (foundUser.password==userinfo.pass) {
            // Save loggedInUser to sessionStorage
          console.log("Login successful, redirecting...");
         
          document.getElementById('login-message').textContent = "Login Successful.";
          document.getElementById('login-message').style.color = 'green';
          sessionStorage.setItem('loggedInUser', username);
          sessionStorage.setItem('userInfo',JSON.stringify(foundUser));
          console.log(foundUser);
          window.location.href = "../Trainers/Traineehome.html";
        }

        else{
              // Display error message
              console.log("Login failed, incorrect username or password.");
              document.getElementById('login-message').textContent = "Wrong username or password.";
              document.getElementById('login-message').style.color = 'red';
        }

       event.target.reset();
    });
});



