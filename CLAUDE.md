# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WLINSK AI Answering Frontend** - A Vue 3 + TypeScript application that provides AI-powered quiz creation and management with user authentication and administrative features.

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Type checking (Vue SFC compatible)
npm run type-check

# Production build with type validation
npm run build

# Preview production build
npm run preview

# Lint and fix code issues
npm run lint

# Format code with Prettier
npm run format
```

## Technology Stack & Architecture

### Core Technologies
- **Frontend**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite 4.4.9
- **Language**: TypeScript with strict mode
- **State Management**: Pinia with persistence (`pinia-plugin-persistedstate`)
- **Routing**: Vue Router 4.2.4
- **UI Library**: Arco Design Vue (`@arco-design/web-vue`)
- **HTTP Client**: Axios with custom interceptors
- **Styling**: SCSS with global reset styles

### Directory Structure
```
src/
├── api/                    # API layer - controllers + TypeScript models
│   ├── controller/         # API endpoint definitions (admin/, user/)
│   └── models/            # TypeScript types and DTOs
├── components/            # Reusable Vue components
├── layouts/               # Layout templates (BasicLayout, UserLayout)
├── router/               # Vue Router configuration with access control
├── stores/               # Pinia stores with persistence
├── styles/               # Global styles and resets
├── views/                # Page components (admin/, user/)
├── access/               # Access control system
├── request.ts            # Axios configuration with interceptors
└── main.ts              # Application entry point
```

## Key Architectural Patterns

### State Management (Pinia Stores)
All stores use persistence and follow this pattern:
- **userStore**: Authentication, user profile, AI points
- **appStore**: Current application metadata
- **chatSessionStore**: Chat session management
- **chatRecordsStore**: Chat history tracking
- **questionStore**: Quiz question state

### API Layer Architecture
- **Controllers**: Grouped by user type (`user/`, `admin/`) with TypeScript models
- **Type Safety**: Full TypeScript integration with `Result<T>` wrapper
- **Authentication**: Automatic token injection via request interceptors
- **Error Handling**: Centralized error responses with modal notifications
- **Base URL**: Configured via `VITE_REQUEST_HOST` environment variable

### Access Control System
- **Roles**: `NOT_LOGIN`, `USER`, `ADMIN` (defined in `accessEnum.ts`)
- **Route Guards**: Declarative permissions in route meta tags
- **Dynamic Menu**: Menu items filtered by user permissions
- **Auth Flow**: Token-based with automatic redirect on expiry

### Request/Response Patterns
- **Standard Response**: `Result<T>` wrapper with `rspCd`/`rspInf` fields
- **Error Codes**: `9991` (unauthorized), `9990` (insufficient permissions)
- **File Upload**: Dedicated endpoints with multipart/form-data
- **Pagination**: `IPage<T>` interface for list responses

## Development Guidelines

### Component Development
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow the existing component structure and naming conventions
- Leverage Arco Design Vue components for consistency
- Implement responsive design patterns

### API Integration
- Import controllers from `@/api/controller/` directories
- Use existing TypeScript models from `@/api/models/`
- Follow the established request patterns in controllers
- Handle authentication tokens automatically via interceptors

### Store Usage
- Import stores using `use*Store()` naming convention
- Access store state and actions as defined in each store
- All stores have persistence enabled automatically
- Clear stores appropriately on logout

### Routing & Navigation
- Routes are defined in router configuration files
- Access control is handled via route meta tags
- Use the existing redirect patterns for authentication
- Follow the established layout selection logic

## Important Configuration

### Path Aliases
- `@/*` maps to `src/*` for clean imports throughout the application

### Environment Variables
- `VITE_REQUEST_HOST`: API base URL for backend requests

### TypeScript Configuration
- Strict mode enabled
- Vue SFC type checking via `vue-tsc`
- Path aliases configured for `@/*` imports

## Key Features Implementation

### Authentication System
- Login/logout with token storage in localStorage
- Three-party OAuth integration support
- Automatic token refresh and expiry handling
- Role-based access control

### AI Points System
- Daily credit reset for AI features
- Points tracked in userStore with persistence
- Integration with AI-powered quiz generation

### Chat System
- Persistent chat sessions with history
- Real-time messaging capabilities
- AI customer service integration
- Session management with store persistence

### Quiz/Application Management
- AI-assisted question generation
- Interactive quiz taking interface
- Automated scoring and result tracking
- Admin approval workflow for user-created content