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
const operationsContainer = document.getElementsByClassName("schedule-operation-container");

function arrangeSchedules() {
    const listItems = [...schedulesList.children];
    listItems.sort((a, b) => a.textContent.localeCompare(b.textContent));
    schedulesList.innerHTML = ""; // assuming user does not use HTML markup in naming of their schedules
    listItems.forEach(item => schedulesList.appendChild(item));
}

arrangeSchedules();

createButton.addEventListener("click", () => {
    const scheduleName = prompt("Enter a name for the new schedule:");

    if (scheduleName) {

        const newSchedule = new Schedule(scheduleName);

        const newScheduleItem = document.createElement("li");
        newScheduleItem.textContent = scheduleName;
        newScheduleItem.tabIndex = 0;
        newScheduleItem.classList.add("schedule-item");
        schedulesList.appendChild(newScheduleItem);

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