// Content for the showcase, taken from the BreachWatch AI specification.
// Written plain-English first; `tech` fields are only shown when "Technical detail" is switched on.
// Deliberately contains no real procedure deadline hours: in the real system they are only read from the PDFs.

export const SNAPSHOT_AT_UTC = '2026-03-14T01:40:00Z' // the snapshot shown in the spec's dashboard screenshots

export const HUBS = [
  { name: 'Bengaluru', code: 'BLR', tz: 'Asia/Kolkata' },
  { name: 'Lisbon', code: 'LIS', tz: 'Europe/Lisbon' },
  { name: 'Warsaw', code: 'WAW', tz: 'Europe/Warsaw' },
  { name: 'Tallinn', code: 'TLL', tz: 'Europe/Tallinn' },
]

export const GLOSSARY = {
  incident: { term: 'Incident', def: 'Something that has harmed, or may have harmed, a system or the data in it. Example: a customer database left open to the internet.' },
  campaign: { term: 'Campaign', def: 'Several incidents that are really one attack. We add up the customers across all of them, because together they can be big enough to report even when each one alone is not.' },
  snapshot: { term: 'Snapshot time', def: 'The fixed moment the incident list was exported. Every "hours left" figure is counted from this moment, not from the clock on your computer, so everyone sees the same numbers every day.' },
  boundary: { term: 'Maths by code, words by AI', def: 'All numbers (risk, deadlines, totals, hours) are worked out by ordinary code and trained models. The AI only receives the finished numbers and writes the explanation. It never calculates anything.' },
  awareness: { term: 'Awareness (confirmation)', def: 'The moment an analyst confirms the incident is real. Some deadlines start counting from here. If nobody has confirmed it yet, those deadlines have not started.' },
  firstAlert: { term: 'First alert', def: 'The moment any of our tools first noticed something. It usually comes hours before confirmation, and some deadlines start counting from here, so they can be running before anyone has confirmed anything.' },
  milestone: { term: 'Milestone', def: 'One thing a law requires us to do, with its own time limit. Example: "send an initial report to the authority within N hours". Read from the law’s PDF.' },
  exemption: { term: 'Exemption', def: 'A situation where customers do not need to be told, for example if the leaked data was protected in a way the EU procedure says is safe. The system reads which situations count from the PDF and never guesses.' },
  gate: { term: 'The human sign-off', def: 'The point where the system stops and waits for the Data Protection Officer. Nothing is sent to an authority or a customer until a person decides. The pause is saved, so it survives a restart.' },
  reserve: { term: 'Filing buffer', def: 'A few hours kept aside for writing and sending the report. Time available = time to the earliest deadline minus this buffer.' },
  enumeration: { term: 'Same answer for everyone', def: 'If a communications agent asks about an incident that hasn’t been made public, they get the same refusal whether it exists or not. Asking can’t reveal that something is being kept quiet.' },
  dpo: { term: 'Data Protection Officer (DPO)', def: 'The person responsible for data-protection law at the company. In BreachWatch, the only person allowed to decide whether to notify a regulator or customers.' },
}

export const STORY = [
  { n: '01', title: 'A big online marketplace', text: 'Merrowfield Digital runs an online marketplace with about 9 million customers and 60,000 sellers across Europe and India.' },
  { n: '02', title: 'A security team that never sleeps', text: 'Security teams in four cities (Bengaluru, Lisbon, Warsaw and Tallinn) watch for problems around the clock. Each records times in its own local time zone.' },
  { n: '03', title: 'Most alarms are nothing', text: 'A blocked login, a harmless scan. But a few are real: a database left open, passwords stolen by a fake login page, a laptop left in a taxi, a spreadsheet emailed to the wrong person.' },
  { n: '04', title: 'The law sets a stopwatch', text: 'When something real happens, the law says certain authorities must be told within a time limit. There are three different rulebooks, each with its own authority and its own time limits, starting from different moments.' },
  { n: '05', title: 'Two ways to get it wrong', text: 'Report too late and the company has broken the law on the record. Report when there was no need and three authorities hear about something that never affected a customer.' },
  { n: '06', title: 'Too much work, too few people', text: 'There are more alerts than analysts. The most urgent incident doesn’t always reach the decision-maker first, and the deadline everyone remembers is often not the one that is due first.' },
]

