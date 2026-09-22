# Publishing Guide

This document outlines the steps to publish WP Trac Triager v1.5.0 to the Chrome Web Store.

## Prerequisites

Before publishing, ensure:

- [ ] All features are working correctly
- [ ] No console errors or warnings
- [ ] Extension tested on multiple Trac tickets
- [ ] README includes screenshots
- [ ] Version number updated in `manifest.json` (currently: **1.5.0**)
- [ ] CHANGELOG.md is up to date
- [ ] Icons are properly sized and high quality

## Pre-Publication Checklist

### 1. Testing

Test the extension thoroughly on real tickets:
- [ ] Load extension in Chrome
- [ ] Test on https://core.trac.wordpress.org/ticket/8905
- [ ] Test on https://meta.trac.wordpress.org/ticket/1
- [ ] Verify role badges work (all commenters badged)
- [ ] Test Keyword Change History Timeline (shows additions/removals)
- [ ] Test Milestone History Timeline (shows milestone changes)
- [ ] Test sidebar section drag & drop in settings
- [ ] Test section visibility toggles
- [ ] Test collapsible sections (state persists)
- [ ] Test WordPress Release Schedule section
- [ ] Verify Authority Legend appears when core team comments
- [ ] Check responsive behavior (resize window)
- [ ] Verify no browser console errors

### 2. Assets Preparation

#### Screenshots (Required - At least 1, ideally 5)

Create high-quality screenshots (1280x800px or 640x400px):

1. **Main View** - Show a Trac ticket with role badges and GitHub PR badges
2. **Keyword Timeline** - Show Keyword Change History with color-coded additions/removals
3. **Milestone Timeline** - Show milestone timeline with punt warning
4. **Sidebar Overview** - Show all sections (Quick Info, Release, Keywords, Maintainers)
5. **Settings** - Show Sidebar Section Manager with drag handles

**Good test tickets for screenshots:**
- https://core.trac.wordpress.org/ticket/8905 (lots of comments, keywords, milestones)
- https://core.trac.wordpress.org/ticket/62812 (recent activity)

Save screenshots in a `store-assets/` directory.

#### Promotional Images (Optional but Recommended)

- **Small tile**: 440x280px
- **Large tile**: 920x680px
- **Marquee**: 1400x560px

### 3. Create Extension Package

Use the automated packaging script:

```bash
# Run the packaging script
./scripts/package.sh

# This creates: wp-trac-triager-v1.5.0.zip in the release/ directory
```

Or manually:

```bash
# Create release directory
mkdir -p release
cp -r . release/wp-trac-triager

# Remove development files
cd release/wp-trac-triager
rm -rf .git .gitignore node_modules package*.json .eslintrc* .prettier*
rm -rf .claude store-assets
rm PUBLISHING.md CONTRIBUTING.md

# Create ZIP file
cd ..
zip -r wp-trac-triager-v1.5.0.zip wp-trac-triager/

# Clean up
rm -rf wp-trac-triager
cd ..
```

## Chrome Web Store Submission

### 1. Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with Google account
3. Pay one-time $5 developer fee (if first time)

### 2. Create New Item

1. Click "New Item"
2. Upload `wp-trac-triager-v1.5.0.zip`
3. Fill in store listing:

#### Store Listing Details

**Name:**
```
WP Trac Triager
```

**Summary:** (max 132 characters)
```
Enhance WordPress Trac with smart timelines, role badges, keyword history, and customizable sidebar for efficient ticket triage.
```

