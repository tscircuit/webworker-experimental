import { Circuit } from "@tscircuit/core"
import * as Comlink from "comlink"
import type { WorkerApi } from "shared-src/types"
import type { SerializedReactComponent } from "../lib/serialize-react"
import React, { type ReactElement } from "react"

const circuit = new Circuit()

const registeredProxies: Record<string, any> = {}

function deserializeComponent(
  serialized: SerializedReactComponent,
): ReactElement {
  const { type, props } = serialized

  // Handle "type.$proxy_FN"
  if (typeof type === "string" && type.startsWith("$proxy_")) {
    console.log("registeredProxies", registeredProxies)
    console.log(registeredProxies[type]())
    // return React.createElement(
    //   (...args: any[]) => {
    //     const proxyRes = registeredProxies[type](...args)
    //     return deserializeComponent(proxyRes)
    //   },
    //   { ...props, children: undefined },
    //   ...(props.children ?? []).map(deserializeComponent),
    // )
  }

  return React.createElement(
    type as any,
    {
      ...props,
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

  _registerProxy(name: string, fn: any) {
    registeredProxies[name] = fn
  },
}

Comlink.expose(api)
