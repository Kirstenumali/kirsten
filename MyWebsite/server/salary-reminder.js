module.exports = function salaryReminder(data, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(part=>[part.type,part.value]));
  const month=parts.year+'-'+parts.month;
  const unpaid=data.workers.filter(worker=>!(data.payments || []).some(payment=>payment.workerId===worker.id && payment.month===month));
  if(Number(parts.day)<27 || !unpaid.length) return null;
  return {month,dueDate:month+'-28',unpaidCount:unpaid.length,message:'Transfer the salary now. '+(Number(parts.day)===27?'Salary is due tomorrow, on the 28th.':Number(parts.day)===28?'Salary is due today, the 28th.':'Salary was due on the 28th.')};
};
