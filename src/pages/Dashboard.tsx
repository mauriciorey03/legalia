import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { FileText, User, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id);

      if (!error) {
        setDocuments(data || []);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, [user, navigate]);

  if (!user || !profile) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {documents.length === 0 ? (
                <li className="px-4 py-4 sm:px-6">
                  <p className="text-gray-500">No hay documentos generados aún.</p>
                </li>
              ) : (
                documents.map((doc: any) => (
                  <li key={doc.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm font-medium text-indigo-600">{doc.title}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{doc.created_at}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Información del Perfil</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{profile.full_name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
              </dl>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Plan Actual</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1)}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {profile.subscription_status === 'active' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 mb-8 md:mb-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'documents'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'profile'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="h-5 w-5 mr-2" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'subscription'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Suscripción
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="p-4">Cargando...</div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;