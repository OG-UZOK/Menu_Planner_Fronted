document.querySelector("head").innerHTML = `<meta charset="UTF-8">`;

let route = (window.location.pathname).split('/')[1];
console.log(route);

const authToken = localStorage.getItem("token");
console.log(authToken);

switch ('/' + route) {
    case "/login":
        $.get("login/index.html", (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>login</title>
            `;
        });
        break;
    case "/registration":
        $.get("registration/index.html",(data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>registration</title>
            `;
        });
        break;
    case "/patients":
        $.get('patients/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Patients</title>
            `;
        });
        break;
    case "/profile":
        $.get('profile/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Profile</title>
            `;
        });
        break;
    case "/consultations":
        $.get('consultations/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Consultations</title>
            `;
        });
        break;
    case "/patient":
        $.get('patient/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Patient</title>
            `;
        });
        break;
    case "/inspection/create/":
        $.get('inspection/create/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Inspection Create</title>
            `;
        });
        break;
    case "/inspection/":
        $.get('inspection/index.html', (data)=>{
            updatepage(data);
            document.querySelector("head").innerHTML+=`
            <title>Inspection</title>
            `;
        });
        break;
    default:
        if (!authToken){
           window.location.href = "/login";
            break;
        } else{
            window.location.href = "/patients";
            break;
        }
        
}

function updatepage(page){
    $("main").html(page);
}