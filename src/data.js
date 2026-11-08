// Content for the showcase, taken from the BreachWatch AI specification.
// Deliberately contains no procedure deadline hours: in the real system they are only read from the PDFs.

export const SNAPSHOT_AT_UTC = '2026-03-14T01:40:00Z' // the snapshot shown in the spec's dashboard screenshots

export const HUBS = [
  { name: 'Bengaluru', code: 'BLR', tz: 'Asia/Kolkata', sample: '2026-03-13T23:10:00+05:30' },
  { name: 'Lisbon', code: 'LIS', tz: 'Europe/Lisbon', sample: '07/02/2025 03:42 +05:30' },
  { name: 'Warsaw', code: 'WAW', tz: 'Europe/Warsaw', sample: '31-Jan-2024 10:27 CET' },
  { name: 'Tallinn', code: 'TLL', tz: 'Europe/Tallinn', sample: '2026-03-12T11:40:00+02:00' },
]

export const GLOSSARY = {
  campaign: { term: 'Campaign Aggregation', def: 'Incidents that belong to one attack share a campaign reference (CMP-YYYY-NNNN). Customers affected are summed across every incident in the campaign, so several small incidents can cross the significance threshold together.' },
  snapshot: { term: 'Snapshot vs. Wall Clock', def: 'Hours remaining are always measured from config.SNAPSHOT_AT_UTC, the moment the queue was extracted, never from the machine clock. The same incident gives the same answer today and tomorrow; a passed deadline is a negative number.' },
  boundary: { term: 'Deterministic Boundary', def: 'The line between code and language models. Every figure (bands, deadlines, sums, effort) is computed by tools and ML models; agents only receive those facts as text and are told never to recalculate them.' },
  awareness: { term: 'Awareness', def: 'The moment an analyst confirmed the incident is real — config.AWARENESS_COLUMN (confirmed_at). An incident awaiting confirmation has no awareness moment, so awareness clocks have not started.' },
  firstAlert: { term: 'First Alert', def: 'The moment anything at Merrowfield first noticed the incident — config.FIRST_ALERT_COLUMN. Usually hours before awareness, and clocks counted from it are running even before confirmation.' },
  milestone: { term: 'Milestone', def: 'One thing a procedure requires, with its own length and its own clock start. It is read from a fixed-form sentence in the procedure PDF using config.MILESTONE_STATEMENT_PATTERN.' },
  exemption: { term: 'Exemption', def: 'The protection state (read from the EU procedure PDF) under which customers need not be told. Not assumed: excusing the wrong states means telling nobody about incidents that should be disclosed.' },
  gate: { term: 'The Gate', def: 'A LangGraph interrupt at request_dpo_decision. The paused run is checkpointed to SQLite, so the process can stop and the Data Protection Officer can decide later.' },
  reserve: { term: 'Filing Reserve', def: 'config.FILING_RESERVE_HOURS — hours kept back for writing and filing. Hours available = hours to the earliest deadline minus this reserve.' },
  enumeration: { term: 'Anti-Enumeration', def: 'A refusal that reads identically whether an incident exists or not, so nobody can discover by asking that something is being kept quiet.' },
}

export const PROCEDURES = [
  {
    code: 'PROCEDURE_EU_PERSONAL_DATA_BREACH', short: 'Procedure 01', title: 'EU Personal Data Breach', tag: 'GDPR', authority: 'Lead supervisory authority',
    doc: 'Procedure-01-EU-Personal-Data-Breach.pdf', color: 'cyan',
    applies: ['Personal data was involved', '≥ 1 EU data subject (eu_data_subjects_count)', 'Harm band ∈ config.EU_PROCEDURE_HARM_BANDS'],
    extra: 'Also governs whether customers must be told, and which protection state excuses it.',
  },
  {
    code: 'PROCEDURE_SIGNIFICANT_INCIDENT', short: 'Procedure 02', title: 'Significant Incident Reporting', tag: 'NIS2-style', authority: 'National CSIRT',
    doc: 'Procedure-02-Significant-Incident-Reporting.pdf', color: 'amber',
    applies: ['Outage > SIGNIFICANT_OUTAGE_MINUTES', 'or customers across campaign > SIGNIFICANT_CUSTOMERS_ACROSS_CAMPAIGN', 'or direct loss > SIGNIFICANT_DIRECT_LOSS_EUR'],
    extra: 'Carries the one milestone counted from a filing (the final report), in months.',
  },
  {
    code: 'PROCEDURE_INDIA_CYBER_INCIDENT', short: 'Procedure 03', title: 'India Cyber Incident Reporting', tag: 'CERT-In', authority: 'CERT-In',
    doc: 'Procedure-03-India-Cyber-Incident-Reporting.pdf', color: 'violet',
    applies: ['Hosting region ∈ config.INDIA_HOSTING_REGIONS', 'or ≥ 1 Indian data subject (india_data_subjects_count)'],
    extra: 'In the sample queue, its clock is often the one that comes due first.',
  },
]

