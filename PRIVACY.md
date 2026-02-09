# Privacy Policy for WP Trac Triager

**Last Updated:** February 9, 2026
**Extension Version:** 1.5.0

## Overview

WP Trac Triager is committed to protecting your privacy. This privacy policy explains what data we collect (spoiler: none), how we use it, and your rights.

## Data Collection

**WP Trac Triager does NOT collect, store, transmit, or share any personal data, browsing information, or user activity.**

We do not:
- Track which Trac tickets you visit
- Collect your WordPress.org username or profile information
- Monitor your browsing history
- Send any data to external servers
- Use analytics or tracking tools
- Display advertisements

## Local Storage

The extension stores the following data **locally on your device only**:

### Chrome Local Storage
- Collapsed/expanded state of sidebar sections (e.g., `wpt-section-quick-info`)
- Sidebar visibility state (hidden/visible)

### Chrome Sync Storage
- User preference settings from the Settings page:
  - Sidebar section order (your custom arrangement via drag & drop)
  - Sidebar section visibility toggles (which sections you show/hide)
  - Target WordPress version for release schedule display

**Chrome Sync Storage** means your settings sync across devices where you're signed into Chrome with the same Google account. This syncing is handled entirely by Chrome's built-in sync mechanism - we don't access, store, or transmit this data ourselves.

### What This Data Includes
- Section order preferences (e.g., "Milestone Timeline before Keywords")
- Section visibility toggles (e.g., "hide Recent Comments section")
- WordPress version selection (e.g., "WordPress 7.0")

### What This Data NEVER Includes
- Ticket numbers or URLs you visit
- Comment content or user information from tickets
- Your WordPress.org username or identity
- Any personally identifiable information

## Permissions Explained

The extension requests the following Chrome permissions:

### `storage`
**Why:** Save your sidebar layout preferences and section visibility settings locally and sync them across your devices.

**What we access:** Only the settings you configure in the Settings page (section order, visibility toggles, WordPress version).

**What we DON'T access:** Browsing history, passwords, bookmarks, or any other Chrome data.

### `host_permissions` for `core.trac.wordpress.org` and `meta.trac.wordpress.org`
**Why:** Read ticket page content to extract and display:
- Keyword history from ticket comments
- Milestone changes from ticket history
- Component and maintainer information
- Commenter roles and GitHub PR sync status

**What we access:** Only the content of Trac ticket pages you visit (publicly available information).

**What we DON'T access:** Your Trac login credentials, private tickets, or any data outside of Trac ticket pages.

## Data Processing

All data processing happens **entirely within your browser**:
- Keyword extraction and timeline generation
- Milestone history parsing
- Role badge assignments
- Timeline visualizations

**No data leaves your device.** The extension does not communicate with any external servers, APIs, or third-party services.

## Third-Party Services

WP Trac Triager does **NOT** use any third-party services, including:
- No analytics (Google Analytics, etc.)
- No error tracking (Sentry, etc.)
- No advertising networks
- No social media integrations
- No external APIs or webhooks

## Data Retention

- **Settings data:** Retained until you uninstall the extension or clear Chrome's sync data
- **UI state data:** Retained until you clear Chrome's local storage or uninstall the extension
- **Ticket data:** Never stored - processed in real-time when you view a ticket

## Your Rights

You have complete control over your data:

### View Your Data
1. Open Chrome DevTools (F12) on any Trac ticket page
2. Go to **Application** → **Storage**
3. Check **Local Storage** for UI state (keys starting with `wpt-`)
4. Check **Chrome Sync Storage** (via chrome://sync-internals) for settings

### Delete Your Data
- **All data:** Uninstall the extension (Settings → Extensions → Remove)
- **Settings only:** Open extension Settings → Click "Reset to Default Order"
- **Local storage only:** Clear browsing data → Site settings → Remove Trac domains

### Export Your Data
Your settings are stored in plain JSON format in Chrome's sync storage. You can export them via Chrome DevTools if desired.

## Changes to This Privacy Policy

We will update this privacy policy if the extension's data handling changes. Changes will be:
1. Documented in this file with a new "Last Updated" date
2. Announced in the CHANGELOG.md
3. Highlighted in the Chrome Web Store update description

## Open Source Transparency

WP Trac Triager is **fully open source** under the MIT License. You can:
- Review all source code on GitHub: https://github.com/juanmaguitar/wp-trac-triager
- Verify our privacy claims by inspecting the code
- Audit the extension's behavior using Chrome DevTools
- Contribute improvements or report concerns via GitHub Issues

## Contact & Questions

For privacy questions or concerns:
- **GitHub Issues:** https://github.com/juanmaguitar/wp-trac-triager/issues
- **Email:** juanma.garrido@gmail.com

For general support or feature requests, please use GitHub Issues.

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

Since we don't collect any personal data, most data protection regulations don't apply, but we've designed the extension with privacy-first principles anyway.

## Children's Privacy

WP Trac Triager does not knowingly collect data from anyone, including children under 13. Since the extension is designed for WordPress contributors (a technical audience), it's not directed at children.

---

**Summary:** We don't collect your data. We don't track you. We don't send anything to servers. Your settings stay on your device (or sync via Chrome). That's it. 🔒

Made with ❤️ and respect for your privacy by [Juan Manuel Garrido](https://github.com/juanmaguitar).
