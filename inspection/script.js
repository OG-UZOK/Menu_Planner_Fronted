const id = localStorage.getItem("selectedInspectionId");
getName();
const authToken = localStorage.getItem("token");
let countDiagnosis = 0;

var blockInfo = document.getElementById("blockInfo");
var blockComplaints = document.getElementById("blockComplaints");
var blockAnamnesis = document.getElementById("blockАnamnesis");
var listOfConsultations = document.getElementById("listOfConsultations");
var listOfDiagnosis = document.getElementById("listOfDiagnosis");
var blockRecomendation = document.getElementById("blockRecomendation");
var blockConclusion = document.getElementById("blockConclusion");

var errorPopup = document.getElementById('errorPopup');
var errorText = errorPopup.querySelector('#errorText');

var errorPopup1 = document.getElementById('errorPopup1');
var errorText1 = errorPopup1.querySelector('#errorText1');

var urlGeneral = `https://mis-api.kreosoft.space/api/inspection/${id}`;

const optionsGeneral  = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
};

fetch(urlGeneral, optionsGeneral)
.then((response) => {
    if (response.status === 200){   
    
    response.json() // Преобразование ответа в JSON
    .then(data => {
        addInfo(data);
        checkAuthor(data);
    });
    errorPopup.style.display = 'none';  
    console.log("Успешно!");
    } else if (response.status === 400) {
        errorText.textContent = 'Пользователь с таким email уже существует';
        errorPopup.style.display = 'flex';
        return;
    }
    else if (response.status === 401) {
        errorText.textContent = 'Вы не авторизированы';
        errorPopup.style.display = 'flex';
        return;
    } else if (response.status === 404) {
        errorText.textContent = 'Страница не найдена';
        errorPopup.style.display = 'flex';
        return;
    } else if(response.status === 500){
        errorText.textContent = 'Ошибка сервера';
        errorPopup.style.display = 'flex';
        response.json().then((errorData) => {
            console.error("Произошла ошибка сервера:", errorData.message)
        });
        return;
    }
})
.catch((error) => {
    // Обработка ошибки сети или других ошибок
    console.error("Произошла ошибка:", error);
    return;
});


function addInfo(data){
    blockInfo.innerHTML = 
    `
    <div class="col-auto titleCard">
            <h2>Амбулаторный осмотр от ${formatDateTime(data.date)}</h2>
    </div>
    <div class="col"></div>
    <div class="col-auto button">
      <button type="button" class="btn btn-primary button" data-bs-toggle="modal" data-bs-target="#alterModal" id="alterInspection" style="display: none">Редактировать осмотр</button>
    </div>
    <div class="col-12">
        <b>Пациент: ${data.patient.name}</b>
    </div>
    <div class="col-12">
        Пол: ${transleteGender(data.patient.gender)}
    </div>
    <div class="col-12">
        Дата рождения: ${formatDateTime(data.patient.birthday)}
    </div>
    <div class="col-12 form-label" id="infoBlockMed">
        Медицинский работник: ${data.doctor.name}
    </div>
    `

    blockComplaints.innerHTML =`${data.complaints}`;

    blockAnamnesis.innerHTML = `${data.anamnesis}`;

    var countConsultations = 0;

    data.consultations.forEach(element => {
        countConsultations++;
        var form = document.createElement('form');
        form.className = 'row container';
        form.innerHTML = 
        `
        <div class="col-12 titleCard">
            <h2>Консультация ${countConsultations}</h2>
        </div>
        <div class="col-12">
            <b>Консультант: ${(element.rootComment.author.name)}</b>
        </div>
        <div class="col-12 form-label" >
        Специализация консультанта: ${element.speciality.name}
        </div>
        `
        listOfConsultations.appendChild(form);
    });

    var countDiagnosis = 0;

    data.diagnoses.forEach(element => {
        countDiagnosis++;
        var form = document.createElement('form');
        form.className = 'row container';
        form.innerHTML =
        `
        <div class="col-12 titleCard">
            <h2>Диагноз ${countDiagnosis}</h2>
        </div>
        <div class="col-12">
            <b>(${element.code}) ${element.name}</b>
        </div>
        <div class="col-12 form-label" >
            Тип: ${transleteType(element.type)}
        </div>
        <div class="col-12 form-label" >
            Расшифрока: ${element.description}
        </div>
        `
        listOfDiagnosis.appendChild(form);
    })

    blockRecomendation.innerHTML = `${data.treatment}`;
    
    if(data.conclusion == "Recovery"){
        blockConclusion.innerHTML = `<h4>Восстановление</h4>`;
    } else if(data.conclusion == "Death"){
        blockConclusion.innerHTML = 
        `
        <h4>Смерть</h4>
        <div class="col-12" >
            Дата смерти: ${formatDateTime(data.deathDate)}
        </div>
        `;
    } else{
        blockConclusion.innerHTML =
        `
        <h4>Болезнь</h4>
        <div class="col-12" >
            Дата следующего визита: ${formatDateTime(data.nextVisitDate)}
        </div>
        `
    }
    

}

