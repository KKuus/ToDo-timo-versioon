var jwt = localStorage.getItem("jwt");
if (jwt != null) {
    window.location.href = './index.html'; 
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    

    fetch("https://demo2.z-bit.ee/users/get-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({
            "username": email,
            "password": password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['access_token']) {

            localStorage.setItem("jwt", data['access_token']);
            window.location.href = './index.html';
        } else {
            alert("Login failed. Please check your credentials.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred during login. Please try again later.");
    });

    return false;
}
