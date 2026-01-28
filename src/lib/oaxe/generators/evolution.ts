import type { BrandDNA, OaxeOutput } from '../types';

/**
 * M8: Evolution Roadmap Generator
 *
 * Generates a credible v1 → v2 → v3 evolution roadmap that explains
 * what ships now (unfair MVP), how the product scales and builds a moat,
 * and how it becomes category-defining.
 *
 * Written like a strong founder + staff engineer collaboration.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface VersionPhase {
  version: string;
  title: string;
  timeline: string;
  sections: {
    problemStatement?: string;
    mustHaveFeatures?: string[];
    notBuilt?: string[];
    targetUser?: string;
    useCase?: string;
    successMetrics?: string[];
    technicalConstraints?: string[];
    featureExpansions?: string[];
    architectureEvolution?: string[];
    scalingConsiderations?: string[];
    monetization?: string;
    moatBuilding?: string[];
    categoryExpansion?: string;
    platformStrategy?: string;
    advancedMonetization?: string;
    partnerships?: string[];
    differentiationNarrative?: string;
  };
}

export interface FeatureProgression {
  feature: string;
  v1: string;
  v2: string;
  v3: string;
}

export interface EvolutionRoadmap {
  appName: string;
  category: string;
  generatedAt: string;
  v1: VersionPhase;
  v2: VersionPhase;
  v3: VersionPhase;
  featureProgression: FeatureProgression[];
  architectureNotes: {
    v1ToV2: string[];
    v2ToV3: string[];
    technicalDebt: string[];
  };
  monetizationEvolution: {
    v1: string;
    v2: string;
    v3: string;
  };
}

// ============================================================================
// CATEGORY-SPECIFIC TEMPLATES
// ============================================================================

interface CategoryTemplate {
  problemStatement: string;
  targetUser: string;
  v1MustHave: string[];
  v1NotBuilt: string[];
  v1Metrics: string[];
  v1Constraints: string[];
  v2Expansions: string[];
  v2Architecture: string[];
  v2Scaling: string[];
  v2Moat: string[];
  v3Category: string;
  v3Platform: string;
  v3Partnerships: string[];
  v3Differentiation: string;
  featureExamples: { name: string; v1: string; v2: string; v3: string }[];
  archV1V2: string[];
  archV2V3: string[];
  techDebt: string[];
  monetization: { v1: string; v2: string; v3: string };
}

const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  legal: {
    problemStatement: 'Law firms waste 30% of billable hours on administrative overhead—intake forms, matter tracking, deadline management, and client communication spread across disconnected tools.',
    targetUser: 'Solo practitioners and small firm partners (2-10 attorneys) who handle their own client intake and matter management.',
    v1MustHave: [
      'Client intake with conflict checking',
      'Matter timeline with deadline tracking',
      'Document attachment to matters',
      'Basic time entry linked to matters',
      'Client portal for document sharing',
    ],
    v1NotBuilt: [
      'Court filing integration',
      'Billing/invoicing (use existing tools)',
      'Trust accounting',
      'Multi-jurisdiction calendar rules',
      'E-discovery workflows',
    ],
    v1Metrics: [
      'Time to create new matter < 2 minutes',
      'Zero missed deadlines after 30 days',
      '80% reduction in "where is this document" questions',
      'Client NPS > 50',
    ],
    v1Constraints: [
      'No database migration from existing systems',
      'Works offline for court appearances',
      'Mobile-first for intake on the go',
    ],
    v2Expansions: [
      'Calendar rule engine for jurisdiction-specific deadlines',
      'Templated document generation with merge fields',
      'Client-facing mobile app for status updates',
      'Basic billing with time-to-invoice workflow',
      'Matter analytics dashboard',
    ],
    v2Architecture: [
      'Add background job system for deadline calculations',
      'Introduce document template engine',
      'Add webhook system for integrations',
    ],
    v2Scaling: [
      'Multi-user concurrent editing on matters',
      'Document storage scales to 10GB per firm',
      'API rate limits for third-party integrations',
    ],
    v2Moat: [
      'Deadline rule library grows with each firm (network effect)',
      'Client portal creates switching cost—clients expect updates',
      'Matter history becomes institutional knowledge',
    ],
    v3Category: 'From case management to "legal operations infrastructure" serving the entire client-firm relationship lifecycle.',
    v3Platform: 'Marketplace for legal templates, integrations with court e-filing systems, and a network of vetted service providers (process servers, expert witnesses).',
    v3Partnerships: [
      'Court e-filing system integrations (state by state)',
      'Legal research providers (Westlaw, Casetext)',
      'Professional liability insurers for risk scoring',
    ],
    v3Differentiation: 'The only system where matter data, deadlines, documents, and client communication live together—creating a complete audit trail that reduces malpractice risk.',
    featureExamples: [
      { name: 'Deadline Tracking', v1: 'Manual entry with reminders', v2: 'Jurisdiction-aware auto-calculation', v3: 'Predictive risk scoring based on workload' },
      { name: 'Client Communication', v1: 'Portal with document sharing', v2: 'Mobile app with push notifications', v3: 'AI-drafted status updates from matter activity' },
      { name: 'Billing', v1: 'Export time entries to CSV', v2: 'Built-in invoicing with templates', v3: 'Value-based pricing suggestions from outcome data' },
    ],
    archV1V2: [
      'Add PostgreSQL for relational matter data (from SQLite)',
      'Introduce Redis for session management and caching',
      'Background workers for deadline calculations',
    ],
    archV2V3: [
      'Event sourcing for complete audit trails',
      'Multi-tenant architecture for managed hosting',
      'ML pipeline for risk and outcome predictions',
    ],
    techDebt: [
      'v1 deadline logic is hardcoded—needs abstraction for rule engine',
      'Document storage uses local filesystem—needs S3 migration',
      'Client portal auth is session-based—needs OAuth for mobile',
    ],
    monetization: {
      v1: 'Free during beta, then $49/user/month. No annual contracts.',
      v2: '$79/user/month with client portal. Enterprise tier at $149/user with API access.',
      v3: 'Platform fees on marketplace transactions (15%). Compliance certification add-on for large firms.',
    },
  },
  finance: {
    problemStatement: 'Small business owners spend 8+ hours weekly on bookkeeping, reconciliation, and financial reporting using tools designed for accountants, not operators.',
    targetUser: 'Owner-operators of service businesses ($100K-$5M revenue) who currently use spreadsheets or basic accounting software.',
    v1MustHave: [
      'Bank connection with auto-categorization',
      'Invoice creation and tracking',
      'Expense logging with receipt capture',
      'Cash flow dashboard',
      'Basic P&L and balance sheet',
    ],
    v1NotBuilt: [
      'Payroll processing',
      'Multi-currency support',
      'Inventory tracking',
      'Tax filing',
      'AP/AR aging automation',
    ],
    v1Metrics: [
      'Bank reconciliation time < 5 minutes/week',
      '90% transaction auto-categorization accuracy',
      'Invoice payment time reduced by 40%',
      'Weekly active usage > 3 sessions',
    ],
    v1Constraints: [
      'Bank connections via Plaid (supported institutions only)',
      'US-only for v1 (tax/regulatory simplicity)',
      'No real-time sync—daily batch updates',
    ],
    v2Expansions: [
      'Recurring invoices and payment plans',
      'Expense approval workflows',
      'Budget vs actual tracking',
      'Accountant collaboration portal',
      'Basic forecasting from historical data',
    ],
    v2Architecture: [
      'Add async job processing for bank sync',
      'Introduce multi-tenancy for accountant access',
      'Build reporting engine for custom reports',
    ],
    v2Scaling: [
      'Handle 10K+ transactions per account per month',
      'Multi-entity support for business owners with multiple LLCs',
      'Concurrent accountant and owner access',
    ],
    v2Moat: [
      'Transaction history creates switching cost (data portability is painful)',
      'Accountant network—their clients stay on the platform',
      'Categorization model improves with volume',
    ],
    v3Category: 'From bookkeeping software to "financial operations OS" that connects books to actual business decisions.',
    v3Platform: 'Integration marketplace for vertical-specific add-ons, lending/financing referrals based on financial health, and fractional CFO services.',
    v3Partnerships: [
      'Neo-banks for seamless account opening',
      'Revenue-based financing providers',
      'Vertical SaaS platforms (restaurants, contractors)',
    ],
    v3Differentiation: 'Financial data connected to business context—not just numbers, but what they mean for this specific business type.',
    featureExamples: [
      { name: 'Categorization', v1: 'Rule-based with manual review', v2: 'ML model trained on business type', v3: 'Predictive with anomaly detection' },
      { name: 'Reporting', v1: 'Standard P&L and balance sheet', v2: 'Custom report builder', v3: 'Automated insights and recommendations' },
      { name: 'Cash Flow', v1: 'Historical view', v2: '30-day forecast', v3: 'Scenario planning with what-if analysis' },
    ],
    archV1V2: [
      'Move from SQLite to PostgreSQL',
      'Add job queue for bank sync workers',
      'Introduce RBAC for multi-user access',
    ],
    archV2V3: [
      'Data warehouse for reporting and analytics',
      'ML infrastructure for predictions',
      'Event streaming for real-time updates',
    ],
    techDebt: [
      'v1 categorization rules are in code—needs database-driven config',
      'Bank sync is synchronous—needs async with retry logic',
      'Reports are hardcoded—needs dynamic report engine',
    ],
    monetization: {
      v1: 'Free for <50 transactions/month. $29/month for unlimited.',
      v2: '$49/month with forecasting. $99/month with accountant portal and unlimited entities.',
      v3: 'Referral fees from financing partners (1-2% of funded amount). Premium insights tier at $199/month.',
    },
  },
  wellness: {
    problemStatement: 'Wellness apps either gamify habits into addictive loops or provide generic advice that ignores individual rhythms and real-life constraints.',
    targetUser: 'Professionals aged 28-45 who have tried multiple wellness apps and quit, seeking sustainable habits without the productivity guilt.',
    v1MustHave: [
      'Personalized ritual builder (not preset programs)',
      'Flexible check-in without streaks',
      'Mood and energy tracking',
      'Simple journaling prompts',
      'Weekly reflection summaries',
    ],
    v1NotBuilt: [
      'Social features or leaderboards',
      'Wearable device integration',
      'Nutrition tracking',
      'Workout libraries',
      'Meditation audio content',
    ],
    v1Metrics: [
      '60-day retention > 40% (vs industry 15%)',
      'Average session length > 3 minutes',
      'Self-reported "feels helpful" > 80%',
      'Zero notifications marked as annoying',
    ],
    v1Constraints: [
      'Offline-first for use during device-free time',
      'No external accounts required',
      'Privacy-first—no data sharing or ads',
    ],
    v2Expansions: [
      'Pattern recognition across moods and habits',
      'Gentle scheduling suggestions based on energy',
      'Optional friend accountability (invite-only)',
      'Guided breathing and focus sessions',
      'Export to therapist/coach',
    ],
    v2Architecture: [
      'Add local ML for pattern detection',
      'Introduce encrypted cloud sync',
      'Build notification scheduling system',
    ],
    v2Scaling: [
      'Multi-year data retention with efficient storage',
      'Cross-device sync without account friction',
      'Batch processing for weekly insights',
    ],
    v2Moat: [
      'Personal data history creates emotional switching cost',
      'Pattern insights get more accurate over time',
      'Therapist/coach exports create professional trust',
    ],
    v3Category: 'From habit tracker to "personal operating rhythm" platform that integrates life context (calendar, location, season).',
    v3Platform: 'Coach and therapist marketplace with client data sharing (consent-based), content partnerships for guided practices, API for health apps that want gentle defaults.',
    v3Partnerships: [
      'Corporate wellness programs (B2B2C)',
      'Health insurance wellness incentives',
      'Therapist platforms for data continuity',
    ],
    v3Differentiation: 'The only wellness tool that learns your rhythm without judgment, gamification, or social comparison—sustainable by design.',
    featureExamples: [
      { name: 'Habits', v1: 'Self-defined rituals, flexible timing', v2: 'Suggested timing based on patterns', v3: 'Auto-adjusted for life events (travel, illness)' },
      { name: 'Tracking', v1: 'Manual mood/energy check-in', v2: 'Pattern correlation across variables', v3: 'Predictive energy forecasting' },
      { name: 'Accountability', v1: 'Personal reflection only', v2: 'Invite-only friend circles', v3: 'Professional coach integration' },
    ],
    archV1V2: [
      'Add on-device ML framework for patterns',
      'Introduce E2E encrypted sync',
      'Build adaptive notification system',
    ],
    archV2V3: [
      'Federated learning for population insights without data sharing',
      'Calendar and location API integrations',
      'Multi-tenant coach/therapist portal',
    ],
    techDebt: [
      'v1 data model is flat—needs relational structure for patterns',
      'Notification timing is static—needs dynamic scheduling',
      'Export is manual—needs automated sharing protocols',
    ],
    monetization: {
      v1: 'Free for core features. $5/month for unlimited history and advanced prompts.',
      v2: '$9/month with pattern insights and cloud sync. Annual plan at $79.',
      v3: 'B2B licensing for corporate wellness ($3/employee/month). Coach marketplace fees (20% of session bookings).',
    },
  },
  technology: {
    problemStatement: 'Developer tools assume you already know what you need. Setup friction, configuration complexity, and undocumented edge cases slow teams down.',
    targetUser: 'Small engineering teams (3-15 engineers) at startups who need to ship fast without dedicated DevOps.',
    v1MustHave: [
      'One-command project setup',
      'Sensible defaults with escape hatches',
      'Local development that mirrors production',
      'Clear error messages with fix suggestions',
      'Configuration as code (versionable)',
    ],
    v1NotBuilt: [
      'Cloud hosting or deployment',
      'Team collaboration features',
      'Monitoring and alerting',
      'CI/CD pipelines',
      'Multi-region support',
    ],
    v1Metrics: [
      'Setup to first request < 5 minutes',
      'Zero "works on my machine" issues',
      'Documentation search success > 90%',
      'GitHub stars as proxy for adoption',
    ],
    v1Constraints: [
      'Works on Mac, Linux, and WSL2',
      'No proprietary cloud dependencies',
      'Runs in CI environments without modification',
    ],
    v2Expansions: [
      'Team configuration sharing',
      'Basic deployment to major clouds',
      'Environment variable management',
      'Integration test helpers',
      'Plugin system for extensions',
    ],
    v2Architecture: [
      'Add plugin architecture with stable API',
      'Introduce remote state management',
      'Build cloud adapter abstraction',
    ],
    v2Scaling: [
      'Support monorepos with 100+ packages',
      'Parallel execution for CI speed',
      'Incremental builds based on change detection',
    ],
    v2Moat: [
      'Plugin ecosystem creates community investment',
      'Team configurations become institutional knowledge',
      'Open source contributions build trust and lock-in',
    ],
    v3Category: 'From developer tool to "developer platform" that handles the full local-to-production lifecycle.',
    v3Platform: 'Managed cloud offering for teams who want zero-ops, plugin marketplace with revenue sharing, enterprise support contracts.',
    v3Partnerships: [
      'Cloud providers for native integrations',
      'CI/CD platforms for deep integration',
      'Enterprise vendors for compliance certifications',
    ],
    v3Differentiation: 'The only developer tool that prioritizes "time to productive" over feature count—complexity is opt-in, not default.',
    featureExamples: [
      { name: 'Setup', v1: 'CLI with interactive prompts', v2: 'Team templates with customization', v3: 'AI-assisted from README or existing code' },
      { name: 'Configuration', v1: 'Single config file with comments', v2: 'Environment-specific overrides', v3: 'Drift detection and auto-remediation' },
      { name: 'Deployment', v1: 'Export for manual deploy', v2: 'Push-button to major clouds', v3: 'Managed hosting with preview environments' },
    ],
    archV1V2: [
      'Introduce plugin system with versioned API',
      'Add remote state backend option',
      'Build cloud provider abstraction layer',
    ],
    archV2V3: [
      'Add control plane for managed offering',
      'Introduce usage-based billing infrastructure',
      'Build enterprise RBAC and audit logging',
    ],
    techDebt: [
      'v1 cloud logic is hardcoded—needs provider abstraction',
      'Config parsing is custom—needs standard format support',
      'Error messages are static—needs context-aware suggestions',
    ],
    monetization: {
      v1: 'Free and open source. No commercial offering.',
      v2: 'Open source core. Pro plugins at $19/month for teams.',
      v3: 'Managed cloud at $99/month/team. Enterprise at $499/month with SSO and support.',
    },
  },
  productivity: {
    problemStatement: 'Task management tools optimize for capturing tasks, not completing them. Users drown in lists that never shrink.',
    targetUser: 'Individual knowledge workers who manage their own work across multiple projects and contexts.',
    v1MustHave: [
      'Quick capture from anywhere',
      'Context-based task views (not just projects)',
      'Simple prioritization (today, next, someday)',
      'Completion-focused design',
      'Weekly review workflow',
    ],
    v1NotBuilt: [
      'Team collaboration',
      'Time tracking',
      'Calendar integration',
      'Recurring tasks',
      'File attachments',
    ],
    v1Metrics: [
      'Tasks completed per week > tasks created',
      'Daily active use > 5 days/week',
      'Inbox zero achievable in < 10 minutes',
      'User-reported stress reduction',
    ],
    v1Constraints: [
      'Works offline',
      'Keyboard-first for speed',
      'No account required for local use',
    ],
    v2Expansions: [
      'Calendar view with time blocking',
      'Recurring task patterns',
      'Project templates',
      'Basic reporting on completion trends',
      'Mobile app with quick capture',
    ],
    v2Architecture: [
      'Add sync infrastructure for cross-device',
      'Introduce recurrence calculation engine',
      'Build notification scheduling system',
    ],
    v2Scaling: [
      'Handle 10K+ tasks per user',
      'Multi-year archive with search',
      'Efficient sync for spotty connections',
    ],
    v2Moat: [
      'Task history becomes personal knowledge base',
      'Completion patterns enable personalized suggestions',
      'Workflow habits create strong retention',
    ],
    v3Category: 'From task manager to "personal work operating system" that connects tasks to time, energy, and outcomes.',
    v3Platform: 'Integrations with work tools (email, Slack, docs), automation marketplace, team version with shared visibility.',
    v3Partnerships: [
      'Calendar providers for native integration',
      'Email clients for task extraction',
      'Focus apps for distraction blocking',
    ],
    v3Differentiation: 'The only task system designed around completion psychology, not just organization—fewer tasks, actually done.',
    featureExamples: [
      { name: 'Capture', v1: 'Global shortcut, instant inbox', v2: 'Email forwarding, Slack integration', v3: 'AI extraction from meeting notes' },
      { name: 'Prioritization', v1: 'Manual three-tier (today/next/someday)', v2: 'Deadline and effort aware', v3: 'Auto-suggested based on patterns and energy' },
      { name: 'Review', v1: 'Weekly review checklist', v2: 'Guided review with prompts', v3: 'Adaptive review frequency based on load' },
    ],
    archV1V2: [
      'Add real-time sync with CRDT',
      'Introduce background workers for reminders',
      'Build integration webhook system',
    ],
    archV2V3: [
      'Add ML pipeline for suggestions',
      'Introduce team workspace layer',
      'Build automation engine',
    ],
    techDebt: [
      'v1 storage is local-only—needs sync protocol',
      'Prioritization logic is user-defined—needs smart defaults',
      'Notifications are platform-specific—needs abstraction',
    ],
    monetization: {
      v1: 'Free for local use. $6/month for sync and mobile.',
      v2: '$12/month with integrations and reporting.',
      v3: 'Team tier at $15/user/month. Enterprise with SSO at $25/user/month.',
    },
  },
  healthcare: {
    problemStatement: 'Healthcare coordination is fragmented—patients juggle multiple providers, portals, and care instructions with no unified view.',
    targetUser: 'Patients managing chronic conditions or coordinating care across multiple specialists.',
    v1MustHave: [
      'Unified health record view (patient-controlled)',
      'Medication list with reminders',
      'Appointment tracking across providers',
      'Care instructions storage',
      'Emergency info card',
    ],
    v1NotBuilt: [
      'Provider-side tools',
      'Insurance claims',
      'Telehealth',
      'Lab result interpretation',
      'Prescription ordering',
    ],
    v1Metrics: [
      'Medication adherence improvement > 20%',
      'Missed appointments reduced by 50%',
      'User-reported confidence in care management > 80%',
      'Emergency info accessed in < 10 seconds',
    ],
    v1Constraints: [
      'No PHI storage on servers (local-first)',
      'HIPAA-compliant by architecture',
      'Works without internet for emergencies',
    ],
    v2Expansions: [
      'Caregiver access with permissions',
      'Provider record import (FHIR)',
      'Symptom tracking and trends',
      'Care team communication hub',
      'Appointment prep checklists',
    ],
    v2Architecture: [
      'Add FHIR adapter for record import',
      'Introduce permission system for sharing',
      'Build encrypted cloud backup (optional)',
    ],
    v2Scaling: [
      'Multi-decade health history',
      'Family accounts with separate records',
      'Large file support for imaging',
    ],
    v2Moat: [
      'Health history is irreplaceable data',
      'Provider connections create stickiness',
      'Family accounts expand user base organically',
    ],
    v3Category: 'From health record to "care coordination platform" bridging patients, caregivers, and providers.',
    v3Platform: 'Provider-facing tools for care continuity, clinical trial matching, health plan integrations for care gap closure.',
    v3Partnerships: [
      'Health systems for bidirectional data flow',
      'Pharmacies for medication sync',
      'Insurance plans for care management programs',
    ],
    v3Differentiation: 'Patient-controlled health data that follows them across providers, payers, and life stages—continuity without vendor lock-in.',
    featureExamples: [
      { name: 'Records', v1: 'Manual entry and document storage', v2: 'FHIR import from providers', v3: 'Bi-directional sync with consent' },
      { name: 'Medications', v1: 'List with basic reminders', v2: 'Interaction checking, refill tracking', v3: 'Pharmacy integration, auto-refills' },
      { name: 'Care Team', v1: 'Contact list', v2: 'Secure messaging hub', v3: 'Shared care plan with task coordination' },
    ],
    archV1V2: [
      'Add FHIR client library',
      'Introduce end-to-end encryption for sync',
      'Build permission model for sharing',
    ],
    archV2V3: [
      'Add provider-side API for integration',
      'Introduce consent management system',
      'Build clinical data pipeline for matching',
    ],
    techDebt: [
      'v1 data model is flat—needs FHIR alignment',
      'Encryption is file-level—needs field-level for sharing',
      'Reminders are local—needs cross-device sync',
    ],
    monetization: {
      v1: 'Free for individuals. Premium at $4/month for cloud backup.',
      v2: '$8/month for family accounts and provider connections.',
      v3: 'B2B to health systems ($1/patient/month). Care management program fees from payers.',
    },
  },
  creative: {
    problemStatement: 'Creative project management tools force linear workflows on non-linear work. Creatives need flexible structure, not rigid processes.',
    targetUser: 'Freelance designers, writers, and content creators managing multiple client projects.',
    v1MustHave: [
      'Flexible project boards (not just kanban)',
      'Asset organization with preview',
      'Version history without manual naming',
      'Client feedback collection',
      'Simple time tracking per project',
    ],
    v1NotBuilt: [
      'Design tool integrations',
      'Automated invoicing',
      'Team workspaces',
      'Advanced analytics',
      'Content calendars',
    ],
    v1Metrics: [
      'Project organization time reduced by 50%',
      'Client feedback turnaround < 24 hours',
      'Version confusion eliminated',
      'Weekly active usage > 4 sessions',
    ],
    v1Constraints: [
      'Works with existing file storage (no migration)',
      'Large file support (100MB+)',
      'Clean, distraction-free interface',
    ],
    v2Expansions: [
      'Figma/Sketch plugin for asset sync',
      'Client portal with approval workflows',
      'Project templates from past work',
      'Basic invoicing from time logs',
      'Mood boards and inspiration collection',
    ],
    v2Architecture: [
      'Add plugin system for tool integrations',
      'Introduce client-facing portal',
      'Build workflow automation engine',
    ],
    v2Scaling: [
      'Multi-GB asset libraries',
      'Concurrent client and creator access',
      'Archive system for completed projects',
    ],
    v2Moat: [
      'Project history becomes portfolio/reference library',
      'Client relationships stored create repeat business value',
      'Templates encode personal workflow',
    ],
    v3Category: 'From project management to "creative business OS" managing client relationships, work, and finances.',
    v3Platform: 'Marketplace for templates and workflows, client matchmaking, creative resource network.',
    v3Partnerships: [
      'Design tool companies for deep integration',
      'Stock asset providers',
      'Creative education platforms',
    ],
    v3Differentiation: 'The only creative project tool that treats the work itself as the organizing principle—assets, feedback, and versions connected naturally.',
    featureExamples: [
      { name: 'Asset Management', v1: 'Link to existing storage', v2: 'Design tool sync with versions', v3: 'AI-organized asset library' },
      { name: 'Feedback', v1: 'Share link, collect comments', v2: 'Approval workflows with rounds', v3: 'Client self-service revisions' },
      { name: 'Billing', v1: 'Time export to spreadsheet', v2: 'Invoice generation from time', v3: 'Contract management, milestone billing' },
    ],
    archV1V2: [
      'Add plugin architecture for integrations',
      'Introduce client tenant layer',
      'Build asset processing pipeline',
    ],
    archV2V3: [
      'Add ML for asset organization',
      'Introduce marketplace infrastructure',
      'Build advanced permission model',
    ],
    techDebt: [
      'v1 asset handling is links only—needs direct storage option',
      'Feedback is unstructured—needs approval state machine',
      'Time tracking is manual—needs automatic detection',
    ],
    monetization: {
      v1: 'Free for 3 projects. $15/month for unlimited.',
      v2: '$25/month with integrations and client portal.',
      v3: 'Agency tier at $20/user/month. Template marketplace revenue share (30%).',
    },
  },
  education: {
    problemStatement: 'Learning platforms optimize for course completion, not actual understanding. Learners forget 80% within a month.',
    targetUser: 'Self-directed adult learners pursuing professional skills outside formal education.',
    v1MustHave: [
      'Personal knowledge repository',
      'Spaced repetition for retention',
      'Progress tracking by skill, not course',
      'Note-taking connected to sources',
      'Learning goal setting',
    ],
    v1NotBuilt: [
      'Course content creation',
      'Social learning features',
      'Certifications',
      'Video hosting',
      'Live sessions',
    ],
    v1Metrics: [
      '30-day retention of material > 60%',
      'Daily practice consistency > 5 days/week',
      'Self-reported skill improvement',
      'Return to platform after completing a goal',
    ],
    v1Constraints: [
      'Works with content from any source',
      'Mobile-friendly for commute learning',
      'No account needed for local use',
    ],
    v2Expansions: [
      'Learning path recommendations',
      'Integration with popular courses',
      'Study group matching',
      'Progress sharing for accountability',
      'Knowledge gap identification',
    ],
    v2Architecture: [
      'Add recommendation engine',
      'Introduce social graph for groups',
      'Build content aggregation pipeline',
    ],
    v2Scaling: [
      'Multi-year learning history',
      'Large knowledge bases (10K+ items)',
      'Cross-device sync with offline access',
    ],
    v2Moat: [
      'Knowledge base is personal intellectual capital',
      'Spaced repetition schedules require continuity',
      'Learning network creates community lock-in',
    ],
    v3Category: 'From learning tool to "skill development platform" connecting learning to career outcomes.',
    v3Platform: 'Skill verification for employers, mentor marketplace, learning content partnerships.',
    v3Partnerships: [
      'Course platforms for integration',
      'Employers for skill verification',
      'Professional communities for content',
    ],
    v3Differentiation: 'The only learning platform that measures retention, not just completion—proof you actually know it.',
    featureExamples: [
      { name: 'Retention', v1: 'Basic spaced repetition', v2: 'Adaptive scheduling by difficulty', v3: 'Predictive forgetting curves per concept' },
      { name: 'Content', v1: 'User-added from any source', v2: 'Course platform integrations', v3: 'AI-generated review materials' },
      { name: 'Progress', v1: 'Self-defined skill tracking', v2: 'Gap analysis and recommendations', v3: 'Verifiable skill credentials' },
    ],
    archV1V2: [
      'Add recommendation ML model',
      'Introduce course platform APIs',
      'Build group messaging system',
    ],
    archV2V3: [
      'Add credential verification system',
      'Introduce employer-facing API',
      'Build content licensing infrastructure',
    ],
    techDebt: [
      'v1 spaced repetition is basic—needs adaptive algorithm',
      'Content is user-only—needs integration layer',
      'Progress is self-reported—needs validation system',
    ],
    monetization: {
      v1: 'Free for core features. $7/month for unlimited knowledge base.',
      v2: '$14/month with integrations and learning paths.',
      v3: 'Skill verification fees ($20/credential). B2B for corporate learning ($8/user/month).',
    },
  },
  ecommerce: {
    problemStatement: 'Small sellers use tools built for large retailers. The overhead of inventory, shipping, and customer management overwhelms single operators.',
    targetUser: 'Solo e-commerce operators selling $10K-$500K annually across 1-3 channels.',
    v1MustHave: [
      'Unified order management',
      'Simple inventory tracking',
      'Shipping label generation',
      'Customer list with purchase history',
      'Basic sales dashboard',
    ],
    v1NotBuilt: [
      'Multi-warehouse',
      'Dropshipping automation',
      'Marketing tools',
      'Advanced analytics',
      'B2B/wholesale',
    ],
    v1Metrics: [
      'Order processing time < 2 minutes',
      'Inventory accuracy > 98%',
      'Shipping cost reduction > 15%',
      'Customer lookup time < 10 seconds',
    ],
    v1Constraints: [
      'Integrates with existing sales channels',
      'No minimum order volume',
      'Works on mobile for packing',
    ],
    v2Expansions: [
      'Multi-channel inventory sync',
      'Returns management',
      'Basic email marketing',
      'Profitability by product',
      'Supplier reorder alerts',
    ],
    v2Architecture: [
      'Add channel sync workers',
      'Introduce campaign system',
      'Build profitability calculation engine',
    ],
    v2Scaling: [
      '10K+ SKUs',
      '1K+ orders/day throughput',
      'Multi-location inventory',
    ],
    v2Moat: [
      'Order history enables customer insights',
      'Channel connections create operational dependency',
      'Profitability data informs business decisions',
    ],
    v3Category: 'From order management to "e-commerce operating system" for growing brands.',
    v3Platform: 'Supplier network, fulfillment partnerships, brand growth services.',
    v3Partnerships: [
      '3PL providers for outsourced fulfillment',
      'Suppliers for direct ordering',
      'Marketing agencies for brand growth',
    ],
    v3Differentiation: 'The only e-commerce tool designed for the operator who does everything—consolidated, not fragmented.',
    featureExamples: [
      { name: 'Orders', v1: 'Manual import, unified view', v2: 'Real-time sync across channels', v3: 'Predictive ordering from sales velocity' },
      { name: 'Inventory', v1: 'Single location tracking', v2: 'Multi-location with transfers', v3: 'Automated reordering, supplier integration' },
      { name: 'Customers', v1: 'List with purchase history', v2: 'Segmentation and basic CRM', v3: 'Lifecycle automation, loyalty programs' },
    ],
    archV1V2: [
      'Add channel API integrations',
      'Introduce async sync workers',
      'Build multi-location inventory model',
    ],
    archV2V3: [
      'Add supplier integration layer',
      'Introduce 3PL API connections',
      'Build advanced analytics pipeline',
    ],
    techDebt: [
      'v1 channel integration is polling—needs webhooks',
      'Inventory is simple counts—needs lot/serial tracking option',
      'Customer data is flat—needs relational model',
    ],
    monetization: {
      v1: 'Free for <100 orders/month. $29/month for unlimited.',
      v2: '$59/month with multi-channel sync and marketing tools.',
      v3: 'Transaction fees on 3PL/supplier orders (1%). Growth services as add-ons.',
    },
  },
  social: {
    problemStatement: 'Social platforms optimize for engagement, not meaningful connection. Users feel drained, not connected.',
    targetUser: 'People seeking genuine community around specific interests, not broad social networking.',
    v1MustHave: [
      'Interest-based group creation',
      'Discussion threads with depth',
      'Member profiles with context',
      'Event/meetup coordination',
      'Respectful notification defaults',
    ],
    v1NotBuilt: [
      'Algorithmic feed',
      'Advertising',
      'Follower counts',
      'Content monetization',
      'Cross-platform sharing',
    ],
    v1Metrics: [
      'Message depth (replies per thread) > 5',
      'Return visits driven by content, not notifications',
      'Member retention > 60% at 90 days',
      'Self-reported quality of connections',
    ],
    v1Constraints: [
      'No engagement-maximizing algorithms',
      'Privacy by default',
      'Moderation tools for community safety',
    ],
    v2Expansions: [
      'Sub-groups within communities',
      'Collaborative documents/wikis',
      'Member directory with search',
      'Integration with calendar apps',
      'Mobile apps with gentle notifications',
    ],
    v2Architecture: [
      'Add real-time messaging infrastructure',
      'Introduce collaborative editing',
      'Build calendar sync system',
    ],
    v2Scaling: [
      'Communities up to 10K members',
      'Message history preservation',
      'Media storage for community content',
    ],
    v2Moat: [
      'Community relationships create strong retention',
      'Content history is collective memory',
      'Moderation norms become community culture',
    ],
    v3Category: 'From community platform to "relationship infrastructure" for interest-based networks.',
    v3Platform: 'Inter-community connections, event hosting services, community analytics for organizers.',
    v3Partnerships: [
      'Event platforms for seamless hosting',
      'Professional communities for networking',
      'Educational institutions for learning communities',
    ],
    v3Differentiation: 'The only social platform designed for depth over breadth—quality connections, not follower counts.',
    featureExamples: [
      { name: 'Discussion', v1: 'Threaded conversations', v2: 'Rich media, collaborative docs', v3: 'AI-summarized threads, knowledge base' },
      { name: 'Events', v1: 'Basic RSVP and details', v2: 'Calendar integration, reminders', v3: 'Hybrid virtual/in-person, recording archive' },
      { name: 'Discovery', v1: 'Browse public communities', v2: 'Interest matching, recommendations', v3: 'Cross-community connections, skill matching' },
    ],
    archV1V2: [
      'Add WebSocket infrastructure for real-time',
      'Introduce collaborative editing (CRDT)',
      'Build moderation queue system',
    ],
    archV2V3: [
      'Add recommendation engine',
      'Introduce cross-community graph',
      'Build event streaming platform',
    ],
    techDebt: [
      'v1 messaging is polling—needs WebSocket',
      'Moderation is manual—needs ML assistance',
      'Search is basic—needs full-text indexing',
    ],
    monetization: {
      v1: 'Free for communities < 100 members. $10/month for larger communities.',
      v2: '$25/month for advanced features. Community tiers based on member count.',
      v3: 'Event ticketing fees (5%). Enterprise community management ($5/member/month).',
    },
  },
  nature: {
    problemStatement: 'Nature enthusiasts track observations in disconnected apps, journals, and photos. Knowledge stays scattered instead of building over time.',
    targetUser: 'Hobbyist naturalists—gardeners, birders, foragers—who want to learn from their observations.',
    v1MustHave: [
      'Location-tagged observations',
      'Photo documentation with notes',
      'Personal species/plant list',
      'Seasonal patterns view',
      'Offline field recording',
    ],
    v1NotBuilt: [
      'Species identification AI',
      'Social sharing',
      'Scientific data contribution',
      'Equipment tracking',
      'Marketplace for seeds/plants',
    ],
    v1Metrics: [
      'Observations recorded per month > 10',
      'Return to past observations for reference',
      'Self-reported learning from patterns',
      'Offline reliability 100%',
    ],
    v1Constraints: [
      'Works completely offline',
      'Low battery usage for field use',
      'Simple enough for quick recording',
    ],
    v2Expansions: [
      'Basic species suggestions from photo',
      'Multi-year comparison views',
      'Personal field guides from observations',
      'Share observations with friends',
      'Bloom/migration alerts for location',
    ],
    v2Architecture: [
      'Add on-device ML for species hints',
      'Introduce cloud sync for backup',
      'Build alert/notification system',
    ],
    v2Scaling: [
      'Multi-decade observation history',
      'Large photo libraries (thousands)',
      'Family/group sharing',
    ],
    v2Moat: [
      'Observation history is irreplaceable personal data',
      'Pattern learning requires continuity',
      'Personal field guides are unique assets',
    ],
    v3Category: 'From nature journal to "ecological knowledge platform" connecting personal observations to larger patterns.',
    v3Platform: 'Citizen science data contribution, expert identification network, conservation organization partnerships.',
    v3Partnerships: [
      'Citizen science projects (iNaturalist, eBird)',
      'Conservation organizations',
      'Native plant nurseries',
    ],
    v3Differentiation: 'The only nature tool that builds personal ecological knowledge over time—not just records, but understanding.',
    featureExamples: [
      { name: 'Observation', v1: 'Photo, location, notes', v2: 'Species suggestions, conditions', v3: 'Auto-tagged, linked to broader data' },
      { name: 'Learning', v1: 'Personal list building', v2: 'Generated field guides', v3: 'Ecological relationship maps' },
      { name: 'Sharing', v1: 'Export to share', v2: 'Friend circles, trip sharing', v3: 'Citizen science contribution' },
    ],
    archV1V2: [
      'Add on-device ML model',
      'Introduce encrypted cloud sync',
      'Build notification infrastructure',
    ],
    archV2V3: [
      'Add citizen science data pipelines',
      'Introduce expert network system',
      'Build ecological relationship graph',
    ],
    techDebt: [
      'v1 photos are local only—needs cloud option',
      'Location is point-based—needs area/trail support',
      'Species list is flat—needs taxonomy structure',
    ],
    monetization: {
      v1: 'Free for core features. $3/month for unlimited storage.',
      v2: '$7/month with species ID and cloud sync.',
      v3: 'Expert ID consultation fees (50% revenue share). Conservation org licensing.',
    },
  },
  energy: {
    problemStatement: 'Fitness apps track workouts but don\'t help with programming progression. Athletes plateau without structured periodization.',
    targetUser: 'Intermediate lifters and athletes who train 3-5x/week and want to progress systematically.',
    v1MustHave: [
      'Workout logging with sets/reps/weight',
      'Exercise library with form cues',
      'Progress charts per lift',
      'Personal records tracking',
      'Simple program following',
    ],
    v1NotBuilt: [
      'Nutrition tracking',
      'Social features',
      'Wearable integration',
      'Video form check',
      'Coaching marketplace',
    ],
    v1Metrics: [
      'Workout logging completion > 90%',
      'Progress on main lifts over 12 weeks',
      'Session completion time tracking',
      'User-reported program adherence',
    ],
    v1Constraints: [
      'Works offline in gym',
      'Fast logging during rest periods',
      'No mandatory account',
    ],
    v2Expansions: [
      'Program builder with periodization',
      'Fatigue and recovery estimation',
      'Exercise substitution suggestions',
      'Training volume analytics',
      'Basic nutrition macros',
    ],
    v2Architecture: [
      'Add training load calculation engine',
      'Introduce program template system',
      'Build analytics pipeline',
    ],
    v2Scaling: [
      'Multi-year training history',
      'Custom exercise library',
      'Cross-device sync',
    ],
    v2Moat: [
      'Training history enables personalized recommendations',
      'Progress data creates emotional investment',
      'Custom programs encode user knowledge',
    ],
    v3Category: 'From workout logger to "athletic development platform" connecting training to performance outcomes.',
    v3Platform: 'Coach marketplace, program library with creator revenue share, competition/event integration.',
    v3Partnerships: [
      'Gym franchises for member tools',
      'Sports federations for competition tracking',
      'Supplement/equipment brands for content',
    ],
    v3Differentiation: 'The only training app that understands progression—not just what you did, but what you should do next.',
    featureExamples: [
      { name: 'Logging', v1: 'Manual entry, quick input', v2: 'Auto-suggestions from history', v3: 'Voice logging, wearable sync' },
      { name: 'Programming', v1: 'Follow preset programs', v2: 'Custom builder with periodization', v3: 'AI-adjusted based on recovery/progress' },
      { name: 'Progress', v1: 'PR tracking, lift charts', v2: 'Volume and intensity trends', v3: 'Performance prediction, plateau detection' },
    ],
    archV1V2: [
      'Add training volume calculation',
      'Introduce program logic engine',
      'Build recommendation system',
    ],
    archV2V3: [
      'Add ML for adaptation predictions',
      'Introduce coach platform layer',
      'Build content marketplace',
    ],
    techDebt: [
      'v1 exercise library is static—needs user customization',
      'Progress tracking is lift-only—needs RPE/fatigue',
      'Programs are templates—needs dynamic adjustment',
    ],
    monetization: {
      v1: 'Free for logging. $8/month for programs and analytics.',
      v2: '$15/month with advanced programming and nutrition.',
      v3: 'Coach platform fees (15% of coaching revenue). Program marketplace (30% revenue share).',
    },
  },
};

// Default template for unknown categories
const DEFAULT_TEMPLATE: CategoryTemplate = {
  problemStatement: 'Existing tools in this space are either too complex for small teams or too limited for real workflows.',
  targetUser: 'Small teams and individual professionals seeking focused, practical tools.',
  v1MustHave: [
    'Core workflow management',
    'Data organization and search',
    'Basic reporting and export',
    'Mobile access',
    'Simple collaboration',
  ],
  v1NotBuilt: [
    'Enterprise features',
    'Advanced analytics',
    'Third-party integrations',
    'Custom workflows',
    'White-label options',
  ],
  v1Metrics: [
    'Setup to first value < 10 minutes',
    'Daily active usage',
    'Task completion rate > 80%',
    'User satisfaction score > 4/5',
  ],
  v1Constraints: [
    'Works on web and mobile',
    'No enterprise dependencies',
    'Data export always available',
  ],
  v2Expansions: [
    'Advanced filtering and views',
    'Team collaboration features',
    'Third-party integrations',
    'Custom templates',
    'Reporting dashboard',
  ],
  v2Architecture: [
    'Add real-time sync infrastructure',
    'Introduce role-based permissions',
    'Build integration framework',
  ],
  v2Scaling: [
    'Support 10x data volume',
    'Multi-user concurrent access',
    'Performance optimization',
  ],
  v2Moat: [
    'Data history creates switching cost',
    'Workflows become institutional knowledge',
    'Integration ecosystem builds lock-in',
  ],
  v3Category: 'From point solution to platform for the entire workflow category.',
  v3Platform: 'Marketplace for extensions, partner integrations, enterprise features.',
  v3Partnerships: [
    'Complementary tool providers',
    'Industry associations',
    'Enterprise software vendors',
  ],
  v3Differentiation: 'Purpose-built for this specific use case, not adapted from generic tools.',
  featureExamples: [
    { name: 'Core Workflow', v1: 'Basic tracking and management', v2: 'Automated workflows', v3: 'Intelligent suggestions' },
    { name: 'Collaboration', v1: 'Share and comment', v2: 'Real-time co-editing', v3: 'Cross-team visibility' },
    { name: 'Reporting', v1: 'Standard exports', v2: 'Custom dashboards', v3: 'Predictive insights' },
  ],
  archV1V2: [
    'Add real-time sync layer',
    'Introduce caching infrastructure',
    'Build webhook system',
  ],
  archV2V3: [
    'Add analytics data warehouse',
    'Introduce ML pipeline',
    'Build marketplace infrastructure',
  ],
  techDebt: [
    'v1 data model needs normalization',
    'Sync is polling-based—needs event-driven',
    'Reports are hardcoded—needs dynamic engine',
  ],
  monetization: {
    v1: 'Free tier with usage limits. Paid tier at $10-20/month.',
    v2: 'Team tier at $15-30/user/month with advanced features.',
    v3: 'Enterprise tier with custom pricing. Platform fees on marketplace.',
  },
};

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

/**
 * Get template for category, with fallback to default
 */
