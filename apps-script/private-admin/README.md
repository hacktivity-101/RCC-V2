# RCC private admin

English-only Google Apps Script admin dashboard. Code.gs and Dashboard.html mirror the saved Apps Script project. The existing deployment was updated to version 3 using the same URL and account-restricted access.

Features: responsive layout, persistent light/dark appearance, clickable overview filters, last-seven-calendar-days preset in IST, optional 60-second auto-refresh, message/service/internal-note search, note character count, unsaved-change prompts and Ctrl/Cmd+Enter save.

The server still authorizes every call. Existing sheet columns, status values, CSV protection and optimistic update checks are retained. No customer records were changed during verification. Theme is the only preference stored by this dashboard; enquiry contents remain in page memory.

Original source is in backup/ for rollback. Keep this private admin project separate from the public website receiver. Do not put Apps Script HTML into GitHub Pages: it requires Google's authenticated script bridge.