export const DEFECTS = [
  { name: 'Padding and case', before: '" Bengaluru", "WARSAW ", "seller portal"', after: 'Bengaluru · Warsaw · Seller portal', cfg: 'HUB_MAPPING, SYSTEM_CLASS_MAPPING' },
  { name: 'Spelling variants', before: '"phishing & credential compromise"', after: 'Phishing and credential compromise', cfg: 'ATTACK_TYPE_MAPPING' },
  { name: 'Missing, written many ways', before: '"-", "none", "?", "N/A", "Not recorded"', after: '∅ (empty)', cfg: 'NULL_TOKEN_LIST' },
  { name: 'Four timestamp notations', before: '"2025-08-24T07:46:00Z" · "07/02/2025 03:42 +05:30" · "21-Jul-2024 08:37 IST" · "1746610260"', after: 'One UTC instant, OUTPUT_TIMESTAMP_FORMAT', cfg: 'TIMESTAMP_FORMAT_LIST, TIMEZONE_ABBREVIATION_OFFSETS' },
  { name: 'Three date notations', before: '"2025-04-18" · "22/07/2025" · "27-Oct-2025"', after: '2025-04-18 / 2025-07-22 / 2025-10-27', cfg: 'DATE_FORMAT_LIST' },
  { name: 'Counts written as text', before: '"1,20,637" · "19,743" · "1.11 lakh" · "8.7k"', after: '120637 · 19743 · 111000 · 8700', cfg: 'COUNT_SUFFIX_MULTIPLIERS' },
  { name: 'Money with a marker', before: '"€105,114" · "EUR 178495"', after: '105114 · 178495', cfg: 'CURRENCY_MARKERS' },
  { name: 'Durations with units', before: '"2h 30m" · "45 min" · "6 h"', after: '150 · 45 · 360 (minutes)', cfg: 'HOURS_AND_MINUTES_PATTERN' },
  { name: 'Booleans many ways', before: '"Y", "yes", "TRUE", "1", "N", "FALSE", "0"', after: 'Yes / No', cfg: 'BOOLEAN_TRUE_TOKENS' },
  { name: 'Markup & entities in notes', before: '"<span>Session token reused&nbsp;from…"', after: 'Session token reused from…', cfg: 'MARKUP_PATTERN, ENCODING_ARTIFACT_LIST' },
  { name: 'Interval that disagrees', before: 'detection_to_confirmation_minutes = 429 (timestamps say 431)', after: 'Recomputed: 431', cfg: 'INCIDENT_INTERVAL_COLUMN' },
  { name: 'Timeline runs backwards', before: 'confirmed_at < first_alert_at', after: 'Moments swapped, row kept', cfg: 'FIRST_ALERT_COLUMN, AWARENESS_COLUMN' },
  { name: 'Count that cannot be true', before: 'forensic_image_required = No, images_taken = 3', after: 'images_taken = 0', cfg: 'FORENSIC_IMAGE_COUNT_COLUMN' },
  { name: 'Stale derived column', before: 'note_length_chars measured before repair', after: 'Recomputed from cleaned text', cfg: 'NOTE_LENGTH_COLUMN' },
]

export const DATASETS = [
  { name: 'security_incidents_train', received: 30728, kept: 29715 },
  { name: 'security_incidents_eval', received: 8613, kept: 8308 },
  { name: 'containment_effort_train', received: 29710, kept: 28611 },
  { name: 'containment_effort_eval', received: 6132, kept: 5913 },
  { name: 'analyst_incident_notes', received: 34685, kept: 32405 },
]