function formatDateTime(inputDateTime) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDateTime = new Date(inputDateTime).toLocaleDateString('ru-RU', options);
  
    return formattedDateTime;
}

function transleteGender(gender){
    if (gender == "Male"){
        return "Мужской";
    }
    return "Мужской";
}

function transleteType(type){
    if (type == "Main"){
        return "Основной";
    } else if(type == "Complication"){
        return "Осложение";
    }
    return "Сопуствующий";
}

function findNameSpeciality(id){
    console.log(id);
    var urlSpeciality = `https://mis-api.kreosoft.space/api/dictionary/speciality?page=1&size=10000`;

    const optionsSpeciality  = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    fetch(urlSpeciality, optionsSpeciality)
    .then((response) => {
        if (response.status === 200){   
        
        response.json() // Преобразование ответа в JSON
        .then(data => {
            data.specialties.forEach(element => {
                if (id == element.id){
                    return element.name;
                }
            });
        });
        errorPopup.style.display = 'none';  
        console.log("Успешно!");
        } else if (response.status === 400) {
            errorText.textContent = 'Пользователь с таким email уже существует';
            errorPopup.style.display = 'flex';
            return;
        }
        else if (response.status === 401) {
            errorText.textContent = 'Вы не авторизированы';
            errorPopup.style.display = 'flex';
            return;
        } else if (response.status === 404) {
            errorText.textContent = 'Страница не найдена';
            errorPopup.style.display = 'flex';
            return;
        } else if(response.status === 500){
            errorText.textContent = 'Ошибка сервера';
            errorPopup.style.display = 'flex';
            response.json().then((errorData) => {
                console.error("Произошла ошибка сервера:", errorData.message)
            });
            return;
        }
    })
    .catch((error) => {
        // Обработка ошибки сети или других ошибок
        console.error("Произошла ошибка:", error);
        return;
    });

}

function checkAuthor(data){
    
    const urlAuthor = "https://mis-api.kreosoft.space/api/doctor/profile";
    const optionsAuthor  = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    };

    fetch(urlAuthor, optionsAuthor)
    .then((response) => {
        if (response.status === 200){   
        
        response.json() // Преобразование ответа в JSON
        .then(data1 => {
            if (data.doctor.id == data1.id){
                document.getElementById("alterInspection").style.display = "flex";
                insertDataModalWindow(data);
            }
        });
        errorPopup.style.display = 'none';  
        console.log("Успешно!");
        } else if (response.status === 400) {
            errorText.textContent = 'Пользователь с таким email уже существует';
            errorPopup.style.display = 'flex';
            return;
        }
        else if (response.status === 401) {
            errorText.textContent = 'Вы не авторизированы';
            errorPopup.style.display = 'flex';
            return;
        } else if (response.status === 404) {
            errorText.textContent = 'Страница не найдена';
            errorPopup.style.display = 'flex';
            return;
        } else if(response.status === 500){
            errorText.textContent = 'Ошибка сервера';
            errorPopup.style.display = 'flex';
            response.json().then((errorData) => {
                console.error("Произошла ошибка сервера:", errorData.message)
            });
            return;
        }
    })
    .catch((error) => {
        // Обработка ошибки сети или других ошибок
        console.error("Произошла ошибка:", error);
        return;
    });
}
    
