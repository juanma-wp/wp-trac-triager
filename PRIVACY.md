# Privacy Policy for WP Trac Triager

**Effective Date:** February 9, 2026

## Data Collection

**WP Trac Triager does not collect ticket content, browsing history, or analytics.**

### What We Store Locally:
- Sidebar layout preferences (using Chrome's storage.sync)
- A cached copy of the public WordPress release calendar and its last check time (using Chrome's storage.local)

The calendar cache stays on your device. Chrome may sync your layout preferences between your signed-in browsers according to your browser settings.

## Permissions
- `storage`: Saves your preferences locally
- `https://core.trac.wordpress.org/*`: Reads Trac pages to enhance display
- `https://meta.trac.wordpress.org/*`: Reads Meta Trac pages to enhance display
- `https://api.wordpress.org/*`: Checks the latest published stable WordPress version
- `https://make.wordpress.org/*`: Discovers upcoming major versions and reads their public calendars

## Data Processing
Calendar requests go directly to the official WordPress servers when the cached information needs refreshing or you click “Refresh release.” These requests do not include ticket content or authentication cookies. As with any network request, the destination server receives connection information such as your IP address. Calendar parsing happens locally. No tracking or analytics services are used.

## Contact
- GitHub: https://github.com/juanmaguitar/wp-trac-triager/issues
- Email: juanma.garrido@gmail.com
