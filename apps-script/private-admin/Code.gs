/** Install ONLY in a separate, Google-account-restricted Apps Script project. */
const ADMIN_HEADERS = ['Enquiry ID','Submitted At','Name','Phone','Email','Service','Message','Status','Internal Notes','Updated At','Updated By','Request ID','Submission Fingerprint'];
const STATUSES = ['New','Pending','In Progress','Completed','Rejected'];

function authorize_() {
  const active = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  const effective = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  const allowed = (PropertiesService.getScriptProperties().getProperty('RCC_ADMIN_EMAILS') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  // Never fall back to effective user: that would authenticate the deployer for visitors.
  if (!active || active !== effective || allowed.indexOf(active) === -1) throw new Error('Access denied. Sign in with an authorised RCC Google account.');
  return active;
}
function doGet() {
  try {
    authorize_();
    return HtmlService.createHtmlOutputFromFile('Dashboard').setTitle('RCC | Enquiry workspace');
  } catch (err) {
    return HtmlService.createHtmlOutput('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RCC | Access denied</title><body style="font:16px Arial;padding:48px;color:#142c3b"><h1>Access denied</h1><p>Open this dashboard with your authorised RCC Google account.</p><p>If access is still denied, ask the owner to review the account allowlist and deployment settings.</p></body></html>');
  }
}
function adminList(options) {
  const email = authorize_();
  const all = records_();
  const filters = normalizeFilters_(options);
  const filtered = filterRecords_(all,filters);
  const pages = Math.max(1,Math.ceil(filtered.length/filters.pageSize));
  const page = Math.min(filters.page,pages);
  const summary = {total:all.length,new:0,pending:0,inProgress:0,completed:0,recent:0,rejected:0};
  const keys = {'New':'new','Pending':'pending','In Progress':'inProgress','Completed':'completed','Rejected':'rejected'};
  all.forEach(r => { if (keys[r.status]) summary[keys[r.status]]++; if (r.timestamp >= Date.now()-7*86400000 && r.timestamp <= Date.now()) summary.recent++; });
  return {email:email,summary:summary,services:Array.from(new Set(all.map(r => r.service))).sort(),records:filtered.slice((page-1)*filters.pageSize,page*filters.pageSize),total:filtered.length,page:page,pages:pages,refreshedAt:new Date().toISOString()};
}
function adminGet(id) {
  authorize_();
  const record = records_().find(r => r.id === String(id));
  if (!record) throw new Error('Enquiry not found. Refresh the list.');
  return record;
}
function adminUpdate(input) {
  const email = authorize_();
  if (!input || STATUSES.indexOf(input.status) === -1) throw new Error('Select a valid status.');
  const notes = String(input.notes || '').trim();
  if (notes.length > 4000) throw new Error('Keep internal notes under 4,000 characters.');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sheet = sheet_();
    const records = records_(sheet);
    const record = records.find(r => r.id === String(input.id));
    if (!record) throw new Error('Enquiry not found. Refresh the list.');
    if (!input.version || input.version !== record.version) throw new Error('This enquiry changed since you opened it. Close and reopen it before saving.');
    // Update only management fields; never replace intake data or append a duplicate.
    const row = record.sheetRow;
    sheet.getRange(row,8,1,4).setValues([[input.status,safeCell_(notes),new Date(),email]]);
    SpreadsheetApp.flush();
    return {ok:true,message:'Changes saved.'};
  } finally { lock.releaseLock(); }
}
function adminExport(options) {
  authorize_();
  const rows = filterRecords_(records_(),normalizeFilters_(options));
  const headers = ['Enquiry ID','Submitted At (IST)','Name','Phone','Email','Service','Message','Status','Internal Notes','Updated At (IST)','Updated By'];
  const data = rows.map(r => [r.id,formatDate_(r.submittedAt),r.name,r.phone,r.email,r.service,r.message,r.status,r.notes,formatDate_(r.updatedAt),r.updatedBy]);
  const csv = '\uFEFF'+[headers].concat(data).map(row => row.map(csvCell_).join(',')).join('\r\n');
  return {filename:'RCC-enquiries-'+Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd')+'.csv',csv:csv,count:rows.length};
}
function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('RCC_SPREADSHEET_ID');
  if (!id) throw new Error('Dashboard is not configured. Ask the owner to set the spreadsheet property.');
  let sheet;
  try { sheet = SpreadsheetApp.openById(id).getSheetByName('Enquiries'); } catch (err) { throw new Error('The authorised account cannot access the enquiry spreadsheet.'); }
  if (!sheet) throw new Error('Enquiries tab is missing.');
  const headers = sheet.getRange(1,1,1,ADMIN_HEADERS.length).getValues()[0];
  if (ADMIN_HEADERS.some((h,i) => headers[i] !== h)) throw new Error('Sheet headings do not match. Run the public receiver setup migration first.');
  return sheet;
}
function records_(existingSheet) {
  const sheet = existingSheet || sheet_();
  const last = sheet.getLastRow();
  // Explicit capacity limit, rather than silently dropping records from exports.
  if (last > 20001) throw new Error('More than 20,000 enquiries. Review archiving or indexed retrieval with the owner before continuing.');
  if (last < 2) return [];
  return sheet.getRange(2,1,last-1,13).getValues().map((row,i) => {
    const date = dateString_(row[1]);
    return {id:text_(row[0]),submittedAt:date,timestamp:date ? new Date(date).getTime() : 0,name:text_(row[2]),phone:text_(row[3]),email:text_(row[4]),service:text_(row[5]),message:text_(row[6]),status:text_(row[7]) || 'New',notes:text_(row[8]),updatedAt:dateString_(row[9]),updatedBy:text_(row[10]),sheetRow:i+2,version:Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(row.slice(7,11))))};
  }).filter(r => r.id);
}
function normalizeFilters_(input) {
  const o = input || {};
  const from = String(o.from || ''), to = String(o.to || '');
  [from,to].forEach(v => { if (v && (!/^\d{4}-\d{2}-\d{2}$/.test(v) || isNaN(Date.parse(v)) || new Date(v).toISOString().slice(0,10) !== v)) throw new Error('Use valid dates.'); });
  if (from && to && from > to) throw new Error('The start date must be on or before the end date.');
  if (o.status && STATUSES.indexOf(o.status) === -1) throw new Error('Select a valid status filter.');
  return {query:String(o.query || '').trim().toLowerCase().slice(0,120),service:String(o.service || '').slice(0,180),status:String(o.status || ''),from:from,to:to,sort:o.sort === 'oldest' ? 'oldest' : 'newest',page:Math.max(1,Math.floor(Number(o.page)||1)),pageSize:[10,25,50].indexOf(Number(o.pageSize)) !== -1 ? Number(o.pageSize) : 10};
}
function filterRecords_(rows,f) {
  const from = f.from ? new Date(f.from+'T00:00:00+05:30').getTime() : -Infinity;
  const to = f.to ? new Date(f.to+'T23:59:59.999+05:30').getTime() : Infinity;
  return rows.filter(r => (!f.query || [r.id,r.name,r.phone,r.email,r.service,r.message,r.notes].join(' ').toLowerCase().includes(f.query)) && (!f.service || r.service === f.service) && (!f.status || r.status === f.status) && r.timestamp >= from && r.timestamp <= to).sort((a,b) => (f.sort === 'oldest' ? a.timestamp-b.timestamp : b.timestamp-a.timestamp) || a.id.localeCompare(b.id));
}
function text_(value) { return String(value == null ? '' : value); }
function dateString_(value) { if (!value) return ''; const d = new Date(value); return isNaN(d.getTime()) ? '' : d.toISOString(); }
function formatDate_(value) { return value ? Utilities.formatDate(new Date(value),'Asia/Kolkata','yyyy-MM-dd HH:mm:ss') : ''; }
function safeCell_(value) { return /^[\s\uFEFF]*[=+@\-]/.test(String(value)) ? "'"+value : value; }
function csvCell_(value) { return '"'+safeCell_(String(value).replace(/\u0000/g,'')).replace(/"/g,'""')+'"'; }
