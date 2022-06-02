# Vouch Digital

```js
// Routes
AuthController {/auth}:
{/auth/signup, POST}
{/auth/login, POST}

ContactsController {/contact}:
{/contact, POST}
{/contact, GET}
{/contact/:id, GET}
{/contact/:id, PATCH}
{/contact/:id, DELETE}
```

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# e2e tests
$ npm run test:e2e
```

## Test Results

```js
Tests Passing

 PASS  test/app.e2e-spec.ts (5.792 s)
  App e2e
    Auth
      Signup
        ✓ Should throw esception if email empty (29 ms)
        ✓ Should throw esception if password empty (4 ms)
        ✓ Should throw esception if no dto (3 ms)
        ✓ Should Signup (86 ms)
      Login
        ✓ Should throw esception if email empty (4 ms)
        ✓ Should throw esception if password empty (5 ms)
        ✓ Should throw esception if no dto (4 ms)
        ✓ Should Login (25 ms)
    Contact
      Create Contact
        ✓ Should create a single contact (53 ms)
      Get last added Contact
        ✓ Should get Contacts (24 ms)
      Update Contact
        ✓ Should update a single contact (30 ms)
      Get contact by ID
        ✓ Should get a single contact (20 ms)
      Delete Contact
        ✓ Should delete a single contact (12 ms)
      Add 200 contacts
        ✓ Should create 200 contacts (106 ms)
      Get Contacts
        ✓ Should get Contacts (11 ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        5.878 s, estimated 6 s
Ran all test suites.
Done in 6.79s.
```
