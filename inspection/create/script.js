const id = localStorage.getItem("selectedPatientId");
getName();
const authToken = localStorage.getItem("token");
var countConsultation = 0;
var countDiagnosis = 0;
addSpecializations(document.getElementById("inputSpecialization"));
addDiseasesList(document.getElementById("DiseasesList"));
addPreviousInspectionList(document.getElementById("PreviousInspectionList"));

const selectedInspectionId = localStorage.getItem('selectedInspectionId');
console.log(selectedInspectionId);
if (selectedInspectionId != null){
    var che = document.getElementById('firstOrRepeatView');
    che.checked = true;
    che.disabled  = true;
    changeLabelColor();
}
 var errorPopup = document.getElementById('errorPopup');
 var errorText = errorPopup.querySelector('#errorText');




function getDataPatient(){
    var url1 = `https://mis-api.kreosoft.space/api/patient/${id}`;

    
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
            addDataPatient(data1);
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






function changeLabelColor() {
    var checkbox = document.getElementById('firstOrRepeatView');
    var label1 = document.getElementById('label1');
    var label2 = document.getElementById('label2');
    var blockPreviousInspection = document.getElementById("blockPreviousInspection");
    var block = document.getElementById("blockWithDiagnosisPrevious");


    if (checkbox.checked) {
        // Если чекбокс включен, изменяем цвет для label2
        label2.style.color = '#2480bd';
        label1.style.color = '';
        block.style.display = "block";
        blockPreviousInspection.style.display = "block";
    } else {
        // Если чекбокс выключен, изменяем цвет для label1
        label1.style.color = '#2480bd';
        label2.style.color = '';
        block.style.display = "none";
        blockPreviousInspection.style.display = "none";
    }
}

function addContentInBlockConsultation(){
    var checkbox = document.getElementById('switchNeedConsultation');
    var blockChooseSpec = document.getElementById("blockChooseSpec");
    var blockComment = document.getElementById("blockComment");
    var blockAddConsultation = document.getElementById("blockAddConsultation");
    var container = document.getElementById('listOfConsultations');

    if (checkbox.checked) {
        blockChooseSpec.style.display = "block";
        blockComment.style.display = "block";
        blockAddConsultation.style.display = "block";
        container.style.display = "block";
    } else {
        blockChooseSpec.style.display = "none";
        blockComment.style.display = "none";
        blockAddConsultation.style.display = "none";
        container.style.display = "none";
    }
}

function addNewConsultations() {
    var container = document.getElementById('listOfConsultations');
    var consultation = document.createElement("div");
    consultation.className += "consultation";
    consultation.id = `consultation${countConsultation}`;
    countConsultation += 1;
    consultation.innerHTML =
        `<div class="col-md-12">
            <h2>Консультация ${countConsultation}</h2>
        </div>
        <div class="col-md-12 input-control spec">
            <select class="form-select" aria-label="Default select example" id="inputSpecialization${countConsultation}">
                <option value="" disabled selected id="chooseSpec">Выберите специализацию</option>
            </select>
            <div class="error"></div>
        </div>
        <div class="col-md-12 input-control">
            <label for="inputComment" class="form-label">Комментарий</label>
            <textarea class="form-control" rows="4" id="inputComment${countConsultation}"></textarea>
            <div class="error"></div>
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-primary button" onclick="removeElementConsultation(this)" style="background-color: #b93131 !important;"> ➖ Удалить консультацию</button>
        </div>`;

    container.appendChild(consultation);
    addSpecializations(document.getElementById(`inputSpecialization${countConsultation}`));
}

function removeElement(button) {
    var elementToRemove = button.closest('.consultation');
    if (elementToRemove) {
        elementToRemove.remove();
        countConsultation -= 1;
    }
}

function addDataPatient(data){
    namePatient = document.getElementById("namePatient");
    
    if (data.gender == "Female"){
        namePatient.innerHTML = `<h2>${data.name}<p1 class ="icon" style="color: #5a94c6;"> ♀</p1></h2>`;
    } else {
        namePatient.innerHTML = `<h2>${data.name}<p1 class ="icon" style="color: #5a94c6;"> ♂</p1></h2>`;
    }

    if (data.birthday != null){
        dataPatient = document.getElementById("dataPatient");
        dataPatient.innerHTML=`Дата рождения: ${serverToClientDate(data.birthday)}`;
    }
}

function addSpecializations(element){

    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      
    fetch("https://mis-api.kreosoft.space/api/dictionary/speciality?page=1&size=99999", options)
    .then((response) => {
        if (response.status === 200) {
        response.json() 
        .then(data => {
            data.specialties.forEach(specialization => {
                const option = document.createElement('option');
                option.text = specialization.name; 
                option.value = specialization.id;
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

function addNewDiagnosis() {
    var container = document.getElementById('listOfDiagnosis');
    var diagnosis = document.createElement("div");
    diagnosis.className += "diagnosis";
    diagnosis.id = `diagnosis${countDiagnosis}`;
    countDiagnosis += 1;
    diagnosis.innerHTML =
        `<div class="col-md-12">
            <h2>Диагноз ${countDiagnosis}</h2>
        </div>
        <div class="col-md-12 input-control">
            <label class="form-label">Болезни</label>
            <input class="form-control" list="DiseasesList" id="exampleDataList" placeholder="Укажите навзание болезнь или её код">
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

function removeElementConsultation(button) {
    var elementToRemove = button.closest('.consultation');
    if (elementToRemove) {
        elementToRemove.remove();
        countConsultation -= 1;
    }
}

function removeElementDiagnosis(button) {
    var elementToRemove = button.closest('.diagnosis');
    if (elementToRemove) {
        elementToRemove.remove();
        countDiagnosis -= 1;
    }
}

function addPreviousInspectionList(element){
    const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      };
      
    fetch(`https://mis-api.kreosoft.space/api/patient/${id}/inspections/search`, options)
    .then((response) => {
    if (response.status === 200){   
        response.json() 
        .then(data1 => {
            data1.forEach(inspection => {
            const option = document.createElement('option');
            option.value = formatDateTime(inspection.date) + ' ' + inspection.diagnosis.code + ' — ' + inspection.diagnosis.name; 

            option.dataset.value = inspection.id;
            if (inspection.id == localStorage.getItem('selectedInspectionId')){
                var inputElement = document.getElementById('exampleDataList');
                inputElement.value = option.value;
                inputElement.disabled = true;
            }
            element.appendChild(option);
        });
        });
        errorPopup.style.display = 'none';  
        console.log("Успешно!");
    }  else if (response.status === 401) {
        errorText.textContent = 'Вы не авторизированы';
        errorPopup.style.display = 'flex';
        return;
    } else if (response.status === 404) {
    errorText.textContent = 'Пациент не найден';
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
    });
}


function formatDateTime(inputDateTime) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDateTime = new Date(inputDateTime).toLocaleDateString('ru-RU', options);
  
    return formattedDateTime;
}

document.getElementById('exampleDataList').addEventListener('input', function() {
    var input = document.getElementById("exampleDataList");
    var datalist = document.getElementById("PreviousInspectionList");
    var selectedOption = datalist.querySelector(`option[value="${input.value}"]`);
    var selectedOptionValue = selectedOption ? selectedOption.dataset.value : null;

    console.log(selectedOptionValue);

    var block = document.getElementById("blockWithDiagnosisPrevious")
    var blockDiagnosis = document.getElementById("diagnozTitle");
    var blockDescription = document.getElementById("diagnozDescription");
    if (selectedOptionValue == null){
        blockDiagnosis.innerHTML = "";
        blockDescription.innerHTML = "";
    } else {
        
        const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          };
          
        fetch(`https://mis-api.kreosoft.space/api/inspection/${selectedOptionValue}`, options)
        .then((response) => {
        if (response.status === 200){   
            response.json() 
            .then(data1 => {
                data1.diagnoses.forEach(inspection => {
                    if (inspection.type == "Main"){
                        blockDiagnosis.innerHTML = `<h4>(${inspection.code}) ${inspection.name}</h4>`;
                        blockDescription.innerHTML = `<p class='form-label'>Тип в осмотре: Основной</p>
                                                      <p class='form-label'>Расшифрока: ${inspection.description}</p>`;
                    }
                });
            });
            errorPopup.style.display = 'none';  
            console.log("Успешно!");
        }  else if (response.status === 401) {
            errorText.textContent = 'Вы не авторизированы';
            errorPopup.style.display = 'flex';
            return;
        } else if (response.status === 404) {
        errorText.textContent = 'Предыдущий осмотр не найден';
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
        });

        
    }
});


function saveInspectionFunction(){
    var checkerInspectionInput = document.getElementById("firstOrRepeatView");
    var dateInspectionInput = document.getElementById("inputDateInspection");

    var input = document.getElementById("exampleDataList");
    var datalist = document.getElementById("PreviousInspectionList");
    var selectedOption = datalist.querySelector(`option[value="${input.value}"]`);
    //тут уже готовый id пред осмотра
    var idPreviousInspection = selectedOption ? selectedOption.dataset.value : null;

    var compaintInput = document.getElementById("inputСomplaint");
    var anamnesisInput = document.getElementById("inputAnamnesis");

    var checkerNeedConsultationInput = document.getElementById("switchNeedConsultation");
    var inputSpecialization0 = document.getElementById("inputSpecialization");
    var inputComment0 = document.getElementById("inputComment");

    var inputNameOrCodeDisease0 = document.getElementById("inputNameOrCodeDisease");
    var datalistDisease0 = document.getElementById("DiseasesList");
    var selectedOption0 = datalistDisease0.querySelector(`option[value="${inputNameOrCodeDisease0.value}"]`);
    //тут уже готовый id диагноза
    var idDiagnosesDisease0 = selectedOption0 ? selectedOption0.dataset.value : null;

    var inputСertainDisease0 = document.getElementById("inputСertainDisease");

    var inputDiagnosisGeneral = document.getElementById("DiagnosisGeneral");
    var inputDiagnosisСoncomitant = document.getElementById("DiagnosisСoncomitant");
    var inputDiagnosisСomplication = document.getElementById("DiagnosisСomplication");

    var inputRecomendation = document.getElementById("inputRecomendation");

    var inputConclusion = document.getElementById("inputConclusion");
    var inputDateNextVisit = document.getElementById("inputDateNextVisit");
    var inputDateDeath = document.getElementById("inputDateDeath");

    if (!validationCreateInspectiont()){
        errorText.textContent = 'Данные не валидны';
        errorPopup.style.display = 'flex';
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Добавляет плавный эффект прокрутки
        });
        return;
    }
    errorPopup.style.display = 'none';

    var baseDiagnosisData = {
        icdDiagnosisId: idDiagnosesDisease0,
        description: inputСertainDisease0.value,
        type: null
    };

    if (inputDiagnosisGeneral.checked == true){
        baseDiagnosisData.type = "Main"
    } else if(inputDiagnosisСoncomitant.checked == true){
        baseDiagnosisData.type = "Concomitant"
    } else {
        baseDiagnosisData.type = "Complication "
    }

    var allDiagnosesData = [baseDiagnosisData];


    var container = document.getElementById('listOfDiagnosis');
    var diagnoses = container.querySelectorAll('.diagnosis'); // выбираем все элементы с классом 'diagnosis' внутри блока


    diagnoses.forEach(function (diagnosis) {
        var inputNameOrCodeDisease = diagnosis.querySelector('input[id^="exampleDataList"]');
        var datalistDisease = diagnosis.querySelector('datalist[id^="DiseasesList"]');
        var selectedOption = datalistDisease.querySelector(`option[value="${inputNameOrCodeDisease.value}"]`);
        var idDiagnosis = selectedOption ? selectedOption.dataset.value : null;

        var inputCertainDisease = diagnosis.querySelector('input[id^="inputСertainDisease"]');
        var typeDiagnosisGeneral = diagnosis.querySelector('input[id^="checkTypeDiagnosisGeneral"]');
        var typeDiagnosisRelated = diagnosis.querySelector('input[id^="checkTypeDiagnosisRelated"]');
        var typeDiagnosisСomplication = diagnosis.querySelector('input[id^="checkTypeDiagnosisСomplication"]');

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

    var baseConsultationObject = {
        "specialityId": inputSpecialization0.value,
        "comment": {
            "content": inputComment0.value
        }
    };

    var listOfConsultations = document.getElementById('listOfConsultations');
    var consultationsArray = [baseConsultationObject];

    

    var consultationDivs = listOfConsultations.querySelectorAll('.consultation');

    consultationDivs.forEach(function (consultation) {
        var specialitySelector = consultation.querySelector('select');
        var commentTextarea = consultation.querySelector('textarea');

        var specialityId = specialitySelector.options[specialitySelector.selectedIndex].value;
        var commentContent = commentTextarea.value;

        if (specialityId == '' || specialityId == null) {
            setError(specialitySelector.options[specialitySelector.selectedIndex], 'Укажите специализацию врача');
            result = false;
        } else {
            setSuccess(specialitySelector.options[specialitySelector.selectedIndex]);

            var consultationObject = {
                "specialityId": specialityId,
                "comment": {
                    "content": commentContent
                }
            };

            consultationsArray.push(consultationObject);
        }
    });


    const data = {
        date: dateInspectionInput.value,
        anamnesis: anamnesisInput.value,
        complaints: compaintInput.value,
        treatment: inputRecomendation.value,
        conclusion: inputConclusion.value,
        nextVisitDate: null,
        deathDate: null,
        previousInspectionId: idPreviousInspection,
        diagnoses: allDiagnosesData,
        consultations: consultationsArray
      };
    
      if (checkerNeedConsultationInput.checked == false){
        data.consultations = null;
      }
      if(inputConclusion.value == "Death"){
        data.deathDate = inputDateDeath.value
      }
      if(inputConclusion.value == "Disease"){
        data.nextVisitDate = inputDateNextVisit.value;
      }
      console.log(data);
    
      // Опции для POST-запроса
      const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      };
    
      // Отправка POST-запроса на указанный URL
      fetch(`https://mis-api.kreosoft.space/api/patient/${id}/inspections`, options)
        .then((response) => {
            if (response.status === 200){   
            
            response.json() // Преобразование ответа в JSON
            .then(data1 => {
                console.log(data1);
            });
            errorPopup.style.display = 'none';  
            console.log(`Успешно, данные отправились: ${data}`);
            } else if (response.status === 400) {
                response.json() // Преобразование ответа в JSON
                .then(data1 => {
                    console.log(id);
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


function cancelExit(){
    window.location.href="javascript:history. back()"
}