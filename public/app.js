const actionBtn = document.getElementById("action-button");
const makeWorkout = document.getElementById("make-new");
const clear = document.getElementById("clear-all");
const results = document.getElementById("results");

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
            console.log(err);
        });
}

function newWorkoutPlan(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let title = res[i]["title"];
        let workoutPlan = document.getElementById("results");
        oneResult = `
      <p class="data-entry">
      <span class="dataTitle" data-id=${data_id}>${title}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>
      </p>`;
      workoutPlan.insertAdjacentHTML("beforeend", oneResult);
    }
}

function clearWorkouts() {
    const workoutPlan = document.getElementById("results");
    workoutPlan.innerHTML = "";
}

function resetTitleAndWorkout() {
    const title = document.getElementById("title");
    title.value = "";
    const type = document.getElementById("type");
    type.value = "";
    const muscle = document.getElementById("muscle");
    muscle.value = "";
    const workout = document.getElementById("workout");
    workout.value = "";
}

function updateTitleAndWorkout(data) {
    const title = document.getElementById("title");
    title.value = data.title;
    const type = document.getElementById("type");
    type.value = data.type;
    const muscle = document.getElementById("muscle");
    muscle.value = data.muscle;
    const workout = document.getElementById("workout");
    workout.value = data.workout;
}

getResults();

results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/delete/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    return;
                }
                element.parentNode.remove();
                resetTitleAndWorkout();
                let newButton = `<button class="btn btn-outline-light" id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log(err);
            });
    } else if (e.target.matches(".dataTitle")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/find/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateTitleAndWorkout(data);
                let newButton = `<button class="btn btn-outline-light" id='updater' data-id=${data_id}>Update</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log(err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {
    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const title = document.getElementById("title").value;
        const type = document.getElementById("type").value;
        const muscle = document.getElementById("muscle").value;
        const workout = document.getElementById("workout").value;
        fetch("/update/" + data_id, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    type,
                    muscle,
                    workout
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                element.innerText = title
                resetTitleAndWorkout();
                let newButton = `<button class="btn btn-outline-light" id='make-new'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log(err);
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
                    type: document.getElementById("type").value,
                    muscle: document.getElementById("muscle").value,
                    workout: document.getElementById("workout").value,
                })
            })
            .then(res => res.json())
            .then(res => newWorkoutPlan([res]));
        resetTitleAndWorkout();
    }
});