export const WALKTHROUGH = [
  { t: 'An alarm goes off', who: 'Monitoring tool', text: 'A security tool flags unusual logins on the seller portal. This moment is the "first alert". Any deadline that counts from the first alert starts ticking now.', tech: 'first_alert_at is recorded in the hub’s own time zone, e.g. 2026-03-12T11:40:00+02:00.' },
  { t: 'An analyst confirms it’s real', who: 'Security Analyst', text: 'An analyst checks and confirms that seller passwords were stolen through a fake login page. This is the moment of "awareness". Deadlines that count from awareness start now.', tech: 'confirmed_at = config.AWARENESS_COLUMN. Before this, awareness clocks have clock_started = false.' },
  { t: 'BreachWatch gathers the facts', who: 'Computer, no AI', text: 'It pulls the incident’s details: about 4,200 customers in Europe and India, passwords involved. A trained model rates the risk to those people as HIGH. Another model reads the analysts’ notes and agrees it is phishing.', tech: 'build_harm_facts → harm_probability + band; build_attack_facts → attack_type + agreement across all notes.' },
  { t: 'Which laws apply?', who: 'Computer, no AI', text: 'EU rule: yes (EU customers and high risk). India rule: yes (Indian customers). "Big incident" rule: this incident is part of an attack with three others, and together they cross the customer limit, so yes.', tech: 'select_applicable_procedures; customers counted across the campaign; significant_only_with_campaign = true.' },
  { t: 'When is each deadline?', who: 'Computer, no AI', text: 'For each law, it opens that law’s own PDF, reads the time limits from the text, and works out exactly when each one is due and how many hours are left. The earliest one is highlighted.', tech: 'read_procedure_deadlines (one PDF each) → compute_procedure_deadlines, measured from SNAPSHOT_AT_UTC.' },
  { t: 'Is there enough time?', who: 'Computer, no AI', text: 'A third model estimates how many analyst hours the work will take, with extra time added if the data is sensitive. It compares that with the time left before the earliest deadline, minus a small buffer for filing.', tech: 'estimate_containment_effort → compare_effort_with_deadline (hours_available = remaining − FILING_RESERVE_HOURS).' },
  { t: 'AI writes the briefing', who: '5 AI helpers', text: 'Five AI helpers each write one part: what to check, why the risk is high, how sure we are about the attack type, who must be told and by when, and a final summary with a recommendation. They use only the facts above.', tech: 'Five agents, one language model call each. Stored with status PENDING_DECISION.' },
  { t: 'A person decides', who: 'Data Protection Officer', text: 'Everything stops here. The DPO reads the briefing and chooses: just record it, tell the regulator, or tell the regulator and the customers. They must write a reason in their own words.', tech: 'LangGraph interrupt; state saved in checkpoint.db; resumed by POST /incidents/{id}/decision.' },
  { t: 'The documents are drafted and logged', who: 'AI + computer', text: 'If customers are to be told, the AI drafts the customer notice first, then the regulator report, which says customers were told. Every step, decision and AI call is saved for auditors.', tech: 'draft_customer_notice → draft_regulator_filing → record_incident_outcome. Final report due date set from the filing moment.' },
]

export const PROCEDURES = [
  {
    code: 'PROCEDURE_EU_PERSONAL_DATA_BREACH', short: 'Rulebook 1', title: 'EU personal data breach', tag: 'GDPR', authority: 'The EU data-protection regulator (lead supervisory authority)',
    doc: 'Procedure-01-EU-Personal-Data-Breach.pdf', color: 'cyan',
    plain: 'Applies when personal data of people in the EU was involved and our risk model says the risk to them is serious enough.',
    applies: ['personal_data_involved_flag = Yes', 'eu_data_subjects_count ≥ 1', 'harm_band ∈ EU_PROCEDURE_HARM_BANDS'],
    extra: 'This rulebook also decides whether customers themselves must be told.',
  },
  {
    code: 'PROCEDURE_SIGNIFICANT_INCIDENT', short: 'Rulebook 2', title: 'Significant ("big") incident', tag: 'NIS2-style', authority: 'The national cyber-security team (CSIRT)',
    doc: 'Procedure-02-Significant-Incident-Reporting.pdf', color: 'amber',
    plain: 'Applies when the incident is big: a long outage, many customers affected (counting the whole attack), or a large money loss.',
    applies: ['outage > SIGNIFICANT_OUTAGE_MINUTES', 'or campaign customers > SIGNIFICANT_CUSTOMERS_ACROSS_CAMPAIGN', 'or direct loss > SIGNIFICANT_DIRECT_LOSS_EUR'],
    extra: 'After the first report, a final report is due some months later.',
  },
  {
    code: 'PROCEDURE_INDIA_CYBER_INCIDENT', short: 'Rulebook 3', title: 'India cyber incident', tag: 'CERT-In', authority: 'CERT-In, India’s national cyber agency',
    doc: 'Procedure-03-India-Cyber-Incident-Reporting.pdf', color: 'violet',
    plain: 'Applies when the affected system is hosted in India, or any Indian person’s data was involved.',
    applies: ['hosting_region ∈ INDIA_HOSTING_REGIONS', 'or india_data_subjects_count ≥ 1'],
    extra: 'In the sample data, this is often the deadline that falls due first.',
  },
]

