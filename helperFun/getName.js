function getName(){
    var name = '';
    const authToken = localStorage.getItem("token");
    var url = "https://mis-api.kreosoft.space/api/doctor/profile";
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
            var navName = document.getElementById("navName");
            navName.innerHTML = `${data.name}`
        
        }); 
        console.log("Успешно!");
      } else if (response.status === 400) {
      }
      else if (response.status === 401) {
      } else if (response.status === 404) {
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
}
  