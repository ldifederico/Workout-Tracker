const actionBtn = document.getElementById("action-button");
const makeWorkout = document.getElementById("make-new");
const clear = document.getElementById("clear-all");
const results = document.getElementById("results");
const status = document.getElementById("status");

function getResults() {
    clearWorkouts();
    fetch("/all")
        .then(function(response) {
            if (response.status !== 200) {
                return;
            }
            response.json().then(function(data) {
                newWorkoutPlan(data);
            });
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function newWorkoutPlan(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let title = res[i]["title"];
        let workoutPlan = document.getElementById("results");
        snippet = `
      <p class="data-entry">
      <span class="dataTitle" data-id=${data_id}>${title}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>
      </p>`;
      workoutPlan.insertAdjacentHTML("beforeend", snippet);
    }
}

function clearWorkouts() {
    const workoutPlan = document.getElementById("results");
    workoutPlan.innerHTML = "";
}

function resetTitleAndWorkout() {
    const workout = document.getElementById("workout");
    workout.value = "";
    const title = document.getElementById("title");
    title.value = "";
}

function updateTitleAndWorkout(data) {
    const workout = document.getElementById("workout");
    workout.value = data.workout;
    const title = document.getElementById("title");
    title.value = data.title;
}

getResults();

clear.addEventListener("click", function(e) {
    if (e.target.matches("#clear-all")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/clearall", {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                clearWorkouts();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/delete/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                element.parentNode.remove();
                resetTitleAndWorkout();
                let newButton = `
      <button id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches(".dataTitle")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        status.innerText = "Editing"
        fetch("/find/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateTitleAndWorkout(data);
                let newButton = `<button id='updater' data-id=${data_id}>Update</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {
    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const title = document.getElementById("title").value;
        const workout = document.getElementById("workout").value;
        fetch("/update/" + data_id, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    workout
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                element.innerText = title
                resetTitleAndWorkout();
                let newButton = `<button id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
                status.innerText = "Creating"
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches("#make-new")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: document.getElementById("title").value,
                    workout: document.getElementById("workout").value,
                    created: Date.now()
                })
            })
            .then(res => res.json())
            .then(res => newWorkoutPlan([res]));
        resetTitleAndWorkout();
    }
});