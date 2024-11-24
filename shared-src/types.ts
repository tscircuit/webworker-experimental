export type WorkerApi = {
  add: (component: any) => void
  renderUntilSettled: () => Promise<void>
  getCircuitJson: () => any
}