export const MODELS = [
  {
    id: 'harm', name: 'Harm Model', kind: 'Binary classifier', icon: 'ShieldAlert', estimator: 'e.g. HistGradientBoosting / Logistic Regression',
    target: 'high_risk_to_individuals (0/1)', metric: 'roc_auc ≥ MINIMUM_HARM_ROC_AUC',
    out: 'Probability → HIGH / MEDIUM / LOW band via HARM_BAND_*_THRESHOLD',
    checks: ['Probability rises when government_id_flag No → Yes', 'Rises when exfiltration_confirmed_flag No → Yes', 'Rises when data goes from unintelligible to in-the-clear', 'Every band occurs at least once across the live queue'],
    metrics: ['roc_auc', 'train_roc_auc', 'generalisation_gap', 'accuracy', 'precision', 'recall', 'f1'],
  },
  {
    id: 'effort', name: 'Effort Model', kind: 'Regressor', icon: 'Timer', estimator: 'native-category gradient boosting (team choice)',
    target: 'containment_hours', metric: 'r2 ≥ MINIMUM_EFFORT_R2 and beats mean baseline MAE',
    out: 'base_hours × SENSITIVE_DATA_EFFORT_MULTIPLIER (once, if any sensitive data)',
    checks: ['Estimate rises with systems_affected_count', 'Rises with log_sources_to_review', 'Rises when forensic imaging goes from none to taken', 'Rises when attacker_still_active_flag No → Yes', 'Every estimate is strictly positive'],
    metrics: ['r2', 'train_r2', 'generalisation_gap', 'mean_absolute_error', 'baseline_mean_absolute_error', 'lowest_prediction'],
  },
  {
    id: 'attack', name: 'Attack Model', kind: 'NLP text classifier', icon: 'FileSearch', estimator: 'TF-IDF + linear classifier in one Pipeline',
    target: 'attack_type (8 classes)', metric: 'macro_f1 ≥ MINIMUM_ATTACK_MACRO_F1',
    out: 'Majority type across every note + agreement share',
    checks: ['Every one of the 8 types is reachable', 'For each type, the commonest prediction on its own notes is itself', 'Stratified split keeps rare types on both sides', 'Takes raw note text; vectorises internally'],
    metrics: ['macro_f1', 'train_macro_f1', 'generalisation_gap', 'accuracy', 'weighted_f1', 'per_class_f1'],
  },
]

export const ATTACK_TYPES = [
  'Phishing and credential compromise', 'Ransomware', 'Other malware', 'Misdirected disclosure',
  'Lost or stolen device', 'Insider misuse', 'Cloud misconfiguration', 'Denial of service',
]

export const DOCS16 = [
  { name: 'Procedure-01-EU-Personal-Data-Breach.pdf', group: 'Procedure' },
  { name: 'Procedure-02-Significant-Incident-Reporting.pdf', group: 'Procedure' },
  { name: 'Procedure-03-India-Cyber-Incident-Reporting.pdf', group: 'Procedure' },
  { name: 'Incident-Response-Plan.pdf', group: 'Policy' },
  { name: 'Data-Classification-Standard.pdf', group: 'Policy' },
  { name: 'Sensitive-Data-Handling-Standard.pdf', group: 'Policy' },
  { name: 'Customer-Communication-Policy.pdf', group: 'Policy' },
  { name: 'Past-Incidents-Casebook.pdf', group: 'Restricted' },
  ...['Phishing-And-Credential-Compromise', 'Ransomware', 'Other-Malware', 'Misdirected-Disclosure', 'Lost-Or-Stolen-Device', 'Insider-Misuse', 'Cloud-Misconfiguration', 'Denial-Of-Service']
    .map((n) => ({ name: `Playbook-${n}.pdf`, group: 'Playbook' })),
]

