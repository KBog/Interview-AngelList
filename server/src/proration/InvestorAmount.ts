export class InvestorAmount {
  name: string
  requested_amount: number
  average_amount: number

  constructor(name: string, requested_amount: number, average_amount: number) {
    this.name = name
    this.requested_amount = requested_amount
    this.average_amount = average_amount
  }
}
