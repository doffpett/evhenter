# evHenter Constitution

## Core Principles

### I. Code Quality Standards

**Type Safety First**
- TypeScript strict mode required (`strict: true`)
- No `any` types without explicit justification and approval
- All function parameters and return types must be explicitly typed
- Prefer interfaces for object shapes, types for unions/intersections
- Use discriminated unions for state machines and complex conditional logic

**Code Organization**
- Single Responsibility Principle: Each module/component has one clear purpose
- DRY (Don't Repeat Yourself): Extract reusable logic into shared utilities
- Clear folder structure: Group by feature/domain, not by technical layer
- Maximum function length: 50 lines (excluding comments)
- Maximum file length: 300 lines

**Code Style**
- Consistent naming: camelCase for variables/functions, PascalCase for components/classes
- Descriptive names over comments: Code should be self-documenting
- Avoid magic numbers: Use named constants
- Early returns over nested conditionals
- Async/await preferred over promise chains

### II. Testing Standards (NON-NEGOTIABLE)

**Test Coverage Requirements**
- Minimum 80% code coverage for new code
- 100% coverage for critical business logic and data mutations
- All bug fixes must include regression tests

**Test Hierarchy**
1. **Unit Tests**: All pure functions, utilities, hooks
   - Fast execution (< 100ms per test)
   - No external dependencies
   - Mock all I/O operations
2. **Integration Tests**: Component interactions, API endpoints
   - Test realistic user workflows
   - Mock external services only
3. **E2E Tests**: Critical user journeys
   - Happy paths for core features
   - Authentication flows
   - Data persistence verification

**Test Quality**
- Each test has a single, clear assertion
- Test names describe behavior: "should [expected behavior] when [condition]"
- Arrange-Act-Assert pattern strictly followed
- No test interdependencies: Each test runs in isolation
- Tests must be deterministic: No flaky tests tolerated

**TDD Workflow**
1. Write failing test
2. Get user/reviewer approval on test
3. Implement minimal code to pass test
4. Refactor while keeping tests green
5. Commit only when all tests pass

### III. User Experience Consistency

**Design System Adherence**
- All UI components use design tokens (colors, spacing, typography)
- No inline styles except for dynamic, calculated values
- Component library usage mandatory: No custom implementations of existing components
- Accessibility (a11y) checklist required for all interactive elements

**Interaction Patterns**
- Loading states required for all async operations (> 200ms)
- Error states with actionable messages: "What happened" + "What to do"
- Optimistic updates with rollback for user actions
- Keyboard navigation support: Tab order, escape key, enter key
- Focus management: Preserve and restore focus appropriately

**Responsive Design**
- Mobile-first approach: Design for smallest screen, enhance for larger
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Touch targets minimum 44x44px
- Test on real devices, not just browser DevTools

**Performance UX**
- Time to Interactive (TTI) < 3 seconds on 3G
- First Contentful Paint (FCP) < 1.5 seconds
- Layout Stability: Cumulative Layout Shift (CLS) < 0.1
- User feedback within 100ms for interactions

### IV. Performance Requirements

**Frontend Performance**
- Bundle size budget:
  - Initial bundle < 200KB gzipped
  - Route-based code splitting required
  - Lazy load non-critical components
- Image optimization:
  - Next-gen formats (WebP/AVIF) with fallbacks
  - Responsive images with srcset
  - Lazy loading below the fold
- React optimization:
  - Memoization for expensive computations
  - Virtualization for lists > 50 items
  - Debounce/throttle user inputs

**Backend Performance**
- API response times:
  - P50 < 200ms
  - P95 < 500ms
  - P99 < 1000ms
- Database queries:
  - Proper indexes on filtered/sorted columns
  - N+1 query detection and prevention
  - Query execution time logged and monitored
- Caching strategy:
  - Cache-Control headers on static assets
  - Stale-while-revalidate for API responses
  - Optimistic locking for concurrent updates

**Monitoring & Alerting**
- Real User Monitoring (RUM) for frontend metrics
- Application Performance Monitoring (APM) for backend
- Error tracking with contextual information
- Performance budgets in CI/CD pipeline

### V. Security Standards

**Authentication & Authorization**
- Never trust client-side validation: Always validate server-side
- Principle of least privilege: Users/services get minimum required permissions
- Sensitive data never logged or exposed in error messages
- Session management: Secure cookies, CSRF protection, session expiry

**Data Protection**
- Input sanitization: Prevent XSS, SQL injection, command injection
- Output encoding based on context (HTML, URL, JavaScript)
- Secrets in environment variables, never in code
- PII (Personally Identifiable Information) handling documented and compliant

**Dependency Management**
- Regular security audits: `npm audit` or equivalent
- Automated dependency updates with breaking change review
- No dependencies with known critical vulnerabilities
- License compliance verification

## Development Workflow

### Code Review Process

**Pre-Review Checklist**
- [ ] All tests pass locally
- [ ] Code coverage meets requirements
- [ ] No linting errors or warnings
- [ ] Self-review completed
- [ ] PR description explains "why" not just "what"

**Review Standards**
- Mandatory approval from at least one reviewer
- Maximum 48-hour review SLA
- Reviewers check for:
  - Code quality adherence
  - Test coverage and quality
  - Performance implications
  - Security vulnerabilities
  - UX consistency
- Constructive feedback: Suggest alternatives, explain reasoning

### Git Workflow

**Branching Strategy**
- Feature branches from main: `feature/description` or `issue-number-description`
- Bug fixes: `fix/description`
- Branch lifetime < 3 days: Small, incremental changes

**Commit Standards**
- Conventional Commits format: `type(scope): description`
  - Types: feat, fix, refactor, test, docs, chore
  - Example: `feat(assignments): add ctrl+click support for empty cells`
- Atomic commits: Each commit is a complete, working change
- Commit messages explain "why" in body when needed

**Pull Request Standards**
- PR title follows commit convention
- Description includes:
  - Problem/context
  - Solution approach
  - Testing performed
  - Screenshots for UI changes
- Link to related issues/tickets
- Keep PRs small: < 400 lines changed when possible

## Quality Gates

### CI/CD Pipeline

**Automated Checks (Must Pass)**
1. All tests pass (unit, integration, E2E)
2. Code coverage meets minimums
3. Linting passes with zero errors
4. Type checking passes
5. Build succeeds
6. Bundle size within budget
7. Security scan passes

**Pre-Deployment**
- Staging environment validation
- Performance benchmarks compared to baseline
- Database migration tested (if applicable)

### Definition of Done

A feature is complete when:
- [ ] Implemented according to specification
- [ ] All tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] Performance benchmarked
- [ ] Deployed to staging and validated
- [ ] Product owner approval received