export const DEFECTS = [
  { name: 'Same name typed differently', before: '" Bengaluru"  ·  "WARSAW "  ·  "seller portal"', after: 'Bengaluru · Warsaw · Seller portal', cfg: 'HUB_MAPPING, SYSTEM_CLASS_MAPPING' },
  { name: 'Spelling varies by person', before: '"phishing & credential compromise"', after: 'Phishing and credential compromise', cfg: 'ATTACK_TYPE_MAPPING' },
  { name: '"Empty" written many ways', before: '"-"  ·  "none"  ·  "?"  ·  "N/A"  ·  "Not recorded"', after: '(blank)', cfg: 'NULL_TOKEN_LIST' },
  { name: 'Times written 4 ways, in 4 time zones', before: '"2025-08-24T07:46:00Z"  ·  "21-Jul-2024 08:37 IST"  ·  "1746610260"', after: 'One standard time (UTC)', cfg: 'TIMESTAMP_FORMAT_LIST, TIMEZONE_ABBREVIATION_OFFSETS' },
  { name: 'Dates written 3 ways', before: '"2025-04-18"  ·  "22/07/2025"  ·  "27-Oct-2025"', after: 'One date format', cfg: 'DATE_FORMAT_LIST' },
  { name: 'Numbers written in words', before: '"1,20,637"  ·  "1.11 lakh"  ·  "8.7k"', after: '120637  ·  111000  ·  8700', cfg: 'COUNT_SUFFIX_MULTIPLIERS' },
  { name: 'Money with currency signs', before: '"€105,114"  ·  "EUR 178495"', after: '105114  ·  178495', cfg: 'CURRENCY_MARKERS' },
  { name: 'Durations with units', before: '"2h 30m"  ·  "45 min"  ·  "6 h"', after: '150  ·  45  ·  360 minutes', cfg: 'HOURS_AND_MINUTES_PATTERN' },
  { name: 'Yes / No written many ways', before: '"Y"  ·  "TRUE"  ·  "1"  ·  "no"  ·  "0"', after: 'Yes  ·  No', cfg: 'BOOLEAN_TRUE_TOKENS' },
  { name: 'Leftover web code in notes', before: '"<span>Session token reused&nbsp;from…"', after: 'Session token reused from…', cfg: 'MARKUP_PATTERN, ENCODING_ARTIFACT_LIST' },
  { name: 'A time gap that doesn’t add up', before: 'Says 429 minutes, but the two times are 431 apart', after: 'Recalculated: 431', cfg: 'INCIDENT_INTERVAL_COLUMN' },
  { name: 'Confirmed before it was noticed', before: 'Confirmed at 09:00, first noticed at 11:00', after: 'Times put back in the right order', cfg: 'FIRST_ALERT_COLUMN, AWARENESS_COLUMN' },
  { name: 'Evidence counted where none was needed', before: 'Forensic image needed: No · Images taken: 3', after: 'Images taken: 0', cfg: 'FORENSIC_IMAGE_COUNT_COLUMN' },
  { name: 'Note length measured before cleanup', before: 'Length counted with the web code still inside', after: 'Re-measured on the clean text', cfg: 'NOTE_LENGTH_COLUMN' },
]

export const DATASETS = [
  { name: 'Past incidents (training)', key: 'security_incidents_train', received: 30728, kept: 29715 },
  { name: 'Past incidents (testing)', key: 'security_incidents_eval', received: 8613, kept: 8308 },
  { name: 'Work hours (training)', key: 'containment_effort_train', received: 29710, kept: 28611 },
  { name: 'Work hours (testing)', key: 'containment_effort_eval', received: 6132, kept: 5913 },
  { name: 'Analyst notes', key: 'analyst_incident_notes', received: 34685, kept: 32405 },
]

export const MODELS = [
  {
    id: 'harm', name: 'Risk model', icon: 'ShieldAlert',
    question: 'How likely is it that the people whose data was involved are now at high risk?',
    plain: 'It learned from about 30,000 past incidents where the DPO had already judged the risk. For a new incident, it gives a percentage, which is grouped into HIGH, MEDIUM or LOW.',
    checks: ['More worried when ID documents are involved', 'More worried when data was confirmed stolen', 'More worried when the data was readable rather than encrypted', 'Gives a spread of HIGH, MEDIUM and LOW, not the same answer for everything'],
    tech: { kind: 'Binary classifier (e.g. HistGradientBoosting)', target: 'high_risk_to_individuals (0/1)', gate: 'roc_auc ≥ MINIMUM_HARM_ROC_AUC', metrics: ['roc_auc', 'train_roc_auc', 'generalisation_gap', 'accuracy', 'precision', 'recall', 'f1'] },
  },
  {
    id: 'effort', name: 'Workload model', icon: 'Timer',
    question: 'How many analyst hours will it take to contain this incident and establish the facts?',
    plain: 'It learned from about 29,000 past investigations. If sensitive data (ID documents, health data or children’s accounts) is involved, a fixed amount of extra time is added once.',
    checks: ['More systems affected → more hours', 'More logs to review → more hours', 'Forensic imaging needed → more hours', 'Attacker still active → more hours', 'Never predicts zero or negative hours'],
    tech: { kind: 'Regressor (native-category gradient boosting)', target: 'containment_hours', gate: 'r2 ≥ MINIMUM_EFFORT_R2 and beats the average-answer baseline', metrics: ['r2', 'train_r2', 'generalisation_gap', 'mean_absolute_error', 'baseline_mean_absolute_error', 'lowest_prediction'] },
  },
  {
    id: 'attack', name: 'Notes reader', icon: 'FileSearch',
    question: 'Reading the analysts’ quick notes, what kind of attack is this?',
    plain: 'Analysts write fast, in shorthand. This model reads each note and picks one of eight attack types. It also reports how much the notes agree, because notes can disagree.',
    checks: ['Can recognise all 8 types, including the rare ones', 'Doesn’t keep mistaking one type for another', 'Reads every note on the incident, not just the first'],
    tech: { kind: 'Text classifier (TF-IDF + linear model)', target: 'attack_type (8 classes)', gate: 'macro_f1 ≥ MINIMUM_ATTACK_MACRO_F1', metrics: ['macro_f1', 'train_macro_f1', 'generalisation_gap', 'accuracy', 'weighted_f1', 'per_class_f1'] },
  },
]

