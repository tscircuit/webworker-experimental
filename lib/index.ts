import type React from "react"

export class WebWorkerCircuit {
  worker: Worker

  constructor() {
    this.worker = new Worker(
      new URL("./webworker-src/index.ts", import.meta.url),
      {
        type: "module",
      },
    )
  }

  add(component: React.ReactNode) {
    // TODO traverse component and create comlink proxies for functions
  }

  async renderUntilSettled() {}

  getCircuitJson() {
    return {}
  }
}
