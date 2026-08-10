import test from "node:test";
import assert from "node:assert/strict";
import { availableHours, loadRatio, capacityStatus, summarizeCapacity, capacityCsv } from "../src/core.js";

test("available hours account for focus time", () => {
  assert.equal(availableHours({ contractedHours: 40, focusPercent: 75 }), 30);
});

test("member load and capacity status are calculated consistently", () => {
  const member = { contractedHours: 40, focusPercent: 80, assignedHours: 30 };
  assert.equal(loadRatio(member), 0.9375);
  assert.equal(capacityStatus(member), "near-limit");
});

test("over-allocation is flagged", () => {
  assert.equal(capacityStatus({ contractedHours: 40, focusPercent: 50, assignedHours: 24 }), "overloaded");
});

test("team summary includes remaining capacity", () => {
  const summary = summarizeCapacity([
    { contractedHours: 40, focusPercent: 75, assignedHours: 24 },
    { contractedHours: 20, focusPercent: 100, assignedHours: 16 },
  ]);
  assert.deepEqual(summary, { totalAvailable: 50, totalAssigned: 40, remaining: 10, utilization: 80, overloaded: 0 });
});

test("CSV export includes calculated capacity, load, and status", () => {
  const csv = capacityCsv([
    { name: "Taylor", role: "Operations", contractedHours: 40, focusPercent: 50, assignedHours: 24 },
  ]);
  assert.match(csv, /"Taylor","Operations","40","50","20.0","24.0","120","overloaded"/);
});

test("CSV export safely escapes names and handles an empty plan", () => {
  const csv = capacityCsv([
    { name: 'Morgan "Mo"', role: "Ops, Finance", contractedHours: 0, focusPercent: 0, assignedHours: 0 },
  ]);
  assert.match(csv, /"Morgan ""Mo""","Ops, Finance"/);
  assert.equal(capacityCsv([]).split("\n").length, 1);
});
