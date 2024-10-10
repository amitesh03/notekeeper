import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import axios from 'axios';

interface Note {
  _id: string;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/notes', newNote, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    try {
      await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, editingNote, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Notes</h2>
      
      <form onSubmit={handleCreateNote} className="mb-8">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg mb-2"
          required
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg mb-2"
          rows={3}
          required
        ></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
          <Plus className="mr-2" size={18} />
          Add Note
        </button>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-4 rounded-lg shadow">
            {editingNote && editingNote._id === note._id ? (
              <form onSubmit={handleUpdateNote}>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  required
                />
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mb-2"
                  rows={3}
                  required
                ></textarea>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex items-center">
                  <Save className="mr-2" size={18} />
                  Save
                </button>
              </form>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
                <p className="mb-4">{note.content}</p>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingNote(note)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300 flex items-center">
                    <Edit className="mr-1" size={16} />
                    Edit
                  </button>
                  <button onClick={() => handleDeleteNote(note._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300 flex items-center">
                    <Trash2 className="mr-1" size={16} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;