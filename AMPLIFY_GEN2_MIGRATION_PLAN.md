# Amplify Gen 1 → Gen 2 Migration Plan

Amplify Gen 1 (CLI-managed CloudFormation) has reached end of life. This guide migrates the photoportfolio app to Amplify Gen 2 (CDK-based). The approach is blue/green: a Gen 2 environment runs alongside Gen 1 until fully validated, then stateful resources (DynamoDB tables, Cognito user pool, S3 bucket) are moved via CloudFormation refactoring to preserve all data. Stateless resources (AppSync API, IAM roles) are recreated fresh.

Dev environment is migrated first. Production is only touched after dev is confirmed stable.

---

## Current Infrastructure

| Resource | Service | Key Details |
|----------|---------|-------------|
| Auth | Cognito | User pool `us-east-2_bBunoZZlb`, `portfolio_admin` group, email verification, unauthenticated identity pool |
| API | AppSync GraphQL | 4 models: Albums, Images, AlbumTags, Url. Dual auth: API key (public reads) + Cognito user pools (admin writes) |
| Storage | S3 | Bucket `photoportfolio2823651daae6495a9294d18fa599cb6261107-dev`, guest: READ, authenticated: CRUD |
| Region | us-east-2 | Amplify App ID: `d31w5rszj2sf4f` |

**Risk — `@manyToMany` relationship:** Albums ↔ AlbumTags uses `@manyToMany`, which is not natively supported in Gen 2. The migration tool should generate a CDK escape hatch for it. Verify this in the assessment step (Phase 1.1) before proceeding.

---

## Code Changes Required (Frontend)

These changes are needed alongside the backend migration and are called out at the appropriate phase:

| File | Change |
|------|--------|
| `src/lib/aws-amplify.js` | Import `amplify_outputs.json` instead of `amplifyconfiguration.json` |
| `src/app/layout.js` | Same config import update |
| `src/adapters/api/AmplifyApiAdapter.js` | Storage API: `key`-based → `path`-based (Gen 2 uses `path`, see Phase 2.3) |
| `amplify/data/resource.ts` | Set correct `branchName`, verify `@manyToMany` CDK escape hatch |
| `amplify/backend.ts` | Uncomment `postRefactor()` after Phase 3 refactor |
| `package.json` | Upgrade `aws-amplify` to `^6.16.2` |

---

## Rollback Options by Phase

| Phase | Rollback Method |
|-------|----------------|
| Before Phase 1.3 (lock) | No backend changes made — just delete the git branch |
| After lock, before refactor | `amplify gen2-migration lock --rollback` |
| After refactor, before decommission | `amplify gen2-migration refactor --to <stack> --rollback`, then `amplify gen2-migration lock --rollback`, then `amplify push` |
| After decommission (Phase 3.6) | **Not possible** — Gen 1 stateless resources have been deleted |

---

## Phase 0: Prerequisites (One-Time Setup)

These are non-destructive checks and installs. Do these before touching any environment.

### 0.1 — Verify Node.js version

```bash
node --version
```

Must be **v20 or later** (CDK requirement). If below v20, upgrade Node.js before proceeding.

**Verify:** `node --version` shows `v20.x.x` or higher.

### 0.2 — Install Amplify CLI v14+

```bash
npm install -g @aws-amplify/cli@14
amplify --version
```

**Verify:** Output shows version 14.x or higher.

### 0.3 — Bootstrap CDK in the account and region

CDK must be bootstrapped in `us-east-2` for account `068884799909`. This is a no-op if already done.

```bash
npx cdk bootstrap aws://068884799909/us-east-2
```

**Verify:** Command completes without error. Check the AWS Console → CloudFormation for a stack named `CDKToolkit` in `us-east-2`.

### 0.4 — Verify IAM permissions

The AWS user/role used for migration must have:
- CloudFormation stack operations (including refactoring APIs: `cloudformation:CreateChangeSet`, `cloudformation:ExecuteChangeSet`)
- S3 bucket operations
- Cognito user pool operations

