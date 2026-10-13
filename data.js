/* ==========================================================================
   AICAF — data.js
   All framework content, personas, and the resource inventory (Pillars 4–6).
   Every resource entry carries a `url` — the source used for the report's
   citation appendix and every inline "resource" link.
   ========================================================================== */

const AICAF_VERSION = '2026.10';

/* ---------------- Pillar 1: Organization Profile ---------------- */

const COMPANY_SIZES = [
  { id: 'small', label: 'Small Business', desc: '1–50 employees' },
  { id: 'smb', label: 'SMB', desc: '51–500 employees' },
  { id: 'midmarket', label: 'Mid-Market', desc: '501–5,000 employees' },
  { id: 'enterprise', label: 'Enterprise', desc: '5,000+ employees' },
];

const INDUSTRIES = [
  { id: 'professional', label: 'Professional Services' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'construction', label: 'Construction' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'government', label: 'Government' },
  { id: 'education', label: 'Education' },
  { id: 'technology', label: 'Technology' },
  { id: 'retail', label: 'Retail' },
  { id: 'financial', label: 'Financial Services' },
  { id: 'nonprofit', label: 'Nonprofit' },
  { id: 'logistics', label: 'Logistics' },
];

const TECH_ENVIRONMENTS = [
  { id: 'microsoft', label: 'Microsoft-centric', desc: 'Microsoft 365, Azure, Windows-first' },
  { id: 'google', label: 'Google-centric', desc: 'Google Workspace, Chrome, GCP-first' },
  { id: 'mixed', label: 'Mixed ecosystem', desc: 'Both Microsoft and Google in active use' },
  { id: 'limited', label: 'Limited technology stack', desc: 'Minimal cloud/productivity tooling today' },
];

/* Workforce composition categories */
const COMPOSITION_CATEGORIES = [
  { id: 'admin', label: 'Administrative' },
  { id: 'knowledge', label: 'Knowledge Workers' },
  { id: 'sales', label: 'Sales' },
  { id: 'customerService', label: 'Customer Service' },
  { id: 'frontline', label: 'Frontline Workers' },
  { id: 'skilledTrades', label: 'Skilled Trades' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'technical', label: 'Technical Staff' },
];

/* ---------------- Pillar 2: AI Maturity Assessment ---------------- */

const MATURITY_LEVELS = [
  {
    id: 0, name: 'Unaware',
    short: 'Limited understanding of AI; no policy, no approved tools.',
    signals: ['No formal AI policy exists', 'Leadership has limited AI literacy', 'No approved AI tools or vendors'],
  },
  {
    id: 1, name: 'Experimenting',
    short: 'Individuals use AI on their own, with inconsistent practices.',
    signals: ['Employees use free consumer AI tools informally ("shadow AI")', 'No consistent practices across teams', 'No governance or usage guardrails'],
  },
  {
    id: 2, name: 'Managed Adoption',
    short: 'Approved platforms are in place with basic training and initial governance.',
    signals: ['One or more AI platforms formally approved', 'Basic training has been delivered', 'Initial acceptable-use guardrails exist'],
  },
  {
    id: 3, name: 'Integrated',
    short: 'AI is built into workflows with department-level adoption and measured outcomes.',
    signals: ['AI is embedded in day-to-day workflows', 'Adoption is tracked at the department level', 'Outcomes are measured, not just usage'],
  },
  {
    id: 4, name: 'Optimized',
    short: 'Enterprise-wide standards and AI-enabled processes with strong governance.',
    signals: ['Enterprise-wide standards and playbooks exist', 'Governance is mature and enforced', 'AI-enabled processes are the default, not the exception'],
  },
  {
    id: 5, name: 'Transformational',
    short: 'AI-first thinking with proprietary tools/agents and continuous innovation.',
    signals: ['Leadership thinks "AI-first" by default', 'Proprietary tools or agents are built in-house', 'Continuous innovation is part of the operating rhythm'],
  },
];

/* ---------------- Pillar 3: Workforce AI Relevance Model ---------------- */

