# HeartByte Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Only Admin Can Post Events**: Only verified admin (`razafimahefaphilibert7@gmail.com` with `email_verified == true` or listed in `/admins/{uid}`) may create or delete `/events/{eventId}`.
2. **Atomic Registration & Fund Increment**: Creating a registration in `/registrations/{regId}` requires `userId == request.auth.uid`, an existing `/events/{eventId}` parent, a matching non-PII `/events/{eventId}/publicProfiles/{regId}` written atomically, and any non-admin fund increment on `/events/{eventId}` MUST prove via `getAfter()` that `lastRegistrationId` exists in `/registrations` with matching `totalAmount`.
3. **Strict PII Isolation**: Attendee email and ticket codes live ONLY in `/registrations/{registrationId}`, readable solely by the registration owner (`resource.data.userId == request.auth.uid`) or `isAdmin()`. Public speed-dating booth cards live in `/events/{eventId}/publicProfiles/{registrationId}` with zero PII.
4. **Path & Identity Integrity**: All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), `createdAt` and `updatedAt` MUST equal `request.time`, and `createdAt` / `userId` / `creatorId` / `eventId` are immutable after creation.
5. **Email Verification Gate**: All authenticated writes require `request.auth.token.email_verified == true`.

## 2. The "Dirty Dozen" Attack Payloads
1. **Unauthenticated Event Creation**: Unauthenticated client attempts `create` on `/events/evt-hack`. Expected: `PERMISSION_DENIED`.
2. **Non-Admin Event Creation**: Regular verified user attempts `create` on `/events/evt-spam`. Expected: `PERMISSION_DENIED`.
3. **Unverified Admin Email Spoof**: User with `email: "razafimahefaphilibert7@gmail.com"` and `email_verified: false` attempts `create` on `/events/evt-spoof`. Expected: `PERMISSION_DENIED`.
4. **Shadow Field Injection ("Ghost Field")**: Authenticated user creates `/users/{uid}` with extra field `isAdmin: true`. Expected: `PERMISSION_DENIED`.
5. **Identity Spoofing on Registration**: User A attempts `create` on `/registrations/reg-1` with `userId: "user-b"`. Expected: `PERMISSION_DENIED`.
6. **PII Blanket Read / Scrape**: User A attempts `get` or `list` on `/registrations` without `userId == uid` filter. Expected: `PERMISSION_DENIED`.
7. **Orphaned Registration**: User A creates `/registrations/reg-orphan` pointing to non-existent `eventId: "does-not-exist"`. Expected: `PERMISSION_DENIED`.
8. **Fake Fund Inflation Without Registration**: User A updates `/events/{eventId}` setting `currentFundsRaised: 999999` without creating a matching `/registrations` doc in the same batch. Expected: `PERMISSION_DENIED`.
9. **Resource Exhaustion (1.5KB ID Poisoning)**: User attempts `setDoc` at `/users/{uid}/dateResults/{200-char-invalid-id!}`. Expected: `PERMISSION_DENIED`.
10. **Client-Forged Timestamp**: User creates `/users/{uid}` with `createdAt: Timestamp(2020-01-01)` instead of `serverTimestamp()`. Expected: `PERMISSION_DENIED`.
11. **Terminal State Tampering**: Non-admin user attempts `update` on `/events/{eventId}` when `status == "completed"`. Expected: `PERMISSION_DENIED`.
12. **Privilege Escalation on `/admins`**: Regular user attempts `create` on `/admins/{uid}` to promote themselves. Expected: `PERMISSION_DENIED`.
