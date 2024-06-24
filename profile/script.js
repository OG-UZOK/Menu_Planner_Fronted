const authToken = localStorage.getItem("token");
getName();
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  },
};

var errorPopup = document.getElementById('errorPopup');
var errorText = errorPopup.querySelector('#errorText');

var fullNameInput = document.getElementById("inputName");
var dateInput = document.getElementById("inputDate");
var genderInput = document.getElementById("inputGender");
var phoneNumberInput = document.getElementById("inputPhoneNumber");
var emailInput = document.getElementById("inputEmail");

const saveButton  = document.getElementById("saveChanges");



fetch("https://mis-api.kreosoft.space/api/doctor/profile", options)
  .then((response) => {
    if (response.status === 200) {
      response.json() // Преобразование ответа в JSON
      .then(data => {     
      errorPopup.style.display = 'none'; 

      const email = data.email;
      const fullName = data.name;
      const date = data.birthday;
      const gender = data.gender;
      const phoneNumber = data.phone;
      

      console.log(email,fullName,date,gender,phoneNumber);
    
      fullNameInput.value = fullName;
      dateInput.value = serverToClientDate(date);
      console.log(serverToClientDate(date));
      genderInput.value = gender;
      phoneNumberInput.value = phoneNumber;
      emailInput.value = email;

    });
    } else if (response.status === 401) {
      errorText.textContent = 'Вы не авторизованы';
      errorPopup.style.display = 'flex';
    } else if(response.status === 404){
        errorText.textContent = 'Страница не найдена';
        errorPopup.style.display = 'flex';
    } else if(response.status === 500)
    {
      errorText.textContent = 'ошибка сервера';
      errorPopup.style.display = 'flex';  

      response.json().then((errorData) => {
          console.error("Произошла ошибка сервера:", errorData.message)
      });
    }
  })
  .catch((error) => {
    // Обработка ошибки сети или других ошибок
    console.error("Произошла ошибка:", error);
  });

saveButton.addEventListener("click", (event) => {
  event.preventDefault();

  const newFullName = fullNameInput.value;
  let newDate = dateInput.value;
  const newGender = genderInput.value;
  const newPhoneNumber = phoneNumberInput.value;
  const newEmail = emailInput.value;

  if (!validateInputsProfile()){
    console.log("Данные не верны");
    return;
  }

  //Создание объекта для отправки данных
  const data = {
    name: newFullName,
    email: newEmail,
    birthday: clientToServerDate(newDate),
    gender: newGender,
    phone: newPhoneNumber
  };

  if (newDate == ""){
    data.birthday = null;
  }
  if (newPhoneNumber == ""){
    data.phone = null;
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  };

  // Отправка POST-запроса на указанный URL
  fetch("https://mis-api.kreosoft.space/api/doctor/profile", options)
    .then((response) => {
      if (response.status === 200){   
        errorPopup.style.display = 'none';  
        console.log("Успешно!");

      } else if (response.status === 400) {
        errorText.textContent = 'Пользователь с таким email уже существует';
        errorPopup.style.display = 'flex';
      }
      else if (response.status === 401) {
        errorText.textContent = 'Вы не авторизированы';
        errorPopup.style.display = 'flex';
      } else if (response.status === 404) {
        errorText.textContent = 'Страница не найдена';
        errorPopup.style.display = 'flex';
      } else if(response.status === 500)
      {
        errorText.textContent = 'Ошибка сервера';
        errorPopup.style.display = 'flex';
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