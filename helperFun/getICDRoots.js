async function icdRoots() {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch("https://mis-api.kreosoft.space/api/dictionary/icd10/roots", options);

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 500) {
      console.error("Произошла ошибка сервера:", await response.json());
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
}

async function loadAndProcessData() {
  var rootsICD = await icdRoots();

  rootsICD.forEach(root => {
    const option = document.createElement('option');
    option.text = root.name; 
    option.value = root.id;
    MKB10Input.appendChild(option);
  });

}

