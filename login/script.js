const emailInput = document.getElementById("exampleInputEmail1");
const passwordInput = document.getElementById("exampleInputPassword1");
const loginButton  = document.getElementById("login");
const registrationButton  = document.getElementById("registration");

loginButton.addEventListener("click", (event) => {
  event.preventDefault(); 

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!validateInputsLogin()){
    console.log("Данные не верны");
    return;
  }

  const data = {
    email: email,
    password: password
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  };

  fetch("http://158.160.152.102:8080/user/login", options)
    .then((response) => {
      if (response.status === 200) {
        response.json() 
        .then(data => {
          const authToken = data.token;
          localStorage.setItem("token", authToken);
          console.log(authToken);
          document.getElementById('errorPopup').style.display = 'none';
          window.location.href = ''; // TODO
        });
      } else if (response.status === 400) {
        document.getElementById('errorPopup').style.display = 'flex';
      }
      else if(response.status === 500)
      {
        response.json().then((errorData) => {
            console.error("Произошла ошибка сервера:", errorData.message)
        });
      }
    })
    .catch((error) => {
      console.error("Произошла ошибка:", error);
    });
});

registrationButton.addEventListener("click", (event) => {
    event.preventDefault(); 
    window.location.href = '/registration';
});