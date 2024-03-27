import { Schedule, OperationTemplates } from "./schedule-classes.js";

let mySchedule = new Schedule("MyChemSchedule");

mySchedule.addOperation(OperationTemplates.transferPlate("Plate1", true, "Lab1", "Lab2", "Replace Lid"));
mySchedule.addOperation(OperationTemplates.deviceOperation("DispenseReagent", "Bioraptr", "plate"));

mySchedule.printOperations();

const createButton = document.getElementById("create-schedule-btn");
const deleteButton = document.getElementById("delete-schedule-btn");
const scheduleFilter = document.getElementById("schedule-filter");
const infoButton = document.getElementById("info-btn");
const schedulesList = document.getElementById("schedules-list");
const openedSchedule = document.getElementsByClassName("opened-schedules");
const openedScheduleTitle = document.querySelector(".opened-schedules h3");
const operationsContainer = document.getElementById("schedule-operation-container");
const addOperationButton = document.getElementById("add-operation-btn");

let currentSchedule;

function arrangeSchedules() {
    const listItems = [...schedulesList.children];
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    schedulesList.innerHTML = ""; // assuming user does not use HTML markup in naming of their schedules
    listItems.forEach(item => schedulesList.appendChild(item));
}

function saveScheduleToLocalStorage(schedule) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    schedules[schedule.name] = schedule;
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function getScheduleFromLocalStorage(scheduleName) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    return schedules[scheduleName] || null;
}

function loadScheduleOperations(scheduleName) {
    const schedule = getScheduleFromLocalStorage(scheduleName);
   
    if (schedule) {
        currentSchedule = new Schedule(schedule.name); // assign the loaded schedule to currentSchedule
        currentSchedule.operations = schedule.operations; // copy operations from loaded schedule
        // clear the operations from another operation
        while (operationsContainer.firstElementChild) {
            operationsContainer.removeChild(operationsContainer.firstElementChild);
        }
        // iterate through operations and display them
        currentSchedule.operations.forEach(operation => {
            const operationListItem = document.createElement("li");
            operationListItem.textContent = operation;
            operationsContainer.appendChild(operationListItem);
        });
        // show the add operation button
        operationsContainer.appendChild(addOperationButton);
    } else {
        // clear the operations container if no schedule is found
        while (operationsContainer.firstElementChild) {
            operationsContainer.removeChild(operationsContainer.firstElementChild);
        }
        operationsContainer.appendChild(addOperationButton);
    }
}

arrangeSchedules();

createButton.addEventListener("click", () => {
    const scheduleName = prompt("Enter a name for the new schedule:");

    if (scheduleName) {

        currentSchedule = new Schedule(scheduleName);

        // update the content on the main page with the newly added schedule
        openedScheduleTitle.textContent = scheduleName;

        //save to local storage
        saveScheduleToLocalStorage(currentSchedule);

        operationsContainer.innerHTML = "";
        
        operationsContainer.appendChild(addOperationButton);

        loadScheduleList();

        arrangeSchedules();
    };
});

scheduleFilter.addEventListener("input", () => {
    const filterText = scheduleFilter.value.toLowerCase(); // convert input to lowercase
    const listItems = schedulesList.querySelectorAll("li.schedule-item");

    listItems.forEach(item => {
        const itemName = item.textContent.toLowerCase();
        // check if the filter text is "*" (wildcard) or if the list item contains the filter text
        if (filterText === "*" || itemName.includes(filterText.replace("*", ""))) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});

function loadScheduleList() {
    schedulesList.innerHTML = ""; // Clear the current list
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    for (let scheduleName in schedules) {
        const scheduleListItem = document.createElement("li");
        scheduleListItem.textContent = scheduleName;
        scheduleListItem.tabIndex = 0;
        scheduleListItem.classList.add("schedule-item");
        schedulesList.appendChild(scheduleListItem);
    }
}

window.addEventListener("load", () => {
    loadScheduleList();
});

schedulesList.addEventListener("click", (e) => {
    const clickedSchedule = e.target;
    // check if the click is on one of the schedules on the list
    if (clickedSchedule.tagName === "LI") {
        const scheduleName = clickedSchedule.textContent;
        // update the content on the main page
        openedScheduleTitle.textContent = scheduleName;
        loadScheduleOperations(scheduleName);
    };
});

addOperationButton.addEventListener("click", () => {
    if (!currentSchedule) {
        alert("Please create a schedule first.");
        return;
    }

    const operationType = prompt("Enter operation type (transferPlate or deviceOperation)");
    let operation;
    if (operationType === "transferPlate") {
        const objectName = prompt("Enter the object name:");
        const source = prompt("Enter the source:");
        const destination = prompt("Enter the destination:");
        const lidHandlerAction = prompt("Enter the lid handler action:");
        operation = OperationTemplates.transferPlate(objectName, source, destination, lidHandlerAction);
    } else if (operationType === "deviceOperation") {
        const operationName = prompt("Enter the operation name:");
        const deviceType = prompt("Enter the device type:");
        const objectName = prompt("Enter the object name:");
        operation = OperationTemplates.deviceOperation(operationName, deviceType, objectName);
    } else {
        alert("Invalid operation type!");
        return;
    }

    // add operation using the class method
    currentSchedule.addOperation(operation);

    // console check
    console.log(`Operation added to ${currentSchedule.name}: ${operation}`);

    // Display the operation in the schedule operation container
    const operationListItem = document.createElement("li");
    operationListItem.textContent = operation;

    operationsContainer.appendChild(operationListItem);

    saveScheduleToLocalStorage(currentSchedule);

});