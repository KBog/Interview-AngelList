import { InvestorAmount } from "./InvestorAmount"

// Helper method
function cappedAmount(investorAmount: InvestorAmount): number {
  // Going over the requested amount for the investor isn't something we want to allow
  let capped = Math.min(investorAmount.requested_amount, investorAmount.average_amount)
  // also for new investors that are just starting with us, let's assume they've invested
  // $1 before, to make sure they can still hit their target
  return Math.max(capped, 1)
}

export default function prorate(allocation: number, investorAmounts: InvestorAmount[]): any {
  // For illustration purposes only
  console.log(`\n# Input\nallocation_amount: ${allocation}\ninvestor_amounts: ${JSON.stringify(investorAmounts, null, 2)}`)

  let proratedAmounts: any = {}

  // First check to see if the investors' requested amounts are < allocation
  let totalDesired = investorAmounts.reduce((total, item) => {
    return total + item.requested_amount
  }, 0)

  if (totalDesired <= allocation) {
    // Adding up all the desired amounts is within the allowed allocation
    // so let's just convert the array into a dictionary
    investorAmounts.forEach(item => {
      proratedAmounts[item.name] = item.requested_amount
    })
  } else {
    // Our goal is to consume the entire allocation and not leave any potential
    // investment on the table. So we're going to start with the allocation
    // until it goes to 0 and no money is left.

    while (allocation > 0) {
      let consumedFunds = 0

      // Step 1: Calculate the total historical average of all investors
      let totalAverageAmounts = investorAmounts.reduce((total, item) => {
        // Going over the requested amount for the investor isn't something we want to allow
        return total + cappedAmount(item)
      }, 0)

      // if we got 0 total average let's abort
      if (totalAverageAmounts === 0) {
        break
      }

      // Step 2: Multiply the allocation allowed for the startup by the %
      // from the investor based on their historical investment, then return
      // the proratedAmounts in a dictionary
      investorAmounts.forEach(item => {
        // if we don't have an item in the dictionary yet, let's add it
        if (!proratedAmounts[item.name]) {
          proratedAmounts[item.name] = 0
        }
        proratedAmounts[item.name] += (allocation * (cappedAmount(item) / totalAverageAmounts))
        // let's make sure we didn't go beyond the desired amount
        proratedAmounts[item.name] = Math.min(proratedAmounts[item.name], item.requested_amount)

        // accummulate what we've allocated so far
        consumedFunds += proratedAmounts[item.name]
      })

      // Step 3: Only keep the investors that haven't reached their investment goals yet
      investorAmounts = investorAmounts.filter(item => proratedAmounts[item.name] < item.requested_amount)

      // Step 4: Update the allocation with whatever we consumed so far so we can repeat
      // but this time with the rest of the unallocated money
      allocation -= consumedFunds
    }
  }

  // For illustration purposes only
  console.log(`\n# Output\n${JSON.stringify(proratedAmounts, null, 2)}`)

  return proratedAmounts
}
