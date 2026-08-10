# Capacity Map — Team Capacity Planner

A practical weekly capacity planner that separates contracted time from realistic focus time. It helps small teams spot overload before work is committed.

## Features

- Converts weekly hours and focus percentage into usable capacity
- Tracks assigned work by team member
- Flags available, near-limit, and overloaded team members
- Summarizes total capacity, assigned work, and remaining hours
- Stores the plan locally in the browser
- Unit-tested calculation logic

## Run locally

Serve the folder with any static web server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Tests

```bash
npm test
```

## Operating principle

Calendar hours are not delivery capacity. The focus-time adjustment makes meetings, administration, and normal interruptions visible in the plan.

## License

MIT
