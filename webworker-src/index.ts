import { Circuit } from "@tscircuit/core"
import * as Comlink from "comlink"
import type { WorkerApi } from "shared-src/types"

const circuit = new Circuit()

const api: WorkerApi = {
  add(component: any) {
    console.log("add", component)
    circuit.add(component)
  },

  async renderUntilSettled() {
    return await circuit.renderUntilSettled()
  },

  getCircuitJson() {
    return circuit.getCircuitJson()
  },
}

Comlink.expose(api)