export const ATTACK_TYPES = [
  'Phishing and credential compromise', 'Ransomware', 'Other malware', 'Misdirected disclosure',
  'Lost or stolen device', 'Insider misuse', 'Cloud misconfiguration', 'Denial of service',
]

export const DOCS16 = [
  { name: 'Procedure-01-EU-Personal-Data-Breach.pdf', plain: 'EU rulebook', group: 'Procedure' },
  { name: 'Procedure-02-Significant-Incident-Reporting.pdf', plain: '"Big incident" rulebook', group: 'Procedure' },
  { name: 'Procedure-03-India-Cyber-Incident-Reporting.pdf', plain: 'India rulebook', group: 'Procedure' },
  { name: 'Incident-Response-Plan.pdf', plain: 'Who does what in an incident', group: 'Policy' },
  { name: 'Data-Classification-Standard.pdf', plain: 'Which data is high-impact', group: 'Policy' },
  { name: 'Sensitive-Data-Handling-Standard.pdf', plain: 'Extra care for sensitive data', group: 'Policy' },
  { name: 'Customer-Communication-Policy.pdf', plain: 'What a customer notice must and mustn’t say', group: 'Policy' },
  { name: 'Past-Incidents-Casebook.pdf', plain: 'Past cases (confidential, never used by chat)', group: 'Restricted' },
  ...[
    ['Phishing-And-Credential-Compromise', 'Phishing'], ['Ransomware', 'Ransomware'], ['Other-Malware', 'Other malware'], ['Misdirected-Disclosure', 'Sent to the wrong person'],
    ['Lost-Or-Stolen-Device', 'Lost or stolen device'], ['Insider-Misuse', 'Insider misuse'], ['Cloud-Misconfiguration', 'Cloud setup mistake'], ['Denial-Of-Service', 'Service flooded (DoS)'],
  ].map(([n, p]) => ({ name: `Playbook-${n}.pdf`, plain: `Playbook: ${p}`, group: 'Playbook' })),
]

export const NODES = [
  { id: 'load_incident_context', label: 'Gather the facts', agent: null, calls: 0, kind: 'tool', plain: 'Loads the incident, its related incidents and its notes. Runs the risk model and the notes reader. No AI writing yet.', reads: 'incident_reference, analyst_request, analyst_id, thread_id', writes: 'run_id, assessment_id, incident_profile, campaign_incidents, harm_facts, attack_facts' },
  { id: 'plan_assessment', label: 'Planner', agent: 'incident_intake_planner', calls: 1, kind: 'agent', plain: 'Reads the analyst’s question and lists what needs checking. It plans only and decides nothing.', reads: 'incident_profile, analyst_request', writes: 'assessment_plan', fields: 'PRIORITY · CHECKS · RATIONALE' },
  { id: 'assess_harm', label: 'Risk explainer', agent: 'harm_analyst', calls: 1, kind: 'agent', plain: 'Explains in plain words why the risk is high, medium or low. It may not change the score.', reads: 'harm_facts, incident_profile, assessment_plan', writes: 'harm_assessment', fields: 'DRIVERS · PROTECTION · HARM SUMMARY' },
  { id: 'identify_attack', label: 'Attack explainer', agent: 'attack_analyst', calls: 1, kind: 'agent', plain: 'Says how sure we can be about the attack type. If the notes mostly disagree, it must say the type is not settled.', reads: 'attack_facts, campaign_incidents, harm_assessment', writes: 'attack_analysis', fields: 'ATTACK TYPE · CONFIDENCE · EVIDENCE' },
  { id: 'check_reporting_duties', label: 'Reporting-duties explainer', agent: 'reporting_duty_advisor', calls: 1, kind: 'agent', plain: 'The computer first works out which rulebooks apply and every deadline. The AI then writes who must be told and by when, using only the rulebook text.', reads: 'incident_profile, harm_facts, campaign_incidents', writes: 'reporting_facts, reporting_advice', fields: 'AUTHORITIES · DEADLINES · CUSTOMER NOTICE' },
  { id: 'compose_incident_assessment', label: 'Report writer', agent: 'incident_writer', calls: 1, kind: 'agent', plain: 'The computer estimates the hours needed and checks whether they fit before the deadline. The AI writes the final briefing and recommends one of three actions.', reads: 'everything so far', writes: 'incident_assessment', fields: 'ASSESSMENT · RECOMMENDED DISPOSITION' },
  { id: 'request_dpo_decision', label: 'DPO sign-off', agent: null, calls: 0, kind: 'gate', plain: 'Everything stops and waits for the Data Protection Officer. The pause is saved to disk, so the computer can even be switched off.', reads: 'assessment_id, run_id, llm_call_log', writes: 'dpo_decision, customer_notice, regulator_filing, filing_submitted_at' },
  { id: 'draft_customer_notice', label: 'Customer notice writer', agent: 'customer_notice_agent', calls: 1, kind: 'agent', plain: 'Writes the message to affected customers, using the playbook’s advice. It never includes internal system names, staff names, ticket numbers or guesses about who did it.', reads: 'incident_profile, harm_facts, attack_facts', writes: 'customer_notice', fields: 'SUBJECT · NOTICE' },
  { id: 'draft_regulator_filing', label: 'Regulator report writer', agent: 'regulator_filing_agent', calls: 1, kind: 'agent', plain: 'Writes the report to the authorities, including the decision, who made it, why, and whether customers were told.', reads: 'reporting_facts, incident_assessment, dpo_decision, customer_notice', writes: 'regulator_filing, filing_submitted_at' , fields: 'SUMMARY · SECTIONS · CUSTOMERS' },
  { id: 'record_incident_outcome', label: 'Save everything', agent: null, calls: 0, kind: 'tool', plain: 'Saves the decision, the documents and the final status, and sets the date the final report is due. No AI.', reads: 'assessment_id, dpo_decision, reporting_facts, filing_submitted_at', writes: '— (database only)' },
]

