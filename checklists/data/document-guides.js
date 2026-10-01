/* ==========================================================
   Document Guides — Content for hover/tap popovers
   Each key matches a data-doc attribute on a checklist item
   ========================================================== */

const documentGuides = {

    /* ==================== FILE INTAKE ==================== */
    "loan-application": {
        title: "Loan Application (1003)",
        lookFor: [
            "All sections completed — no blanks except refinance-specific items",
            "Borrower information matches photo ID exactly",
            "Present and previous address for last 2 years",
            "Employment history for last 2 years including gaps",
            "Monthly income broken out by type (base, OT, bonus, commission)",
            "All assets and liabilities listed",
            "Declarations section fully answered by all borrowers",
            "Signed and dated by all borrowers"
        ],
        redFlags: [
            "Missing signatures or dates",
            "Employment gaps not explained",
            "Income does not match supporting documents",
            "Self-employment box not checked when applicable",
            "Discrepancies between 1003 and credit report",
            "Borrower-only signature when co-borrower exists"
        ],
        crossCheck: ["Photo ID", "Credit Report", "Pay Stubs", "W-2s", "Bank Statements"],
        feedsInto: ["AUS submission", "LTV and DTI calculations"]
    },

    "photo-id": {
        title: "Photo ID — Government Issued",
        lookFor: [
            "Government-issued ID (driver's license, passport, state ID)",
            "Legible — full name clearly readable",
            "Not expired (some lenders allow expired by a grace period)",
            "Name matches 1003 and credit report",
            "Date of birth matches 1003",
            "Address matches current address on 1003"
        ],
        redFlags: [
            "Expired ID",
            "Name variations without supporting documentation",
            "Address mismatch without LOX",
            "Blurry or illegible copy",
            "Missing pages for passports (need both photo page and address page)"
        ],
        crossCheck: ["1003", "Credit Report", "SSN Verification", "W-2s"],
        feedsInto: ["Identity verification", "Borrower data integrity"]
    },

    "ssn-verification": {
        title: "SSN Verification (SSA-89 or Card)",
        lookFor: [
            "Executed Form SSA-89 OR clear copy of Social Security card",
            "SSN matches credit report",
            "SSN matches pay stubs and W-2s",
            "SSN matches any other documents in file"
        ],
        redFlags: [
            "SSN discrepancy across documents",
            "SSA-89 not fully completed or unsigned",
            "Card shows signs of alteration"
        ],
        crossCheck: ["1003", "Credit Report", "W-2s", "Pay Stubs"],
        feedsInto: ["Identity verification", "Credit report accuracy"]
    },

    /* ==================== INITIAL REVIEW ==================== */
    "credit-report": {
        title: "Tri-Merge Credit Report",
        lookFor: [
            "Dated within 120 days of note date",
            "Three repositories present: TransUnion, Experian, Equifax",
            "At least one score for each borrower",
            "Applicant names match photo ID",
            "Address matches current address",
            "SSN matches SSA-89 or card",
            "All trade lines reviewed and match 1003",
            "No undisclosed debts or liabilities"
        ],
        redFlags: [
            "Report older than 120 days",
            "Missing repositories",
            "AKAs or address variations within 24 months",
            "Inquiries within 90 days",
            "Undisclosed mortgage or rent payments",
            "Collections, judgments, or tax liens",
            "Late payments within 24 months (check overlays)",
            "Frozen credit in one or more bureaus"
        ],
        crossCheck: ["1003", "Photo ID", "SSN Verification", "LOXs"],
        feedsInto: ["Credit score determination", "DTI calculation", "AUS submission"]
    },

    "1008": {
        title: "1008 — Underwriting Transmittal",
        lookFor: [
            "Borrower name(s) match 1003",
            "Property address complete and correct",
            "Property type (1-unit, PUD, condo)",
            "Sales price or appraised value",
            "Loan program (Conv, FHA, VA, USDA)",
            "Loan purpose (Purchase, Refi, Cash-Out)",
            "Total monthly income for all borrowers",
            "Proposed PITIA and monthly obligations",
            "Front-end and back-end ratios",
            "LTV, CLTV, HLTV",
            "Underwriter name and date"
        ],
        redFlags: [
            "Ratio inconsistencies vs. AUS findings",
            "Sales price mismatch with contract",
            "Income mismatch with 1003 or docs",
            "Missing MI indicator when LTV >80%"
        ],
        crossCheck: ["1003", "AUS Findings", "Sales Contract", "Appraisal"],
        feedsInto: ["Underwriter review", "Loan file organization"]
    },

    /* ==================== INCOME VERIFICATION ==================== */
    "pay-stub": {
        title: "Pay Stubs — 30 Days Coverage",
        lookFor: [
            "Employee name matches ID",
            "Company name and address present",
            "Full pay period dates covering 30 days",
            "YTD earnings included",
            "Deductions shown (proves W-2 status)",
            "Direct deposit notice matches bank statement",
            "Hours, rate, and gross pay reconcile"
        ],
        redFlags: [
            "Handwritten or altered amounts",
            "Missing YTD column",
            "Round/even numbers on every deduction",
            "Pay stub older than 30 days",
            "Deductions don't add up to gross-to-net difference",
            "No company name or address",
            "Consecutive pay stubs don't cover a full month"
        ],
        crossCheck: ["Bank Statement", "W-2", "VOE", "1003"],
        feedsInto: ["Base pay calculation", "Variable hours averaging", "Bonus/OT/commission calc"]
    },

    "w2": {
        title: "W-2 — Wage and Tax Statement",
        lookFor: [
            "Employer name and EIN present",
            "Employee SSN matches file",
            "Employee name matches ID",
            "Correct tax year (typically last 2 years)",
            "All 4 copies (Federal, State, City, Employee)",
            "Box 1 (Wages) and Box 5 (Medicare) both shown",
            "Consistent with pay stub YTD"
        ],
        redFlags: [
            "Altered fonts or formatting",
            "Missing boxes",
            "YTD doesn't match pay stub",
            "Mismatched wages between years without explanation",
            "W-2 vs. tax return discrepancy"
        ],
        crossCheck: ["Pay Stubs", "Tax Returns", "VOE", "1003"],
        feedsInto: ["Prior year income for averaging", "Income stability analysis"]
    },

    "voe-written": {
        title: "Verification of Employment (Written)",
        lookFor: [
            "Company name, address, phone present",
            "Employer completed all applicable fields",
            "Base pay, OT, bonus, commission broken out",
            "Start date and YTD earnings shown",
            "Signed and dated by employer representative",
            "Borrower authorization attached",
            "Fully completed — no blank fields (N/A where needed)"
        ],
        redFlags: [
            "Blanks left in critical fields",
            "Missing signature or date",
            "VOE numbers don't match pay stubs",
            "No breakdown of income types",
            "Employer signature stamp (some lenders don't allow)",
            "Borrower authorization missing"
        ],
        crossCheck: ["Pay Stubs", "W-2s", "1003", "Bank Statement"],
        feedsInto: ["Income qualifying analysis", "Employment verification"]
    },

    "verbal-voe": {
        title: "Verbal VOE — Within 10 Days of Closing",
        lookFor: [
            "Completed within 10 business days of note date",
            "Called directly to employer's HR or authorized rep",
            "Confirmed borrower still employed",
            "Confirmed position and start date",
            "Documented date, time, contact name, and phone number",
            "Signed by the processor who performed the VOE"
        ],
        redFlags: [
            "VOE performed too early (outside 10-day window)",
            "Unable to reach employer",
            "Employment ended since application",
            "Borrower no longer in the position"
        ],
        crossCheck: ["Written VOE", "Pay Stubs", "1003"],
        feedsInto: ["Final employment verification", "Clear-to-close condition"]
    },

    "tax-returns": {
        title: "Tax Returns — Personal (1040)",
        lookFor: [
            "Most recent 1 or 2 years (per AUS findings)",
            "All schedules attached (Schedule C, E, etc.)",
            "Signed and dated by borrower",
            "IRS transcript matching returns if required",
            "Consistent with W-2s and other income docs",
            "YTD current year income trending",
            "Any K-1s attached when applicable"
        ],
        redFlags: [
            "Missing schedules",
            "Unsigned returns",
            "Tax transcript does not match return",
            "Declining income trend without explanation",
            "K-1s missing for partnerships or S-corps",
            "Losses on schedule C with positive income claimed elsewhere"
        ],
        crossCheck: ["W-2s", "K-1s", "Business Tax Returns", "VOE"],
        feedsInto: ["Self-employment income", "Income averaging", "1084/1088 analysis"]
    },

    "award-letter": {
        title: "Award Letter — SS, Pension, Retirement",
        lookFor: [
            "Official letter from issuing organization",
            "Borrower name matches ID",
            "Monthly benefit amount clearly stated",
            "Start date of benefits",
            "Continuance of benefit indicated",
            "SSN or claim number shown",
            "Dated within last 12 months"
        ],
        redFlags: [
            "Benefit amount doesn't match bank deposit",
            "Letter older than 12 months",
            "Continuance not stated",
            "Non-taxable portion not documented (for gross-up)",
            "Benefit ends within 3 years (for SS or family benefit)"
        ],
        crossCheck: ["Bank Statements", "Tax Returns", "1003"],
        feedsInto: ["Non-employment income", "Social Security gross-up", "Retirement income"]
    },

    /* ==================== ASSET VERIFICATION ==================== */
    "bank-statement": {
        title: "Bank Statements — 2 Months",
        lookFor: [
            "All pages present (page X of Y)",
            "Account holder name matches borrower",
            "Statement period covers 2 full months",
            "Beginning and ending balances shown",
            "All transactions legible",
            "Payroll deposits match pay stubs",
            "Large deposits identified and sourced",
            "No unexplained or recurring outflows"
        ],
        redFlags: [
            "Missing pages",
            "Altered fonts or formatting",
            "Large unverified deposits (over 50% of monthly income)",
            "NSF fees — multiple or recurring",
            "Recurring payments not on credit report (undisclosed debt)",
            "Balance doesn't reconcile with deposits/withdrawals",
            "Transfers from outside accounts without statements",
            "Earnest money check not shown as cleared"
        ],
        crossCheck: ["Pay Stubs", "VOD", "Gift Letter", "1003", "Sales Contract"],
        feedsInto: ["Large deposit test", "Funds to close", "Reserves"]
    },

    "gift-letter": {
        title: "Gift Letter",
        lookFor: [
            "Donor name and relationship to borrower",
            "Gift amount stated",
            "Borrower name as recipient",
            "Subject property address",
            "Donor's source of funds",
            "Signed and dated by donor",
            "Signed and dated by borrower(s)",
            "Evidence of donor's ability to provide funds",
            "Evidence of transfer to borrower (or received in escrow)"
        ],
        redFlags: [
            "Cousins, aunts, uncles, or non-immediate family donors (ineligible for most programs)",
            "No evidence of donor funds",
            "Gift funds not deposited or not sourced",
            "Donor is a real estate agent or interested party",
            "Signed by only one borrower when there are two"
        ],
        crossCheck: ["Bank Statement", "1003 Asset Section", "Sales Contract"],
        feedsInto: ["Funds to close", "Reserves"]
    },

    "vod": {
        title: "Verification of Deposit (VOD)",
        lookFor: [
            "Bank name and address",
            "Account holder name matches borrower",
            "Account type (checking, savings, money market)",
            "Current balance and average for 2 months",
            "Signed and dated by bank representative",
            "All sections completed — no blanks",
            "Borrower authorization attached"
        ],
        redFlags: [
            "Missing bank signature",
            "Blanks in critical fields",
            "Balance inconsistent with bank statements",
            "Older than 120 days",
            "Borrower authorization missing",
            "Average balance much lower than current (large recent deposit)"
        ],
        crossCheck: ["Bank Statements", "1003 Asset Section"],
        feedsInto: ["Asset verification", "Funds to close", "Reserves"]
    },

    /* ==================== CREDIT & LIABILITIES ==================== */
    "lox-inquiries": {
        title: "Letter of Explanation — Credit Inquiries",
        lookFor: [
            "Signed and dated by borrower",
            "Addresses every inquiry within 90 days",
            "Explains purpose of each inquiry",
            "States whether new debt was obtained",
            "For mortgage inquiries: explicitly states 'shopping, no new debt obtained'"
        ],
        redFlags: [
            "Vague explanations ('shopping around')",
            "Missing inquiries",
            "No signature or date",
            "New debt opened but not disclosed"
        ],
        crossCheck: ["Credit Report", "1003 Liability Section"],
        feedsInto: ["Credit risk analysis", "DTI calculation"]
    },

    "lox-address": {
        title: "Letter of Explanation — Address Variations",
        lookFor: [
            "Signed and dated by borrower",
            "Lists every address variation within 24 months",
            "Explains reason for each address (moved, school, etc.)",
            "Consistent with 1003 address history"
        ],
        redFlags: [
            "Missing addresses",
            "Unexplained variations",
            "Address not matching 1003 residence history",
            "Unsigned or undated"
        ],
        crossCheck: ["Credit Report", "1003 Residence Section"],
        feedsInto: ["Identity verification", "Fraud prevention"]
    },

    "lox-aka": {
        title: "Letter of Explanation — AKA Variations",
        lookFor: [
            "Signed and dated by borrower",
            "Lists every AKA from credit report",
            "Explains origin of each name (maiden, previous marriage, typo)",
            "Consistent with supporting documents (marriage certificate, etc.)"
        ],
        redFlags: [
            "Missing AKAs",
            "Unexplained variations",
            "Variations not supported by legal documentation"
        ],
        crossCheck: ["Credit Report", "Photo ID", "Marriage Certificate"],
        feedsInto: ["Identity verification", "Fraud prevention"]
    },

    /* ==================== PROPERTY & TITLE ==================== */
    "sales-contract": {
        title: "Sales Contract — Purchase Agreement",
        lookFor: [
            "All pages present and initialed",
            "Borrower names match 1003",
            "Seller names match title commitment",
            "Full property address matches appraisal and title",
            "Sales price matches 1003 and 1008",
            "Earnest money amount and holder stated",
            "Closing date and possession terms",
            "All addendums attached (per checkboxes)",
            "Signed and dated by buyer and seller",
            "FHA: Page 9 of 10 with realtor license numbers"
        ],
        redFlags: [
            "Missing pages or addendums",
            "Expired closing date without amendment",
            "Seller not matching title",
            "Unsigned pages",
            "Sales price discrepancy with 1008 or 1003",
            "Unusual special provisions",
            "Seller credits exceed program limits"
        ],
        crossCheck: ["Title Commitment", "Appraisal", "1003", "1008"],
        feedsInto: ["LTV calculation", "Cash to close", "Purchase transaction"]
    },

    "appraisal": {
        title: "Appraisal Report",
        lookFor: [
            "Property address matches sales contract",
            "Borrower name and current owner match",
            "Legal description matches title",
            "As-is value stated and reasonable",
            "Comparable sales within mileage for area type",
            "All utilities on and functioning",
            "FHA: head-and-shoulders attic inspection",
            "FHA case number on each page (for FHA loans)",
            "Appraiser license not expired",
            "Photos support bed/bath/square footage count"
        ],
        redFlags: [
            "Appraiser license expired",
            "Subject-to repairs without final inspection",
            "Utilities not functioning",
            "Declining neighborhood",
            "Bed/bath/square footage discrepancies",
            "Comparables outside acceptable distance or age",
            "Prior sale within FHA 90-day rule without exception",
            "Value doesn't support sales price"
        ],
        crossCheck: ["Sales Contract", "Title Commitment", "1003", "1008"],
        feedsInto: ["LTV, CLTV, HCLTV", "MI requirements", "Property acceptability"]
    },

    "title-commitment": {
        title: "Title Commitment",
        lookFor: [
            "Effective date within 60–90 days of closing",
            "Owner matches seller on sales contract",
            "Legal description matches sales contract and appraisal",
            "Policy amounts match first and second liens",
            "Schedule B exceptions reviewed",
            "Schedule C liens identified",
            "Any judgments, tax liens, or mortgages disclosed"
        ],
        redFlags: [
            "Unknown liens or judgments",
            "Mismatched legal description",
            "Missing vesting information",
            "Unsatisfied prior mortgage",
            "Tax liens present",
            "Effective date too old"
        ],
        crossCheck: ["Sales Contract", "Appraisal", "Credit Report"],
        feedsInto: ["Closing prep", "Cash to close", "Payoff amounts"]
    },

    /* ==================== DISCLOSURES & COMPLIANCE ==================== */
    "loan-estimate": {
        title: "Loan Estimate (LE)",
        lookFor: [
            "Dated within 3 business days of application",
            "Loan amount, interest rate, monthly P&I correct",
            "All fees disclosed (A through J)",
            "FHA: upfront MIP and monthly MI shown",
            "Lender credits shown if applicable",
            "Confirm receipt signed by borrower(s)",
            "Intent to Proceed executed before collecting fees"
        ],
        redFlags: [
            "Fees missing from correct buckets",
            "Rounding errors",
            "LE not dated within 3 business days",
            "FHA upfront MIP missing",
            "Intent to
