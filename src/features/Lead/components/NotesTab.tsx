/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Lock,
  Eye,
  Save,
  X,
  StickyNote,
  Clock,
  User,
} from "lucide-react";
import {
  useGetLeadNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../../services/noteApi";
import type { NoteResponse } from "../../../types";

interface NotesTabProps {
  leadId: string;
}

interface NoteFormData {
  content: string;
  isInternal: boolean;
}

interface NoteCardProps {
  note: NoteResponse;
  onEdit: (note: NoteResponse) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              note.isInternal
                ? "bg-amber-100 text-amber-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {note.isInternal ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {note.user.firstName} {note.user.lastName}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                  note.isInternal
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {note.isInternal ? "Internal" : "Visible"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(note.createdAt)}</span>
              {new Date(note.updatedAt).getTime() !==
                new Date(note.createdAt).getTime() && (
                <span className="text-gray-400">• Edited</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit note"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {note.content}
      </p>
    </div>
  );
};

interface NoteEditorProps {
  initialData?: NoteFormData;
  isEditing: boolean;
  onSubmit: (data: NoteFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState<NoteFormData>(
    initialData || { content: "", isInternal: false }
  );

  const handleSubmit = async (): Promise<void> => {
    if (!formData.content.trim()) return;
    await onSubmit(formData);
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">
          {isEditing ? "Edit Note" : "Add New Note"}
        </h4>
        {!isEditing && (
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="Write your note here..."
        rows={4}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none mb-4"
        autoFocus
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isInternal}
              onChange={(e) =>
                setFormData({ ...formData, isInternal: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Lock className="w-4 h-4 text-amber-600" />
              Internal Note
            </div>
            <div className="text-xs text-gray-600">
              Only visible to team members
            </div>
          </div>
        </label>

        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? "Update" : "Add Note"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotesTab: React.FC<NotesTabProps> = ({ leadId }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null);
  const [showInternal, setShowInternal] = useState(true);

  const { data, isLoading, refetch } = useGetLeadNotesQuery({
    leadId,
    includeInternal: showInternal,
  });

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes = data || [];

  const handleCreateNote = async (formData: NoteFormData): Promise<void> => {
    try {
      await createNote({
        leadId,
        content: formData.content,
        isInternal: formData.isInternal,
      }).unwrap();
      setShowEditor(false);
      refetch();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleUpdateNote = async (formData: NoteFormData): Promise<void> => {
    if (!editingNote) return;

    try {
      await updateNote({
        id: editingNote.id,
        data: { content: formData.content },
      }).unwrap();
      setEditingNote(null);
      refetch();
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(noteId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleEditNote = (note: NoteResponse): void => {
    setEditingNote(note);
    setShowEditor(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Notes</h3>
          <p className="text-sm text-gray-600 mt-1">
            Keep track of important information about this lead
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInternal(!showInternal)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              showInternal
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {showInternal ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showInternal ? "Show All" : "Show Visible Only"}
          </button>
          {!showEditor && !editingNote && (
            <button
              onClick={() => setShowEditor(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Note
            </button>
          )}
        </div>
      </div>

      {showEditor && !editingNote && (
        <NoteEditor
          isEditing={false}
          onSubmit={handleCreateNote}
          onCancel={() => setShowEditor(false)}
          isLoading={isCreating}
        />
      )}

      {editingNote && (
        <NoteEditor
          initialData={{
            content: editingNote.content,
            isInternal: editingNote.isInternal,
          }}
          isEditing={true}
          onSubmit={handleUpdateNote}
          onCancel={() => setEditingNote(null)}
          isLoading={isUpdating}
        />
      )}

      {notes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
          <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No notes yet
          </h4>
          <p className="text-gray-600 mb-6">
            Start documenting your interactions and observations
          </p>
          <button
            onClick={() => setShowEditor(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add First Note
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
