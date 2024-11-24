import { Circuit } from "@tscircuit/core"
import * as Comlink from "comlink"
import type { WorkerApi } from "shared-src/types"
import type { SerializedReactComponent } from "../lib/serialize-react"
import React, { type ReactElement } from "react"

const circuit = new Circuit()

function deserializeComponent(
  serialized: SerializedReactComponent,
): ReactElement {
  const { type, props } = serialized

  // Handle function components by evaluating their string representation
  if (typeof type === "string" && type.startsWith("function")) {
    // Basic eval of function component - in production you'd want more security
    const fn = new Function(`return ${type}`)()
    return fn({ ...props, children: props.children?.map(deserializeComponent) })
  }

  // Handle primitive components
  return React.createElement(
    type as any,
    {
      ...props,
      // biome-ignore lint/correctness/noChildrenProp: <explanation>
      children: undefined,
    },
    ...(props.children ?? []).map(deserializeComponent),
  )
}

const api: WorkerApi = {
  add(component: SerializedReactComponent) {
    const deserialized = deserializeComponent(component)
    circuit.add(deserialized)
  },

  async renderUntilSettled() {
    return await circuit.renderUntilSettled()
  },

  getCircuitJson() {
    return circuit.getCircuitJson()
  },
}

Comlink.expose(api)
