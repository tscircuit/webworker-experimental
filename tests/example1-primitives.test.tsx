import { WebWorkerCircuit } from "lib"
import "@tscircuit/core"
import { describe, it, expect } from "bun:test"

describe("WebWorkerCircuit with primitives", () => {
  it("should handle basic board with resistor", async () => {
    const circuit = new WebWorkerCircuit()

    circuit.add(
      <board width="10mm" height="10mm">
        <resistor name="R1" resistance="10k" footprint="0402" />
      </board>,
    )

    await circuit.renderUntilSettled()

    const json = circuit.getCircuitJson()
    expect(json).toBeDefined()
    // Add more specific assertions as needed
  })
})
