// WordPress Contributor Role Hierarchy
// Based on WordPress Test Team Training (2026-02-03)
//
// Lower numbers = higher authority
// Includes authority roles (Project Lead → Individual Contributor) and participation roles (Reporter)
// Project Lead > Lead Developer > Core Committer > Component Maintainer > Individual Contributor > Reporter

var ROLE_HIERARCHY = {
  'Project Lead': 1,
  'Lead Developer': 2,
  'Core Committer': 3,
  'Emeritus Committer': 3,  // Same level as Core Committer
  'Component Maintainer': 4,
  'Lead Tester': 4,  // Same level as Component Maintainer
  'Themes Committer': 4,  // Same level as Component Maintainer
  'Individual Contributor': 5,  // Default for users not in wpTracContributorLabels
  'Reporter': 6  // Ticket author (participation role, not authority)
};

// Role colors for consistent visual styling (matching Material Design scheme)
var ROLE_COLORS = {
  'Project Lead': { border: '#9C27B0', bg: '#F3E5F5', badge: '#9C27B0' },        // Purple
  'Lead Developer': { border: '#2196F3', bg: '#E3F2FD', badge: '#2196F3' },     // Blue
  'Core Committer': { border: '#4CAF50', bg: '#E8F5E9', badge: '#4CAF50' },     // Green
  'Emeritus Committer': { border: '#FF9800', bg: '#FFF3E0', badge: '#FF9800' }, // Orange
  'Component Maintainer': { border: '#009688', bg: '#E0F2F1', badge: '#009688' }, // Teal
  'Lead Tester': { border: '#E91E63', bg: '#FCE4EC', badge: '#E91E63' },        // Pink
  'Themes Committer': { border: '#00BCD4', bg: '#E0F7FA', badge: '#00BCD4' },   // Cyan
  'Individual Contributor': { border: '#607D8B', bg: '#ECEFF1', badge: '#607D8B' }, // Gray
  'Reporter': { border: '#795548', bg: '#EFEBE9', badge: '#795548' }            // Brown
};

// Variables are shared between content scripts via execution order
// No need to expose to window in MV3
