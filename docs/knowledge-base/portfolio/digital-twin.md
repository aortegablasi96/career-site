# Project: Digital Twin

# Slogan

A chatbot to talk about my career

### General description:

A chatbot that answers questions about the career on this page, in the visitor’s language. Demonstrates an agentic RAG system: several agents filter each question, retrieve the documents, write a professional answer, and send push notifications, while semantic vector search and BM25 lexical search run concurrently and are reranked with Cohere for precision.

### AI-assisted product development:

Designed an orchestrated **multi-agent workflow** with LangGraph and OpenAI agents, breaking the conversation into specialized steps. Each agent can access the tools it needs, while **structured outputs and guardrails** provide consistency and control over the responses.

To improve retrieval quality, implemented a **hybrid RAG approach** combining BM25 lexical search and semantic vector search. Relevant documents are retrieved from the Chroma database and then **reranked with Cohere** before being provided as context to the agents.

Built the backend with **FastAPI**, exposing the agentic RAG pipeline through APIs that connect the AI layer with the frontend.

### Tech stack:

- Next.js
- FastAPI
- LangGraph
- OpenAI Agents SDK
- Chroma
- Cohere

## Summary of Business Case:

### Summary:

**01 — Problem**

Traditional career websites require visitors to navigate static pages to understand a candidate's experience, creating an opportunity for a more interactive way to explore professional information.

- Icon: ⚠️
- Headline: Static pages make visitors dig for answers
- Key figure: 
- Key figure caption: 

**02 — Product**

An AI-powered Digital Twin that allows recruiters and visitors to ask natural-language questions about my experience, projects, skills and professional background.

- Icon: 💡
- Headline: Ask about my career in plain language
- Key figure: 
- Key figure caption: 

**03 — Key decisions**

AI as an interface · Grounded professional knowledge · Structured career context · Controlled conversational scope

- Icon: 🔀
- Headline: AI as the interface, grounded in facts
- Key figure: 
- Key figure caption: 

04 — Outcome
Interactive AI profile · Conversational career exploration · Structured professional knowledge base · AI agent foundation

- Icon: 🏁
- Headline: An interactive AI profile
- Key figure: 
- Key figure caption: 

**05 — My contribution**

Product strategy · AI & data design · Conversational UX · Knowledge architecture · End-to-end development

- Icon: 🛠
- Headline: From AI design to end-to-end development
- Key figure: 
- Key figure caption: 

## Business Case:

### Problem

Traditional career websites present information about a candidate through static pages, requiring visitors to navigate through experience, projects, skills and education to understand their profile.

This creates an opportunity to make the career experience more interactive: instead of simply reading about a candidate, visitors can ask questions and explore the candidate's experience through a conversational interface.

### Product decision

Build an AI-powered Digital Twin that acts as an interactive interface to my professional profile.

The product combines structured information about my career, experience, projects and skills with an AI conversational layer, allowing visitors to ask natural-language questions about my background and receive answers grounded in my professional information.

The goal was not to create an AI representation capable of impersonating me, but to experiment with a more engaging way of presenting professional information while keeping the underlying knowledge constrained to relevant career data.

### Key product decisions

* **AI as an interface:** Use conversational AI as an alternative way to explore a professional profile rather than simply adding a chatbot to the website.
* **Grounded knowledge:** Base responses on curated information about my actual experience, projects and skills rather than relying on the model's general knowledge.
* **Structured professional context:** Organize career information so that the AI can retrieve and connect relevant experiences when answering questions.
* **Controlled scope:** Focus the Digital Twin on professional topics and career-related questions to maintain relevance and reduce unsupported responses.
* **Conversational discovery:** Design the experience around questions that a recruiter, hiring manager or potential collaborator might naturally ask.

### Outcome

* Delivered an interactive AI-powered Digital Twin capable of answering questions about my professional background.
* Transformed a static career profile into a conversational experience.
* Created a structured knowledge base covering professional experience, projects, skills and other relevant career information.
* Demonstrated how generative AI can be used as a product interface for navigating structured personal information.
* Established a foundation for further experimentation with personalized AI agents and professional knowledge systems.

### My role

#### Product strategy

* Defined the Digital Twin concept and its target users.
* Identified the types of questions and information that should be supported by the experience.
* Defined the product scope and boundaries of the AI assistant.

#### AI & data

* Structured and curated the information required to represent my professional profile.
* Designed the approach for grounding AI responses in career-specific information.
* Defined the conversational experience and relevant interaction patterns.

#### UX

* Designed the interaction between the traditional career website and the conversational Digital Twin.
* Focused the experience on helping visitors discover relevant information through natural-language questions.

#### Delivery

* Designed and implemented the Digital Twin end-to-end.
* Integrated the AI capabilities and supporting data layer.
* Tested conversational scenarios to improve answer relevance and reliability.