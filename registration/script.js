const registrationButton  = document.getElementById("SignUp");

registrationButton.addEventListener("click", (event) => {
  event.preventDefault(); 


  const nameInput = document.getElementById("inputName");
  const surnameInput = document.getElementById("inputSurName");
  const emailInput  = document.getElementById("inputEmail");
  const passwordInput  = document.getElementById("inputPassword");

  const name = nameInput.value;
  const surname = surnameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  console.log('данные верны');

  
  //Создание объекта для отправки данных
  const data = {
    name: name,
    password: password,
    email: email,
    surname: surname
  };

  // Опции для POST-запроса
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // Отправка POST-запроса на указанный URL
  fetch("http://158.160.152.102:8080/user/register", options)
  
    .then((response) => {
    console.log("34234523432432");


      if (response.status === 200) {
        response.json()
        .then(data => {

            document.getElementById('errorPopup').style.display = 'none';

            const authToken = data.token;
            localStorage.setItem("token", authToken);
            console.log(authToken);

            window.location.href = '/patients';
            console.log("Успешная регистрация");
  
      });
      } else if (response.status === 400) {
        response.json()
        .then(data => {
            console.log(data)
        });

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
      // Обработка ошибки сети или других ошибок
      console.error("Произошла ошибка:", error);
    });



});
