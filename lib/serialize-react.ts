import type { ReactNode } from "react"
import * as Comlink from "comlink"

export type SerializedReactComponent = {
  type: string | Function
  props: Record<string, any>
  children?: SerializedReactComponent[]
}

export function serializeReactNode(
  node: ReactNode,
  registerProxy: (name: string, fn: any) => string,
): SerializedReactComponent | null {
  if (!node || typeof node !== "object") return null

  const element = node as any
  if (!element.type) return null

  return {
    type:
      typeof element.type === "function"
        ? registerProxy(element.type.name, element.type)
        : element.type,
    props: {
      ...element.props,
      children: element.props?.children
        ? (Array.isArray(element.props.children)
            ? element.props.children.map((child: ReactNode) =>
                serializeReactNode(child, registerProxy),
              )
            : [serializeReactNode(element.props.children, registerProxy)]
          ).filter(Boolean)
        : undefined,
    },
  }
}