function getTemplate(category: string): CategoryTemplate {
  return CATEGORY_TEMPLATES[category] || DEFAULT_TEMPLATE;
}

/**
 * Personalize a string by replacing placeholders with actual values
 */
function personalize(text: string, context: { appName: string; category: string; target: string }): string {
  return text
    .replace(/\{appName\}/g, context.appName)
    .replace(/\{category\}/g, context.category)
    .replace(/\{target\}/g, context.target);
}

/**
 * Generate v1 phase from template and Brand DNA
 */
function generateV1(template: CategoryTemplate, brandDNA: BrandDNA, output: OaxeOutput): VersionPhase {
  const context = {
    appName: output.appName,
    category: brandDNA.category,
    target: brandDNA.positioning.targetAudience,
  };

  // Use actual core features if available, otherwise use template
  const mustHaveFeatures = output.productSpec.coreFeatures.length >= 3
    ? output.productSpec.coreFeatures.slice(0, 5)
    : template.v1MustHave;

  return {
    version: 'v1',
    title: 'Unfair MVP',
    timeline: '0-3 months',
    sections: {
      problemStatement: personalize(template.problemStatement, context),
      mustHaveFeatures,
      notBuilt: template.v1NotBuilt,
      targetUser: personalize(template.targetUser, context),
      useCase: `${output.appName} helps ${brandDNA.positioning.targetAudience.toLowerCase()} ${brandDNA.positioning.differentiator.toLowerCase()}.`,
      successMetrics: template.v1Metrics,
      technicalConstraints: template.v1Constraints,
    },
  };
}

