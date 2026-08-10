import { availableHours, capacityStatus, loadRatio, summarizeCapacity } from "./src/core.js";

const STORAGE_KEY = "capacity-map-team-v1";
const sampleMembers = [
  { id:"alex", name:"Alex Morgan", role:"Operations", contractedHours:40, focusPercent:70, assignedHours:25 },
  { id:"sam", name:"Sam Rivera", role:"Customer Success", contractedHours:40, focusPercent:65, assignedHours:28 },
  { id:"jordan", name:"Jordan Lee", role:"Analytics", contractedHours:32, focusPercent:80, assignedHours:22 },
  { id:"casey", name:"Casey Patel", role:"Finance", contractedHours:20, focusPercent:75, assignedHours:10 },
];
let members = load();
const rows = document.querySelector("#memberRows");

function load(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||structuredClone(sampleMembers)}catch{return structuredClone(sampleMembers)}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(members))}
function escapeHtml(value){const node=document.createElement("span");node.textContent=value;return node.innerHTML}
function labelFor(status){return {available:"Available","near-limit":"Near limit",overloaded:"Overloaded"}[status]}

function render(){
  const totals=summarizeCapacity(members);
  document.querySelector("#utilization").textContent=`${totals.utilization}%`;
  document.querySelector("#teamMeter").style.width=`${Math.min(totals.utilization,100)}%`;
  document.querySelector("#summary").innerHTML=[
    [`${totals.totalAvailable}h`,"Focus capacity"],[`${totals.totalAssigned}h`,"Assigned work"],[`${totals.remaining}h`,totals.remaining>=0?"Unallocated":"Over capacity"],[totals.overloaded,"People overloaded"],
  ].map(([value,label])=>`<article><strong>${value}</strong><span>${label}</span></article>`).join("");
  rows.innerHTML=members.map((member)=>{
    const available=availableHours(member);const ratio=loadRatio(member);const status=capacityStatus(member);
    return `<tr><td class="name">${escapeHtml(member.name)}</td><td class="role">${escapeHtml(member.role)}</td><td>${available.toFixed(1)}h</td><td>${Number(member.assignedHours).toFixed(1)}h</td><td><div class="loadbar" title="${Math.round(ratio*100)}%"><i style="width:${Math.min(ratio*100,100)}%"></i></div></td><td><span class="badge ${status}">${labelFor(status)}</span></td><td><button class="remove" data-remove="${member.id}" aria-label="Remove ${escapeHtml(member.name)}">Remove</button></td></tr>`;
  }).join("");
}

document.querySelector("#memberForm").addEventListener("submit",(event)=>{
  event.preventDefault();const data=new FormData(event.currentTarget);
  members.push({id:crypto.randomUUID(),name:data.get("name").trim(),role:data.get("role").trim(),contractedHours:Number(data.get("contractedHours")),focusPercent:Number(data.get("focusPercent")),assignedHours:Number(data.get("assignedHours"))});
  save();render();event.currentTarget.reset();
});
rows.addEventListener("click",(event)=>{const id=event.target.dataset.remove;if(!id)return;members=members.filter((member)=>member.id!==id);save();render()});
document.querySelector("#resetButton").addEventListener("click",()=>{members=structuredClone(sampleMembers);save();render()});
render();