function insertDataModalWindow(data){

    var compaintInput = document.getElementById("inputСomplaint");
    var anamnesisInput = document.getElementById("inputAnamnesis");

    var inputNameOrCodeDisease0 = document.getElementById("inputNameOrCodeDisease");
    var datalistDisease0 = document.getElementById("DiseasesList");
    // var selectedOption0 = datalistDisease0.querySelector(`option[value="${inputNameOrCodeDisease0.value}"]`);
    // //тут уже готовый id диагноза
    // var idDiagnosesDisease0 = selectedOption0 ? selectedOption0.dataset.value : null;

    var inputСertainDisease0 = document.getElementById("inputСertainDisease");

    var inputDiagnosisGeneral = document.getElementById("DiagnosisGeneral");
    var inputDiagnosisСoncomitant = document.getElementById("DiagnosisСoncomitant");
    var inputDiagnosisСomplication = document.getElementById("DiagnosisСomplication");

    var inputRecomendation = document.getElementById("inputRecomendation");

    var inputConclusion = document.getElementById("inputConclusion");
    var inputDateNextVisit = document.getElementById("inputDateNextVisit");
    var inputDateDeath = document.getElementById("inputDateDeath");

    var dateDeathBlock = document.getElementById("dateDeath");
    var dateNextVisitBlock = document.getElementById("dateNextVisit");


    compaintInput.value = data.complaints;
    anamnesisInput.value = data.anamnesis;
    inputRecomendation.value = data.treatment;

    if (data.conclusion == "Recovery"){
        inputConclusion.value = "Recovery";
        dateDeathBlock.style.display = "none";
        dateNextVisitBlock.style.display = "none";
    } else if(data.conclusion == "Death"){
        inputConclusion.value = "Death";
        dateDeathBlock.style.display = "block";
        dateNextVisitBlock.style.display = "none";
        inputDateDeath.value = data.deathDate


    } else{
        inputConclusion.value = "Disease";
        dateDeathBlock.style.display = "none";
        dateNextVisitBlock.style.display = "block";
        inputDateNextVisit.value = data.nextVisitDate;
    }

    
    data.diagnoses.forEach(element => {
        countDiagnosis++;
        insertFirstDiagnosis(element, countDiagnosis)
    });
}

function handleConclusionChange() {
    var conclusionSelect = document.getElementById("inputConclusion");
    var dateDeathInput = document.getElementById("dateDeath");
    var dateNextVisitInput = document.getElementById("dateNextVisit");

    if (conclusionSelect.value === "Recovery") {
        dateDeathInput.style.display = "none";
        dateNextVisitInput.style.display = "none";
    } else if (conclusionSelect.value === "Death") {
        dateDeathInput.style.display = "block";
        dateNextVisitInput.style.display = "none";
    } else {
        dateDeathInput.style.display = "none";
        dateNextVisitInput.style.display = "block";
    }
}

function insertFirstDiagnosis(element, countDiagnosis){
    var container = document.getElementById('listOfDiagnosisModal');
    var diagnosis = document.createElement("div");
    diagnosis.className += "diagnosis titleCard";
    diagnosis.id = `diagnosis${countDiagnosis}`;
    diagnosis.innerHTML =
        `<div class="col-md-12">
            <h2>Диагноз ${countDiagnosis}</h2>
        </div>
        <div class="col-md-12 input-control">
            <label class="form-label">Болезни</label>
            <input class="form-control" list="DiseasesList${countDiagnosis}" id="exampleDataList" placeholder="Укажите навзание болезнь или её код">
            <datalist id="DiseasesList${countDiagnosis}">
            </datalist>
            <div class="error"></div>
        </div>
        <div class="col-12 input-control">
            <input type="text" class="form-control" id="inputСertainDisease${countDiagnosis}" value="${element.description}" placeholder="Укажите точный недуг">
            <div class="error"></div>
        </div>
        <label class="form-label">Тип диагноза в осмотре</label>
        <div class="col-12 input-control listChecked">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisGeneral${countDiagnosis}" value="option1">
                <label class="form-check-label">Основной</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisRelated${countDiagnosis}" value="option2" checked>
                <label class="form-check-label">Сопуствующий</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisСomplication${countDiagnosis}" value="option3">
                <label class="form-check-label">Осложнение</label>
            </div>
            <div class="error"></div>
        </div>
        `;
        if (countDiagnosis != 1){
            diagnosis.innerHTML += `<div class="mb-3">
            <button type="button" class="btn btn-primary button" onclick="removeElementDiagnosis(this)" style="background-color: #b93131 !important;"> ➖ Удалить диагноз</button>
        </div>`
        } else {
            diagnosis.innerHTML += `<div class="mb-3">
            <button type="button" class="btn btn-primary button" onclick="addNewDiagnosis()"> ➕ Добавить диагноз</button>
          </div>`
        }
        container.appendChild(diagnosis);

        if(element.type == "Main"){
            document.getElementById(`checkTypeDiagnosisGeneral${countDiagnosis}`).checked = true;
        } else if(element.type == "Complication "){
            document.getElementById(`checkTypeDiagnosisСomplication${countDiagnosis}`).checked = true;
        } else{
            document.getElementById(`checkTypeDiagnosisRelated${countDiagnosis}`).checked = true;
        }


    
    
    addDiseasesListForInsert(diagnosis.querySelector('input[id^="exampleDataList"]'),document.getElementById(`DiseasesList${countDiagnosis}`), element);
}