export const NODES = [
  { id: 'load_incident_context', label: 'Load incident context', agent: null, calls: 0, kind: 'tool', reads: 'incident_reference, analyst_request, analyst_id, thread_id', writes: 'run_id, assessment_id, incident_profile, campaign_incidents, harm_facts, attack_facts', desc: 'Fetches the profile, campaign and notes from the live queue; runs the harm and attack models; writes the run to agent_runs as RUNNING. No language model.' },
  { id: 'plan_assessment', label: 'Intake Planner', agent: 'incident_intake_planner', calls: 1, kind: 'agent', reads: 'incident_profile, analyst_request', writes: 'assessment_plan', fields: 'PRIORITY · CHECKS · RATIONALE', desc: 'Decides what must be established before anyone can decide. Plans; settles nothing.' },
  { id: 'assess_harm', label: 'Harm Analyst', agent: 'harm_analyst', calls: 1, kind: 'agent', reads: 'harm_facts, incident_profile, assessment_plan', writes: 'harm_assessment', fields: 'DRIVERS · PROTECTION · HARM SUMMARY', desc: 'Explains what drives the harm score, in human-readable data categories. Told never to recalculate probability or band.' },
  { id: 'identify_attack', label: 'Attack Analyst', agent: 'attack_analyst', calls: 1, kind: 'agent', reads: 'attack_facts, campaign_incidents, harm_assessment', writes: 'attack_analysis', fields: 'ATTACK TYPE · CONFIDENCE · EVIDENCE', desc: 'Weighs how far the notes agree. Below ~50% agreement it must say the type is not settled.' },
  { id: 'check_reporting_duties', label: 'Reporting Duty Advisor', agent: 'reporting_duty_advisor', calls: 1, kind: 'agent', reads: 'incident_profile, harm_facts, campaign_incidents', writes: 'reporting_facts, reporting_advice', fields: 'AUTHORITIES · DEADLINES · CUSTOMER NOTICE', desc: 'Tools select procedures, read each from its own PDF and time every clock; then one call states duties using only the retrieved passages.' },
  { id: 'compose_incident_assessment', label: 'Incident Writer', agent: 'incident_writer', calls: 1, kind: 'agent', reads: 'everything so far', writes: 'incident_assessment', fields: 'ASSESSMENT · RECOMMENDED DISPOSITION', desc: 'Effort model + effort-vs-deadline comparison run first; then the writer drafts and recommends. Stored as PENDING_DECISION with tool figures, not prose figures.' },
  { id: 'request_dpo_decision', label: 'DPO Gate', agent: null, calls: 0, kind: 'gate', reads: 'assessment_id, run_id, llm_call_log', writes: 'dpo_decision, customer_notice, regulator_filing, filing_submitted_at', desc: 'Moves the run to AWAITING_DECISION and interrupts. The pause lives in checkpoint.db and survives a restart.' },
  { id: 'draft_customer_notice', label: 'Customer Notice Agent', agent: 'customer_notice_agent', calls: 1, kind: 'agent', reads: 'incident_profile, harm_facts, attack_facts', writes: 'customer_notice', fields: 'SUBJECT · NOTICE', desc: 'Reads the attack type’s playbook first. Never includes system names, ticket IDs, staff IDs, campaign refs or guesses about attribution.' },
  { id: 'draft_regulator_filing', label: 'Regulator Filing Agent', agent: 'regulator_filing_agent', calls: 1, kind: 'agent', reads: 'reporting_facts, incident_assessment, dpo_decision, customer_notice', writes: 'regulator_filing, filing_submitted_at', fields: 'SUMMARY · SECTIONS · CUSTOMERS', desc: 'Writes the filing and sets filing_submitted_at = SNAPSHOT_AT_UTC — the moment the final-report milestone counts from.' },
  { id: 'record_incident_outcome', label: 'Record outcome', agent: null, calls: 0, kind: 'tool', reads: 'assessment_id, dpo_decision, reporting_facts, filing_submitted_at', writes: '— (database only)', desc: 'Writes the dpo_decisions row, sets status (RECORDED / NOTIFIED / NOTIFIED_AND_DISCLOSED), stores documents, computes final_report_due_at, marks run COMPLETE.' },
]

export const DECISIONS = [
  { id: 'RECORD_ONLY', label: 'RECORD ONLY', status: 'RECORDED', path: [], calls: 5, tone: 'emerald' },
  { id: 'NOTIFY_REGULATOR', label: 'NOTIFY REGULATOR', status: 'NOTIFIED', path: ['draft_regulator_filing'], calls: 6, tone: 'amber' },
  { id: 'NOTIFY_BOTH', label: 'NOTIFY REGULATOR AND CUSTOMERS', status: 'NOTIFIED_AND_DISCLOSED', path: ['draft_customer_notice', 'draft_regulator_filing'], calls: 7, tone: 'rose' },
]

