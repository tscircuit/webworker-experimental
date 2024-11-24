import { WebWorkerCircuit } from "lib"
import "@tscircuit/core"
import { describe, it, expect } from "bun:test"
import { su } from "@tscircuit/soup-util"
import type { SourceSimpleResistor } from "circuit-json"

const MyCustomComponent = () => (
  <group>
    <resistor name="R1" resistance="10k" footprint="0402" />
  </group>
)

it("example2: should handle custom component with resistor", async () => {
  const circuit = new WebWorkerCircuit()

  circuit.add(
    <board width="10mm" height="10mm">
      <MyCustomComponent />
    </board>,
  )

  await circuit.renderUntilSettled()

  const circuitJson = await circuit.getCircuitJson()
  expect(circuitJson).toBeDefined()

  const resistor = su(circuitJson).source_component.getWhere({
    name: "R1",
  }) as SourceSimpleResistor

  expect(resistor?.resistance).toBe(10_000)
})