function addNewDiagnosis() {
    var container = document.getElementById('listOfDiagnosisModal');
    var diagnosis = document.createElement("div");
    countDiagnosis += 1;
    diagnosis.className += "diagnosis";
    diagnosis.id = `diagnosis${countDiagnosis}`;
    diagnosis.innerHTML =
        `<div class="col-md-12">
            <h2>Диагноз ${countDiagnosis}</h2>
        </div>
        <div class="col-md-12 input-control">
            <label class="form-label">Болезни</label>
            <input class="form-control" list="DiseasesList${countDiagnosis}" id="exampleDataList" placeholder="Укажите навзание болезнь или её код">
            <datalist id="DiseasesList${countDiagnosis}">
            </datalist>
            <div class="error"></div>
        </div>
        <div class="col-12 input-control">
            <input type="text" class="form-control" id="inputСertainDisease${countDiagnosis}" placeholder="Укажите точный недуг">
            <div class="error"></div>
        </div>
        <label class="form-label">Тип диагноза в осмотре</label>
        <div class="col-12 input-control listChecked">
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisGeneral${countDiagnosis}" value="option1">
                <label class="form-check-label">Основной</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisRelated${countDiagnosis}" value="option2" checked>
                <label class="form-check-label">Сопуствующий</label>
            </div>
            <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="inlineRadioOptions${countDiagnosis}" id="checkTypeDiagnosisСomplication${countDiagnosis}" value="option3">
                <label class="form-check-label">Осложнение</label>
            </div>
            <div class="error"></div>
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-primary button" onclick="removeElementDiagnosis(this)" style="background-color: #b93131 !important;"> ➖ Удалить диагноз</button>
        </div>`;


    
    container.appendChild(diagnosis);
    addDiseasesList(document.getElementById(`DiseasesList${countDiagnosis}`));
}

