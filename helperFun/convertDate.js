function serverToClientDate(date) {
    const dateObject = new Date(date);
    
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = dateObject.getFullYear();
    
    return `${day}.${month}.${year}`;
}

function clientToServerDate(date) {
    const dateParts = date.split('.');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}