export const DECISIONS = [
  { id: 'RECORD_ONLY', label: 'Just record it', code: 'RECORD ONLY', status: 'RECORDED', path: [], calls: 5, tone: 'emerald', plain: 'No one outside is told. The decision and reason are kept on file.' },
  { id: 'NOTIFY_REGULATOR', label: 'Tell the regulator', code: 'NOTIFY REGULATOR', status: 'NOTIFIED', path: ['draft_regulator_filing'], calls: 6, tone: 'amber', plain: 'A report is drafted for the authorities. Customers are not contacted.' },
  { id: 'NOTIFY_BOTH', label: 'Tell regulator + customers', code: 'NOTIFY REGULATOR AND CUSTOMERS', status: 'NOTIFIED_AND_DISCLOSED', path: ['draft_customer_notice', 'draft_regulator_filing'], calls: 7, tone: 'rose', plain: 'A customer notice is drafted first, then the regulator report, which says customers were told.' },
]

export const ROLES = [
  { id: 'dpo', name: 'Data Protection Officer', short: 'DPO', cfg: 'ROLE_DPO', areas: ['INTAKE', 'ASSESSMENT', 'DECISION', 'AUDIT', 'CHAT'], pages: ['Incident list', 'Incident details', 'Decisions waiting', 'History', 'Chat assistant'], note: 'Can see everything, and is the only person who can make the final decision.' },
  { id: 'analyst', name: 'Security Analyst', short: 'Analyst', cfg: 'ROLE_ANALYST', areas: ['INTAKE', 'ASSESSMENT', 'AUDIT', 'CHAT'], pages: ['Incident list', 'Incident details', 'History', 'Chat assistant'], note: 'Does the investigation, but can’t decide whether to notify anyone. Company policy keeps those two jobs apart.' },
  { id: 'comms', name: 'Customer Communications Agent', short: 'Comms', cfg: 'ROLE_COMMUNICATIONS', areas: ['CHAT'], pages: ['Chat assistant'], note: 'Only uses the chat assistant, and can’t learn about an incident until customers have been told.' },
]
export const AREAS = [
  { id: 'INTAKE', plain: 'See the incident list' },
  { id: 'ASSESSMENT', plain: 'Run an assessment' },
  { id: 'DECISION', plain: 'Make the final decision' },
  { id: 'AUDIT', plain: 'View the history' },
  { id: 'CHAT', plain: 'Use the chat assistant' },
]

