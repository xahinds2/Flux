const reserved = new Set(["api", "dashboard", "profile", "new", "item", "seller", "admin", "login", "logout", "sign-in", "sign-up", "settings", "favicon", "icon", "robots", "sitemap"]);

export function handleError(handle: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(handle)) return "Use 3–30 lowercase letters, numbers or hyphens.";
  if (reserved.has(handle) || /^(dashboard|profile|new)/.test(handle)) return "This address is reserved.";
  return null;
}