export const ROLES = [
  { id: 'dpo', name: 'Data Protection Officer', cfg: 'ROLE_DPO', person: 'Ines Carvalho', areas: ['INTAKE', 'ASSESSMENT', 'DECISION', 'AUDIT', 'CHAT'], pages: ['Incident queue', 'Incident detail', 'Decision queue', 'Audit trail', 'Response chat'], note: 'Everything — and the only role that may record a decision.' },
  { id: 'analyst', name: 'Security Analyst', cfg: 'ROLE_ANALYST', person: 'Priya Raghavan', areas: ['INTAKE', 'ASSESSMENT', 'AUDIT', 'CHAT'], pages: ['Incident queue', 'Incident detail', 'Audit trail', 'Response chat'], note: 'May do all the work, may not decide notification (Incident Response Plan).' },
  { id: 'comms', name: 'Customer Communications Agent', cfg: 'ROLE_COMMUNICATIONS', person: 'Ananya Kulkarni', areas: ['CHAT'], pages: ['Response chat'], note: 'Chat only — and never a named incident’s status before disclosure.' },
]
export const AREAS = ['INTAKE', 'ASSESSMENT', 'DECISION', 'AUDIT', 'CHAT']

export const TREE = [
  { dir: 'data_pipeline', color: 'cyan', blurb: 'Cleaners, loaders, profiler and feature builders for the five raw extracts.', files: [
    { f: 'dataset_loader.py', fns: ['load_raw_dataset', 'load_processed_dataset', 'save_processed_dataset'], d: 'The only module that touches CSVs. Raw files load as all-text so nothing is guessed.' },
    { f: 'common_cleaning.py', fns: ['strip_text_whitespace', 'replace_missing_tokens', 'remove_duplicate_records', 'normalize_category_column', 'restrict_to_known_values', 'normalize_boolean_columns', 'parse_mixed_format_timestamps', 'parse_mixed_format_dates', 'convert_written_counts', 'convert_money_amounts', 'convert_durations_to_minutes', 'convert_durations_to_hours', 'remove_out_of_range_measurements', 'resolve_missing_measurements', 'resolve_missing_categories'], d: 'Pure, non-mutating table → table repairs, testable one step at a time.' },
    { f: 'incident_cleaning.py', fns: ['clean_incident_dataset'], d: 'Fixes backward timelines and recomputes detection_to_confirmation_minutes.' },
    { f: 'effort_cleaning.py', fns: ['clean_effort_dataset'], d: 'Hours with units; zeroes forensic images where none was required.' },
    { f: 'incident_note_cleaning.py', fns: ['clean_incident_note_dataset'], d: 'Strips markup/entities, drops short notes, recomputes note length.' },
    { f: 'feature_builder.py', fns: ['build_model_inputs', 'build_model_pipeline', 'build_native_category_pipeline'], d: 'Separates features from target; one Pipeline so prep is never forgotten.' },
    { f: 'quality_profiler.py', fns: ['profile_dataset', 'profile_incident_details', 'profile_effort_details', 'profile_note_details', 'write_quality_report'], d: 'Measured evidence of every defect → data_quality_report.json.' },
  ] },
  { dir: 'modeling', color: 'emerald', blurb: 'Harm, effort and attack trainers, evaluators and the registry.', files: [
    { f: 'harm_model.py', fns: ['train_harm_model'], d: 'Classifier with classes 0/1 and calibrated probabilities.' },
    { f: 'effort_model.py', fns: ['train_effort_model'], d: 'Strictly positive hours; monotone in scope features.' },
    { f: 'attack_model.py', fns: ['train_attack_model'], d: 'Text in, one of 8 attack types out.' },
    { f: 'model_evaluation.py', fns: ['evaluate_classifier', 'evaluate_regressor', 'evaluate_text_classifier'], d: 'Held-out and train scores so the generalisation gap is visible.' },
    { f: 'model_registry.py', fns: ['save_model', 'load_model', 'save_feature_schema', 'load_feature_schema', 'save_metrics'], d: 'The only writer to output/models/.' },
  ] },
  { dir: 'knowledge', color: 'violet', blurb: 'PDF extraction, chunking, ChromaDB indexing and runtime procedure parsing.', files: [
    { f: 'pdf_extraction.py', fns: ['extract_text_from_directory'], d: 'Reads all 16 PDFs once, pages in order, settled document order.' },
    { f: 'chunk_splitting.py', fns: ['split_documents_into_sections', 'build_chunk_records'], d: 'Split on in-sequence numbered headings, then sentence-whole overlapping chunks.' },
    { f: 'vector_index.py', fns: ['build_vector_index', 'open_vector_index', 'search_documents'], d: 'Persistent Chroma, cosine distance, rebuild replaces not appends.' },
    { f: 'procedure_reading.py', fns: ['read_procedure_deadlines', 'read_customer_notice_exemption'], d: 'Regex over passages restricted to one procedure PDF. Raises if nothing is read.' },
  ] },
  { dir: 'tools', color: 'amber', blurb: 'Deterministic deadline maths, campaign aggregation and fact assemblers.', files: [
    { f: 'incident_data_tools.py', fns: ['fetch_incident_profile', 'fetch_incident_notes', 'fetch_campaign_incidents'], d: 'Single records from the in-memory queue; unknown refs raise.' },
    { f: 'prediction_tools.py', fns: ['build_harm_facts', 'build_attack_facts', 'estimate_containment_effort'], d: 'Model outputs → banded, labelled business facts.' },
    { f: 'deadline_tools.py', fns: ['select_applicable_procedures', 'compute_procedure_deadlines', 'compare_effort_with_deadline', 'compute_final_report_due', 'rank_incident_queue'], d: 'Every hour comes from a document reading; none is written here.' },
    { f: 'retrieval_tools.py', fns: ['read_reporting_duties', 'read_customer_steps'], d: 'Reads every applicable procedure and the playbook for customer steps.' },
  ] },
  { dir: 'agentic', color: 'rose', blurb: 'LangGraph state graph, nodes, agent prompts and checkpointing.', files: [
    { f: 'state.py', fns: ['IncidentAssessmentState'], d: '20 keys; llm_call_log accumulates, everything else replaces.' },
    { f: 'agents.py', fns: ['call_language_model', 'parse_labelled_response', 'plan_assessment', 'assess_harm', 'identify_attack', 'advise_on_reporting_duties', 'write_incident_assessment', 'draft_customer_notice', 'draft_regulator_filing'], d: 'Gemini client (key/model from .env), tolerant labelled-field parser, seven prompts.' },
    { f: 'nodes.py', fns: ['load_incident_context_node', 'plan_assessment_node', 'assess_harm_node', 'identify_attack_node', 'check_reporting_duties_node', 'compose_incident_assessment_node', 'request_dpo_decision_node', 'draft_customer_notice_node', 'draft_regulator_filing_node', 'record_incident_outcome_node'], d: 'Ten nodes; models and Chroma are loaded once at import.' },
    { f: 'graph.py', fns: ['build_workflow'], d: 'Linear six, the gate, a three-way branch, one end, SQLite checkpointer.' },
  ] },
  { dir: 'api', color: 'sky', blurb: 'FastAPI REST endpoints, Pydantic schemas, session auth.', files: [
    { f: 'schemas.py', fns: ['SignInRequest', 'SignedInUserResponse', 'QueueRow', 'IncidentDetailResponse', 'AssessmentRequest', 'DecisionRequest', 'SecurityIncidentResponse', 'CallBudgetResponse', 'ChatRequest', 'ChatResponse', 'ChatTurnResponse'], d: 'Every shape declared once; invalid requests get 422 before work.' },
    { f: 'routes.py', fns: ['authorize_request', 'sign_in_user', 'sign_out_user', 'list_incident_queue', 'get_incident_detail', 'start_incident_assessment', 'list_incidents', 'submit_dpo_decision', 'get_call_budget', 'ask_response_assistant', 'list_own_chat_turns', 'list_recent_chat_turns'], d: 'Two routers; everything but auth sits behind the guard. service_application is importable.' },
  ] },
  { dir: 'access', color: 'teal', blurb: 'Password hashing and path-based permissions.', files: [
    { f: 'password_security.py', fns: ['hash_password'], d: 'Salted, iterated hash; per-account salt.' },
    { f: 'permissions.py', fns: ['check_request_permission'], d: 'Area from AREA_BY_PATH_START; POST …/decision is always the DECISION area.' },
  ] },
  { dir: 'chat', color: 'fuchsia', blurb: 'Grounded response assistant and the disclosure line.', files: [
    { f: 'conversation_memory.py', fns: ['recall_conversation'], d: 'Last N turns from the DB (never from the client) as history + search text.' },
    { f: 'response_assistant.py', fns: ['answer_from_documents'], d: 'Two searches, casebook excluded, one LLM call, distance-guarded refusal.' },
    { f: 'incident_status_answer.py', fns: ['answer_incident_status'], d: 'Answers from the record, role-aware, no LLM.' },
  ] },
  { dir: 'persistence', color: 'orange', blurb: 'SQLAlchemy engine, six tables, the only query builder.', files: [
    { f: 'database.py', fns: ['database_engine', 'SessionFactory'], d: 'Built once at import; cross-thread safe.' },
    { f: 'models.py', fns: ['UserAccount', 'AgentRun', 'SecurityIncident', 'DpoDecision', 'LlmCall', 'ChatTurn'], d: 'DB-set timestamps; long Text columns for notices and filings.' },
    { f: 'repository.py', fns: ['insert_user_account', 'fetch_user_account', 'update_session_token', 'insert_agent_run', 'update_agent_run', 'insert_llm_call', 'fetch_llm_calls', 'insert_security_incident', 'record_incident_outcome', 'fetch_incident_records', 'insert_dpo_decision', 'insert_chat_turn', 'fetch_chat_turns'], d: 'Returns plain dicts, never ORM objects.' },
  ] },
  { dir: 'dashboard', color: 'lime', blurb: 'Streamlit five-page interface over the REST service.', files: [
    { f: 'api_client.py', fns: ['call_service'], d: 'Only place holding the base URL, timeout and session header.' },
    { f: 'incident_queue.py', fns: ['render_incident_queue_page'], d: 'Ranked queue, band filter, top-line counts.' },
    { f: 'incident_detail.py', fns: ['render_incident_detail_page'], d: 'Reporting clock, facts, harm/attack, effort, assess form.' },
    { f: 'decision_queue.py', fns: ['render_decision_queue_page'], d: 'PENDING_DECISION list and the decision form.' },
    { f: 'audit_trail.py', fns: ['render_audit_trail_page'], d: 'Decisions, documents, call budget, chat log.' },
    { f: 'response_chat.py', fns: ['render_response_chat_page'], d: 'Own conversation, type badges, sources.' },
  ] },
]

