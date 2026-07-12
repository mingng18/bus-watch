# BusWatch KL — App Store Connect Submission Draft

**Prepared:** 12 July 2026
**Workflow:** Draft for review only; nothing in this document authorizes submission to App Review.

## Release

| Field | Draft |
|---|---|
| App name | BusWatch KL |
| Platform | Apple Watch standalone app, packaged in an iOS container |
| Version | 1.0 |
| Build | 3 |
| Build status | Valid; internal TestFlight testing active |
| Price | Free |
| Release option | Manually release after App Review approval |
| Availability | Malaysia only |

## Product page — English (U.S.)

### Subtitle

> KL transit on your wrist

### Promotional text

> See nearby buses, stops and live arrivals at a glance—built for quick checks on Apple Watch across Klang Valley.

### Description

> BusWatch KL puts Klang Valley public transit on your wrist.
>
> Open the app for a quick view of nearby buses and bus stops—without reaching for your phone.
>
> FEATURES
> • See live bus positions on a nearby map
> • Check nearby bus stops with distance and arrival estimates
> • Follow supported bus trips stop by stop, including live bus position when available
> • Read clear live, scheduled and approximate arrival indicators
>
> BUILT FOR APPLE WATCH
> BusWatch KL is a standalone watchOS experience designed for quick, glanceable checks while you are moving around the city. No account or sign-in is required.
>
> PRIVACY
> BusWatch KL has no advertising or tracking. Your location is used only to provide nearby results and is not associated with an account.
>
> An internet connection and location permission are required for nearby results. Live information depends on participating transit data providers and may not be available for every route or vehicle. BusWatch KL is an independent app and is not affiliated with Prasarana Malaysia Berhad or any transit operator.

### Keywords

> Kuala Lumpur,bus,transit,arrival,nearby,KL,Malaysia,watchOS,commute,stop,route

### URLs

| Field | URL |
|---|---|
| Support URL | https://github.com/mingng18/bus-watch/blob/master/SUPPORT.md |
| Marketing URL | https://github.com/mingng18/bus-watch |
| Privacy Policy URL | https://github.com/mingng18/bus-watch/blob/master/PRIVACY.md |
| Privacy Choices URL | Leave blank |

### Classification

| Field | Draft |
|---|---|
| Primary category | Navigation |
| Secondary category | Travel |
| Copyright | `2026 Ng Gih Ming` — confirmed |
| Content rights | **Yes** — third-party content rights confirmed by the account holder |

## Screenshots

Upload in this order for the 416 × 496 Apple Watch display class:

1. `01-your-kl-commute.png` — Your KL commute.
2. `02-arrivals-at-a-glance.png` — Arrivals at a glance.
3. `03-live-buses-on-the-map.png` — Live buses on the map.

All three are 416 × 496, opaque PNG, sRGB, and use verified build UI.

## App Privacy

### Tracking

- Does the app or its third-party partners use data for tracking? **No**
- App Tracking Transparency prompt required? **No**

### Data collection

Draft selection: **Data Not Collected**.

Rationale:

- Precise coordinates are transmitted only to service the live `/nearby` request.
- Coordinates are not written to KV, D1, analytics, advertising systems, or application logs.
- Worker observability/log retention is not enabled in `wrangler.toml`.
- No account, user ID, device ID, analytics SDK, advertising SDK, or tracking SDK is present.
- Apple states that data immediately discarded after servicing a real-time request is not “collected” for its privacy label.

The public privacy policy still explains transient location processing and infrastructure-provider request handling.

## Age rating questionnaire

Draft every content frequency as **None** and every capability/control as **No**:

- Parental controls: No
- Age assurance: No
- Unrestricted web access: No
- User-generated content: No
- Messaging/chat: No
- Advertising: No
- Profanity or crude humor: None
- Horror/fear themes: None
- Alcohol, tobacco, or drug references: None
- Medical or treatment information: None
- Sexual content or nudity: None
- Graphic sexual content or nudity: None
- Cartoon/fantasy violence: None
- Realistic violence: None
- Prolonged graphic/sadistic realistic violence: None
- Simulated gambling: None
- Contests: None
- Gambling: No
- Loot boxes: No
- Made for Kids: Not applicable
- Override to higher rating: Not applicable
- Age suitability URL: Leave blank

Expected calculated rating: **4+** (with region-specific equivalents where Apple applies them).

## Export compliance and monetization

| Field | Draft |
|---|---|
| Uses non-exempt encryption | No (`ITSAppUsesNonExemptEncryption = NO`; build already accepted) |
| In-app purchases | None |
| Subscriptions | None |
| Advertising | None |
| Sign-in required | No |
| Demo account | Not required |
| Regulated medical device | No |
| Digital services / trader declarations | Depends on final availability and account-holder status; do not guess |

## App Review contact

These values must remain private and should be entered directly in App Store Connect, not committed:

| Field | Status |
|---|---|
| First name | Confirmed privately |
| Last name | Confirmed privately |
| Email | Confirmed privately |
| Phone | Confirmed privately |

## App Review notes

> BusWatch KL is a standalone Apple Watch app. The included iOS app is a packaging container and has no user interface.
>
> To review the app:
> 1. Install build 1.0 (3) on an Apple Watch or Apple Watch simulator.
> 2. Grant location permission when prompted.
> 3. Use a location in Kuala Lumpur, Malaysia; for simulator testing, 3.133649, 101.685557 at KL Sentral provides nearby bus-stop results. Live vehicles appear when the transit provider's realtime feed has active buses.
> 4. The default screen shows nearby bus stops and, when the realtime feed has active vehicles, live bus positions. Orange map markers are buses, neutral markers are stops, and the blue marker is the authorized current location.
> 5. Tap a supported live bus row with a disclosure chevron to view stop-by-stop trip progress and the current bus position when available.
>
> No account, demo credentials, purchases, subscriptions, or external hardware are required. Live data availability varies by transit provider.

## Version notes

> Initial release of BusWatch KL for Apple Watch.

## Optional fields intentionally left blank

- App preview video
- Privacy Choices URL
- Age suitability URL
- Promotional in-app purchases
- Game Center
- Routing app coverage file
- Custom license agreement
- Accessibility Nutrition Label (can be added later after a dedicated audit)

## Remaining approvals before any live entry or submission

1. Approve this package for live App Store Connect entry.
