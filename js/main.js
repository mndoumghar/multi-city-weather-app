let url = "https://geocoding-api.open-meteo.com/v1/search?name=";

const searchForm = document.getElementById("search-form");
console.log(searchForm);


async function fetchData(city) {
    try {
        const response = await fetch(`${url}${city}`);

        if (!response.ok) {
            throw Error("Error : Server Error");
        }

        const data = await response.json();
        return data?.results ?? [];

    } catch (e) {
        console.error("Error page Not found 404 : ", e);
        return e;
    }
}


searchForm.addEventListener("click", (event) => {
    event.preventDefault();
    const button = event.target.closest("button");
    if(!button) return;

    const input =  document.querySelector("input").value;
    const error = document.querySelector("#error");

    if(!isValid(input)) {
        error.classList.remove("hidden");
        error.textContent = "Error Input  ...";
        return ;
    }

   async function searchCity() {
    const lists = document.querySelector("#results");
    lists.replaceChildren();
    const data = await fetchData(input) ?? [];
    let find = new Set();
    data.forEach(element => {
        if (find.has(element.name)) return;
        const div = document.createElement("div");
        
        div.textContent = element.name;
        div.classList.add("bg-red-200");
        lists.append(div);
        console.log(element);
        find.add(element.name)
        
    });
}

    searchCity();
  
})

function isValid(city) {
    if(!city.trim()) return false
    const regix =/^[a-zA-ZÀ-ÿ\s-]+$/;
    return regix.test(city)  
}