const PERSONAS = [
  {
    id: 'A', name: 'Information Coordinators',
    examples: 'Receptionists, admin assistants, office managers, executive assistants',
    coreWork: 'Scheduling, communication, documentation, coordination',
    aiValue: 'Email drafting, meeting summaries, document creation, scheduling assistance',
    impact: 9,
    compositionKeys: ['admin'],
    targetLevel: 2,
  },
  {
    id: 'B', name: 'Knowledge Professionals',
    examples: 'Accountants, HR, recruiters, analysts, compliance staff',
    coreWork: 'Review, analysis, interpretation, reporting',
    aiValue: 'Data analysis, research synthesis, document review, summarization, reporting support',
    impact: 10,
    compositionKeys: ['knowledge'],
    targetLevel: 3,
  },
  {
    id: 'C', name: 'Revenue Creators',
    examples: 'Sales, business development, account managers, customer success',
    coreWork: 'Relationship building, prospecting, proposals',
    aiValue: 'Account research, account planning, proposal generation, follow-up automation',
    impact: 10,
    compositionKeys: ['sales'],
    targetLevel: 3,
  },
  {
    id: 'D', name: 'Service & Support Workers',
    examples: 'Customer service reps, help desk, dispatch, contact center staff',
    coreWork: 'Problem resolution, information delivery',
    aiValue: 'Knowledge retrieval, response assistance, documentation',
    impact: 8,
    compositionKeys: ['customerService'],
    targetLevel: 2,
  },
  {
    id: 'E', name: 'Operations & Skilled Trades',
    examples: 'Manufacturing, maintenance, warehouse, field service, construction',
    coreWork: 'Physical production, equipment operation, troubleshooting',
    aiValue: 'SOP access, maintenance support, safety guidance, knowledge transfer',
    impact: 6,
    compositionKeys: ['frontline', 'skilledTrades'],
    targetLevel: 1,
  },
  {
    id: 'F', name: 'Leaders & Decision Makers',
    examples: 'Supervisors, managers, directors, executives',
    coreWork: 'Planning, resource allocation, strategy',
    aiValue: 'Strategic analysis, scenario planning, reporting, communication',
    impact: 10,
    compositionKeys: ['leadership'],
    targetLevel: 4,
  },
  {
    id: 'G', name: 'Builders & Technologists',
    examples: 'Developers, architects, engineers, data teams',
    coreWork: 'Solution development',
    aiValue: 'Coding assistance, agent development, data analysis, AI app development',
    impact: 10,
    compositionKeys: ['technical'],
    targetLevel: 5,
  },
];

/* ---------------- Pillar 4: Capability Levels + Training Resources ---------------- */

const CAPABILITY_LEVELS = [
  {
    id: 1, name: 'AI Aware', audience: 'Every employee',
    skills: ['Understand AI basics', 'Recognize opportunities', 'Understand risks', 'Use approved tools safely'],
  },
  {
    id: 2, name: 'AI Practitioner', audience: 'Most employees',
    skills: ['Effective prompting', 'Content generation', 'Summarization', 'Information analysis'],
  },
  {
    id: 3, name: 'AI Power User', audience: 'Managers & specialists',
    skills: ['Workflow redesign', 'Team enablement', 'Advanced prompting', 'Productivity optimization'],
  },
  {
    id: 4, name: 'AI Champion', audience: 'Department leaders',
    skills: ['Change management', 'Adoption planning', 'Department strategy', 'ROI measurement'],
  },
  {
    id: 5, name: 'AI Builder', audience: 'Technical teams',
    skills: ['Agents & integrations', 'Automation', 'Governance implementation', 'AI app development'],
  },
];