Review the [AWS Amplify Gen 2 migration IAM requirements](https://docs.amplify.aws/react/start/migrate-to-gen2/migrate-existing-app/#prerequisites) and attach any missing policies before proceeding.

### 0.5 — Upgrade npm packages

```bash
npm install aws-amplify@^6.16.2 @aws-amplify/ui-react@^6
```

**Verify:**
```bash
npm run build
npm test
```

Both should pass without errors. The upgrade is backward-compatible with the Gen 1 backend.

### 0.6 — Verify TypeScript version

```bash
npx tsc --version
```

Must be **5.0 or later**. If below 5.0:

```bash
npm install typescript@^5.0.0 --save-dev
```

---

## Phase 1: Dev Environment — Assess & Generate Gen 2 Code

All steps in this phase are reversible. No stateful resources are modified.

### 1.1 — Assess the Gen 1 dev environment

```bash
amplify env checkout dev
amplify gen2-migration assess
```

Review the generated report carefully:
- [ ] `@manyToMany` (Albums ↔ AlbumTags) is listed and flagged for CDK escape hatch generation
- [ ] No DataStore conflict resolution is enabled
- [ ] Auth: `portfolio_admin` group is recognized
- [ ] Storage: guest-read, auth-CRUD access levels are recognized
- [ ] Note any features flagged as "manual migration required"

**Stop here if the report flags unsupported features that are not accounted for above.** Research the specific feature before proceeding.

### 1.2 — Create a Git branch for Gen 2

```bash
git checkout -b gen2-migration
```

### 1.3 — Lock the Gen 1 dev environment

Prevents accidental Gen 1 updates during migration. Reversible until the refactor step.

```bash
amplify gen2-migration lock
```

**Verify:** In AWS Console → CloudFormation → stack `amplify-photoportfolio-dev-61107` → Stack policy, confirm a deny-all policy is now applied.

### 1.4 — Generate Gen 2 TypeScript code

```bash
amplify gen2-migration generate
```

This introspects the CloudFormation stacks and produces CDK TypeScript definitions in `amplify/`.

**Verify the generated files exist:**
```bash
ls amplify/
# Expected: backend.ts, auth/resource.ts, data/resource.ts, storage/resource.ts
```

**Review each generated file:**

- `amplify/data/resource.ts`: Confirm the 4 models (Albums, Images, AlbumTags, Url) are present. The `@manyToMany` between Albums and AlbumTags should appear as a CDK escape hatch (custom L1 constructs or inline CDK). Confirm the dual-auth rules are preserved: public API key for reads, Cognito `portfolio_admin` group for writes.
- `amplify/auth/resource.ts`: Confirm `portfolio_admin` group is defined, unauthenticated access is enabled.
- `amplify/storage/resource.ts`: Confirm guest:read and auth:CRUD access levels.
- `amplify/backend.ts`: Confirm `postRefactor()` call is present but commented out (do not uncomment yet).

### 1.5 — Post-generate manual adjustments

#### Fix the branch name in the data model

In `amplify/data/resource.ts`, update the branch reference to match the current Gen 2 branch:

```typescript
// Change:
branchName: "main"
// To:
branchName: "gen2-migration"
```

#### Verify @auth rules

Confirm the generated data model preserves the dual-auth pattern from Gen 1. For each model, it should read something like:

```typescript
authorization: (allow) => [
  allow.publicApiKey().to(['read']),
  allow.group('portfolio_admin').to(['create', 'update', 'delete']),
]
```

If `@manyToMany` was translated to a CDK escape hatch, manually verify the join table (AlbumAlbumTags) has equivalent auth rules.

#### Verify storage access levels

In `amplify/storage/resource.ts`, confirm:
- Unauthenticated (guest) users: read-only
- Authenticated users: create, read, update, delete

### 1.6 — Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

**Verify:** `npm run build` completes without errors.

---

## Phase 2: Dev Environment — Deploy & Test in Isolation

Deploy the Gen 2 config to a sandbox (fresh temporary resources, does not touch the dev DynamoDB tables, Cognito, or S3 bucket). Validate everything works before the irreversible refactor.

### 2.1 — Deploy to a sandbox

```bash
npx ampx sandbox --once
```

This creates temporary Gen 2 resources in your AWS account and writes `amplify_outputs.json` to the project root.

**Verify:** The command completes and `amplify_outputs.json` exists at the project root.

### 2.2 — Update the frontend config import

In `src/lib/aws-amplify.js`:
```javascript
// Before:
import amplifyconfig from '../amplifyconfiguration.json';
// After:
import outputs from '../../amplify_outputs.json';
const amplifyconfig = outputs;
```

In `src/app/layout.js`, make the same import change.

> Note: `Amplify.configure()` accepts both the Gen 1 and Gen 2 config formats, so no other initialization code needs to change.

### 2.3 — Update `AmplifyApiAdapter.js` for Gen 2 storage API

Gen 2 uses `path` (the full S3 key path) instead of `key` (a short key with access level managed separately). In Gen 1, guest files were stored under `public/{key}` in S3, so the mapping is to prepend `public/`.

In `src/adapters/api/AmplifyApiAdapter.js`, update all four storage methods:

```javascript
// uploadFile: was uploadData({ key, ... }) — now:
uploadData({ path: `public/${key}`, data: file, options: { contentType, ... } })

// getFileUrl: was getUrl({ key }) — now:
getUrl({ path: `public/${key}` })

// deleteFile: was remove({ key }) — now:
remove({ path: `public/${key}` })

// listFiles: was list({ prefix, ... }) — now:
list({ path: `public/${prefix}`, options: { ... } })
```

**Before writing these changes**, verify the actual S3 path scheme by checking a known image URL in the existing app. If existing image URLs contain `public/` in the S3 key, the `public/` prefix mapping is correct. If they use a different prefix, adjust accordingly.

### 2.4 — Run the test suite

```bash
npm test
```

All tests must pass. (Tests use mock adapters and are not affected by the storage path change directly, but any test that asserts on storage call arguments will fail and will need updating to use `path`.)

### 2.5 — Functional test against the sandbox

Start the dev server:
```bash
npm run dev
```

Test all critical flows against the sandbox (fresh data, not real dev data):
- [ ] Sign in with a `portfolio_admin` account
- [ ] Sign out and sign back in
- [ ] View the albums list (unauthenticated)
- [ ] Create a new album (admin)
- [ ] Upload an image to an album
- [ ] View an image via its public URL
- [ ] Delete an image
- [ ] Create an album tag and assign it to an album (**critical** — tests `@manyToMany` via CDK escape hatch)
- [ ] Confirm private albums are not visible to unauthenticated users
- [ ] `npm run build` — production build succeeds

**Do not proceed to Phase 3 until all items above pass.**

### 2.6 — Deploy Gen 2 branch to Amplify Console

```bash
git add .
git commit -m "feat: migrate to Amplify Gen 2"
git push origin gen2-migration
```

In the AWS Amplify Console (`d31w5rszj2sf4f`):
1. App Settings → Branch settings → Add branch
2. Select `gen2-migration` and connect it
3. Wait for the deployment to succeed

**Verify:** The Amplify Console shows a green build and deploy for `gen2-migration`.

---

## Phase 3: Dev Environment — Refactor Stateful Resources

> **This is the point of no return for the dev environment.** The refactor moves the existing Cognito user pool, DynamoDB tables, and S3 bucket from the Gen 1 CloudFormation stack into the Gen 2 stack. Rollback is possible immediately after if something goes wrong, but becomes increasingly risky over time as data changes accumulate in the Gen 2 stack.
>
> Ensure Phase 2 testing is completely done before proceeding.

### 3.1 — Find the Gen 2 root stack name

In the AWS Console → CloudFormation, find the stack created for the `gen2-migration` branch. Its name follows the pattern: `amplify-<appId>-gen2migration-branch-<suffix>`.

Alternatively, use the AWS CLI:

```bash
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE \
  --query "StackSummaries[?contains(StackName, 'd31w5rszj2sf4f')].[StackName,CreationTime]" \
  --output table \
  --region us-east-2
```

Note the full stack name — you'll need it for the next step.

### 3.2 — Run the refactor

Switch back to the Gen 1 dev environment and run the refactor command:

```bash
git checkout main
amplify pull --appId d31w5rszj2sf4f --envName dev
amplify gen2-migration refactor --to <gen2-root-stack-name>
```

The refactor uses CloudFormation refactoring APIs to move the Cognito user pool, DynamoDB tables, and S3 bucket from the Gen 1 stack (`amplify-photoportfolio-dev-61107`) to the Gen 2 stack.

**Verify:** In CloudFormation Console, confirm:
- The Gen 1 stack no longer owns the Cognito user pool, DynamoDB tables, and S3 bucket
- The Gen 2 stack now owns those resources
- "Holding stacks" (temporary stacks created during refactor) are present — these are normal and provide rollback capability

**If the refactor fails or something looks wrong:**
```bash
amplify gen2-migration refactor --to <gen2-root-stack-name> --rollback
amplify gen2-migration lock --rollback
amplify push
```

### 3.3 — Post-refactor reconciliation

```bash
git checkout gen2-migration
```

Edit `amplify/backend.ts` and uncomment the `postRefactor()` call. This call must remain uncommented permanently — it reconciles CloudFormation drift introduced by the refactor.

### 3.4 — Deploy post-refactor changes

```bash
git add amplify/backend.ts
git commit -m "fix: post-refactor reconciliation"
git push origin gen2-migration
```

Wait for the Amplify Console deployment to complete.

### 3.5 — Full regression test on dev (with real data)

Repeat all tests from Phase 2.5, but now you're operating against the real dev data (the same Cognito user pool, DynamoDB tables, and S3 bucket that existed in Gen 1).

- [ ] Existing albums appear correctly
- [ ] Existing images load correctly (check that S3 URLs work — the `public/` path prefix mapping from Phase 2.3 is critical here)
- [ ] Existing tags on albums are intact
- [ ] Admin create/update/delete operations work
- [ ] Public read access works without authentication

### 3.6 — Decommission Gen 1 dev resources

Only after confirming the Gen 2 dev environment is fully operational:

1. **Check CloudWatch metrics** — Confirm no traffic is hitting the Gen 1 AppSync endpoint (`https://vvh26xffdvgv5lc2ddikmzu6ji.appsync-api.us-east-2.amazonaws.com/graphql`)

2. **Apply Retain deletion policies** — In the Gen 1 CloudFormation stack (`amplify-photoportfolio-dev-61107`), manually set `DeletionPolicy: Retain` on all remaining resources before deletion. Do this via the CloudFormation console or by updating the template.

3. **Delete Gen 1 stateless resources** — Manually remove via the AWS Console:
   - The AppSync API (now replaced by Gen 2)
   - Any IAM roles specific to the Gen 1 stack
   - Lambda functions (if any)

4. **Delete the Gen 1 stack shell** — Delete only the stack metadata shell (the stateful resources will be retained due to step 2). Follow the Amplify documentation for safe deletion.

> **Do NOT run `amplify env remove`** and do NOT delete the Gen 1 CloudFormation stack directly via the console without first applying Retain policies. Either action can trigger resource deletion that corrupts the migrated Gen 2 environment.

---

## Phase 4: Production Environment Migration

Proceed only after the dev Gen 2 environment has been stable for at least a few days with no issues.

### 4.1 — Confirm the production environment

```bash
amplify env list
```

Identify the production environment name. If there is no separate prod environment and production runs from a different branch of the same Amplify app, note which environment name maps to production.

### 4.2 — Create a production Gen 2 branch

Based on the validated `gen2-migration` branch:

```bash
git checkout gen2-migration
git checkout -b gen2-prod
```

Update `amplify/data/resource.ts`:
```typescript
// Change:
branchName: "gen2-migration"
// To:
branchName: "gen2-prod"
```

```bash
git add amplify/data/resource.ts
git commit -m "chore: set prod branch name for Gen 2"
git push origin gen2-prod
```

### 4.3 — Assess the Gen 1 prod environment

```bash
amplify env checkout prod
amplify gen2-migration assess
```

Compare the report to the dev assessment. If prod has any additional resources or differences, handle them before proceeding.

### 4.4 — Lock the Gen 1 prod environment

```bash
amplify gen2-migration lock
```

**Verify:** Confirm the CloudFormation stack policy is applied to the production Gen 1 stack.

### 4.5 — Generate Gen 2 code for prod

```bash
amplify gen2-migration generate
```

Review the diff between the generated prod code and the `gen2-prod` branch. Apply the same post-generate adjustments from Phase 1.5 if needed. The prod code should be nearly identical to dev — the primary difference will be DynamoDB table names and resource ARNs referencing prod resources.

### 4.6 — Deploy Gen 2 prod to Amplify Console

In the AWS Amplify Console, connect the `gen2-prod` branch:
1. App Settings → Branch settings → Add branch
2. Select `gen2-prod` and connect it
3. Wait for deployment to succeed

### 4.7 — Functional testing against prod Gen 2

> Do not switch production traffic to Gen 2 until this testing is complete.

Using the Gen 2 prod endpoint URL (from `amplify_outputs.json` for the prod branch), verify:
- [ ] All albums and images are accessible
- [ ] Admin sign-in works with real production credentials
- [ ] Image upload works
- [ ] Album tags work
- [ ] Public access works (unauthenticated)

### 4.8 — Refactor prod stateful resources (POINT OF NO RETURN for prod)

Find the prod Gen 2 root stack name in CloudFormation, then:

```bash
git checkout main  # or whichever branch tracks the Gen 1 prod env
amplify pull --appId d31w5rszj2sf4f --envName prod
amplify gen2-migration refactor --to <prod-gen2-root-stack-name>
```

**Verify:** Same checks as Phase 3.2 — confirm the Gen 1 prod stack no longer owns stateful resources and the Gen 2 prod stack does.

### 4.9 — Post-refactor and final deploy for prod

```bash
git checkout gen2-prod
```

Uncomment `postRefactor()` in `amplify/backend.ts`:

```bash
git add amplify/backend.ts
git commit -m "fix: post-refactor reconciliation for prod"
git push origin gen2-prod
```

Wait for the Amplify Console deployment to complete.

### 4.10 — Regression test on prod (with real production data)

Repeat all tests from Phase 3.5 against the production Gen 2 endpoint with real production data.

Monitor CloudWatch for at least 24 hours after the refactor before proceeding to decommission.

### 4.11 — Switch production traffic to Gen 2

Update your production frontend deployment to point to the Gen 2 Amplify Console environment or update DNS to route to the `gen2-prod` branch.

### 4.12 — Decommission Gen 1 prod resources

Same process as Phase 3.6 but for the production Gen 1 stack. Be extra cautious:
- Monitor CloudWatch for **48 hours** after switching traffic before deleting anything
- Confirm zero requests to the Gen 1 AppSync endpoint
- Apply Retain policies before any deletion
- Delete stateless resources manually first, then the stack shell

---

## Reference: Key Resource IDs

| Resource | Value |
|----------|-------|
| Amplify App ID | `d31w5rszj2sf4f` |
| AWS Account | `068884799909` |
| Region | `us-east-2` |
| Gen 1 dev stack | `amplify-photoportfolio-dev-61107` |
| Gen 1 AppSync endpoint | `https://vvh26xffdvgv5lc2ddikmzu6ji.appsync-api.us-east-2.amazonaws.com/graphql` |
| Dev Cognito user pool | `us-east-2_bBunoZZlb` |
| Dev S3 bucket | `photoportfolio2823651daae6495a9294d18fa599cb6261107-dev` |
| CloudFront (image delivery) | `d3fgg5e5ebp2y7.cloudfront.net` |
