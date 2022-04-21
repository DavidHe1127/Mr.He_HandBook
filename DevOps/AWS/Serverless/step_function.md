## Step Functions

- A state takes json as input and passes json as output to the next state. i.e return a json variable in handler as output
- Parallel wait until all branches terminate (reach a terminal state) before processing the Parallel state’s Next field
- Parameters gives you a way to specify what goes in as input.

```json
"Parameters": {
  "Input.$": "$",
  // if values is selected through a path like $.xx then the key name must end in .$
  // to access contextual object information, use $$
  "Route.$": "$$.State.Name",
  "Meta": {
    "StateMachineArn.$": "$$.StateMachine.Id",
    "ExecutionArn.$": "$$.Execution.Id"
  }
}
```

- catch errors

```json
"Catch": [
  {
    "ErrorEquals": [ "States.ALL" ],
    // input supplied to next state. $ is output from current state
    "ResultPath": "$.error",
    "Next": "Failed"
  }
],
```
