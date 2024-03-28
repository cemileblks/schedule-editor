import { Schedule, OperationTemplates } from "./schedule-classes.js";

const createButton = document.getElementById("create-schedule-btn");
const deleteButton = document.getElementById("delete-schedule-btn");
const scheduleFilter = document.getElementById("schedule-filter");
const sidebar = document.querySelector(".sidebar")
const schedulesList = document.getElementById("schedules-list");
const main = document.querySelector(".main")
const openedScheduleTitle = document.querySelector(".opened-schedules h3");
const operationsContainer = document.getElementById("schedule-operation-container");
const addOperationButton = document.getElementById("add-operation-btn");
const contextMenu = document.getElementById("context-menu");
const duplicateSchedule = document.getElementById("duplicate-schedule");
const createSchedule = document.getElementById("create-schedule");
const deleteSchedule = document.getElementById("delete-schedule");

let currentSchedule;

// Function to arrange schedules alphebetically 
const arrangeSchedules = function() {
    const listItems = [...schedulesList.children];
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    schedulesList.innerHTML = ""; // assuming user does not use HTML markup in naming of their schedules
    listItems.forEach(item => schedulesList.appendChild(item));
}

const saveScheduleToLocalStorage = function(schedule) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    schedules[schedule.name] = schedule;
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

const getScheduleFromLocalStorage = function(scheduleName) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    return schedules[scheduleName] || null;
}

const deleteScheduleFromLocalStorage = function(scheduleName) {
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    delete schedules[scheduleName];
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

// Function to load operations for the currently open schedule
const loadScheduleOperations = function(scheduleName) {
    const schedule = getScheduleFromLocalStorage(scheduleName);

    if (schedule) {
        currentSchedule = new Schedule(schedule.name); // assign the schedule to currentSchedule
        currentSchedule.operations = schedule.operations;
        // clear the operations from another operation
        while (operationsContainer.firstElementChild) {
            operationsContainer.removeChild(operationsContainer.firstElementChild);
        }
        const operationList = document.createElement('ul');
        // iterate through operations and display them
        currentSchedule.operations.forEach(operation => {
            const operationListItem = document.createElement("li");
            operationListItem.textContent = operation;
            operationList.appendChild(operationListItem);
        });
        operationsContainer.appendChild(operationList);
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

const loadScheduleList = function() {
    schedulesList.innerHTML = ""; // Clear the current list
    let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    for (let scheduleName in schedules) {
        const scheduleListItem = document.createElement("li");
        scheduleListItem.textContent = scheduleName;
        scheduleListItem.tabIndex = 0;
        scheduleListItem.classList.add("schedule-item");
        schedulesList.appendChild(scheduleListItem);
    };

    arrangeSchedules();
};

const createNewSchedule = function(scheduleName) {
    if (!scheduleName) return;

    currentSchedule = new Schedule(scheduleName);
    // update the title on the main page with the newly added schedule
    openedScheduleTitle.textContent = scheduleName;

    saveScheduleToLocalStorage(currentSchedule);
    operationsContainer.innerHTML = "";
    operationsContainer.appendChild(addOperationButton);
    loadScheduleList();
    arrangeSchedules();
}

createButton.addEventListener("click", () => {
    const scheduleName = prompt("Enter a name for the new schedule:");

    createNewSchedule(scheduleName);
});

deleteButton.addEventListener("click", () => {
    if (!currentSchedule) {
        alert("No schedule to delete.");
        return;
    }

    const scheduleName = currentSchedule.name;

    // Ask for confirmation before deleting
    const confirmed = confirm(`Are you sure you want to delete the schedule "${scheduleName}"?`);
    if (!confirmed) {
        return;
    }

    deleteScheduleFromLocalStorage(scheduleName);
    operationsContainer.innerHTML = "";
    loadScheduleList();
    currentSchedule = null;
    openedScheduleTitle.textContent = "";
    alert(`Schedule "${scheduleName}" has been deleted.`);
})

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
        openedScheduleTitle.textContent = scheduleName;
        loadScheduleOperations(scheduleName);
    };
});