export const TREE = [
  { dir: 'data_pipeline', color: 'cyan', plain: 'Cleans up the messy spreadsheets', blurb: 'Fixes the messy raw data and writes a report showing what was wrong.', files: [
    { f: 'dataset_loader.py', fns: ['load_raw_dataset', 'load_processed_dataset', 'save_processed_dataset'], d: 'Opens and saves the data files. Raw files are read exactly as written, with nothing guessed.' },
    { f: 'common_cleaning.py', fns: ['strip_text_whitespace', 'replace_missing_tokens', 'remove_duplicate_records', 'normalize_category_column', 'restrict_to_known_values', 'normalize_boolean_columns', 'parse_mixed_format_timestamps', 'parse_mixed_format_dates', 'convert_written_counts', 'convert_money_amounts', 'convert_durations_to_minutes', 'convert_durations_to_hours', 'remove_out_of_range_measurements', 'resolve_missing_measurements', 'resolve_missing_categories'], d: 'The shared clean-up steps: tidy spacing, unify spellings, read every date format, turn "1.11 lakh" into a number, and so on.' },
    { f: 'incident_cleaning.py', fns: ['clean_incident_dataset'], d: 'Cleans past incidents, including fixing times that are in the wrong order.' },
    { f: 'effort_cleaning.py', fns: ['clean_effort_dataset'], d: 'Cleans the work-hours records.' },
    { f: 'incident_note_cleaning.py', fns: ['clean_incident_note_dataset'], d: 'Cleans analysts’ notes: removes web code and drops notes too short to learn from.' },
    { f: 'feature_builder.py', fns: ['build_model_inputs', 'build_model_pipeline', 'build_native_category_pipeline'], d: 'Prepares the cleaned data so the models can learn from it.' },
    { f: 'quality_profiler.py', fns: ['profile_dataset', 'profile_incident_details', 'profile_effort_details', 'profile_note_details', 'write_quality_report'], d: 'Counts every problem found and fixed, as proof the cleaning worked.' },
  ] },
  { dir: 'modeling', color: 'emerald', plain: 'Trains the three prediction models', blurb: 'Teaches the risk model, workload model and notes reader, and checks they are good enough.', files: [
    { f: 'harm_model.py', fns: ['train_harm_model'], d: 'Trains the risk model.' },
    { f: 'effort_model.py', fns: ['train_effort_model'], d: 'Trains the workload model.' },
    { f: 'attack_model.py', fns: ['train_attack_model'], d: 'Trains the notes reader.' },
    { f: 'model_evaluation.py', fns: ['evaluate_classifier', 'evaluate_regressor', 'evaluate_text_classifier'], d: 'Tests each model on data it has never seen, to make sure it learned rather than memorised.' },
    { f: 'model_registry.py', fns: ['save_model', 'load_model', 'save_feature_schema', 'load_feature_schema', 'save_metrics'], d: 'Saves and loads the trained models and their scores.' },
  ] },
  { dir: 'knowledge', color: 'violet', plain: 'Reads the 16 policy PDFs', blurb: 'Turns the company’s PDFs into a searchable library and reads deadlines from them.', files: [
    { f: 'pdf_extraction.py', fns: ['extract_text_from_directory'], d: 'Pulls the text out of all 16 PDFs.' },
    { f: 'chunk_splitting.py', fns: ['split_documents_into_sections', 'build_chunk_records'], d: 'Cuts each document into short passages without splitting a rule in half.' },
    { f: 'vector_index.py', fns: ['build_vector_index', 'open_vector_index', 'search_documents'], d: 'Makes the passages searchable by meaning, not just exact words.' },
    { f: 'procedure_reading.py', fns: ['read_procedure_deadlines', 'read_customer_notice_exemption'], d: 'Reads each rulebook’s deadlines from its own PDF only. Stops with an error if it can’t find them.' },
  ] },
  { dir: 'tools', color: 'amber', plain: 'Does all the calculations', blurb: 'Plain code that works out which laws apply, every deadline, and whether there’s enough time.', files: [
    { f: 'incident_data_tools.py', fns: ['fetch_incident_profile', 'fetch_incident_notes', 'fetch_campaign_incidents'], d: 'Looks up one incident, its notes and its related incidents.' },
    { f: 'prediction_tools.py', fns: ['build_harm_facts', 'build_attack_facts', 'estimate_containment_effort'], d: 'Turns model outputs into clear facts: a risk level, an attack type, an hours estimate.' },
    { f: 'deadline_tools.py', fns: ['select_applicable_procedures', 'compute_procedure_deadlines', 'compare_effort_with_deadline', 'compute_final_report_due', 'rank_incident_queue'], d: 'Decides which laws apply, works out every deadline, and sorts the list by urgency.' },
    { f: 'retrieval_tools.py', fns: ['read_reporting_duties', 'read_customer_steps'], d: 'Looks up what each law requires and what the playbook tells customers to do.' },
  ] },
  { dir: 'agentic', color: 'rose', plain: 'Runs the AI helpers', blurb: 'The step-by-step AI workflow, including the stop for the DPO.', files: [
    { f: 'state.py', fns: ['IncidentAssessmentState'], d: 'The "folder" of information passed from one step to the next.' },
    { f: 'agents.py', fns: ['call_language_model', 'parse_labelled_response', 'plan_assessment', 'assess_harm', 'identify_attack', 'advise_on_reporting_duties', 'write_incident_assessment', 'draft_customer_notice', 'draft_regulator_filing'], d: 'The instructions given to each AI helper, and the code that reads their answers.' },
    { f: 'nodes.py', fns: ['load_incident_context_node', 'plan_assessment_node', 'assess_harm_node', 'identify_attack_node', 'check_reporting_duties_node', 'compose_incident_assessment_node', 'request_dpo_decision_node', 'draft_customer_notice_node', 'draft_regulator_filing_node', 'record_incident_outcome_node'], d: 'The ten steps of the workflow.' },
    { f: 'graph.py', fns: ['build_workflow'], d: 'Connects the steps in order, adds the DPO stop and the three possible paths after it.' },
  ] },
  { dir: 'api', color: 'sky', plain: 'The back-end service', blurb: 'The service the dashboard talks to. It also checks who you are and what you may do.', files: [
    { f: 'schemas.py', fns: ['SignInRequest', 'SignedInUserResponse', 'QueueRow', 'IncidentDetailResponse', 'AssessmentRequest', 'DecisionRequest', 'SecurityIncidentResponse', 'CallBudgetResponse', 'ChatRequest', 'ChatResponse', 'ChatTurnResponse'], d: 'Defines exactly what each request and reply looks like.' },
    { f: 'routes.py', fns: ['authorize_request', 'sign_in_user', 'sign_out_user', 'list_incident_queue', 'get_incident_detail', 'start_incident_assessment', 'list_incidents', 'submit_dpo_decision', 'get_call_budget', 'ask_response_assistant', 'list_own_chat_turns', 'list_recent_chat_turns'], d: 'Every action the dashboard can ask for, each protected by a sign-in and permission check.' },
  ] },
  { dir: 'access', color: 'teal', plain: 'Passwords and permissions', blurb: 'Stores passwords safely and decides which role can open which page.', files: [
    { f: 'password_security.py', fns: ['hash_password'], d: 'Scrambles passwords so the real password is never stored.' },
    { f: 'permissions.py', fns: ['check_request_permission'], d: 'Checks whether your role is allowed to do what you’re asking.' },
  ] },
  { dir: 'chat', color: 'fuchsia', plain: 'The chat assistant', blurb: 'Answers questions only from the company documents, and refuses when it can’t.', files: [
    { f: 'conversation_memory.py', fns: ['recall_conversation'], d: 'Remembers your last few questions so follow-ups make sense.' },
    { f: 'response_assistant.py', fns: ['answer_from_documents'], d: 'Finds the right passages and answers from them, or politely refuses.' },
    { f: 'incident_status_answer.py', fns: ['answer_incident_status'], d: 'Answers "what’s the status of incident X?" from the records, depending on who’s asking.' },
  ] },
  { dir: 'persistence', color: 'orange', plain: 'The database', blurb: 'Keeps a permanent record of everything for auditors.', files: [
    { f: 'database.py', fns: ['database_engine', 'SessionFactory'], d: 'The connection to the database.' },
    { f: 'models.py', fns: ['UserAccount', 'AgentRun', 'SecurityIncident', 'DpoDecision', 'LlmCall', 'ChatTurn'], d: 'The six tables: users, runs, assessments, decisions, AI calls, chat questions.' },
    { f: 'repository.py', fns: ['insert_user_account', 'fetch_user_account', 'update_session_token', 'insert_agent_run', 'update_agent_run', 'insert_llm_call', 'fetch_llm_calls', 'insert_security_incident', 'record_incident_outcome', 'fetch_incident_records', 'insert_dpo_decision', 'insert_chat_turn', 'fetch_chat_turns'], d: 'All reading and writing of the database happens here, in one place.' },
  ] },
  { dir: 'dashboard', color: 'lime', plain: 'The screens people use', blurb: 'The five pages the team works in.', files: [
    { f: 'api_client.py', fns: ['call_service'], d: 'Sends every request from the screens to the back-end service.' },
    { f: 'incident_queue.py', fns: ['render_incident_queue_page'], d: 'The incident list, most urgent first.' },
    { f: 'incident_detail.py', fns: ['render_incident_detail_page'], d: 'Everything about one incident: deadlines, facts, risk, workload, and a button to start an assessment.' },
    { f: 'decision_queue.py', fns: ['render_decision_queue_page'], d: 'Briefings waiting for the DPO, and the decision form.' },
    { f: 'audit_trail.py', fns: ['render_audit_trail_page'], d: 'History of decisions, documents, AI calls and chat questions.' },
    { f: 'response_chat.py', fns: ['render_response_chat_page'], d: 'The chat assistant.' },
  ] },
]

