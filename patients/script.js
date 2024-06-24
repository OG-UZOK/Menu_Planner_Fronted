
getName();

const authToken = localStorage.getItem("token");
var options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  },
};


var errorPopup = document.getElementById('errorPopup');
var errorText = errorPopup.querySelector('#errorText');

var errorPopup1 = document.getElementById('errorPopup1');
var errorText1 = errorPopup1.querySelector('#errorText1');


var fullNameInput = document.getElementById("inputName");
var consulusionInput = document.getElementById("inputСonclusion");
var visitInput = document.getElementById("scheduledVisits");
var onlyMineInput = document.getElementById("onlyMine");
var sortingInput = document.getElementById("sortingPatients");
var inputSize = document.getElementById("inputSize");


const searchButton  = document.getElementById("search");
const register = document.getElementById("register");


searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const name = fullNameInput.value;
  const visit = visitInput.checked;
  const onlyMine = onlyMineInput.checked;
  const sorting = sortingInput.value;
  const size = inputSize.value;

  if (!validateInputsFiltersPatients()){
    console.log("Данные не верны");
    return;
  }

  var selectedOptions;
  if (consulusionInput.value == ''){
     selectedOptions = null;
  } else {
     selectedOptions = Array.from(consulusionInput.selectedOptions).map(option => option.value);
  }


  const dataCurrent = {
    name: name,
    consulusions: selectedOptions,
    size: size,
    scheduledVisits: visit,
    onlyMine: onlyMine,
    sorting: sorting,
    page: 1,
  };
 
  if (size == ""){
    dataCurrent.size = 5;
  }
  
  const paramsCurrent = new URLSearchParams();
    Object.entries(dataCurrent).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {

        value.forEach(val => {
          paramsCurrent.append('conclusions', val);
        });
      } else {
        paramsCurrent.append(key, value);
      }
    }
    });

  var url = `https://mis-api.kreosoft.space/api/patient${paramsCurrent.toString() ? `?${paramsCurrent.toString()}` : ""}`;
  const optionsCurrent = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  };


  // Отправка POST-запроса на указанный URL
  fetch(url, optionsCurrent)
    .then((response) => {
      if (response.status === 200){   
        
        response.json() // Преобразование ответа в JSON
        .then(data => {

          paginationCreate(data,url,optionsCurrent);
        
        });
        var currentUrl = new URL(window.location.origin + window.location.pathname);
        const apiUrlParams = new URLSearchParams(url.split('?')[1]);

        apiUrlParams.forEach((value, key) => {
          currentUrl.searchParams.append(key, value);
        });

      
      window.history.replaceState(null, null, currentUrl.href);
      // window.location.href = currentUrl;
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



register.addEventListener("click", (event) => {
  event.preventDefault();


  var patientNameInput = document.getElementById("inputNamePatient");
  var patientGenderInput = document.getElementById("inputGenderPatient");
  var patientDateInput = document.getElementById("inputDatePatinet");


  const namePatient = patientNameInput.value;
  const genderPatient = patientGenderInput.value;
  const datePatient = patientDateInput.value;


  if (!validateInputsRegisterPatient()){
    console.log("Данные не верны");
    return;
  }

  const data = {
    name: namePatient,
    birthday: clientToServerDate(datePatient),
    gender: genderPatient
  };

  if (datePatient == ""){
    data.birthday = null;
  }

    options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  };


  fetch("https://mis-api.kreosoft.space/api/patient", options)
    .then((response) => {

      if (response.status === 200) {
        response.json()
        .then(data => {

          errorPopup1.style.display = 'none';

            console.log("Успешно");

            patientNameInput.value = null;
            patientGenderInput.value = "male";
            patientDateInput.value = null;



            var modal = document.getElementById('exampleModal');
            var modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
  
      });
      } else if (response.status === 400) {
        response.json()
        .then(data => {
        });

        errorText1.textContent = 'Неправильно введены данные';
        errorPopup1.style.display = 'flex';
        
        
      }
      else if (response.status === 401) {
        errorText1.textContent = 'Вы не авторизованы';
        errorPopup1.style.display = 'flex';
      } else if(response.status === 404){
          errorText1.textContent = 'Страница не найдена';
          errorPopup1.style.display = 'flex';
      } else if(response.status === 500)
      {
        errorText1.textContent = 'ошибка сервера';
        errorPopup1.style.display = 'flex';  
  
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




const urlParams = new URLSearchParams(window.location.search);
const name1 = urlParams.get('name');
const conclusions1 = urlParams.getAll('conclusions');
const sorting1 = urlParams.get('sorting');
const scheduledVisits1 = urlParams.get('scheduledVisits');
const onlyMine1 = urlParams.get('onlyMine');
const page1 = urlParams.get('page');
const size1 = urlParams.get('size');


  const dataCurrent1 = {
    name: name1,
    conclusions: conclusions1,
    size: size1,
    page: page1,
    scheduledVisits1: scheduledVisits1,
    onlyMine: onlyMine1,
    sorting: sorting1,
  };
 
  
  const paramsCurrent1 = new URLSearchParams();
    Object.entries(dataCurrent1).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {

        value.forEach(val => {
          paramsCurrent1.append('conclusions', val);
        });
      } else {
        paramsCurrent1.append(key, value);
      }
    }
    });

  var url1 = `https://mis-api.kreosoft.space/api/patient${paramsCurrent1.toString() ? `?${paramsCurrent1.toString()}` : ""}`;

  const optionsCurrent1 = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  };



  // Отправка POST-запроса на указанный URL
  fetch(url1, optionsCurrent1)
    .then((response) => {
      if (response.status === 200){   
        
        response.json() // Преобразование ответа в JSON
        .then(data1 => {

          paginationCreate(data1,url1,optionsCurrent1);
            
        });
        errorPopup.style.display = 'none';  
        console.log("Успешно!");
      } else if (response.status === 400) {
        errorText.textContent = 'Пользователь с таким email уже существует';
        errorPopup.style.display = 'flex';
      }
      else if (response.status === 401) {
        errorText.textContent = 'Вы не авторизированы';
        errorPopup.style.display = 'flex';
        window.location.href = '../login/index.html';
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

