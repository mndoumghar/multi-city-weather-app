const url = "https://geocoding-api.open-meteo.com/v1/search";

const searchForm = document.getElementById("search-form");

async function fetchData(city) {
    const params = new URLSearchParams({
        name: city,
        count: 5,
        language: "en",
        format: "json"
    });

    const response = await fetch(`${url}?${params}`);
    if (!response.ok) {
        throw new Error(`server error : ${response.status}`);
    }

    const data = await response.json();
    return data?.results ?? [];
}

searchForm.addEventListener("submit", async (event) => {
    
    event.preventDefault();
    const input = document.querySelector("#city").value.trim();
    const error = document.querySelector("#error");
    const lists = document.querySelector("#results");
    const loading = document.querySelector("#loading");

    error.classList.add("hidden");
    error.textContent = "";
    lists.replaceChildren();

    if (!isValid(input)) {
        error.classList.remove("hidden");
        error.textContent = "please enter a city name ....";
        return;
    }

    loading.classList.remove("hidden");

    try {
        const data = await fetchData(input);

        if (data.length === 0) {
            error.classList.remove("hidden");
            error.textContent = "City not found.";
            return;
        }

        const find = new Set();

        data.forEach(element => {
            if (find.has(element.id)) return;

            const div = document.createElement("div");

            div.textContent = [
                element.name,
                element.admin1,
                element.country
            ].filter(Boolean).join(", ");

            div.classList.add("bg-red-200", "p-2", "mb-2");

            lists.append(div);

            find.add(element.id);
        });

    } catch (e) {
        console.error(e);

        error.classList.remove("hidden");
        error.textContent = "unable to search ..please try again";

    } finally {
        loading.classList.add("hidden");
    }
});



function isValid(city) {
    return city.trim().length > 0

}