**Description:**
```
WP Trac Triager is the essential browser extension for WordPress contributors, streamlining ticket triage with powerful visual enhancements, historical context, and intelligent insights.

🎯 WHAT MAKES IT SPECIAL

Smart Timelines & History
• **Keyword Change Timeline** - See complete history of keyword additions/removals with color-coded changes
• **Milestone History** - Visual timeline of all milestone changes with punt detection
• **Interactive Tooltips** - Hover over any keyword to see descriptions and guidelines
• Understand ticket evolution at a glance

Enhanced Role Recognition
• **Universal Role Badges** - Every commenter gets a role badge (Project Lead, Core Committer, Individual Contributor)
• **GitHub Integration** - Automatically detects and badges comments synced from GitHub PRs
• **Authority Legend** - See role distribution across all comments with statistics
• Instantly identify who's involved and their authority level

Customizable Workflow
• **Drag & Drop Sidebar Sections** - Arrange 7 sidebar sections in your preferred order
• **Show/Hide Sections** - Toggle visibility of sections you don't need
• **Persistent Preferences** - Settings sync across all your devices
• **Locked Critical Info** - Quick Info section stays at top for essential ticket data

📚 SIDEBAR FEATURES

• **Quick Info** - Ticket summary, reporter, milestone, priority, component (always visible)
• **WordPress Release Schedule** - Next milestone dates with countdown
• **Recent Comments** - Last 3 comments with role context
• **Milestone Timeline** - Visual history of milestone changes
• **Keyword Change History** - Complete timeline of keyword additions/removals
• **Component Maintainers** - Contact info with links to profiles
• **TRAC Keywords** - Explanations for all keywords based on WordPress Core Handbook

🎨 VISUAL ENHANCEMENTS

• Color-coded role badges throughout ticket comments
• Vertical timelines with connecting lines and color dots
• Inline keyword badges with addition (+) or removal (-) indicators
• Collapsible sections with persistent state
• Slide-out sidebar with smooth animations

🎯 PERFECT FOR

• WordPress core contributors and committers
• Ticket triagers and bug shepherds
• Test team members
• Component maintainers
• New contributors learning the triage process
• Anyone participating in WordPress Trac

📊 TECHNICAL EXCELLENCE

• Manifest V3 compliant - Built for the modern web
• Works on core.trac.wordpress.org and meta.trac.wordpress.org
• Scoped permissions - Storage, Trac access, and official WordPress release sources
• Privacy-focused - Zero data collection or tracking
• Open source (MIT License) - Transparent and community-driven
• JSON-based keyword data - Easy for contributors to update

💚 OPEN SOURCE & CONTRIBUTOR-FRIENDLY

This extension is fully open source! Visit our GitHub repository to:
• Report issues or suggest features
• Submit pull requests
• Update keyword definitions via simple JSON file
• Read comprehensive documentation

📖 DATA SOURCES

All information sourced from official WordPress documentation:
• WordPress Core Contributors Handbook
• WordPress Testing Handbook
• WordPress Trac Keywords Guide
• make.wordpress.org/core

🚀 GET STARTED

Install the extension and visit any WordPress Trac ticket. The sidebar appears automatically with all the context you need to make informed triage decisions. Customize the layout in settings to match your workflow.

Made with ❤️ for the WordPress community by a WordPress contributor who wanted better triage tools.
```

**Category:**
- Productivity

**Language:**
- English (United States)

#### Graphics

Upload all prepared screenshots and promotional images (in order of importance):
1. Keyword Timeline screenshot
2. Main view with role badges
3. Milestone Timeline screenshot
4. Sidebar overview
5. Settings page

#### Privacy

**Single Purpose:**
```
Enhance WordPress Trac ticket pages with visual timelines, role badges, and contextual information to help contributors triage tickets more effectively.
```

**Permission Justifications:**

- **storage**: Save user settings (sidebar section order, visibility toggles) and sync preferences across devices
- **Host permissions (core.trac.wordpress.org and meta.trac.wordpress.org)**: Read ticket data to display keyword timelines, milestone history, role badges, and maintainer information
- **Host permission (api.wordpress.org)**: Read the latest stable version to exclude already released major versions
- **Host permission (make.wordpress.org)**: Discover announced major versions and retrieve their public calendars; no ticket data or authentication cookies are sent

**Privacy Policy URL:**
```
https://github.com/juanmaguitar/wp-trac-triager/blob/main/PRIVACY.md
```

### 3. Distribution

**Visibility:**
- Public

**Geographic Distribution:**
- All regions

**Pricing:**
- Free

### 4. Submit for Review

1. Review all information carefully
2. Preview your store listing
3. Click "Submit for Review"
4. Wait for Chrome Web Store review (typically 1-3 business days)

## Post-Publication

Once published:

1. **Update README.md** with Chrome Web Store link and install badge
2. **Create a GitHub release**:
   ```bash
   git tag -a v1.5.0 -m "Version 1.5.0 - Keyword Change History Timeline"
   git push origin v1.5.0
   ```
3. **Add GitHub release notes** (copy from CHANGELOG.md)
4. **Announce on WordPress communities**:
   - make.wordpress.org/core (comment on relevant post)
   - make.wordpress.org/test (introduce to test team)
   - WordPress Slack #core and #core-test channels
   - Personal blog or social media

## Updates (For Future Releases)

For future updates:

1. Update version in `manifest.json`
2. Update CHANGELOG.md
3. Run `./scripts/package.sh` to create new ZIP
4. Upload to Chrome Web Store Developer Dashboard
5. Update listing if needed (screenshots, description)
6. Publish update
7. Create GitHub release with tag

**Note:** Updates are typically approved faster than initial submissions.

## Support & Maintenance

After publication, monitor:
- Chrome Web Store reviews (respond to user feedback)
- GitHub issues (triage and fix bugs)
- WordPress Slack mentions
- make.wordpress.org discussions

Respond promptly to issues and maintain the extension regularly.

## Resources

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/devguide/)
- [WordPress Core Handbook](https://make.wordpress.org/core/handbook/)

## Quick Reference

**Current Version:** 1.5.0
**GitHub Repo:** https://github.com/juanmaguitar/wp-trac-triager
**Privacy Policy:** https://github.com/juanmaguitar/wp-trac-triager/blob/main/PRIVACY.md
**License:** MIT
