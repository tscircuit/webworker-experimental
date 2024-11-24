import type { ReactNode } from "react"

export type SerializedReactComponent = {
  type: string | Function
  props: Record<string, any>
  children?: SerializedReactComponent[]
}

export function serializeReactNode(
  node: ReactNode,
): SerializedReactComponent | null {
  if (!node || typeof node !== "object") return null

  const element = node as any
  if (!element.type) return null

  return {
    type:
      typeof element.type === "function"
        ? element.type.toString()
        : element.type,
    props: {
      ...element.props,
      children: element.props?.children
        ? (Array.isArray(element.props.children)
            ? element.props.children.map(serializeReactNode)
            : [serializeReactNode(element.props.children)]
          ).filter(Boolean)
        : undefined,
    },
  }
}