export const ENTRY_POINTS = [
  { n: 1, file: 'run_database_setup.py', title: 'Set up the database', icon: 'Database', does: 'Creates the database and the 15 user accounts people sign in with. Running it again changes nothing.', out: `database: database/breachwatch.db
  tables: agent_runs, chat_turns, dpo_decisions, llm_calls, security_incidents, user_accounts
  account created  ines   Ines Carvalho   Data Protection Officer
  account created  arjun  Arjun Menon     Data Protection Officer
  ...
  accounts created: 15, already present: 0` },
  { n: 2, file: 'run_data_pipeline.py', title: 'Clean the data', icon: 'Sparkles', does: 'Cleans all five raw spreadsheets and writes a report of every problem it found.', out: `security_incidents_train   30728 received -> 29715 kept (1013 removed)
security_incidents_eval     8613 received ->  8308 kept  (305 removed)
containment_effort_train   29710 received -> 28611 kept (1099 removed)
containment_effort_eval     6132 received ->  5913 kept  (219 removed)
analyst_incident_notes     34685 received -> 32405 kept (2280 removed)

quality report written to output/data_quality_report.json` },
  { n: 3, file: 'run_model_training.py', title: 'Train the models', icon: 'Brain', does: 'Teaches the three models from past data, tests them, and reports whether each passed its minimum score.', out: `training three models
  harm    <estimator>  eval ROC AUC N.NNNN  (train N.NNNN, gap +N.NNNN)
  effort  <estimator>  eval R2 N.NNNN  MAE N.NN h  (train N.NNNN, gap +N.NNNN)
  attack  <estimator>  eval macro F1 N.NNNN  (train N.NNNN, gap +N.NNNN)

metrics written to output/model_metrics.json
every model is above the minimum config sets for it` },
  { n: 4, file: 'run_knowledge_indexing.py', title: 'Build the document library', icon: 'Library', does: 'Turns the 16 PDFs into a searchable library, then proves it can read each rulebook’s deadlines from the right PDF.', out: `building the incident response knowledge index
    documents read:  16
    sections found:  126
    passages stored: 142
    store location:  database/chroma_store

reporting deadlines, read back from each procedure's own document
  Procedure 01   Procedure-01-EU-Personal-Data-Breach.pdf
     <milestone>        within NN hours of <clock start>
  Procedure 02   Procedure-02-Significant-Incident-Reporting.pdf
     <milestone>        N months after the <milestone> is filed
  Procedure 03   Procedure-03-India-Cyber-Incident-Reporting.pdf
     <milestone>        within NN hours of <clock start>` },
  { n: 5, file: 'run_api_service.py', title: 'Start the back-end', icon: 'Server', does: 'Starts the back-end service. If an earlier step was skipped, it says exactly what is missing instead of crashing.', out: `Starting BreachWatch AI API on port 8082. Interactive documentation: http://localhost:8082/docs
INFO:     Uvicorn running on http://0.0.0.0:8082 (Press CTRL+C to quit)

# if run too early:
The service cannot start.
  output/models/harm_model.pkl is missing; it comes from run_model_training.py` },
  { n: 6, file: 'run_dashboard.py', title: 'Open the dashboard', icon: 'LayoutDashboard', cmd: 'python3 -m streamlit run run_dashboard.py', does: 'Starts the screens the team uses. Open the address in a browser and sign in.', out: `  You can now view your Streamlit app in your browser.
  Local URL: http://localhost:8501` },
]

