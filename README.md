# VERIQ - Enterprise Engineering Decision Intelligence Platform

VERIQ is a high-reliability decision intelligence platform for enterprise software engineering organizations.

## Project Structure
- `veriq-backend/` - Spring Boot 3 (Java 21) REST API Service
- `veriq-frontend/` - React + TypeScript + Vite Web Application

## Technology Stack
- **Backend:** Java 21, Spring Boot 3.2.x, Spring Data JPA, Flyway Migration
- **Frontend:** React 18, TypeScript 5, Vite, React Router v6, Axios, Lucide Icons
- **Database:** PostgreSQL 16+

## Architecture Pattern
All modules follow the strict 10-tier architecture:
`PostgreSQL → Entity → Repository → DTO → Mapper → Service → Controller → REST API → React Service → React State → UI`