/**
 * Generate v2 phase from template and Brand DNA
 */
function generateV2(template: CategoryTemplate, brandDNA: BrandDNA, output: OaxeOutput): VersionPhase {
  return {
    version: 'v2',
    title: 'Scale & Moat',
    timeline: '3-12 months',
    sections: {
      featureExpansions: template.v2Expansions,
      architectureEvolution: template.v2Architecture,
      scalingConsiderations: template.v2Scaling,
      monetization: template.monetization.v2,
      moatBuilding: template.v2Moat,
    },
  };
}

/**
 * Generate v3 phase from template and Brand DNA
 */
function generateV3(template: CategoryTemplate, brandDNA: BrandDNA, output: OaxeOutput): VersionPhase {
  const context = {
    appName: output.appName,
    category: brandDNA.category,
    target: brandDNA.positioning.targetAudience,
  };

  return {
    version: 'v3',
    title: 'Category King',
    timeline: '12-36 months',
    sections: {
      categoryExpansion: personalize(template.v3Category, context),
      platformStrategy: personalize(template.v3Platform, context),
      advancedMonetization: template.monetization.v3,
      partnerships: template.v3Partnerships,
      differentiationNarrative: personalize(template.v3Differentiation, context),
    },
  };
}

/**
 * Generate feature progression table
 */
