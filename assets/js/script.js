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

createButton.addEventListener("click", () => {
    const scheduleName = prompt("Enter a name for the new schedule:");

    if (scheduleName) {

        const newSchedule = new Schedule(scheduleName);

        const newScheduleItem = document.createElement("li");
        newScheduleItem.textContent = scheduleName;
        newScheduleItem.tabIndex = 0;
        newScheduleItem.classList.add("schedule-item");
        schedulesList.appendChild(newScheduleItem);
    }
})
