# Acceptance testing

## Automated checks

Run `npm test`. Four unit tests cover focus-capacity calculation, load ratios, overload classification, and team-level remaining capacity.

## Manual release check

1. Reset the sample plan.
2. Add `QA Operator`, role `Operations`, 40 contracted hours, 50% focus time, and 24 assigned hours.
3. Confirm focus capacity is `20.0h` and status is `Overloaded`.
4. Reload the page and confirm the team member remains.
5. Remove the team member and reset the sample plan.

## Expected result

The planner reports 120% load for the test member and stores the plan only in the current browser.
