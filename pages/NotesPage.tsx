import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { ArrowLeft, Check, Copy, Download, ExternalLink, FileText, Github, ImagePlus, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

type NoteColor = 'rose' | 'orange' | 'amber' | 'emerald' | 'sky' | 'violet' | 'slate';

type NoteAttachment = {
  id: string;
  name: string;
  src: string;
};

type NoteItem = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  attachments: NoteAttachment[];
  createdAt: string;
  updatedAt: string;
};

type GitHubDraftConfig = {
  owner: string;
  repo: string;
  branch: string;
  folder: string;
};

const NOTE_STORAGE_KEY = 'afflosaur_notes_v1';
const NOTE_CONFIG_KEY = 'afflosaur_notes_github_v1';

const COLOR_STYLES: Record<NoteColor, { label: string; text: string; bg: string; border: string }> = {
  rose: { label: 'Rose', text: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  orange: { label: 'Orange', text: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  amber: { label: 'Amber', text: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  emerald: { label: 'Green', text: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  sky: { label: 'Blue', text: 'text-sky-600', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  violet: { label: 'Purple', text: 'text-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  slate: { label: 'Slate', text: 'text-slate-600', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createStarterNote(): NoteItem {
  const now = new Date().toISOString();
  return {
    id: createId('note'),
    title: 'CS Notes Starter',
    content:
      '[sky]Algorithms[/sky]\n' +
      'Use [amber]short definitions[/amber], [rose]examples[/rose], and [emerald]diagrams[/emerald] for revision.\n\n' +
      '[violet]GitHub sync[/violet] keeps the note export ready for a repo or gist.',
    tags: ['cs', 'revision', 'starter'],
    attachments: [],
    createdAt: now,
    updatedAt: now,
  };
}

function loadNotes(): NoteItem[] {
  if (typeof window === 'undefined') return [createStarterNote()];
  try {
    const raw = window.localStorage.getItem(NOTE_STORAGE_KEY);
    if (!raw) return [createStarterNote()];
    const parsed = JSON.parse(raw) as NoteItem[];
    return parsed.length > 0 ? parsed : [createStarterNote()];
  } catch {
    return [createStarterNote()];
  }
}

function loadConfig(): GitHubDraftConfig {
  if (typeof window === 'undefined') {
    return { owner: '', repo: '', branch: 'main', folder: 'notes' };
  }
  try {
    const raw = window.localStorage.getItem(NOTE_CONFIG_KEY);
    if (!raw) return { owner: '', repo: '', branch: 'main', folder: 'notes' };
    const parsed = JSON.parse(raw) as Partial<GitHubDraftConfig>;
    return {
      owner: parsed.owner || '',
      repo: parsed.repo || '',
      branch: parsed.branch || 'main',
      folder: parsed.folder || 'notes',
    };
  } catch {
    return { owner: '', repo: '', branch: 'main', folder: 'notes' };
  }
}

function stripColorMarkup(text: string) {
  return text.replace(/\[(rose|orange|amber|emerald|sky|violet|slate)\]([\s\S]*?)\[\/\1\]/g, '$2');
}

function buildMarkdown(note: NoteItem) {
  const parts: string[] = [];
  parts.push(`# ${note.title}`);
  parts.push('');
  parts.push(`- Created: ${new Date(note.createdAt).toLocaleString()}`);
  parts.push(`- Updated: ${new Date(note.updatedAt).toLocaleString()}`);
  if (note.tags.length > 0) {
    parts.push(`- Tags: ${note.tags.join(', ')}`);
  }
  parts.push('');
  parts.push('> Inline color tags use the app syntax like `[sky]text[/sky]`.');
  parts.push('');
  parts.push(note.content);
  parts.push('');

  if (note.attachments.length > 0) {
    parts.push('## Images', '');
    note.attachments.forEach((attachment) => {
      if (attachment.src.startsWith('data:')) {
        parts.push(`- ${attachment.name} (embedded in the app; re-upload to GitHub for long-term storage)`);
      } else {
        parts.push(`![${attachment.name}](${attachment.src})`);
      }
    });
  }

  return parts.join('\n');
}

function buildGithubUrl(config: GitHubDraftConfig, note: NoteItem) {
  const owner = config.owner.trim();
  const repo = config.repo.trim();
  const branch = config.branch.trim() || 'main';
  const folder = config.folder.trim().replace(/^\/+|\/+$/g, '');
  const filename = `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'note'}.md`;
  const fullPath = folder ? `${folder}/${filename}` : filename;
  const markdown = buildMarkdown(note);
  return `https://github.com/${owner}/${repo}/new/${branch}?filename=${encodeURIComponent(fullPath)}&value=${encodeURIComponent(markdown)}`;
}

function renderColorMarkup(text: string, isDark: boolean) {
  const regex = /\[(rose|orange|amber|emerald|sky|violet|slate)\]([\s\S]*?)\[\/\1\]/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`${lastIndex}-plain`}>{text.slice(lastIndex, match.index)}</span>);
    }

    const color = match[1] as NoteColor;
    const styles = COLOR_STYLES[color];
    nodes.push(
      <span
        key={`${match.index}-${color}`}
        className={`inline-flex rounded-md px-1.5 py-0.5 font-semibold ${styles.bg} ${styles.text} ${styles.border} border`}
      >
        {match[2]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`${lastIndex}-tail`}>{text.slice(lastIndex)}</span>);
  }

  if (nodes.length === 0) {
    return <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{text}</span>;
  }

  return nodes;
}

export function NotesPage() {
  const { theme, setPage, showNotification } = useApp();
  const isDark = theme === 'dark';
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notes, setNotes] = useState<NoteItem[]>(() => loadNotes());
  const [activeNoteId, setActiveNoteId] = useState<string>('');
  const [githubConfig, setGithubConfig] = useState<GitHubDraftConfig>(() => loadConfig());

  useEffect(() => {
    window.localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(NOTE_CONFIG_KEY, JSON.stringify(githubConfig));
  }, [githubConfig]);

  useEffect(() => {
    if (!notes.some((note) => note.id === activeNoteId) && notes[0]) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [notes]);
  const activeNote = useMemo(() => notes.find((note) => note.id === activeNoteId) || notes[0], [notes, activeNoteId]);
  const githubUrl = activeNote ? buildGithubUrl(githubConfig, activeNote) : '';

  const updateActiveNote = (patch: Partial<NoteItem>) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNote.id
          ? { ...note, ...patch, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const createNote = () => {
    const now = new Date().toISOString();
    const note: NoteItem = {
      id: createId('note'),
      title: 'New CS Note',
      content: '',
      tags: ['cs'],
      attachments: [],
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    setActiveNoteId(note.id);
  };

  const duplicateNote = () => {
    if (!activeNote) return;
    const now = new Date().toISOString();
    const copy: NoteItem = {
      ...activeNote,
      id: createId('note'),
      title: `${activeNote.title} Copy`,
      createdAt: now,
      updatedAt: now,
      attachments: activeNote.attachments.map((attachment) => ({ ...attachment, id: createId('att') })),
    };
    setNotes((prev) => [copy, ...prev]);
    setActiveNoteId(copy.id);
  };

  const deleteNote = () => {
    if (!activeNote) return;
    if (!confirm(`Delete "${activeNote.title}"?`)) return;
    setNotes((prev) => {
      const remaining = prev.filter((note) => note.id !== activeNote.id);
      return remaining.length > 0 ? remaining : [createStarterNote()];
    });
  };

  const handleWrapColor = (color: NoteColor) => {
    if (!activeNote || !editorRef.current) return;
    const textarea = editorRef.current;
    const content = activeNote.content;
    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const selected = content.slice(start, end);
    const openTag = `[${color}]`;
    const closeTag = `[/${color}]`;
    const inserted = selected ? `${openTag}${selected}${closeTag}` : `${openTag}${closeTag}`;
    const nextContent = `${content.slice(0, start)}${inserted}${content.slice(end)}`;

    updateActiveNote({ content: nextContent });

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selected ? start + inserted.length : start + openTag.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeNote) return;

    const reader = new FileReader();
    reader.onload = () => {
      const attachment: NoteAttachment = {
        id: createId('att'),
        name: file.name,
        src: String(reader.result || ''),
      };
      updateActiveNote({ attachments: [attachment, ...activeNote.attachments] });
      showNotification('Image added to note');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const addImageByUrl = () => {
    if (!activeNote) return;
    const url = window.prompt('Paste an image URL');
    if (!url?.trim()) return;
    const attachment: NoteAttachment = {
      id: createId('att'),
      name: url.split('/').pop() || 'image',
      src: url.trim(),
    };
    updateActiveNote({ attachments: [attachment, ...activeNote.attachments] });
    showNotification('Image linked to note');
  };

  const copyMarkdown = async () => {
    if (!activeNote) return;
    try {
      const markdown = buildMarkdown(activeNote);
      await navigator.clipboard.writeText(markdown);
      showNotification('Markdown copied for GitHub');
    } catch {
      showNotification('Copy failed. Use download instead.');
    }
  };

  const openGithubDraft = () => {
    if (!activeNote) return;
    if (!githubConfig.owner.trim() || !githubConfig.repo.trim()) {
      showNotification('Add a GitHub repo first');
      return;
    }
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  const downloadMarkdown = () => {
    if (!activeNote) return;
    const markdown = buildMarkdown(activeNote);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'note'}.md`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  };

  if (!activeNote) {
    return null;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setPage('home')}
        className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-colors ${
          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <section className={`rounded-3xl p-5 sm:p-7 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-700'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Notes + GitHub sync
            </div>
            <h1 className={`mt-3 text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CS Notes editor
            </h1>
            <p className={`mt-2 text-sm max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Write revision notes, color key words, attach images, and export the same note to a GitHub repo without exposing tokens in the browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={createNote} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold text-sm">
              <Plus className="w-4 h-4" /> New Note
            </button>
            <button onClick={duplicateNote} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-sm ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <FileText className="w-4 h-4" /> Duplicate
            </button>
            <button onClick={deleteNote} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-bold text-sm ${isDark ? 'bg-gray-800 text-red-300' : 'bg-red-50 text-red-600'}`}>
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <aside className={`rounded-3xl p-4 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Your notes
            </h2>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {notes.length}
            </span>
          </div>
          <div className="space-y-2">
            {sortedNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left rounded-2xl p-3 border transition-colors ${
                  note.id === activeNoteId
                    ? isDark
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-orange-50 border-orange-200'
                    : isDark
                      ? 'bg-gray-950 border-gray-800 hover:border-gray-700'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {note.title || 'Untitled note'}
                    </p>
                    <p className={`mt-1 text-xs line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {stripColorMarkup(note.content) || 'Start typing your note.'}
                    </p>
                  </div>
                  {note.id === activeNoteId && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'}`}>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {note.attachments.length} images
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <section className={`rounded-3xl p-4 sm:p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Editor</h2>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Inline color tags are preserved in the note and exported to GitHub.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COLOR_STYLES).map(([key, styles]) => (
                  <button
                    key={key}
                    onClick={() => handleWrapColor(key as NoteColor)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${styles.bg} ${styles.text} ${styles.border}`}
                  >
                    {styles.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <input
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                placeholder="Note title"
                className={`w-full bg-transparent text-2xl sm:text-3xl font-black outline-none ${isDark ? 'text-white placeholder:text-gray-700' : 'text-gray-900 placeholder:text-gray-300'}`}
              />

              <textarea
                ref={editorRef}
                value={activeNote.content}
                onChange={(e) => updateActiveNote({ content: e.target.value })}
                rows={18}
                placeholder="Write your CS notes here. Select text, then choose a color to wrap it."
                className={`w-full resize-none rounded-2xl border p-4 text-sm leading-relaxed outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
              />

              <input
                value={activeNote.tags.join(', ')}
                onChange={(e) => updateActiveNote({ tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })}
                placeholder="tags, separated, by, commas"
                className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button onClick={addImageByUrl} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                  <ImagePlus className="w-4 h-4" /> Add image URL
                </button>
                <button onClick={() => fileInputRef.current?.click()} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                  <Plus className="w-4 h-4" /> Upload image
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>

              {activeNote.attachments.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeNote.attachments.map((attachment) => (
                    <div key={attachment.id} className={`rounded-2xl overflow-hidden border ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'}`}>
                      <img src={attachment.src} alt={attachment.name} className="h-36 w-full object-cover" />
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <p className={`truncate text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{attachment.name}</p>
                        <button
                          onClick={() => updateActiveNote({ attachments: activeNote.attachments.filter((item) => item.id !== attachment.id) })}
                          className={`rounded-lg p-1 ${isDark ? 'text-gray-500 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={`grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]`}>
            <div className={`rounded-3xl p-4 sm:p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <h3 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Live preview
              </h3>
              <div className={`mt-4 rounded-2xl p-4 ${isDark ? 'bg-gray-950 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{activeNote.title || 'Untitled note'}</h4>
                <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
                  {renderColorMarkup(activeNote.content, isDark)}
                </div>
                {activeNote.attachments.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {activeNote.attachments.map((attachment) => (
                      <figure key={attachment.id} className={`overflow-hidden rounded-xl border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <img src={attachment.src} alt={attachment.name} className="h-28 w-full object-cover" />
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-3xl p-4 sm:p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>GitHub sync</h3>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Save repo details locally, then open a prefilled GitHub file editor.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <input
                  value={githubConfig.owner}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, owner: e.target.value }))}
                  placeholder="GitHub owner"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
                />
                <input
                  value={githubConfig.repo}
                  onChange={(e) => setGithubConfig((prev) => ({ ...prev, repo: e.target.value }))}
                  placeholder="Repository name"
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={githubConfig.branch}
                    onChange={(e) => setGithubConfig((prev) => ({ ...prev, branch: e.target.value }))}
                    placeholder="Branch"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
                  />
                  <input
                    value={githubConfig.folder}
                    onChange={(e) => setGithubConfig((prev) => ({ ...prev, folder: e.target.value }))}
                    placeholder="Folder"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-gray-800 bg-gray-950 text-gray-200 placeholder:text-gray-600' : 'border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400'}`}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${githubConfig.owner && githubConfig.repo ? 'bg-emerald-500/10 text-emerald-600' : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  <span className={`h-2 w-2 rounded-full ${githubConfig.owner && githubConfig.repo ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {githubConfig.owner && githubConfig.repo ? 'Repo connected' : 'Add repo details'}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <button onClick={copyMarkdown} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                  <Copy className="w-4 h-4" /> Copy Markdown
                </button>
                <button onClick={openGithubDraft} className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold bg-linear-to-r from-orange-500 to-amber-500 text-white">
                  <ExternalLink className="w-4 h-4" /> Open in GitHub
                </button>
                <button onClick={downloadMarkdown} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                  <Download className="w-4 h-4" /> Download .md
                </button>
              </div>

              <div className={`mt-4 rounded-2xl p-3 text-xs leading-relaxed ${isDark ? 'bg-gray-950 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                The GitHub button opens a new file draft in your browser, so you can save the note into a repo without exposing a token in this app.
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