const TRAINING_RESOURCES = {
  // Order matters: the report shows the first three per level. Free, certificate-bearing options lead.
  1: [
    { name: 'AI Fluency: Framework & Foundations', provider: 'Anthropic Academy', cost: 'Free · certificate', duration: 'Self-paced', url: 'https://anthropic.skilljar.com/' },
    { name: 'AI Foundations', provider: 'OpenAI Academy', cost: 'Free', duration: '60–75 min', url: 'https://help.openai.com/en/articles/20001270-openai-academy-courses' },
    { name: 'AI Fluency learning path', provider: 'Microsoft Learn', cost: 'Free', duration: '7 modules', url: 'https://learn.microsoft.com/en-us/training/paths/ai-fluency/' },
    { name: 'AI Skills for America', provider: 'Verizon (with Google, IBM, Microsoft, Anthropic, OpenAI)', cost: 'Free · U.S. adults', duration: '200+ self-paced courses', url: 'https://www.verizon.com/about/responsibility/human-prosperity/workforce-development/ai-learning' },
    { name: 'Google AI Essentials', provider: 'Google via Coursera', cost: '$49/mo subscription', duration: '< 10 hrs', url: 'https://www.coursera.org/learn/google-ai-essentials' },
  ],
  2: [
    { name: 'Applied AI Foundations', provider: 'OpenAI Academy', cost: 'Free', duration: '75–90 min', url: 'https://help.openai.com/en/articles/20001270-openai-academy-courses' },
    { name: 'Claude 101', provider: 'Anthropic Academy', cost: 'Free · certificate', duration: 'Self-paced', url: 'https://anthropic.skilljar.com/' },
    { name: 'Google Prompting Essentials', provider: 'Google via Coursera', cost: '$49/mo subscription', duration: '< 10 hrs', url: 'https://www.coursera.org/learn/google-prompting-essentials' },
    { name: 'Generative AI for Everyone', provider: 'DeepLearning.AI (Andrew Ng) via Coursera', cost: 'Subscription', duration: '~3 weeks', url: 'https://www.coursera.org/learn/generative-ai-for-everyone' },
    { name: 'Build Your Generative AI Productivity Skills with Microsoft and LinkedIn', provider: 'LinkedIn Learning', cost: 'Subscription', duration: '5 hrs', url: 'https://www.linkedin.com/learning/paths/build-your-generative-ai-productivity-skills-with-microsoft-and-linkedin' },
  ],
  3: [
    { name: 'Google AI Professional Certificate', provider: 'Google via Coursera', cost: '$49/mo · free via Oklahoma libraries', duration: '8 courses, ~13 hrs', url: 'https://www.coursera.org/professional-certificates/google-ai' },
    { name: 'Agents and Workflows', provider: 'OpenAI Academy', cost: 'Free', duration: '75–90 min', url: 'https://help.openai.com/en/articles/20001270-openai-academy-courses' },
    { name: 'Get started with Microsoft 365 Copilot', provider: 'Microsoft Learn', cost: 'Free', duration: '3 modules', url: 'https://learn.microsoft.com/en-us/training/paths/get-started-with-microsoft-365-copilot/' },
  ],
  4: [
    { name: 'AI Leadership', provider: 'OpenAI Academy', cost: 'Free', duration: '~3 hrs', url: 'https://help.openai.com/en/articles/20001270-openai-academy-courses' },
    { name: 'AI+HI Specialty Credential', provider: 'SHRM', cost: 'Paid · see SHRM', duration: '3 labs + capstone', url: 'https://www.shrm.org/credentials/specialty-credentials/ai-hi-specialty-credential' },
    { name: 'AI for Business Leaders', provider: 'University of Maryland via Coursera', cost: 'Subscription', duration: '6 modules', url: 'https://www.coursera.org/learn/ai-for-business-leaders' },
    { name: 'Building an AI-Enabled Workforce (seminar)', provider: 'SHRM', cost: 'Paid · see SHRM', duration: '6 PDCs', url: 'https://www.shrm.org/events-education/education/seminars/strategy-leadership/building-an-ai-enabled-workforce' },
  ],
  5: [
    { name: 'Agentic AI', provider: 'DeepLearning.AI (Andrew Ng)', cost: 'Free to audit · $25–30/mo for certificate', duration: '9h 55m', url: 'https://www.deeplearning.ai/courses/agentic-ai/' },
    { name: 'Design and Build Agentic Systems', provider: 'OpenAI Academy', cost: 'Free', duration: '110 min', url: 'https://help.openai.com/en/articles/20001270-openai-academy-courses' },
    { name: 'Claude Code in Action · Building with the Claude API · Intro to MCP', provider: 'Anthropic Academy', cost: 'Free · certificates', duration: 'Self-paced', url: 'https://anthropic.skilljar.com/' },
    { name: 'Develop AI agents on Azure', provider: 'Microsoft Learn', cost: 'Free', duration: '9 modules', url: 'https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/' },
    { name: 'GitHub Copilot Certification (GH-300)', provider: 'Microsoft Learn / GitHub', cost: 'Proctored exam fee', duration: 'Exam', url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/' },
  ],
};

/* Free and Oklahoma upskilling programs — shown in every report beneath the roadmap.
   Source: Oklahoma Career Pathways Guide (kept in sync monthly). */
const UPSKILLING_PROGRAMS = [
  { name: 'Google AI courses free through Oklahoma libraries', provider: 'Grow with Google · Oklahoma Dept. of Libraries', cost: 'Free with library card', note: 'Free Coursera access to Google Career Certificates, including the Google AI Professional Certificate.', url: 'https://oklahoma.gov/libraries/digital-resources/grow-google.html' },
  { name: 'TCC Skills Lab: Artificial Intelligence and Data Analytics tracks', provider: 'Tulsa Community College', cost: 'Free', note: 'Residency and Sprint tracks, plus an 8-week work-based option that pays a $1,000 stipend.', url: 'https://skillslab.tulsacc.edu/programs' },
  { name: 'UpskillOK AI microcredentials', provider: 'Oklahoma State Regents for Higher Education', cost: 'Varies by program', note: 'Stackable, statewide credentials, including AI for office staff (OSU-Tulsa) and prompt engineering for managers (NSU).', url: 'https://upskillok.org/microcredentials/' },
  { name: 'Greenwood Cyber + AI Lab', provider: 'Microsoft · Black Tech Street (Tulsa)', cost: 'Free', note: 'Public AI-fluency and workforce workshops in Tulsa.', url: 'https://www.prnewswire.com/news-releases/microsoft-and-black-tech-street-launch-greenwood-cyber--ai-lab-in-tulsa-302779672.html' },
  { name: 'AI Skills for America', provider: 'Verizon', cost: 'Free · U.S. adults', note: '200+ beginner-to-advanced courses with shareable certificates; good for employees and job seekers alike.', url: 'https://www.verizon.com/about/responsibility/human-prosperity/workforce-development/ai-learning' },
];

/* ---------------- Pillar 5: AI Platform Alignment (by scenario) ---------------- */

const PLATFORM_SCENARIOS = {
  research: {
    label: 'Research',
    tools: [
      { name: 'Perplexity', vendor: 'Perplexity AI', desc: 'Answer engine with cited web search; Free / Pro / Enterprise tiers.', price: 'Free · Pro $20/mo · Enterprise Pro $40/seat · Enterprise Max $325/seat', url: 'https://coworker.ai/blog/perplexity-enterprise-pricing' },
      { name: 'ChatGPT', vendor: 'OpenAI', desc: 'General-purpose assistant strong at broad research synthesis.', price: 'Free · Plus $20/mo · Pro $200/mo · Enterprise custom', url: 'https://openai.com/chatgpt/pricing/' },
      { name: 'Claude', vendor: 'Anthropic', desc: 'Strong long-document research and reasoning.', price: 'Free · Pro $17/mo · Max from $100/mo', url: 'https://www.anthropic.com/pricing' },
      { name: 'Gemini / Gemini Notebook', vendor: 'Google', desc: 'Research assistant integrated with Google Search and Workspace.', price: 'Free · AI Plus $4.99/mo · AI Pro $19.99/mo · AI Ultra from $99.99/mo', url: 'https://gemini.google/subscriptions/' },
    ],
  },
  writing: {
    label: 'Writing',
    tools: [
      { name: 'Claude', vendor: 'Anthropic', desc: 'Long-form writing and editing with strong tone control.', price: 'Free · Pro $17/mo · Max from $100/mo', url: 'https://www.anthropic.com/pricing' },
      { name: 'ChatGPT', vendor: 'OpenAI', desc: 'Versatile drafting, editing, and rewriting assistant.', price: 'Free · Plus $20/mo · Pro $200/mo', url: 'https://openai.com/chatgpt/pricing/' },
      { name: 'Microsoft Copilot / M365 Premium', vendor: 'Microsoft', desc: 'Writing assistance embedded in Word, Outlook, and Copilot Chat.', price: 'Free baseline + paid tiers (n.a. exact price)', url: 'https://www.microsoft.com/en-us/microsoft-copilot/for-individuals/copilot-pro' },
      { name: 'Grammarly', vendor: 'Grammarly', desc: 'Grammar, tone, and style assistant across apps and browsers.', price: 'Free · Pro $12/mo · Enterprise via Superhuman Go', url: 'https://www.grammarly.com/plans' },
    ],
  },
  msProductivity: {
    label: 'Microsoft Productivity',
    tools: [
      { name: 'Microsoft 365 Copilot (Enterprise)', vendor: 'Microsoft', desc: 'AI across Word, Excel, Outlook, Teams for enterprise tenants.', price: '$30/user/mo add-on', url: 'https://www.microsoft.com/en-us/microsoft-365-copilot/pricing' },
      { name: 'Microsoft 365 Copilot (Business/SMB)', vendor: 'Microsoft', desc: 'Same Copilot experience sized for teams under 300 seats.', price: '~$18/user/mo promo · $21/user/mo standard', url: 'https://www.microsoft.com/en-us/microsoft-365-copilot/pricing' },
      { name: 'Microsoft 365 Copilot Chat', vendor: 'Microsoft', desc: 'Baseline Copilot chat included with eligible M365 plans.', price: 'No extra cost with eligible plans', url: 'https://www.microsoft.com/en-us/microsoft-365-copilot/pricing' },
    ],
  },
  googleProductivity: {
    label: 'Google Workspace Productivity',
    tools: [
      { name: 'Gemini for Workspace — Business Standard', vendor: 'Google', desc: 'Gemini AI features across Gmail, Docs, and Sheets.', price: '$7/user/mo', url: 'https://workspace.google.com/pricing' },
      { name: 'Gemini for Workspace — Business Plus', vendor: 'Google', desc: 'Expanded Gemini features and admin controls.', price: '$11/user/mo', url: 'https://workspace.google.com/pricing' },
      { name: 'Gemini Enterprise', vendor: 'Google', desc: 'Enterprise-grade Gemini deployment for larger organizations.', price: 'Custom', url: 'https://workspace.google.com/pricing' },
    ],
  },
  softwareDev: {
    label: 'Software Development',
    tools: [
      { name: 'GitHub Copilot', vendor: 'GitHub / Microsoft', desc: 'In-editor coding assistant with autocomplete and chat.', price: 'Free · Pro $10/mo · Pro+ $39/mo · Business/Enterprise n.a.', url: 'https://github.com/features/copilot/plans' },
      { name: 'Claude Code', vendor: 'Anthropic', desc: 'Agentic coding assistant for terminal and IDE workflows.', price: 'Included in Claude Pro/Max/Team seats', url: 'https://www.anthropic.com/claude-code' },
      { name: 'Cursor', vendor: 'Cursor', desc: 'AI-native code editor built around agentic pair-programming.', price: 'Hobby free · Individual $20/mo · Teams $40/mo · Enterprise custom', url: 'https://cursor.com/pricing' },
      { name: 'Gemini Code Assist', vendor: 'Google', desc: 'AI coding assistant integrated with Google Cloud tooling.', price: 'Standard $19/user/mo · Enterprise $45/user/mo', url: 'https://cloud.google.com/products/gemini/code-assist' },
    ],
  },
  enterpriseAI: {
    label: 'Enterprise AI & Agents',
    tools: [
      { name: 'Microsoft Foundry', vendor: 'Microsoft', desc: 'Enterprise platform for building and governing custom AI models and agents (formerly Azure AI Foundry/Studio).', price: 'Consumption-based', url: 'https://azure.microsoft.com/en-us/products/ai-foundry' },
      { name: 'Amazon Bedrock (incl. AgentCore)', vendor: 'AWS', desc: 'Managed foundation-model and agent platform on AWS.', price: 'Usage-based · $200 in free credits', url: 'https://aws.amazon.com/bedrock/' },
      { name: 'Gemini Enterprise Agent Platform', vendor: 'Google Cloud', desc: 'Enterprise agent-building platform (formerly Vertex AI).', price: 'Pay-as-you-go · $300 in free credits', url: 'https://cloud.google.com/vertex-ai' },
      { name: 'Claude Enterprise', vendor: 'Anthropic', desc: 'Enterprise deployment of Claude with seat- and usage-based pricing.', price: 'Seat + usage, no fixed public price', url: 'https://www.anthropic.com/pricing' },
    ],
  },
};

/* ---------------- Pillar 6: Governance & Adoption Resources ---------------- */

const GOVERNANCE_RESOURCES = {
  acceptableUse: {
    label: 'Acceptable Use Policy',
    icon: 'shield',
    checklist: ['Define which AI tools are approved for company use', 'Specify what data may and may not be entered into AI tools', 'Set expectations for disclosing AI-assisted work', 'Review and update the policy at least annually'],
    resources: [
      { name: 'AI Acceptable Use Policy Template', org: 'FRSecure', cost: 'Free', url: 'https://frsecure.com/ai-acceptable-use-policy-template/' },
      { name: 'Free AI Policy for Employers', org: 'Legal Templates', cost: 'Free (PDF/Word)', url: 'https://legaltemplates.net/form/employee/policy/ai/' },
      { name: 'AI Acceptable Use Policy Template', org: 'ISACA', cost: 'Free with signup', url: 'https://www.isaca.org/resources/artificial-intelligence-acceptable-use-policy-template' },
      { name: 'Simple AI Governance Policy Template', org: 'SHRM', cost: 'Member access', url: 'https://www.shrm.org/topics-tools/tools/policies/simple-ai-governance-policy-employers' },
    ],
  },
  privacy: {
    label: 'Privacy & Confidentiality',
    icon: 'lock',
    checklist: ['Classify what counts as sensitive or regulated data at your org', 'Prohibit entering confidential data into public/free AI tools', 'Confirm vendor data-retention and training-use terms before adoption', 'Train employees on what NOT to paste into an AI tool'],
    resources: [
      { name: 'Generative AI Checklist', org: 'Future of Privacy Forum (FPF)', cost: 'Free', url: 'https://fpf.org/wp-content/uploads/2023/07/Generative-AI-Checklist.pdf' },
      { name: 'Secure Use of GenAI for SMBs', org: 'Cyber Readiness Institute', cost: 'Free guide', url: 'https://cyberreadinessinstitute.org/wp-content/uploads/2026CRI_GenAI-Guide-Booklet_2.18.25-FINAL.pdf' },
      { name: 'Privacy Framework', org: 'NIST', cost: 'Free', url: 'https://www.nist.gov/privacy-framework' },
      { name: 'AI Data Privacy Checklist for SMB Teams', org: 'AILD', cost: 'Free', url: 'https://aild.org/learn/ai-data-privacy-checklist/' },
    ],
  },
  oversight: {
    label: 'Human Oversight & Review',
    icon: 'eye',
    checklist: ['Require human review before AI output reaches a customer or regulator', 'Assign clear accountability for verifying AI-assisted work', 'Document where in each workflow a human checkpoint occurs', 'Retrain staff on oversight duties as tools change'],
    resources: [
      { name: 'AI Risk Management Framework (AI RMF 1.0) + Playbook', org: 'NIST', cost: 'Free', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { name: 'Responsible AI Standard v2 (Goal A5)', org: 'Microsoft', cost: 'Free', url: 'https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf?culture=en-us&country=us' },
      { name: '3 Emerging Practices for Responsible Generative AI', org: 'Google', cost: 'Free article', url: 'https://blog.google/innovation-and-ai/products/google-responsible-generative-ai-best-practices/' },
    ],
  },
  riskManagement: {
    label: 'Risk Management',
    icon: 'alert',
    checklist: ['Assess bias and fairness risk for any AI used in people decisions', 'Plan for hallucinations — verify facts before they go external', 'Review security exposure of any AI tool with data access', 'Reassess risk when adopting new tools or use cases'],
    resources: [
      { name: 'Generative AI Profile (NIST AI 600-1)', org: 'NIST', cost: 'Free', url: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf' },
      { name: 'OWASP Top 10 for LLM Applications', org: 'OWASP', cost: 'Free', url: 'https://genai.owasp.org/llm-top-10/' },
      { name: 'ISO/IEC 42001:2023 — AI Management System', org: 'ISO', cost: 'Paid standard', url: 'https://www.iso.org/standard/42001' },
    ],
  },
  measurement: {
    label: 'Adoption & Outcome Measurement',
    icon: 'chart',
    checklist: ['Track usage/adoption by team, not just licenses purchased', 'Measure time saved or throughput gained on key workflows', 'Survey quality perception alongside quantitative metrics', 'Revisit maturity level every 6–12 months'],
    resources: [
      { name: 'AI Maturity Model + Assessment Tool', org: 'MITRE', cost: 'Free, self-service', url: 'https://aimaturitymodel.mitre.org/' },
      { name: 'AI at Work 2026', org: 'BCG', cost: 'Free article', url: 'https://www.bcg.com/publications/2026/ai-at-work-why-strategy-matters-more-than-tools' },
      { name: 'State of AI — Global Survey', org: 'McKinsey', cost: 'Free article', url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai' },
      { name: 'The Human Side of AI Adoption', org: 'MIT Sloan Management Review', cost: 'Free article', url: 'https://sloanreview.mit.edu/article/the-human-side-of-ai-adoption-lessons-from-the-field/' },
    ],
  },
};

/* ---------------- Pillar 7: Business Activity Framework ("The Missing Piece") ---------------- */

const ACTIVITIES = [
  { id: 'create', label: 'Create', desc: 'Draft documents, content, code, designs, or reports', aiPotential: 4 },
  { id: 'communicate', label: 'Communicate', desc: 'Emails, meetings, presentations, cross-team updates', aiPotential: 3 },
  { id: 'analyze', label: 'Analyze', desc: 'Interpret data, trends, and reports to find insights', aiPotential: 4 },
  { id: 'decide', label: 'Decide', desc: 'Make judgment calls using available information', aiPotential: 2 },
  { id: 'research', label: 'Research', desc: 'Gather and synthesize external or internal information', aiPotential: 3 },
  { id: 'organize', label: 'Organize', desc: 'Schedule, file, track, and coordinate work', aiPotential: 2 },
  { id: 'solveProblems', label: 'Solve Problems', desc: 'Troubleshoot issues and remove blockers', aiPotential: 2 },
  { id: 'build', label: 'Build', desc: 'Develop software, systems, or technical solutions', aiPotential: 4 },
  { id: 'serveCustomers', label: 'Serve Customers', desc: 'Direct interaction resolving customer needs', aiPotential: 3 },
  { id: 'manageProcesses', label: 'Manage Processes', desc: 'Oversee workflows, compliance, and operations', aiPotential: 2 },
];

/* Frequency of each activity, by persona: 3=High 2=Medium 1=Low */
const PERSONA_ACTIVITY_FREQUENCY = {
  A: { communicate: 3, organize: 3, create: 2, research: 1, decide: 1, analyze: 1, solveProblems: 2, build: 1, serveCustomers: 2, manageProcesses: 2 },
  B: { analyze: 3, manageProcesses: 3, research: 2, create: 2, communicate: 2, decide: 2, organize: 2, solveProblems: 1, build: 1, serveCustomers: 1 },
  C: { communicate: 3, research: 2, create: 2, decide: 2, serveCustomers: 2, organize: 2, analyze: 2, manageProcesses: 1, solveProblems: 1, build: 1 },
  D: { serveCustomers: 3, solveProblems: 3, communicate: 2, organize: 2, create: 1, research: 1, decide: 2, analyze: 1, manageProcesses: 1, build: 1 },
  E: { solveProblems: 3, manageProcesses: 2, organize: 2, communicate: 1, build: 2, serveCustomers: 1, create: 1, research: 1, decide: 1, analyze: 1 },
  F: { decide: 3, analyze: 3, communicate: 3, manageProcesses: 2, research: 2, organize: 2, create: 2, solveProblems: 2, serveCustomers: 1, build: 1 },
  G: { build: 3, solveProblems: 3, analyze: 2, create: 2, research: 2, organize: 1, communicate: 1, decide: 1, serveCustomers: 1, manageProcesses: 1 },
};

/* ---------------- Priorities (Pillar 6 input) ---------------- */

const PRIORITIES = [
  { id: 'productivity', label: 'Increase productivity & efficiency' },
  { id: 'costs', label: 'Reduce operating costs' },
  { id: 'cx', label: 'Improve customer experience' },
  { id: 'competitive', label: 'Stay competitive / avoid falling behind' },
  { id: 'talent', label: 'Attract & retain talent' },
  { id: 'strategy', label: 'Improve decision-making & strategy' },
  { id: 'manual', label: 'Reduce manual, repetitive work' },
  { id: 'security', label: 'Strengthen data security & compliance' },
];

const YES_NO_INPROGRESS = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'inprogress', label: 'In progress' },
];

const YES_NO = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];
