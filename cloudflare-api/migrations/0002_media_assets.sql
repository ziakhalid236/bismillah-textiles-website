CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('product', 'certificate', 'brand', 'site')),
  object_key TEXT NOT NULL UNIQUE,
  original_name TEXT NOT NULL,
  label TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_kind_status ON media_assets(kind, status, updated_at);
