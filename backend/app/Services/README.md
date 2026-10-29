# Services

Transactional business workflows live in this namespace — one class per workflow, for example ApproveJobListing, SubmitApplication, ReviewVerificationEvidence.

Rules of thumb:

- A service method wraps everything it needs in a single database transaction.
- Controllers stay thin: validate with a Form Request, delegate to a service, return a Resource.
- Services return typed results; they never return HTTP responses.
