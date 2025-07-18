# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS server application for "all-ai-for-developers-server" - a server application focused on AI tooling for developers. The project uses pnpm as the package manager and follows standard NestJS architectural patterns.

## Development Setup

The project is set up with:
- **Framework**: NestJS (Node.js framework)
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Testing**: Jest for unit tests and e2e tests
- **Linting**: ESLint with Prettier
- **Build Tool**: NestJS CLI with SWC compiler

## Commands

Essential development commands:

### Development
- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run start:debug` - Start development server with debug mode
- `pnpm run start` - Start production server

### Build & Production
- `pnpm run build` - Build the application
- `pnpm run start:prod` - Start production server

### Testing
- `pnpm run test` - Run unit tests
- `pnpm run test:watch` - Run unit tests in watch mode
- `pnpm run test:cov` - Run tests with coverage
- `pnpm run test:e2e` - Run end-to-end tests

### Code Quality
- `pnpm run lint` - Run ESLint and fix issues
- `pnpm run format` - Format code with Prettier

## Architecture

### Project Structure
```
src/
├── app.controller.ts    # Main application controller
├── app.module.ts        # Root application module
├── app.service.ts       # Main application service
└── main.ts             # Application entry point

test/
└── app.e2e-spec.ts     # End-to-end tests
```

### Key Patterns
- **Modules**: Use NestJS modules for feature organization
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data access
- **Dependency Injection**: Leverages NestJS's built-in DI system
- **Decorators**: Extensive use of TypeScript decorators for metadata

### Development Notes
- The application runs on port 3000 by default
- Uses Express.js as the underlying HTTP server
- Configured with reflect-metadata for decorator support

### Code Style and Quality Rules

#### TypeScript Configuration
- Target: ES2023
- Strict null checks enabled
- Decorator metadata enabled
- No implicit any is disabled (but still prefer explicit typing)

#### ESLint Configuration
- Uses TypeScript ESLint with recommended type-checked rules
- Prettier integration enabled
- Key rules:
  - `@typescript-eslint/no-explicit-any`: off (but use sparingly)
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn

#### Prettier Configuration
- Single quotes preferred
- Trailing commas required
- Line length: default (80 characters)

#### Code Generation Guidelines
- Always use explicit type assertions instead of 'any' when possible
- Import specific types from libraries (e.g., `AxiosError` from axios)
- Use proper error handling with typed error objects
- Follow NestJS patterns: Controllers, Services, Modules
- Use dependency injection for all services
- Prefer async/await over promises when possible
- Add proper JSDoc comments for complex functions