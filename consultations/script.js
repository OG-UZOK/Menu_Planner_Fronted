const authToken = localStorage.getItem("token");
getName();
var options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  },
};

var errorPopup = document.getElementById('errorPopup');
var errorText = errorPopup.querySelector('#errorText');

var groupedTrueInput = document.getElementById("radioRepeat");
var MKB10Input = document.getElementById("inputMKB10");
var inputSize = document.getElementById("inputSize");

var searchButton = document.getElementById("search")

var rootsICD = icdRoots();
loadAndProcessData();




searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const grouped = groupedTrueInput.checked;
  const size = inputSize.value;

  if (!validateInputsFiltersPatients()){
    console.log("Данные не верны");
    return;
  }

  var selectedOptions;
  if (MKB10Input.value == ''){
    selectedOptions = null;
  } else {
    selectedOptions = Array.from(MKB10Input.selectedOptions).map(option => option.value);
  }


  const dataCurrent = {
    grouped: grouped,
    icdRoots: MKB10Options,
    size: size,
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
          paramsCurrent.append('icdRoots', val);
        });
      } else {
        paramsCurrent.append(key, value);
      }
    }
    });

  var url = `https://mis-api.kreosoft.space/api/consultation${paramsCurrent.toString() ? `?${paramsCurrent.toString()}` : ""}`;
  const optionsCurrent = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  };


  fetch(url, optionsCurrent)
    .then((response) => {
      if (response.status === 200){   
        
        response.json() 
        .then(data => {

            paginationCreate(data,url,optionsCurrent);
        
        });
        var currentUrl = new URL(window.location.origin + window.location.pathname);
        const apiUrlParams = new URLSearchParams(url.split('?')[1]);

        apiUrlParams.forEach((value, key) => {
          currentUrl.searchParams.append(key, value);
        });

      
      window.history.replaceState(null, null, currentUrl.href);
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



const urlParams = new URLSearchParams(window.location.search);
const grouped1 = urlParams.get('grouped');
const icdRoots1 = urlParams.getAll('icdRoots');
const page1 = urlParams.get('page');
const size1 = urlParams.get('size');


  const dataCurrent1 = {
    grouped: grouped1,
    icdRoots: icdRoots1,
    size: size1,
    page: page1,
  };
 
  
  const paramsCurrent1 = new URLSearchParams();
    Object.entries(dataCurrent1).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {

        value.forEach(val => {
          paramsCurrent1.append('icdRoots', val);
        });
      } else {
        paramsCurrent1.append(key, value);
      }
    }
    });

  var url1 = `https://mis-api.kreosoft.space/api/consultation${paramsCurrent1.toString() ? `?${paramsCurrent1.toString()}` : ""}`;

  const optionsCurrent1 = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  };



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