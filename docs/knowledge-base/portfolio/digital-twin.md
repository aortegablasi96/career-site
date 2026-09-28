# Project: Digital Twin

Developed and deployed an agentic RAG-based chatbot that provides contextual
answers about my own professional experience.

- Includes an agentic loop with several agents to filter, get the RAG documents, produce a professional answer and send push notifications.
- RAG-based system using using both semantic vector search (Chroma + OpenAI embeddings) and BM25 lexical search — run concurrently and reranked with Cohere for precision.
- Developed using react + next.js and FastAPI.

To review how I did it, check the github repository: https://github.com/aortegablasi96/career_conversation_chatbot