function generateFeatureProgression(template: CategoryTemplate, output: OaxeOutput): FeatureProgression[] {
  // Start with template examples
  const progression: FeatureProgression[] = template.featureExamples.map(ex => ({
    feature: ex.name,
    v1: ex.v1,
    v2: ex.v2,
    v3: ex.v3,
  }));

  // Add entity-based features if we have entities
  if (output.entities.length > 0) {
    const primaryEntity = output.entities[0].name;
    progression.push({
      feature: `${primaryEntity} Management`,
      v1: `Basic CRUD, list view`,
      v2: `Advanced filtering, bulk operations`,
      v3: `Intelligent suggestions, automation`,
    });
  }

  return progression;
}

/**
 * Generate architecture notes
 */
function generateArchitectureNotes(template: CategoryTemplate): EvolutionRoadmap['architectureNotes'] {
  return {
    v1ToV2: template.archV1V2,
    v2ToV3: template.archV2V3,
    technicalDebt: template.techDebt,
  };
}

/**
 * Generate monetization evolution
 */
function generateMonetizationEvolution(template: CategoryTemplate): EvolutionRoadmap['monetizationEvolution'] {
  return {
    v1: template.monetization.v1,
    v2: template.monetization.v2,
    v3: template.monetization.v3,
  };
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate Evolution Roadmap from Brand DNA and Product Spec
 */
export function generateEvolutionRoadmap(brandDNA: BrandDNA, output: OaxeOutput): EvolutionRoadmap {
  const template = getTemplate(brandDNA.category);

  return {
    appName: output.appName,
    category: brandDNA.category,
    generatedAt: new Date().toISOString(),
    v1: generateV1(template, brandDNA, output),
    v2: generateV2(template, brandDNA, output),
    v3: generateV3(template, brandDNA, output),
    featureProgression: generateFeatureProgression(template, output),
    architectureNotes: generateArchitectureNotes(template),
    monetizationEvolution: generateMonetizationEvolution(template),
  };
}

// ============================================================================
// MARKDOWN GENERATION
// ============================================================================

/**
 * Generate docs/evolution.md content from Evolution Roadmap
 */
export function generateEvolutionMarkdown(roadmap: EvolutionRoadmap, brandDNA: BrandDNA): string {
  const { v1, v2, v3, featureProgression, architectureNotes, monetizationEvolution } = roadmap;

  return `# ${roadmap.appName} Evolution Roadmap

Generated: ${roadmap.generatedAt}
Category: ${roadmap.category}
Target: ${brandDNA.positioning.targetAudience}

---

## v1 — ${v1.title}
**Timeline:** ${v1.timeline}

### Problem Statement
${v1.sections.problemStatement}

### Target User
${v1.sections.targetUser}

### Use Case
${v1.sections.useCase}

### Must-Have Features
${v1.sections.mustHaveFeatures?.map(f => `- ${f}`).join('\n')}

### Intentionally Not Built
${v1.sections.notBuilt?.map(f => `- ${f}`).join('\n')}

### Success Metrics
${v1.sections.successMetrics?.map(m => `- ${m}`).join('\n')}

### Technical Constraints
${v1.sections.technicalConstraints?.map(c => `- ${c}`).join('\n')}

---

## v2 — ${v2.title}
**Timeline:** ${v2.timeline}

### Feature Expansions
${v2.sections.featureExpansions?.map(f => `- ${f}`).join('\n')}

### Architecture Evolution
${v2.sections.architectureEvolution?.map(a => `- ${a}`).join('\n')}

### Scaling Considerations
${v2.sections.scalingConsiderations?.map(s => `- ${s}`).join('\n')}

### Moat Building
${v2.sections.moatBuilding?.map(m => `- ${m}`).join('\n')}

### Monetization
${v2.sections.monetization}

---

## v3 — ${v3.title}
**Timeline:** ${v3.timeline}

### Category Expansion
${v3.sections.categoryExpansion}

### Platform Strategy
${v3.sections.platformStrategy}

### Strategic Partnerships
${v3.sections.partnerships?.map(p => `- ${p}`).join('\n')}

### Differentiation Narrative
${v3.sections.differentiationNarrative}

### Advanced Monetization
${v3.sections.advancedMonetization}

---

## Feature Progression Map

| Feature | v1 | v2 | v3 |
|---------|----|----|-----|
${featureProgression.map(fp => `| ${fp.feature} | ${fp.v1} | ${fp.v2} | ${fp.v3} |`).join('\n')}

---

## Architecture Evolution Notes

### v1 → v2 Transition
${architectureNotes.v1ToV2.map(n => `- ${n}`).join('\n')}

### v2 → v3 Transition
${architectureNotes.v2ToV3.map(n => `- ${n}`).join('\n')}

### Technical Debt Acknowledgements
${architectureNotes.technicalDebt.map(d => `- ${d}`).join('\n')}

---

## Monetization Evolution

### v1 Pricing
${monetizationEvolution.v1}

### v2 Pricing
${monetizationEvolution.v2}

### v3 Pricing
${monetizationEvolution.v3}

---

*Generated by Oaxe M8 Evolution Roadmap Generator*
`;
}
