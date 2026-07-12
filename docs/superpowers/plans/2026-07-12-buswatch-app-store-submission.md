# BusWatch KL App Store Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and upload every verifiable BusWatch KL App Store submission field and asset, leaving only the final Submit for Review action untouched.

**Architecture:** Keep public policy/support content, non-sensitive Fastlane metadata, screenshot source captures, and screenshot generation tooling in the repository. Use Fastlane/App Store Connect APIs for repeatable metadata and build association, and App Store Connect UI/API for current age-rating, privacy, pricing, and Malaysia-only availability declarations. Keep private App Review contact details outside version control.

**Tech Stack:** Markdown, Fastlane deliver/Spaceship, Xcode watchOS simulator, `simctl`, FFmpeg, App Store Connect.

---

### Task 1: Publish support and privacy documentation

**Files:**
- Create: `PRIVACY.md`
- Create: `SUPPORT.md`

- [ ] Describe transient precise-location use, local preferences/cache, no accounts, no ads/tracking, backend requests, retention, and contact/support routes.
- [ ] Verify both files render as public GitHub URLs after push.
- [ ] Commit and push the documentation.

### Task 2: Add reproducible non-sensitive App Store metadata

**Files:**
- Create: `watch-app/fastlane/Deliverfile`
- Create: `watch-app/fastlane/metadata/en-US/name.txt`
- Create: `watch-app/fastlane/metadata/en-US/subtitle.txt`
- Create: `watch-app/fastlane/metadata/en-US/description.txt`
- Create: `watch-app/fastlane/metadata/en-US/keywords.txt`
- Create: `watch-app/fastlane/metadata/en-US/promotional_text.txt`
- Create: `watch-app/fastlane/metadata/en-US/support_url.txt`
- Create: `watch-app/fastlane/metadata/en-US/marketing_url.txt`
- Create: `watch-app/fastlane/metadata/en-US/privacy_url.txt`
- Create: `watch-app/fastlane/metadata/copyright.txt`
- Create: `watch-app/fastlane/metadata/age_rating.json`

- [ ] Write copy that only advertises build-3 features.
- [ ] Set Navigation/Travel categories, manual release, version 1.0, and build 3.
- [ ] Validate Apple character/byte limits programmatically.
- [ ] Keep App Review phone/email/name in an untracked temporary metadata directory.

### Task 3: Produce Clean Utility Watch screenshots

**Files:**
- Create: `watch-app/AppStore/ScreenshotSources/*.png`
- Create: `watch-app/scripts/generate-app-store-screenshots.sh`
- Create: `watch-app/fastlane/screenshots/en-US/*.png`

- [ ] Capture current 416 × 496 Watch UI for the live nearby map and rail arrivals.
- [ ] Generate cream/navy marketing compositions at exactly 416 × 496.
- [ ] Verify dimensions, color profile, copy legibility, and truthful UI presentation.
- [ ] Commit and push screenshot sources, generator, and outputs.

### Task 4: Upload listing metadata, screenshots, and select build

**Files:**
- Use: `watch-app/fastlane/Deliverfile`
- Use: private temporary review-information files outside the repository

- [ ] Upload English metadata and screenshots without submitting for review.
- [ ] Select version 1.0 build 3.
- [ ] Set App Review contact and review notes.
- [ ] Confirm export-compliance state remains complete.

### Task 5: Complete app-level declarations

- [ ] Set age-rating questionnaire to none/no, Not Made for Kids, no override.
- [ ] Set app privacy to Data Not Collected while publishing the privacy-policy URL.
- [ ] Confirm content-rights declaration is accurate for public transit data and Apple Maps presentation.
- [ ] Set free pricing and Malaysia-only availability.
- [ ] Confirm no IAP, subscriptions, login, advertising, or regulated-medical declarations apply.

### Task 6: Verify submission readiness

- [ ] Re-download/read back metadata and screenshot records from App Store Connect.
- [ ] Verify version/build association, privacy state, rating, categories, availability, price, review contact, and screenshot processing.
- [ ] Confirm the version is ready for review or list the exact remaining blockers.
- [ ] Do not invoke Submit for Review.
