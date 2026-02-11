// Resolution reasons and explanations from WordPress Trac Handbook
// Source: https://make.wordpress.org/core/handbook/contribute/trac/

const RESOLUTION_EXPLANATIONS = {
  'fixed': {
    icon: '✅',
    title: 'Fixed',
    explanation: 'Upon one or more commits to the codebase, this ticket was resolved with a fix.',
    color: '#22c55e', // green
    bgColor: '#f0fdf4',
    borderColor: '#86efac'
  },

  'duplicate': {
    icon: '📋',
    title: 'Duplicate',
    explanation: 'This ticket is a duplicate of an existing ticket, which should be referenced in the comments.',
    color: '#3b82f6', // blue
    bgColor: '#eff6ff',
    borderColor: '#93c5fd'
  },

  'invalid': {
    icon: '❌',
    title: 'Invalid',
    explanation: 'This ticket is not a bug, or is a support request. Such issues should be directed to support forums instead.',
    color: '#ef4444', // red
    bgColor: '#fef2f2',
    borderColor: '#fca5a5'
  },

  'worksforme': {
    icon: '🤔',
    title: 'Works For Me',
    explanation: 'The bug reported in this ticket cannot be reproduced. Sometimes an existing plugin, hook, or feature may render the ticket moot, so the ticket can be closed without further action.',
    color: '#8b5cf6', // purple
    bgColor: '#faf5ff',
    borderColor: '#c4b5fd'
  },

  'wontfix': {
    icon: '🚫',
    title: 'Won\'t Fix',
    explanation: 'This ticket will not be addressed. Occasionally, bugs are considered to be acceptable edge cases and will not be addressed further. This is sometimes used when a request for an enhancement or feature has been rejected for core inclusion.',
    color: '#f59e0b', // amber
    bgColor: '#fffbeb',
    borderColor: '#fcd34d'
  },

  'maybelater': {
    icon: '⏸️',
    title: 'Maybe Later',
    explanation: 'Similar to "wontfix", this resolution is used for a ticket that, while perhaps not outright rejected, has no current traction and may be reconsidered in the future.',
    color: '#6b7280', // gray
    bgColor: '#f9fafb',
    borderColor: '#d1d5db'
  },

  'reported-upstream': {
    icon: '⬆️',
    title: 'Reported Upstream',
    explanation: 'This ticket is for an external library or component, has been reported in an upstream repository (e.g. Gutenberg), and will be addressed there.',
    color: '#06b6d4', // cyan
    bgColor: '#ecfeff',
    borderColor: '#67e8f9'
  }
};

// Helper function to get resolution details
function getResolutionDetails(resolution) {
  const normalizedResolution = resolution ? resolution.toLowerCase().trim() : '';

  // Handle common variations
  const resolutionMap = {
    'worksforme': 'worksforme',
    'works for me': 'worksforme',
    'wontfix': 'wontfix',
    "won't fix": 'wontfix',
    'maybelater': 'maybelater',
    'maybe later': 'maybelater',
    'reported-upstream': 'reported-upstream',
    'reportedupstream': 'reported-upstream'
  };

  const mappedResolution = resolutionMap[normalizedResolution] || normalizedResolution;

  return RESOLUTION_EXPLANATIONS[mappedResolution] || {
    icon: '❓',
    title: resolution || 'Unknown',
    explanation: 'This ticket has been closed. See the ticket comments for more details.',
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#d1d5db'
  };
}
