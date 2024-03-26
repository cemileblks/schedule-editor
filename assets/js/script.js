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
const operationsContainer = document.getElementsByClassName("schedule-operation-container");
const addOperationButton = document.getElementById("add-operation-btn");

let currentSchedule;

function arrangeSchedules() {
    const listItems = [...schedulesList.children];
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    schedulesList.innerHTML = ""; // assuming user does not use HTML markup in naming of their schedules
    listItems.forEach(item => schedulesList.appendChild(item));
}

function saveScheduleToLocalStorage(schedule) {
    localStorage.setItem(schedule.name, JSON.stringify(schedule));
}

function getScheduleFromLocalStorage(scheduleName) {
    const scheduleJson = localStorage.getItem(scheduleName);
    return scheduleJson ? JSON.parse(scheduleJson) : null;
}

arrangeSchedules();

createButton.addEventListener("click", () => {
    const scheduleName = prompt("Enter a name for the new schedule:");

    if (scheduleName) {

        // const newSchedule = new Schedule(scheduleName);
        currentSchedule = new Schedule(scheduleName);

        const newScheduleItem = document.createElement("li");
        newScheduleItem.textContent = scheduleName;
        newScheduleItem.tabIndex = 0;
        newScheduleItem.classList.add("schedule-item");
        schedulesList.appendChild(newScheduleItem);
        // update the content on the main page with the newly added schedule
        // const openedScheduleTitle = document.querySelector(".opened-schedules h3");
        openedScheduleTitle.textContent = scheduleName;

        //save to local storage
        saveScheduleToLocalStorage(currentSchedule);

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

schedulesList.addEventListener("click", (e) => {
    const clickedSchedule = e.target;
    // check if the click is on one of the schedules on the list
    if (clickedSchedule.tagName === "LI") {
        const scheduleName = clickedSchedule.textContent;
        // update the content on the main page
        const openedScheduleTitle = document.querySelector(".opened-schedules h3");
        openedScheduleTitle.textContent = scheduleName;
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
    const scheduleOperationContainer = document.querySelector(".schedule-operation-container");
    scheduleOperationContainer.appendChild(operationListItem);

    saveScheduleToLocalStorage(currentSchedule);

});