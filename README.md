# @tscircuit/webworker

Run @tscircuit/core inside of a WebWorker for improved parallelism and isolation

> [!TIP]
> This is now available via [@tscircuit/eval](https://github.com/tscircuit/eval)

This module functions as a drop-in replacement for @tscircuit/core with some
extra functions for transferring components to the inside of the webworker.

```tsx
import { WebWorkerCircuit } from "@tscircuit/webworker"

const circuit = new WebWorkerCircuit()

circuit.add(
  <board width="10mm" height="10mm">
    <resistor name="R1" resistance="10k" footprint="0402" />
  </board>
)

await circuit.renderUntilSettled()

console.log(circuit.getCircuitJson())
```

## Usage with Custom Components

Custom components are defined as functions, which makes them difficult to
transfer into a Web Worker. There are several strategies for making these
functions work, the most default way is to use the automatic proxy
mechanism (this is used by default):

```tsx
const MyCustomComponent = () => (
  <group>
    <resistor name="R1" resistance="10k" footprint="0402" />
  </group>
)

circuit.add(<MyCustomComponent />)
```

You can also inject component definitions into the worker like so:

```tsx
const { MyCustomComponent } = circuit.injectComponentDefinition(
  `export const MyCustomComponent = () => (
    <group>
      <resistor name="R1" resistance="10k" footprint="0402" />
    </group>
  )`
)

circuit.add(<MyCustomComponent />)
```

The benefit of injecting component definitions is the web worker will not need
to have @tscircuit/core or run any user-code. Additionally, injecting components
will automatically handle...

- Transpilation of the component definition
- Imports from `"@tsci/*"`

## Introspecting the Render Process

You can introspect the render process as you normally would with @tscircuit/core:

```tsx
circuit.on("renderStage:start", (stage) => {
  console.log(`Starting render stage: ${stage}`)
})

circuit.on("renderStage:finish", (stage) => {
  console.log(`Finished render stage: ${stage}`)
})

circuit.getRenderStageStates()
```
