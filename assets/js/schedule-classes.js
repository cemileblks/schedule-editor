// For a new schedule created
class Schedule {
    consturctor(name) {
        this.name = name;
        this.operations = [];
    }

    addOperation(operation) {
        this.operations.push(operation);
    }

    printOperations() {
        console.log(`Schedule: ${this.name}`);
        this.operations.forEach(operation => {
            console.log(operation());
        });
    }
}

class OperationTemplates {
    static transferPlate(objectName, transferFromCurrentLocation, source, destination, lidHandlerAction) {
        return `Transfer object '${objectName}' from Current Location: '${transferFromCurrentLocation}', Source: '${source}', Destination: '${destination}', Lid Handler Action: '${lidHandlerAction}'`;
    }

    static deviceOperation(objectName, deviceType, operationName) {
        return `${operationName} Operation: Device Type: '${deviceType}', Object: '${objectName}'`;
    }
}
