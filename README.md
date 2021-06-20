# Accident Insurance

https://fsrao.ca/consumers/auto-insurance/after-accident-understanding-claims-process  

## FSM
![Alt text](./fsm.png?raw=true "Title")  

## State Data
states: ["Init", "ClaimFiled", "LossReported", "FaultDetermined", "Paid"]  
report: {  
    id: integer,  
    userName: string,  
    currentState: integer,  
    policyNumber: string,  
    make: string,  
    model: string,  
    year: string,  
    plate: string,  
    details: string,  
    injury: string,  
    passengerNumber: Number,  
    damage : string,  
    accidentDescription : string,  
    driverLicenceNumber : string,  
    unsuranceCompany : string,  
    officerBadgeNumber: string,  
    lossAmount: Nmumber,  
    fault: integer,  
    paidAmount: Nmumber,  
}  
  
## Transaction and Role
createReport(reportNumber, content) - car owner  
proofOfLoss(reportNumber, amount) - car owner  
determineFault(reportNumber, percentage) - insurance company  
pay(reportNumber, amount) - insurance company  
  
queryReport(id) - insurance company  
queryAllReports() - insurance company  
queryMyReports() - car owner  