function addDiseasesList(element){
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      
    fetch("https://mis-api.kreosoft.space/api/dictionary/icd10?page=1&size=99999", options)
    .then((response) => {
        if (response.status === 200) {
        response.json() 
        .then(data => {
            data.records.forEach(disease => {
                const option = document.createElement('option');
                option.value = disease.code + ' — ' + disease.name; 

                // element.innerHTML += `<option value="<strong>${disease.code}</strong ${disease.name}" data-value=${disease.id}></option>`
                option.dataset.value = disease.id;
                console.log(option);
                element.appendChild(option);
            });
    
        });
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
}

function addDiseasesListForInsert(element1,element, data){
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      
    fetch("https://mis-api.kreosoft.space/api/dictionary/icd10?page=1&size=99999", options)
    .then((response) => {
        if (response.status === 200) {
        response.json() 
        .then(data1 => {
            data1.records.forEach(disease => {
                const option = document.createElement('option');
                option.value = disease.code + ' — ' + disease.name; 

                // element.innerHTML += `<option value="<strong>${disease.code}</strong ${disease.name}" data-value=${disease.id}></option>`
                option.dataset.value = disease.id;
                if(option.value == (data.code + ' — ' + data.name)){
                    element1.value = option.value;
                }
                element.appendChild(option);
            });
            
        });
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
}

function removeElementDiagnosis(button) {
    var elementToRemove = button.closest('.diagnosis');
    if (elementToRemove) {
        elementToRemove.remove();
        countDiagnosis -= 1;
    }
}

function cancelExit(){
    var modal = document.getElementById('alterModal');
    var modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

function AlterInspectionFunction(){

    var compaintInput = document.getElementById("inputСomplaint");
    var anamnesisInput = document.getElementById("inputAnamnesis");

    var inputRecomendation = document.getElementById("inputRecomendation");

    var inputConclusion = document.getElementById("inputConclusion");
    var inputDateNextVisit = document.getElementById("inputDateNextVisit");
    var inputDateDeath = document.getElementById("inputDateDeath");

    if (!validationAlterInspectiont()){
        errorText1.textContent = 'Данные не валидны';
        errorPopup1.style.display = 'flex';
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Добавляет плавный эффект прокрутки
        });
        return;
    }
    errorPopup1.style.display = 'none';


    var allDiagnosesData = [];


    var container = document.getElementById('listOfDiagnosisModal');
    var diagnoses = container.querySelectorAll('.diagnosis'); // выбираем все элементы с классом 'diagnosis' внутри блока


    diagnoses.forEach(function (diagnosis) {
        var inputNameOrCodeDisease = diagnosis.querySelector('input[id^="exampleDataList"]');
        var datalistDisease = diagnosis.querySelector('datalist[id^="DiseasesList"]');
        var selectedOption = datalistDisease.querySelector(`option[value="${inputNameOrCodeDisease.value}"]`);
        var idDiagnosis = selectedOption ? selectedOption.dataset.value : null;

        var inputCertainDisease = diagnosis.querySelector('input[id^="inputСertainDisease"]');
        var typeDiagnosisGeneral = diagnosis.querySelector('input[id^="checkTypeDiagnosisGeneral"]');
        var typeDiagnosisRelated = diagnosis.querySelector('input[id^="checkTypeDiagnosisRelated"]');

        var diagnosisData = {
            icdDiagnosisId: idDiagnosis,
            description: inputCertainDisease.value,
            type: null,

        };

        if (typeDiagnosisGeneral.checked == true){
            diagnosisData.type = "Main"
        } else if(typeDiagnosisRelated.checked == true){
            diagnosisData.type = "Concomitant"
        } else {
            diagnosisData.type = "Complication "
        }
        
        allDiagnosesData.push(diagnosisData);
    });
    

    const data = {
        anamnesis: anamnesisInput.value,
        complaints: compaintInput.value,
        treatment: inputRecomendation.value,
        conclusion: inputConclusion.value,
        nextVisitDate: null,
        deathDate: null,
        diagnoses: allDiagnosesData,
      };
    
      if(inputConclusion.value == "Death"){
        data.deathDate = inputDateDeath.value
      }
      if(inputConclusion.value == "Disease"){
        data.nextVisitDate = inputDateNextVisit.value;
      }
      console.log(data);
    
      // Опции для POST-запроса
      const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      };
    
      // Отправка POST-запроса на указанный URL
      fetch(`https://mis-api.kreosoft.space/api/inspection/${id}`, options)
        .then((response) => {
            if (response.status === 200){   
            
                location.reload()
            errorPopup.style.display = 'none';  
            console.log(`Успешно, данные отправились: ${data}`);
            } else if (response.status === 400) {
                response.json() // Преобразование ответа в JSON
                .then(data1 => {
                    console.log(data1);
                });
                errorText.textContent = 'Неверно введены данные';
                errorPopup.style.display = 'flex';
                return;
            }
            else if (response.status === 401) {
                errorText.textContent = 'Вы не авторизированы';
                errorPopup.style.display = 'flex';
                return;
            } else if(response.status === 500)
            {
                errorText.textContent = 'Ошибка сервера';
                errorPopup.style.display = 'flex';
                response.json().then((errorData) => {
                    console.error("Произошла ошибка сервера:", errorData.message)
            });
            return;
            }
        })
        .catch((error) => {
            // Обработка ошибки сети или других ошибок
            console.error("Произошла ошибка:", error);
            return;
        });
}