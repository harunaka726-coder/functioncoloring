import type { AlbumProject } from '../types/albumProject';
import { createId } from '../utils/id';

const STORAGE_KEY = 'fc_album_v1';

export type AlbumItem = {
  id: string;
  createdAt: number;
  thumbnailDataUrl: string;
  project: AlbumProject;
};

export type AlbumExportPayload = {
  version: 1;
  exportedAt: number;
  items: AlbumItem[];
};

function readItems(): AlbumItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AlbumItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItems(items: AlbumItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listAlbum(): AlbumItem[] {
  return readItems();
}

export function saveToAlbum(
  thumbnailDataUrl: string,
  project: AlbumProject,
): AlbumItem {
  const item: AlbumItem = {
    id: createId('art'),
    createdAt: Date.now(),
    thumbnailDataUrl,
    project,
  };
  const items = readItems();
  items.unshift(item);
  writeItems(items);
  return item;
}

export function deleteAlbumItem(id: string): void {
  writeItems(readItems().filter((i) => i.id !== id));
}

export function deleteAlbum(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export type ExportResult =
  | { kind: 'empty' }
  | { kind: 'downloaded'; count: number }
  | { kind: 'blob'; blob: Blob; filename: string };

export function exportAlbum(): ExportResult {
  const items = readItems();
  if (items.length === 0) return { kind: 'empty' };
  const payload: AlbumExportPayload = {
    version: 1,
    exportedAt: Date.now(),
    items,
  };
  const json = JSON.stringify(payload);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `function-coloring-album-${Date.now()}.json`;
  return { kind: 'blob', blob, filename };
}

export function importAlbum(
  data: AlbumExportPayload | AlbumItem[],
  mode: 'overwrite' | 'append',
): number {
  let incoming: AlbumItem[];
  if (Array.isArray(data)) {
    incoming = data;
  } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
    incoming = data.items;
  } else {
    throw new Error('invalid');
  }

  const valid = incoming.filter(
    (i) =>
      i &&
      typeof i.id === 'string' &&
      typeof i.createdAt === 'number' &&
      typeof i.thumbnailDataUrl === 'string' &&
      i.project != null,
  );

  if (mode === 'overwrite') {
    writeItems(valid);
    return valid.length;
  }

  const existing = readItems();
  const ids = new Set(existing.map((e) => e.id));
  const merged = [
    ...valid.filter((v) => !ids.has(v.id)),
    ...existing,
  ];
  writeItems(merged);
  return valid.length;
}

export function parseAlbumImportFile(text: string): AlbumExportPayload | AlbumItem[] {
  const data = JSON.parse(text) as AlbumExportPayload | AlbumItem[];
  return data;
}