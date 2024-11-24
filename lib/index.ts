import type React from "react"
import * as Comlink from "comlink"
import type { WorkerApi } from "shared-src/types"
import { serializeReactNode } from "./serialize-react"

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
    const serialized = serializeReactNode(component, (name, fn) => {
      this.api._registerProxy(`$proxy_${name}`, Comlink.proxy(fn))
      return `$proxy_${name}`
    })
    if (!serialized) {
      throw new Error("Invalid React component")
    }
    console.log("serialized", serialized)
    return this.api.add(serialized)
  }

  async renderUntilSettled() {
    return await this.api.renderUntilSettled()
  }

  getCircuitJson() {
    return this.api.getCircuitJson()
  }
}
