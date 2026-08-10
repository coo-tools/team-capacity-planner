export function availableHours(member) {
  const contracted = Math.max(0, Number(member.contractedHours) || 0);
  const focus = Math.min(100, Math.max(0, Number(member.focusPercent) || 0));
  return contracted * (focus / 100);
}

export function loadRatio(member) {
  const available = availableHours(member);
  const assigned = Math.max(0, Number(member.assignedHours) || 0);
  if (available === 0) return assigned > 0 ? Infinity : 0;
  return assigned / available;
}

export function capacityStatus(member) {
  const ratio = loadRatio(member);
  if (ratio > 1) return "overloaded";
  if (ratio >= 0.85) return "near-limit";
  return "available";
}

export function summarizeCapacity(members) {
  const totalAvailable = members.reduce((sum, member) => sum + availableHours(member), 0);
  const totalAssigned = members.reduce((sum, member) => sum + Math.max(0, Number(member.assignedHours) || 0), 0);
  return {
    totalAvailable: Math.round(totalAvailable * 10) / 10,
    totalAssigned: Math.round(totalAssigned * 10) / 10,
    remaining: Math.round((totalAvailable - totalAssigned) * 10) / 10,
    utilization: totalAvailable ? Math.round((totalAssigned / totalAvailable) * 100) : 0,
    overloaded: members.filter((member) => capacityStatus(member) === "overloaded").length,
  };
}
