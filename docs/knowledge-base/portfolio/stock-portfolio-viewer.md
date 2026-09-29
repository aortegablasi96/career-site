# Project: Stock Portfolio Viewer

## Slogan

An on-premise AI-enabled portfolio management assistant.

## Sources

To review how I did it, check the github repository: https://github.com/aortegablasi96/stock-portfolio-viewer

To download it: https://github.com/aortegablasi96/stock-portfolio-viewer/releases/tag/v1.0.0

### General description:

A local-first portfolio management application that lets investors import broker data into a single private workspace, display the data in multiple personalized views and support the analysis through an AI-assisted chatbot.

### AI-assisted product development:

Used Claude Code as a virtual cross-functional development team, creating specialized skill workflows for architecture, UI development, testing, governance and project management. Integrated MCP tools including Figma, shadcn and Playwright to connect product design, implementation and E2E testing.

### Tech stack:

- Electron
- React
- Typescript
- SQLite
- OpenAI
- Vercel

## Summary of Business Case:

### Summary:

**01 — Problem**

Portfolio data is fragmented across brokers, while existing broker interfaces offer limited personalization and cross-portfolio analysis.

- Icon: ⚠️
- Headline: Portfolio data split across brokers
- Key figure: 
- Key figure caption: 

**02 — Product**

A local-first portfolio management application that consolidates broker data into a personalized analytics workspace, complemented by an AI portfolio assistant.

- Icon: 💡
- Headline: A local-first, personal analytics workspace
- Key figure: 
- Key figure caption: 

**03 — Key decisions**

Local-first architecture · IBKR-first MVP · Broker abstraction · AI grounded in portfolio data

- Icon: 🔀
- Headline: Local-first, starting with IBKR
- Key figure: 
- Key figure caption: 

**04 — Outcome**

IBKR MVP · Portfolio analytics · Dividend tracking · AI assistant · Broker-extensible architecture

- Icon: 🏁
- Headline: An IBKR MVP built to add more brokers
- Key figure: 
- Key figure caption: 

**05 — My contribution**

Product strategy · Data pipeline · UX/UI · Architecture · Development · AI-assisted delivery

- Icon: 🛠
- Headline: From data pipeline to AI-assisted delivery
- Key figure: 
- Key figure caption: 

## Business Case:

### Problem

Investors with accounts across brokers lack a single, customizable view of their portfolio.
Broker platforms are optimized for managing individual accounts rather than combining data across providers, analyzing historical performance in a personalized way, and turning portfolio data into actionable insights.

### Product decision

Build a local-first portfolio management application that lets investors import broker data into a single private workspace. The initial MVP integrates Interactive Brokers through Flex Queries, while the architecture separates broker ingestion from the portfolio domain model so additional brokers can be added later.

### Key Product Decisions:

- **Local-first**: sensitive financial data remains under the user's control.
- **IBKR-first MVP**: start with one broker while validating the core product experience.
- **Broker abstraction**: separate broker-specific ingestion from the portfolio domain model.
- **AI-assisted analysis**: allow natural-language exploration of portfolio data without replacing the user's investment judgment.

### Outcome

- Delivered a working portfolio-management MVP using Interactive Brokers as the first broker integration.
- Consolidated positions, transactions, performance, allocation and dividend information into multiple personalized views.
- Enabled natural-language exploration of portfolio data through an AI assistant.
- Established a broker-adapter architecture that allows additional data providers to be integrated without redesigning the product.

### Your role

**Product strategy**

- Defined the product concept, target user and MVP scope.
- Identified the core user workflows and information needs of a self-directed investor.

**Data & architecture**

- Designed the broker ingestion pipeline using Interactive Brokers Flex Queries.
- Defined the normalized data model required to make the portfolio layer broker-agnostic.

**UX**

- Translated investor preferences and portfolio-analysis needs into product requirements.
- Designed the experience and information architecture in Figma.

**Delivery**

- Built the application using Claude Code as an AI-assisted development environment.
- Implemented the product end-to-end across frontend, data layer and AI functionality.