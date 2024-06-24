const setError = (element, message) => {
    const inputControl = element.closest('.input-control');
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const isValidDateTime = dateTimeString => {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    const inputDateTime = new Date(year, month - 1, day, hour, minute);

    // Получаем текущую дату и вычитаем 7 часов
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - 7);

    console.log(inputDateTime, currentDateTime);
    
    return inputDateTime < currentDateTime;
}

const isDate1AfterDate2 = (dateString1, dateString2) => {
    const [year1, month1, day1, time1] = dateString1.split(/[-T:]/).map(Number);
    const [year2, month2, day2, time2] = dateString2.split(/[-T:]/).map(Number);

    const date1 = new Date(year1, month1 - 1, day1, time1);
    const date2 = new Date(year2, month2 - 1, day2, time2);
    return date1 < date2;
}

const setSuccess = element => {
    const inputControl = element.closest('.input-control');
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isValidDate = date => {
    const re = /^\d{2}\.\d{2}\.\d{4}$/;
    return re.test(String(date));
}

//проверка что дата не является будущей
const isValidDate2 = date => {
    const [day, month, year] = date.split('.').map(Number);
    const inputDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
    const today = new Date();
    return inputDate < today;
}

const isValidPhoneNumber = phoneNumber => {
    const re = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    return re.test(String(phoneNumber));
}

const isValidPassword = password => {
    const containsDigit = (str) => /\d/.test(str);
    if (containsDigit(password)){
        return true;
    }
    return false;
}

const isValidSize = size => {
    const re = /^[0-9]+$/;
    return re.test(String(size));
}

const validateInputsRegister = () => {

    let result = true;

    const nameInput = document.getElementById("inputName");
    const genderInput = document.getElementById("inputGender");
    const dateInput  = document.getElementById("inputDate");
    const phoneNumberInput  = document.getElementById("inputPhoneNumber");
    const specializationInput = document.getElementById("inputSpecialization");
    const emailInput  = document.getElementById("inputEmail");
    const passwordInput  = document.getElementById("inputPassword");
  
    const name = nameInput.value;
    const gender = genderInput.value;
    const date = dateInput.value;
    const phoneNumber = phoneNumberInput.value;
    const specialization = specializationInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;


    if(name === '') {
        setError(nameInput, 'Заполните это поле');
        result = false;
    }
    else if (name.length > 1000) {
        setError(nameInput, 'Имя пользователя должно быть короче 1000 символов');
        result = false;
    } else {
        setSuccess(nameInput);
    }

    if(email === '') {
        setError(emailInput, 'Заполните это поле');
        result = false;
    } else if (!isValidEmail(email)) {
        setError(emailInput, 'Неправильно введена почта');
        result = false;
    } else {
        setSuccess(emailInput);
    }

    if(password === '') {
        setError(passwordInput, 'Заполните это поле');
        result = false;
    } else if (password.length < 6 ) {
        setError(passwordInput, 'Пароль должен быть не короче 6 символов');
        result = false;
    } else if (!isValidPassword(password)) {
        setError(passwordInput, 'Пароль должен содержать хотя бы одну цифру');
        result = false;
    } else {
        setSuccess(passwordInput);
    }

    if(date === '') {
        setSuccess(dateInput);
    } else if (!isValidDate(date)) {
        setError(dateInput, 'Неправильно введена дата');
        result = false;
    } else if (!isValidDate2(date)) {
        setError(dateInput, 'Дата должна быть прошедшей');
        result = false;
    } else {
        setSuccess(dateInput);
    }

    if(phoneNumber === '') {
        setSuccess(phoneNumberInput);
    } else if (!isValidPhoneNumber(phoneNumber)) {
        setError(phoneNumberInput, 'Неправильно введен номер телефона');
        result = false;
    } else {
        setSuccess(phoneNumberInput);
    }

    return result;

};

const validateInputsLogin = () => {

    let result = true;

    const emailInput  = document.getElementById("exampleInputEmail1");
    const passwordInput  = document.getElementById("exampleInputPassword1");
  
    const email = emailInput.value;
    const password = passwordInput.value;

    if(email === '') {
        setError(emailInput, 'Заполните это поле');
        result = false;
    } else if (!isValidEmail(email)) {
        setError(emailInput, 'Неправильно введена почта');
        result = false;
    } else {
        setSuccess(emailInput);
    }

    if(password === '') {
        setError(passwordInput, 'Заполните это поле');
        result = false;
    } else if (password.length < 6 ) {
        setError(passwordInput, 'Пароль должен быть не короче 6 символов');
        result = false;
    } else if (!isValidPassword(password)) {
        setError(passwordInput, 'Пароль должен содержать хотя бы одну цифру');
        result = false;
    } else {
        setSuccess(passwordInput);
    }

    return result;

};

const validateInputsProfile = () => {

    let result = true;

    const nameInput = document.getElementById("inputName");
    const genderInput = document.getElementById("inputGender");
    const dateInput  = document.getElementById("inputDate");
    const phoneNumberInput  = document.getElementById("inputPhoneNumber");
    const emailInput  = document.getElementById("inputEmail");
  
    const name = nameInput.value;
    const gender = genderInput.value;
    const date = dateInput.value;
    const phoneNumber = phoneNumberInput.value;
    const email = emailInput.value;


    if(name === '') {
        setError(nameInput, 'Заполните это поле');
        result = false;
    }
    else if (name.length > 1000) {
        setError(nameInput, 'Имя пользователя должно быть короче 1000 символов');
        result = false;
    } else {
        setSuccess(nameInput);
    }

    if(email === '') {
        setError(emailInput, 'Заполните это поле');
        result = false;
    } else if (!isValidEmail(email)) {
        setError(emailInput, 'Неправильно введена почта');
        result = false;
    } else {
        setSuccess(emailInput);
    }

    if(date === '') {
        setSuccess(dateInput);
    } else if (!isValidDate(date)) {
        setError(dateInput, 'Неправильно введена дата');
        result = false;
    } else if (!isValidDate2(date)) {
        setError(dateInput, 'Дата должна быть прошедшей');
        result = false;
    } else {
        setSuccess(dateInput);
    }

    if(phoneNumber === '') {
        setSuccess(phoneNumberInput);
    } else if (!isValidPhoneNumber(phoneNumber)) {
        setError(phoneNumberInput, 'Неправильно введен номер телефона');
        result = false;
    } else {
        setSuccess(phoneNumberInput);
    }

    return result;

};


const validateInputsFiltersPatients = () => {

    let result = true;

    const sizeInput = document.getElementById("inputSize");
  
    const size = sizeInput.value;


    if(size === '') {
        setSuccess(sizeInput);
    } else if (size == '0') {
        setError(sizeInput, 'Размер должен быть не меньше 1');
        result = false;
    }else if (!isValidSize(size)) {
        setError(sizeInput, 'Размер должен содержать только цифры');
        result = false;
    } else {
        setSuccess(sizeInput);
    }

    return result;

};

function validateInputsRegisterPatient(){
    let result = true;

    var patientNameInput = document.getElementById("inputNamePatient");
    var patientDateInput = document.getElementById("inputDatePatinet");
  
  
    const namePatient = patientNameInput.value;
    const datePatient = patientDateInput.value;


    if(namePatient === '') {
        setError(patientNameInput, 'Заполните это поле');
        result = false;
    }
    else if (namePatient.length > 1000) {
        setError(patientNameInput, 'Имя пацициента должно быть короче 1000 символов');
        result = false;
    } else {
        setSuccess(patientNameInput);
    }

    if(datePatient === '') {
        setSuccess(patientDateInput);
    } else if (!isValidDate(datePatient)) {
        setError(patientDateInput, 'Неправильно введена дата');
        result = false;
    } else if (!isValidDate2(datePatient)) {
        setError(patientDateInput, 'Дата должна быть прошедшей');
        result = false;
    } else {
        setSuccess(patientDateInput);
    }

    return result;
}

function validationCreateInspectiont(){
    var listSpec = [];
    var countGeneralDiagnosis = 0;
    var result = true;

    var checkerInspectionInput = document.getElementById("firstOrRepeatView");
    var dateInspectionInput = document.getElementById("inputDateInspection");

    var input = document.getElementById("exampleDataList");
    var datalist = document.getElementById("PreviousInspectionList");
    var selectedOption = datalist.querySelector(`option[value="${input.value}"]`);

    var compaintInput = document.getElementById("inputСomplaint");
    var anamnesisInput = document.getElementById("inputAnamnesis");

    var checkerNeedConsultationInput = document.getElementById("switchNeedConsultation");
    var inputSpecialization0 = document.getElementById("inputSpecialization");
    var inputComment0 = document.getElementById("inputComment");

    var inputNameOrCodeDisease0 = document.getElementById("inputNameOrCodeDisease");
    var datalistDisease0 = document.getElementById("DiseasesList");
    var selectedOption0 = datalistDisease0.querySelector(`option[value="${inputNameOrCodeDisease0.value}"]`);

    var inputСertainDisease0 = document.getElementById("inputСertainDisease");

    var inputDiagnosisGeneral = document.getElementById("DiagnosisGeneral");
    var inputDiagnosisСoncomitant = document.getElementById("DiagnosisСoncomitant");
    var inputDiagnosisСomplication = document.getElementById("DiagnosisСomplication");

    var inputRecomendation = document.getElementById("inputRecomendation");

    var inputConclusion = document.getElementById("inputConclusion");
    var inputDateNextVisit = document.getElementById("inputDateNextVisit");
    var inputDateDeath = document.getElementById("inputDateDeath");


    var checkerInspection = checkerInspectionInput.checked;
    var dateInspection = dateInspectionInput.value; 
    var idPreviousInspection = selectedOption ? selectedOption.dataset.value : null;
    var compaint = compaintInput.value;
    var anamnesis = anamnesisInput.value;
    var checkerNeedConsultation = checkerNeedConsultationInput.checked;
    var specialization0 = inputSpecialization0.value;
    var comment0 = inputComment0.value;
    var idDiagnosesDisease0 = selectedOption0 ? selectedOption0.dataset.value : null;
    var certainDisease0 = inputСertainDisease0.value;
    var diagnosisGeneral = inputDiagnosisGeneral.checked;
    var diagnosisСoncomitant = inputDiagnosisСoncomitant.checked;
    var diagnosisСomplication = inputDiagnosisСomplication.checked;
    var recomendation = inputRecomendation.value;
    var conclusion = inputConclusion.value;
    var dateNextVisit = inputDateNextVisit.value;
    var dateDeath = inputDateDeath.value;

    if(checkerInspection == true && idPreviousInspection == null){
        setError(input, 'Заполните это поле');
        result = false;
    } else{
        setSuccess(input);
    }

    if(dateInspection === '') {
        setError(dateInspectionInput, 'Заполните это поле');
        result = false;
    } 
    else if (!isValidDateTime(dateInspection)) {
        setError(dateInspectionInput, 'Дата осмотра должна быть прошедшей');
        result = false;
    } else if ( checkerInspection == true && idPreviousInspection != null){
        const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          };
          
        fetch(`https://mis-api.kreosoft.space/api/inspection/${idPreviousInspection}`, options)
        .then((response) => {
        if (response.status === 200){   
            response.json() 
            .then(data1 => {
                if (!isDate1AfterDate2(data1.date, dateInspection)){
                    setError(dateInspectionInput, 'Дата текущего осмотра должна быть позже чем дата предыдущего осмотра');
                    result = false;
                } else{
                    setSuccess(dateInspectionInput);
                }
            });
                errorPopup.style.display = 'none';  
            }  else if (response.status === 401) {
                errorText.textContent = 'Вы не авторизированы';
                errorPopup.style.display = 'flex';
            } else if (response.status === 404) {
            errorText.textContent = 'Предыдущий осмотр не найден';
            errorPopup.style.display = 'flex';
            } else if(response.status === 500)
            {
                errorText.textContent = 'Ошибка сервера';
                errorPopup.style.display = 'flex';
                response.json().then((errorData) => {
                    console.error("Произошла ошибка сервера:", errorData.message)
                });
        }
        });
    } else{
        setSuccess(dateInspectionInput);
    }

    if (compaint == "" || compaint == null){
        setError(compaintInput, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(compaintInput);
    }

    if (anamnesis == "" || anamnesis == null){
        setError(anamnesisInput, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(anamnesisInput);
    }

    if (recomendation == "" || recomendation == null){
        setError(inputRecomendation, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(inputRecomendation);
    }

    if (conclusion == "" || conclusion == null){
        console.log(123,conclusion);
        setError(inputConclusion, 'Заключение не выбрано');
        result = false;
    } else if (conclusion == "Death"){
        setSuccess(inputConclusion);
        if (dateDeath == ""){
            setError(inputDateDeath, 'Укажите дату смерти');
            result = false;
        } else if (!isValidDateTime(dateDeath)){
            setError(inputDateDeath, 'Дата смерти должна быть прошедшей');
            result = false;
        } else {
            setSuccess(inputDateDeath);
        }

    } else if (conclusion == "Disease"){
        setSuccess(inputConclusion);
        if (dateNextVisit == ""){
            setError(inputDateNextVisit, 'Укажите дату следующего визита');
            result = false;
        }else if (isValidDateTime(dateNextVisit)){
            setError(inputDateNextVisit, 'Дата следующего визита должна быть в будущем');
            result = false;
        } else {
            setSuccess(inputDateNextVisit);
        }
    }
    else {
        setSuccess(inputConclusion);
    }

    if(checkerNeedConsultation == true){
        if (specialization0 == '' || specialization0 == null){
            setError(inputSpecialization0, 'Укажите специализацию врача');
            result = false;
        } else{
            listSpec.push(specialization0);
            setSuccess(inputSpecialization0);
        }
        if (comment0 == '' || comment0 == null){
            setError(inputComment0, 'Заполните это поле');
            result = false;
        } else {
            setSuccess(inputComment0);
        }

        var listOfConsultations = document.getElementById('listOfConsultations');
        var selectors = listOfConsultations.querySelectorAll('select'); // выбираем все элементы select внутри блока
        var textareas = listOfConsultations.querySelectorAll('textarea'); // выбираем все элементы textarea внутри блока

        var valuesSelectors = [];
        var valuesComments = [];

        selectors.forEach(function (selector) {
            var selectedValue = selector.options[selector.selectedIndex].value;
            if (selectedValue == '' || selectedValue == null){
                setError(selector.options[selector.selectedIndex], 'Укажите специализацию врача');
                result = false;
            } else if(listSpec.includes(selectedValue)){
                setError(selector.options[selector.selectedIndex], 'Нельзя указывать специализацию врача более одно раза');
                result = false;
            } else{
                setSuccess(selector.options[selector.selectedIndex]);
                valuesSelectors.push(selectedValue);
            }
            
        });

        textareas.forEach(function (textarea) {
            var textareaValue = textarea.value;
            if (textareaValue == '' || textareaValue == null){
                setError(textarea, 'Заполните это поле');
                result = false;
            } else {
                setSuccess(textarea);
                valuesComments.push(textareaValue);
            }
        });
    }

    if (idDiagnosesDisease0 == null ||  idDiagnosesDisease0 == ''){
        setError(inputNameOrCodeDisease0, 'Укажите корректное название болезни');
        result = false;
    } else {
        setSuccess(inputNameOrCodeDisease0);
    }

    if (certainDisease0 == null || certainDisease0 == ''){
        setError(inputСertainDisease0, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(inputСertainDisease0);
    }

    if (diagnosisGeneral == true){
        countGeneralDiagnosis++;
    }

    //////////////////////////////////////////
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
            idDiagnosis: idDiagnosis,
            certainDisease: inputCertainDisease.value,
            typeGeneral: typeDiagnosisGeneral.checked,
            typeRelated: typeDiagnosisRelated.checked,
            typeСomplication: typeDiagnosisСomplication.checked
        };

        if (inputCertainDisease.value == null || inputCertainDisease.value == ""){
            setError(inputCertainDisease, 'Заполните это поле');
            result = false;
        } else {
            setSuccess(inputCertainDisease);
        }

        if (idDiagnosis == null || idDiagnosis == ""){
            setError(inputNameOrCodeDisease, 'Укажите корректное название болезни');
            result = false;
        } else{
            setSuccess(inputNameOrCodeDisease);
        }

        if (typeDiagnosisGeneral.checked == true){
            countGeneralDiagnosis++;
        }

        if (typeDiagnosisGeneral.checked == true && countGeneralDiagnosis > 1){
            setError(typeDiagnosisGeneral, 'В осмотре должден быть ровно один основной диагноз');
            result = false;
        } else{
            setSuccess(typeDiagnosisGeneral);
        }
        
    });

    if (countGeneralDiagnosis == 0){
        setError(inputDiagnosisGeneral, 'В осмотре должден быть один основной диагноз');
        result = false;
    } else{
        setSuccess(inputDiagnosisGeneral);
    }

    console.log(result)

    return result;
    
}


function validationAlterInspectiont(){
    var listSpec = [];
    var countGeneralDiagnosis = 0;
    var result = true;

    var compaintInput = document.getElementById("inputСomplaint");
    var anamnesisInput = document.getElementById("inputAnamnesis");

    var inputRecomendation = document.getElementById("inputRecomendation");

    var inputConclusion = document.getElementById("inputConclusion");
    var inputDateNextVisit = document.getElementById("inputDateNextVisit");
    var inputDateDeath = document.getElementById("inputDateDeath");
    var inputDiagnosisGeneral = document.getElementById("checkTypeDiagnosisGeneral1");

    var compaint = compaintInput.value;
    var anamnesis = anamnesisInput.value;
    var recomendation = inputRecomendation.value;
    var conclusion = inputConclusion.value;
    var dateNextVisit = inputDateNextVisit.value;
    var dateDeath = inputDateDeath.value;


    if (compaint == "" || compaint == null){
        setError(compaintInput, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(compaintInput);
    }

    if (anamnesis == "" || anamnesis == null){
        setError(anamnesisInput, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(anamnesisInput);
    }

    if (recomendation == "" || recomendation == null){
        setError(inputRecomendation, 'Заполните это поле');
        result = false;
    } else {
        setSuccess(inputRecomendation);
    }

    if (conclusion == "" || conclusion == null){
        console.log(123,conclusion);
        setError(inputConclusion, 'Заключение не выбрано');
        result = false;
    } else if (conclusion == "Death"){
        setSuccess(inputConclusion);
        if (dateDeath == ""){
            setError(inputDateDeath, 'Укажите дату смерти');
            result = false;
        } else if (!isValidDateTime(dateDeath)){
            setError(inputDateDeath, 'Дата смерти должна быть прошедшей');
            result = false;
        } else {
            setSuccess(inputDateDeath);
        }

    } else if (conclusion == "Disease"){
        setSuccess(inputConclusion);
        if (dateNextVisit == ""){
            setError(inputDateNextVisit, 'Укажите дату следующего визита');
            result = false;
        }else if (isValidDateTime(dateNextVisit)){
            setError(inputDateNextVisit, 'Дата следующего визита должна быть в будущем');
            result = false;
        } else {
            setSuccess(inputDateNextVisit);
        }
    }
    else {
        setSuccess(inputConclusion);
    }


    //////////////////////////////////////////
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
        var typeDiagnosisСomplication = diagnosis.querySelector('input[id^="checkTypeDiagnosisСomplication"]');


        if (inputCertainDisease.value == null || inputCertainDisease.value == ""){
            setError(inputCertainDisease, 'Заполните это поле');
            result = false;
        } else {
            setSuccess(inputCertainDisease);
        }

        if (idDiagnosis == null || idDiagnosis == ""){
            setError(inputNameOrCodeDisease, 'Укажите корректное название болезни');
            result = false;
        } else{
            setSuccess(inputNameOrCodeDisease);
        }

        if (typeDiagnosisGeneral.checked == true){
            countGeneralDiagnosis++;
        }

        if (typeDiagnosisGeneral.checked == true && countGeneralDiagnosis > 1){
            setError(typeDiagnosisGeneral, 'В осмотре должден быть ровно один основной диагноз');
            result = false;
        } else{
            setSuccess(typeDiagnosisGeneral);
        }
        
    });

    if (countGeneralDiagnosis == 0){
        setError(inputDiagnosisGeneral, 'В осмотре должден быть один основной диагноз');
        result = false;
    } else{
        setSuccess(inputDiagnosisGeneral);
    }


    return result;
    
}
  