## Exception Handling

### Technical Debt

**Acceptable Debt**
- Explicitly documented in code comments with "TODO:" or "DEBT:"
- Tracked in project management system
- Has repayment plan and timeline

**Unacceptable Debt**
- Skipping tests "temporarily"
- Disabling linting rules without justification
- Hardcoding sensitive data
- Ignoring security warnings

### Fast-Follow Principle

For urgent production fixes:
1. Hotfix can bypass full process with CTO/Lead approval
2. Must include monitoring and rollback plan
3. Full process (tests, review) completed within 24 hours post-deployment

## Governance

**Constitutional Authority**
- This constitution supersedes all other development practices
- All code reviews verify constitutional compliance
- Violations require documented justification and approval

**Amendment Process**
1. Proposal documented with rationale
2. Team discussion and feedback period (minimum 3 days)
3. Impact assessment and migration plan
4. Approval requires consensus or CTO override
5. Version incremented and changelog updated

**Enforcement**
- Pull requests blocked by CI/CD on violations
- Retrospectives review adherence quarterly
- Team members empowered to call out non-compliance

**Continuous Improvement**
- Quarterly review of metrics and effectiveness
- Feedback encouraged from all team members
- Adapt practices based on evidence and team growth

---

**Version**: 1.0.0 | **Ratified**: 2025-11-11 | **Last Amended**: 2025-11-11
