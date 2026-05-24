export async function getDailyTarget(cookies, secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return cookies[hashInt % cookies.length];
}

export async function getDailyTarget2(cookies, secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-skill`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return cookies[hashInt % cookies.length];
}

export async function getDailyTarget3(cookies, secret) {
  const now = new Date();
  const dateStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-silhouette`;
  const msgBuffer = new TextEncoder().encode(dateStr + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  return cookies[hashInt % cookies.length];
}
