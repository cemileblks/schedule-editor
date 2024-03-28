// For a new schedule created
export class Schedule {
    constructor(name) {
        this.name = name;
        this.operations = [];
    }

    addOperation(operation) {
        this.operations.push(operation);
    }

    printOperations() {
        console.log(`Schedule: ${this.name}`);
        this.operations.forEach(operation => {
            console.log(operation);
        });
    }
}

export class OperationTemplates {
    static transferPlate(objectName, source, destination, lidHandlerAction) {
        return `🔄 Transfer object '${objectName}', from '${source}' to LocationType'${destination}', Lid Handler Action: '${lidHandlerAction}'`;
    }

    static invokeOperation(operationName, deviceType, objectName) {
        return `⚙️ Invoke operation: '${operationName}' Device type: '${deviceType}' Object: '${objectName}'`;
    }

    static sleep(duration) {
        return `💤 Sleep Duration: ${duration} seconds.`;
    }

}
