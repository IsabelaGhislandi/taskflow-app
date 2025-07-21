import React, { useState } from 'react';

interface TaskListProps {
  tasks: any[];
  loading: boolean;
  onToggle: (task: any) => void;
  onDelete: (taskId: number) => void;
  onEdit: (taskId: number, newTitle: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, loading, onToggle, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Suas Tarefas</h3>
      {loading ? (
        <div>Carregando tarefas...</div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-500">Nenhuma tarefa encontrada.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="py-3 flex justify-between items-center">
              {editingId === task.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    onEdit(task.id, editValue);
                    setEditingId(null);
                  }}
                  className="flex-1 flex gap-2"
                >
                  <input
                    className="flex-1 border rounded px-2 py-1"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="text-emerald-600 font-bold">Salvar</button>
                  <button type="button" className="text-gray-400" onClick={() => setEditingId(null)}>Cancelar</button>
                </form>
              ) : (
                <span className="flex-1 flex items-center gap-2">
                  <span
                      className={`cursor-pointer select-none break-words whitespace-pre-line ${task.completed ? 'line-through text-gray-400' : ''}`}
                      onClick={() => onToggle(task)}
                      title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                      style={{ wordBreak: 'break-word' }} 
                    >
                      {task.completed ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-yellow-500">⏳</span>
                      )}{' '}
                      <span className="ml-1 text-xs text-gray-400 italic">(Atualizar status)</span>
                      {' '}
                      {task.title}
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-gray-500 hover:text-emerald-600"
                    title="Editar tarefa"
                    onClick={() => {
                      setEditingId(task.id);
                      setEditValue(task.title);
                    }}
                  >
                    ✏️
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="ml-4 text-red-500 hover:text-red-700"
                title="Excluir tarefa"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};