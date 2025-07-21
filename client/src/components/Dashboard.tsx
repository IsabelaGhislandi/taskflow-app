import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList'; // Certifique-se de que TaskList está implementado
import React, { useState, useEffect } from 'react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const data = await tasksAPI.getTasks();
      const arr = Array.isArray(data) ? data : data.results || [];
      console.log('Tarefas recebidas da API:', arr);
      setTasks(arr);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };
  fetchTasks();
}, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteTask = async (taskId: number) => {
  try {
      await tasksAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setMessage('Tarefa excluída com sucesso!');
      setTimeout(() => setMessage(null), 3000); // Mensagem some após 3s
    } catch {
      setMessage('Erro ao excluir tarefa.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const toggleTaskCompleted = async (task: any) => {
      try {
    const updated = await tasksAPI.updateTask(task.id, { completed: !task.completed });
    setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, ...updated } : t))
      );
    setMessage('Status da tarefa atualizado!');
    setTimeout(() => setMessage(null), 3000);
  } catch {
    setMessage('Erro ao atualizar tarefa.');
    setTimeout(() => setMessage(null), 3000);
  }
  };

  const handleEditTask = async (taskId: number, newTitle: string) => {
  try {
    const updated = await tasksAPI.updateTask(taskId, { title: newTitle });
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, title: updated.title } : t))
    );
    setMessage('Tarefa editada com sucesso!');
    setTimeout(() => setMessage(null), 3000);
  } catch {
    setMessage('Erro ao editar tarefa.');
    setTimeout(() => setMessage(null), 3000);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ✨ TaskFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Olá, <span className="font-medium">{user?.first_name || user?.name || user?.email?.split('@')[0] || 'Usuário'}</span>! 👋
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sair 🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg p-6 text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Bem-vindo ao TaskFlow! 🎉
            </h2>
            <p className="text-emerald-100">
              Gerencie suas tarefas de forma eficiente e organize seu dia!
            </p>
          </div>

          {/* Mensagem customizada */}
          {message && (
            <div className="mb-4 px-4 py-2 rounded bg-emerald-100 text-emerald-800 font-medium shadow">
              {message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      📝
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Tarefas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalTasks}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      ✅
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Concluídas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {completedTasks}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      ⏳
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pendentes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingTasks}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Area */}
          <div className="bg-white shadow rounded-lg p-6">
           
          <TaskForm
            value={newTaskTitle}
            onChange={setNewTaskTitle}
            onSubmit={async () => {
              if (!newTaskTitle.trim()) return;
              setCreatingTask(true);
              try {
                const created = await tasksAPI.createTask({ title: newTaskTitle });
                setTasks((prev) => [created, ...prev]);
                setNewTaskTitle('');
              } catch {
                alert('Erro ao criar tarefa');
              } finally {
                setCreatingTask(false);
              }
            }}
            loading={creatingTask}
          />
         <TaskList
            tasks={tasks}
            loading={loadingTasks}
            onToggle={toggleTaskCompleted}
            onDelete={handleDeleteTask}
             onEdit={handleEditTask}
          />

              
            
          </div>
        </div>
      </main>
    </div>
  );
};