// Function to add new operation to the current schedule
addOperationButton.addEventListener("click", () => {
    if (!currentSchedule) {
        alert("Please create or select a schedule.");
        return;
    }

    const operationType = prompt("Enter operation type (Transfer, Device Operation or Sleep)");
    let operation;
    if (operationType === "Transfer" || operationType === "transfer") {
        const objectName = prompt("Enter the object name:");
        const source = prompt("Enter source name:");
        const destination = prompt("Enter destination name:");
        const lidHandlerAction = prompt("Enter the lid handler action (remove, replace etc.):");

        operation = OperationTemplates.transferPlate(objectName, source, destination, lidHandlerAction);

    } else if (operationType === "Device operation" || operationType === "Device Operation" || operationType === "device operation") {
        const operationName = prompt("Enter operation to perform:");
        const deviceType = prompt("Enter device type:");
        const objectName = prompt("Enter labware object name:");

        operation = OperationTemplates.invokeOperation(operationName, deviceType, objectName);

    } else if (operationType === "sleep" || operationType === "Sleep") {
        let durationString = prompt("Enter sleep duration (in seconds):");
        const duration = parseInt(durationString);
        if (isNaN(duration)) {
            alert("Please enter a numeric value for sleep duration.");
            return;
        }

        operation = OperationTemplates.sleep(duration);

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

// Functions to be executed after everyting is loaded
document.addEventListener("DOMContentLoaded", function () {

    loadScheduleList();

    // Show custom context menu when a schedule item is right-clicked
    schedulesList.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        const target = e.target;
        if (target.classList.contains("schedule-item")) {
            contextMenu.style.display = "block";
            contextMenu.style.left = e.pageX + "px";
            contextMenu.style.top = e.pageY + "px";
            contextMenu.dataset.scheduleName = target.textContent; // Store schedule name
        }
    });

    // Hide context menu
    window.addEventListener("click", function (e) {
        if (e.target !== schedulesList && !schedulesList.contains(e.target)) {
            contextMenu.style.display = "none";
        }
    });

    sidebar.addEventListener("scroll", function () {
        contextMenu.style.display = "none";
    });

    main.addEventListener("scroll", function () {
        contextMenu.style.display = "none";
    });


    // Duplicate schedule
    duplicateSchedule.addEventListener("click", function () {
        const scheduleName = contextMenu.dataset.scheduleName;
        const selectedSchedule = getScheduleFromLocalStorage(scheduleName);
        if (selectedSchedule) {
            const duplicatedSchedule = new Schedule(scheduleName + " (Copy)");
            duplicatedSchedule.operations = selectedSchedule.operations.slice(); // Create a deep copy of operations
            saveNewScheduleToLocalStorage(duplicatedSchedule.name, duplicatedSchedule);
            loadScheduleList();
        }
        contextMenu.style.display = "none";
    });

    // Create new schedule using the context menu
    createSchedule.addEventListener("click", function () {
        const scheduleName = prompt("Enter a name for the new schedule:");
        createNewSchedule(scheduleName);
        contextMenu.style.display = "none";
    });

    // Delete the right clicked schedule using the context menu
    deleteSchedule.addEventListener("click", function () {
        const scheduleName = contextMenu.dataset.scheduleName;
        deleteScheduleFromLocalStorage(scheduleName);

        if (currentSchedule && currentSchedule.name === scheduleName) {
            operationsContainer.innerHTML = "";
            openedScheduleTitle.textContent = "";
            currentSchedule = null;
        }

        loadScheduleList();
        alert(`Schedule "${scheduleName}" has been deleted.`);
    });

    function saveNewScheduleToLocalStorage(scheduleName, scheduleContent) {
        let schedules = JSON.parse(localStorage.getItem("schedules")) || {};
        schedules[scheduleName] = scheduleContent;
        localStorage.setItem("schedules", JSON.stringify(schedules));
    };

});