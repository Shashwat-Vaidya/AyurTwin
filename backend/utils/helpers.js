/**
 * Shared helper functions
 */

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

const round = (val, decimals = 1) => {
  const f = Math.pow(10, decimals);
  return Math.round(val * f) / f;
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const getTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const pick = (obj, keys) => {
  const result = {};
  keys.forEach((k) => {
    if (obj[k] !== undefined) result[k] = obj[k];
  });
  return result;
};

module.exports = { clamp, round, randomBetween, getTimeAgo, pick };