export const ENTRY_POINTS = [
  { n: 1, file: 'run_database_setup.py', title: 'Create the database', icon: 'Database', does: 'Creates database/breachwatch.db, the six tables and the 15 seed accounts (salted, hashed). Safe to re-run.', out: `database: database/breachwatch.db
  tables: agent_runs, chat_turns, dpo_decisions, llm_calls, security_incidents, user_accounts
  account created  ines   Ines Carvalho   Data Protection Officer
  account created  arjun  Arjun Menon     Data Protection Officer
  ...
  accounts created: 15, already present: 0` },
  { n: 2, file: 'run_data_pipeline.py', title: 'Clean the raw data', icon: 'Sparkles', does: 'Runs the five JOBS, writes processed/*.csv and output/data_quality_report.json.', out: `security_incidents_train   30728 received -> 29715 kept (1013 removed)
security_incidents_eval     8613 received ->  8308 kept  (305 removed)
containment_effort_train   29710 received -> 28611 kept (1099 removed)
containment_effort_eval     6132 received ->  5913 kept  (219 removed)
analyst_incident_notes     34685 received -> 32405 kept (2280 removed)

quality report written to output/data_quality_report.json` },
  { n: 3, file: 'run_model_training.py', title: 'Train the models', icon: 'Brain', does: 'Trains harm, effort and attack models, saves pipelines + schemas, writes output/model_metrics.json.', out: `training three models
  harm    <estimator>  eval ROC AUC N.NNNN  (train N.NNNN, gap +N.NNNN)
  effort  <estimator>  eval R2 N.NNNN  MAE N.NN h  (train N.NNNN, gap +N.NNNN)
  attack  <estimator>  eval macro F1 N.NNNN  (train N.NNNN, gap +N.NNNN)

metrics written to output/model_metrics.json
every model is above the minimum config sets for it` },
  { n: 4, file: 'run_knowledge_indexing.py', title: 'Build the knowledge base', icon: 'Library', does: 'Indexes the 16 PDFs into database/chroma_store, then reads each procedure back from its own document.', out: `building the incident response knowledge index
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
     <milestone>        within NN hours of <clock start>

customers need not be told where the data protection state is <state>` },
  { n: 5, file: 'run_api_service.py', title: 'Start the REST service', icon: 'Server', does: 'Checks REQUIRED_BEFORE_STARTING, then serves FastAPI on port 8082. Creates checkpoint.db on first pause.', out: `Starting BreachWatch AI API on port 8082. Interactive documentation: http://localhost:8082/docs
INFO:     Uvicorn running on http://0.0.0.0:8082 (Press CTRL+C to quit)

# run too early:
The service cannot start.
  output/models/harm_model.pkl is missing; it comes from run_model_training.py` },
  { n: 6, file: 'run_dashboard.py', title: 'Start the dashboard', icon: 'LayoutDashboard', cmd: 'python3 -m streamlit run run_dashboard.py', does: 'Streamlit sign-in and the role-filtered pages, all figures fetched from the service.', out: `  You can now view your Streamlit app in your browser.
  Local URL: http://localhost:8501` },
]

