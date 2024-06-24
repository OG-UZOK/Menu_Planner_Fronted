function paginationCreate(data,url,optionsCurrent,){
    let current = data.pagination.current;
    let size = data.pagination.size;
    let count = data.pagination.count;
    let listPages = [];
    let stringPages = 1;


  
    function displayList() {
        var form = document.getElementById("listOfPatients");
        form.innerHTML = '';

        var patientsCount = data.patients.length 
        var rowCount =  Math.ceil(patientsCount / 2)
        var patienCurrent = 0;

        for (let i = 0; i < rowCount; i ++) {
            var row = document.createElement("div");
            row.className += 'row';
            for (let j = 0; j < 2 && patienCurrent < patientsCount; j++) {
                var patient = data.patients[patienCurrent];
                var element = document.createElement("div");
                element.className += 'col-xl m-2 patient';
                element.innerHTML += `<h1>${patient.name}</h1>`;
                if (patient.gender == "Male"){
                    element.innerHTML += `<p><p1>Пол - </p1>Мужчина</p>`;
                } else {
                    element.innerHTML += `<p><p1>Пол - </p1>Женщина</p>`;
                }
                element.innerHTML += `<p><p1>Дата рождения - </p1>${serverToClientDate(patient.birthday)}</p>`;

                var hiddenIdElement = document.createElement("div");
                hiddenIdElement.style.display = "none";
                hiddenIdElement.dataset.patientId = patient.id;
                element.appendChild(hiddenIdElement);
                element.addEventListener('click', function() {
                  var clickedId = this.querySelector("[data-patient-id]").dataset.patientId;
                  console.log(clickedId);
                  localStorage.setItem('selectedPatientId', clickedId);
                  window.location.href = "/patient";
                });
              
                row.appendChild(element);
                patienCurrent++;
            }
            form.appendChild(row);
        }
    }
  
    function displayPagination(arrData, rowPerPage) {
      const ulEl = document.getElementById("page");

      ulEl.innerHTML = '';

      const liElPrev = document.getElementById("pagePrevious");
      listPages[0] = liElPrev;
      liElPrev.style.display = 'none';
      if (count > 10){
        if ((Math.floor((current - 1) / 10) * 10 + 1) == 1){
          liElPrev.classList.add('disabled');
        }
        liElPrev.style.display = 'flex';
        
        liElPrev.addEventListener('click', () => {
            if (current > 0 && current < 11){
                return;
            } else if (current > 10 && current < 21){
                listPages[0].classList.add('disabled');
            }  if (Math.floor(current / 10) == Math.floor(count / 10)){
                listPages[count + 1].classList.remove('disabled');
            }
            current = Math.floor((current - 11) / 10) * 10 + 1;
            
      
            let currentItemLi = document.querySelector('.active');
            currentItemLi.classList.remove('active');
      
            listPages[current].classList.add('active');
    
            ulEl.innerHTML = '';
            for (let i = current; i < current + 10; i++) {          
              ulEl.appendChild(listPages[i])
            }

            var currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('page', current);
            window.history.replaceState(null, null, currentUrl.href);


            url = updatePageParameter(url,current);
            fetch(url, optionsCurrent)
            .then((response) => {
                if (response.status === 200){   
            
                response.json() // Преобразование ответа в JSON
                .then(newData => {
    
                    data = newData;
                    displayList();
                    return;
                
            });
            errorPopup.style.display = 'none';  
          } else if (response.status === 400) {
            errorText.textContent = 'Не верно выбрана страница';
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
        })


      }
        
      for (let i =  1; i <= count; i++) {
        const liEl = displayPaginationBtn(i);
        listPages[i] = liEl;
        if (i >= Math.floor((current - 1) / 10) * 10 + 1 && i <= Math.floor((current - 1) / 10) * 10 + 10){
          ulEl.appendChild(listPages[i]);
        }
      }

      const liElNext = document.getElementById("pageNext");
      listPages.push(liElNext);
      listPages[count + 1] = liElNext;
      liElNext.style.display = 'none';
      if (count > 10){
        if ((Math.floor((current - 1) / 10) * 10 + 1) == (Math.floor((count - 1) / 10) * 10 + 1)){
          console.log(130)
          liElNext.classList.add('disabled');
        }
        liElNext.style.display = 'flex';

        liElNext.addEventListener('click', () => {
            if (Math.floor((current - 1)/10) == Math.floor(count/10)){
                return;
            } else if (Math.floor((current - 1)/10) == Math.floor(count/10) - 1){
              console.log(143);
                listPages[count + 1].classList.add('disabled');
            } if (current > 0 && current < 11){
                listPages[0].classList.remove('disabled');
            }
            current = Math.floor((current + 9) / 10) * 10 + 1;
            
      
            let currentItemLi = document.querySelector('.active');
            currentItemLi.classList.remove('active');
      
            listPages[current].classList.add('active');
    
            ulEl.innerHTML = '';
            for (let i = current; i <= Math.min(current + 9, count); i++) {        
              ulEl.appendChild(listPages[i])
            }

            var currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('page', current);
            window.history.replaceState(null, null, currentUrl.href);
    
            url = updatePageParameter(url,current);
            fetch(url, optionsCurrent)
            .then((response) => {
                if (response.status === 200){   
            
                response.json() // Преобразование ответа в JSON
                .then(newData => {
    
                    data = newData;
                    displayList();
                    return;
                
            });
            errorPopup.style.display = 'none';  
          } else if (response.status === 400) {
            errorText.textContent = 'Не верно выбрана страница';
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
        })
      }
    }
  
    function displayPaginationBtn(page) {
      const liEl = document.createElement("li");
      liEl.className = 'page-item';
      liEl.innerHTML = (`<a class="page-link" href="#listOfPatients">${page}</a>`);
  
      if (current == page) liEl.classList.add('active');
  
      liEl.addEventListener('click', () => {
        current = page
        // displayList(postsData, rows, currentPage)
  
        let currentItemLi = document.querySelector('.active');
        currentItemLi.classList.remove('active');
  
        liEl.classList.add('active');


        url = updatePageParameter(url,page);
        fetch(url, optionsCurrent)
        .then((response) => {
            if (response.status === 200){   
        
            response.json() // Преобразование ответа в JSON
            .then(newData => {

                data = newData;
                displayList();
                return;
            
        });
        errorPopup.style.display = 'none';  
      } else if (response.status === 400) {
        errorText.textContent = 'Не верно выбрана страница';
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
    })
  
      return liEl;
    }

    function updatePageParameter(url, newPage) {
        const urlObject = new URL(url);
        const params = new URLSearchParams(urlObject.search);

        var currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('page', newPage);
        window.history.replaceState(null, null, currentUrl.href);

    
        if (params.has('page')) {
            params.set('page', newPage);
        } else {
            params.append('page', newPage);
        }
    
        urlObject.search = params.toString();
        
        return urlObject.toString();
    }
  
    displayList();
    displayPagination();
}