export const FAQ = [
  { tag: 'AI', q: 'Why doesn’t the AI just work out the deadlines itself?', a: 'Because AI can make mistakes with numbers, and a wrong deadline is a legal problem. Ordinary code does every calculation the same way every time, so an auditor can check it. The AI only writes explanations of numbers it has been given.' },
  { tag: 'Rules', q: 'Why aren’t the deadlines simply typed into the software?', a: 'The rulebooks (PDFs) are the official source. If a rulebook changes, the software picks up the change automatically. If the deadlines were typed into the code as well, there would be two versions that could drift apart.' },
  { tag: 'Rules', q: 'Why search only one PDF for each law?', a: 'The three rulebooks were written from the same template and share many identical sentences. Searching all of them at once could return the EU deadline when you asked about India. So each law is only ever looked up in its own PDF.' },
  { tag: 'Time', q: 'Why count from a fixed "snapshot" time instead of right now?', a: 'So that everyone sees the same numbers, today and tomorrow, and an auditor can reproduce them. If a deadline has already passed, it shows as negative hours (e.g. −64 h), never as zero.' },
  { tag: 'People', q: 'Why must a person make the final decision?', a: 'Company policy says the analyst who investigates must not also decide whether to notify. Telling a regulator or customers is a serious step, so the system recommends and a person decides, giving a written reason.' },
  { tag: 'Safety', q: 'What if the computer is restarted while waiting for the DPO?', a: 'Nothing is lost. The paused workflow is saved to disk, and when the DPO decides later, it carries on from exactly where it stopped.' },
  { tag: 'Cost', q: 'How many AI calls does one incident use?', a: '5 to prepare the briefing. Then 0 more to just record it, 1 more to tell the regulator, or 2 more to tell the regulator and the customers. The system checks every run used exactly that many.' },
  { tag: 'Security', q: 'Why does a wrong username show the same error as a wrong password?', a: 'If the messages were different, someone could find out which usernames exist just by trying. One message for both gives nothing away.' },
  { tag: 'Security', q: 'Why does the chat refuse even for incidents that don’t exist?', a: 'If it said "not found" for fake incidents but "can’t tell you" for real ones, anyone could find the hidden incidents by asking. The same refusal for both reveals nothing.' },
]