export const DECISIONS_DEEP = [
  { tag: 'Time', q: 'Why measure from the snapshot instead of the wall clock?', a: 'Reproducibility and auditability. The live queue is a frozen extract; measuring from SNAPSHOT_AT_UTC means the same incident yields the same hours remaining in tests, in the dashboard and at inspection. A deadline already passed is reported as negative hours, never clamped to nought — and nought itself counts as overdue.' },
  { tag: 'Compliance', q: 'Why read deadlines from PDFs at runtime instead of config?', a: 'Procedures change; code drifts. Keeping hours out of code means one source of truth. The config holds only the regex patterns and the two clock-start phrases (mapped by CLOCK_START_COLUMN_BY_PHRASE). If a procedure’s passages state no milestone, reading raises PROCEDURE_UNREAD_MESSAGE rather than returning an empty — and silently permissive — result.' },
  { tag: 'RAG', q: 'Why restrict each lookup to one document?', a: 'The three procedures are written from one template with shared sentences. A corpus-wide semantic search answers a question about Procedure 03 with Procedure 01’s words — confidently and wrongly. Filtering by document_name via PROCEDURE_DOCUMENT_BY_CODE makes cross-contamination structurally impossible.' },
  { tag: 'Data', q: 'Why median fill and an explicit UNKNOWN category?', a: 'The median cannot be dragged by one extreme row. Categories get UNKNOWN_CATEGORY_VALUE so a page never shows a gap and a model can learn that "not recorded" is itself information.' },
  { tag: 'Agents', q: 'Why exactly one LLM call per agent and labelled fields?', a: 'A fixed budget (5 / 6 / 7 calls) makes cost and behaviour auditable per run — the call-budget endpoint compares actual vs. expected. Labelled fields (e.g. PRIORITY:, CHECKS:) are parsed tolerantly but strictly: a missing label raises, so an assessment with an empty section is never stored.' },
  { tag: 'Agents', q: 'Why are the stored figures from tools, not from agent prose?', a: 'A number an LLM wrote cannot be reproduced. compose_incident_assessment stores harm_probability, deadlines and effort from tool output; only the narrative and the validated disposition come from the agent.' },
  { tag: 'Durability', q: 'Why checkpoint the gate to SQLite?', a: 'A DPO might decide hours later, after a deploy or reboot. LangGraph’s SQLite checkpointer persists the paused state under a per-run thread_id built from the incident reference, so resuming works in another process.' },
  { tag: 'Security', q: 'Why identical sign-in failures and constant-time compare?', a: 'Different messages for "unknown user" and "wrong password" enumerate usernames. Constant-time comparison stops timing leaks. Tokens are fresh SESSION_TOKEN_BYTES per sign-in, and the guard — not the dashboard — refuses with 401/403.' },
  { tag: 'API', q: 'Why 404 / 409 / 422 / 502 instead of empty results?', a: 'An empty list reads as success. Unknown incidents get 404, a second decision 409, out-of-set values 422, and any LLM failure 502 with the reason — so the dashboard can say what actually went wrong.' },
]
