import React from 'react';

interface TaskFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ value, onChange, onSubmit, loading }) => (
  <form
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
    className="flex gap-2 mb-4"
  >
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Nova tarefa..."
      className="flex-1 border rounded px-3 py-2"
      disabled={loading}
      required
    />
    <button
      type="submit"
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
      disabled={loading}
    >
      {loading ? 'Adicionando...' : 'Adicionar'}
    </button>
  </form>
);