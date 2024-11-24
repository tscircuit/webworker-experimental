import type React from "react"
import * as Comlink from "comlink"
import type { WorkerApi } from "shared-src/types"

export class WebWorkerCircuit {
  worker: Worker
  api: WorkerApi

  constructor() {
    this.worker = new Worker(
      new URL("../webworker-src/index.ts", import.meta.url),
      {
        type: "module",
      },
    )
    this.api = Comlink.wrap<WorkerApi>(this.worker)
  }

  add(component: React.ReactNode) {
    return this.api.add(component)
  }

  async renderUntilSettled() {
    return await this.api.renderUntilSettled()
  }

  getCircuitJson() {
    return this.api.getCircuitJson()
  }
}
