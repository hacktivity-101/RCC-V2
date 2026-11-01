/* ============================================
   RenGrow Consulting — Articles & Blog
   Timeline-ordered knowledge posts
   ============================================ */

export const CATEGORY_COLORS = {
  Taxation: 'cat-tax',
  Compliance: 'cat-comp',
  Business: 'cat-biz',
  Financial: 'cat-fin',
  Trademark: 'cat-tm'
};

export const POSTS = [
  {
    id: 'gst-amnesty',
    date: '2026-02-18',
    dateLabel: '18 Feb 2026',
    category: 'Taxation',
    readTime: '5 min read',
    author: 'Priya Sharma',
    role: 'Head — Taxation & GST',
    icon: 'bi-receipt-cutoff',
    title: 'GST Return Filing in 2026: the due dates every business must track',
    excerpt:
      'GSTR-1, GSTR-3B, GSTR-9 and the new invoice-reporting window — a month-by-month calendar so you never pay a late fee again.',
    tags: ['GST Return Filing', 'GST Compliance', 'Late Fee'],
    body: [
      'Late fees under GST are small per day but compound quickly across GSTIN registrations and financial years. The most common reason our clients paid penalties before joining us was simply not knowing which return was due when.',
      'Monthly filers must submit GSTR-1 by the 11th and GSTR-3B by the 20th of the following month. QRMP scheme taxpayers file GSTR-1 quarterly by the 13th, while paying tax monthly through PMT-06 by the 25th. The annual return GSTR-9 and reconciliation statement GSTR-9C fall due on 31 December following the financial year.',
      'Practical tip: reconcile GSTR-2B with your purchase register before filing GSTR-3B, not after. Input tax credit that does not appear in 2B cannot be claimed, and chasing a supplier six months later is rarely successful.',
      'Our retainer clients are placed on a tracked compliance calendar with reminders issued seven days, three days and one day before every deadline — covering GST, TDS, advance tax and ROC filings together.'
    ]
  },
  {
    id: 'itr-regime',
    date: '2026-01-27',
    dateLabel: '27 Jan 2026',
    category: 'Taxation',
    readTime: '6 min read',
    author: 'Priya Sharma',
    role: 'Head — Taxation & GST',
    icon: 'bi-calculator',
    title: 'Old regime vs new regime: how to choose before you file your ITR',
    excerpt:
      'A simple break-even framework for salaried professionals and business owners deciding between the two income-tax regimes.',
    tags: ['ITR Filing', 'Tax Planning', 'Deductions'],
    body: [
      'The new regime offers lower slab rates but removes most deductions. The old regime keeps 80C, 80D, HRA and home-loan interest but taxes at higher rates. There is no universally better option — only a better option for your deduction profile.',
      'The practical test is simple: total up the deductions you genuinely claim each year. If that figure comfortably exceeds the break-even deduction level for your income band, the old regime usually wins. If you have few deductions, pay no rent and have no home loan, the new regime is normally cheaper and far simpler.',
      'Salaried taxpayers can switch regimes every year at the time of filing. Taxpayers with business or professional income have a far more restrictive switching rule, so the first-year choice matters significantly more.',
      'We run both computations side by side for every client before filing and share a one-page comparison, so the decision is based on your actual numbers rather than a general rule of thumb.'
    ]
  },
  {
    id: 'roc-calendar',
    date: '2025-12-09',
    dateLabel: '09 Dec 2025',
    category: 'Compliance',
    readTime: '4 min read',
    author: 'Sneha Kulkarni',
    role: 'Head — Compliance & Registrations',
    icon: 'bi-file-earmark-text',
    title: 'ROC annual compliance checklist for private limited companies',
    excerpt:
      'AOC-4, MGT-7A, DIR-3 KYC and board-meeting records — the filings that keep your company and its directors in good standing.',
    tags: ['ROC Compliance', 'Annual Filing', 'Director KYC'],
    body: [
      'Many founders assume that a dormant company has nothing to file. In reality, every registered company must complete its annual ROC filings regardless of turnover — including companies with zero revenue.',
      'The core annual set is AOC-4 for financial statements, MGT-7A for the annual return, DIR-3 KYC for every director holding a DIN, and ADT-1 where an auditor is appointed or reappointed. Minutes of at least four board meetings and one AGM must also be maintained.',
      'Additional filing penalties under the Companies Act accrue per day and are not capped in the way GST late fees are. Directors of companies that default for two consecutive years can also be disqualified from holding directorships.',
      'We maintain the statutory registers, prepare the board and AGM documentation and file the forms, so that compliance is handled as a routine annual package rather than a year-end emergency.'
    ]
  },
  {
    id: 'cma-loan',
    date: '2025-11-14',
    dateLabel: '14 Nov 2025',
    category: 'Business',
    readTime: '7 min read',
    author: 'Rohan Desai',
    role: 'Founder & Principal Consultant',
    icon: 'bi-bank',
    title: 'What makes a CMA data report bankable — a lender\u2019s view',
    excerpt:
      'Working-capital proposals are rejected for predictable reasons. Here is how we structure CMA data and project reports that get sanctioned.',
    tags: ['CMA Data', 'Project Report', 'Loan Documentation'],
    body: [
      'A CMA (Credit Monitoring Arrangement) report is the structured financial statement banks use to assess working-capital needs. It presents past performance, current position and projections in a format credit officers can compare across applicants.',
      'The most common reason for rejection is not weak numbers — it is internal inconsistency. Projected sales growth that does not match the production capacity, debtor days that suddenly improve without explanation, or projections that conflict with filed GST returns will all trigger queries.',
      'A strong report ties every projection back to a verifiable source: filed returns, purchase orders, capacity data and realistic industry margins. Assumptions should be stated explicitly rather than buried in a spreadsheet.',
      'We prepare CMA data, project reports and the complete documentation set, then walk the client through likely banker questions before the submission meeting.'
    ]
  },
  {
    id: 'trademark-objection',
    date: '2025-10-22',
    dateLabel: '22 Oct 2025',
    category: 'Trademark',
    readTime: '5 min read',
    author: 'Sneha Kulkarni',
    role: 'Head — Compliance & Registrations',
    icon: 'bi-shield-lock',
    title: 'Received a trademark objection? It is not a rejection',
    excerpt:
      'Examination reports under Sections 9 and 11 are routine. Understanding the ground of objection is what determines your reply strategy.',
    tags: ['Trademark Registration', 'Objection Reply', 'Brand Protection'],
    body: [
      'An examination report is the registry asking you to justify your application — not refusing it. A well-drafted reply within the 30-day window resolves a large share of objections without a hearing.',
      'Section 9 objections concern distinctiveness: the mark is seen as descriptive or generic. The reply typically argues inherent distinctiveness or demonstrates acquired distinctiveness through evidence of use — invoices, advertising, social proof and continuous usage dating.',
      'Section 11 objections concern similarity with an existing mark. Here the reply compares the marks visually, phonetically and conceptually, and distinguishes the goods, services, trade channels and consumer base.',
      'Running a comprehensive trademark search before filing remains the cheapest form of protection. It costs a fraction of an objection reply and avoids losing the filing fee on an unregistrable mark.'
    ]
  },
  {
    id: 'startup-registration',
    date: '2025-09-30',
    dateLabel: '30 Sep 2025',
    category: 'Business',
    readTime: '6 min read',
    author: 'Rohan Desai',
    role: 'Founder & Principal Consultant',
    icon: 'bi-building-add',
    title: 'Proprietorship, LLP or Private Limited? Choosing your structure',
    excerpt:
      'Liability, compliance cost, funding ability and tax treatment compared — so you register the right entity the first time.',
    tags: ['Company Registration', 'LLP Registration', 'Startup India'],
    body: [
      'A proprietorship is the fastest and cheapest to start, with minimal compliance. The trade-off is unlimited personal liability and the practical difficulty of raising external investment or even a sizeable business loan.',
      'An LLP separates personal and business liability with far lighter annual compliance than a company. It suits professional services firms and partnerships that do not plan to raise equity capital.',
      'A private limited company is the only structure institutional investors will fund. It offers limited liability, perpetual succession and clean share-transfer mechanics, in exchange for higher compliance: board meetings, ROC filings, audits and statutory registers.',
      'Our rule of thumb: if you intend to raise funding within two years, register a private limited company from the start. Converting later is possible but costs more in fees, time and lost momentum than registering correctly at the outset.'
    ]
  },
  {
    id: 'mis-reports',
    date: '2025-08-18',
    dateLabel: '18 Aug 2025',
    category: 'Financial',
    readTime: '5 min read',
    author: 'Vikram Iyer',
    role: 'Head — Audit & Accounts',
    icon: 'bi-bar-chart-line',
    title: 'Five MIS reports every MSME owner should review monthly',
    excerpt:
      'Bookkeeping that only produces a balance sheet once a year is a compliance exercise. These reports turn it into a management tool.',
    tags: ['MIS Reports', 'Bookkeeping', 'Cash Flow'],
    body: [
      'Start with a rolling 13-week cash-flow statement. Profit is an accounting outcome; cash is what pays salaries. A short-horizon weekly view gives enough warning to act on a shortfall.',
      'Next, an ageing analysis for debtors and creditors. Businesses rarely fail because of poor margins alone — they fail because receivables stretch while payables do not.',
      'Third, a gross-margin report by product, service line or customer. Most firms discover that a meaningful share of revenue is generated at a margin that does not cover its own overhead.',
      'Finally, a budget-versus-actual comparison and a simple break-even dashboard. Together these five reports take under an hour to review and change the quality of every operating decision for the month ahead.'
    ]
  },
  {
    id: 'fssai-iso',
    date: '2025-07-05',
    dateLabel: '05 Jul 2025',
    category: 'Compliance',
    readTime: '4 min read',
    author: 'Sneha Kulkarni',
    role: 'Head — Compliance & Registrations',
    icon: 'bi-patch-check',
    title: 'FSSAI, IEC and ISO: which licence does your business actually need?',
    excerpt:
      'A plain-language guide to the registrations that are legally mandatory versus the certifications that are commercially useful.',
    tags: ['FSSAI', 'IEC Code', 'ISO Certification'],
    body: [
      'FSSAI registration is mandatory for any business handling food — including cloud kitchens, home bakers, distributors and e-commerce sellers. The category (Basic, State or Central) depends on turnover and the scale of operations.',
      'An Import Export Code is mandatory the moment goods or services cross a border commercially. It is a one-time registration, but it now requires annual updating on the DGFT portal to remain active.',
      'ISO certification is voluntary. It is not a legal requirement, but it is frequently a tender prerequisite and a credibility signal in B2B procurement, so the commercial case is often strong even though the legal one does not exist.',
      'Shop and Establishment registration and local trade licences are state-specific and frequently overlooked by online-first businesses that still operate from a physical premises.'
    ]
  }
];
