/*
 * db.js — localStorage-backed table engine (the "database" for now).
 *
 * Every collection in src/data/ opens its table through openTable(), so the
 * whole app talks to data the same way it would talk to MySQL tables through
 * a PHP API later:
 *
 *   PHP/MySQL swap-in: reimplement this file as fetch() calls
 *   (all → SELECT *, insert → POST, update → PATCH, remove → DELETE).
 *   Nothing else in the app has to change.
 *
 * Row shape mirrors a typical DB row:
 *   { id, created_at, updated_at, ...payload }
 */

export const PREFIX = "dd_";

function safeRead(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage full or blocked — data stays in memory for this visit */
  }
}

function now() {
  return new Date().toISOString();
}

export function newId(prefix) {
  return (
    (prefix || "row") +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

export function newRef(prefix) {
  return (
    (prefix || "REF") +
    "-" +
    Date.now().toString(36).toUpperCase().slice(-5) +
    Math.floor(Math.random() * 90 + 10)
  );
}

/**
 * Open a named table. `seedRows` are inserted the first time the table is
 * ever created (idempotent — later code changes to the seed only affect
 * fresh browsers, exactly like a DB migration would be run manually).
 */
export function openTable(name, seedRows = []) {
  const key = PREFIX + name;
  let rows = safeRead(key);

  if (!Array.isArray(rows)) {
    rows = [];
    seedRows.forEach((r) => rows.push(normalize(r)));
    safeWrite(key, rows);
  } else if (seedRows.length) {
    // Insert any seed row whose id does not exist yet (adds new seed
    // accounts/records without touching what the user has changed).
    seedRows.forEach((r) => {
      if (!rows.some((row) => row.id === r.id)) rows.push(normalize(r));
    });
    safeWrite(key, rows);
  }

  function persist() {
    safeWrite(key, rows);
  }

  return {
    name,
    key,
    all: () => rows.slice(),
    count: () => rows.length,
    byId: (id) => rows.find((r) => r.id === id) || null,
    find: (pred) => rows.find(pred) || null,
    filter: (pred) => rows.filter(pred),
    insert(data) {
      const row = normalize({
        id: newId(name.slice(0, 3)),
        created_at: now(),
        updated_at: now(),
        ...data
      });
      rows.push(row);
      persist();
      return row;
    },
    update(id, patch) {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) return null;
      rows[i] = { ...rows[i], ...patch, id: rows[i].id, updated_at: now() };
      persist();
      return rows[i];
    },
    remove(id) {
      const i = rows.findIndex((r) => r.id === id);
      if (i < 0) return false;
      rows.splice(i, 1);
      persist();
      return true;
    },
    replaceAll(next) {
      rows = (next || []).map(normalize);
      persist();
      return rows.slice();
    },
    clear() {
      rows = [];
      persist();
    }
  };
}

function normalize(row) {
  const r = { ...row };
  if (!r.id) r.id = newId();
  if (!r.created_at) r.created_at = now();
  r.updated_at = r.updated_at || r.created_at;
  return r;
}

/* Simple non-cryptographic digest — demo-only stand-in for server-side
   hashing (bcrypt etc.). Never use this as real security. */
export function weakHash(str) {
  let h = 5381;
  const s = String(str) + "::deepdesign";
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return "wh1_" + (h >>> 0).toString(36);
}
