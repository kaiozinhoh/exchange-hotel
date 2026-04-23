import { Link, usePage } from '@inertiajs/react';
import { Shield, Users, TrendingUp } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { app_settings } = usePage().props;
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
            {/* Lado Esquerdo - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                {/* Pattern de fundo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                    <div className="absolute top-40 right-20 w-32 h-32 bg-white rounded-full"></div>
                    <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full"></div>
                    <div className="absolute bottom-40 right-10 w-24 h-24 bg-white rounded-full"></div>
                </div>
                
                {/* Conteúdo do branding */}
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden">
                                <img src="/exchange-logo.png" alt="Exchange Hoteis" className="w-8 h-8 object-contain" />
                            </div>
                            <h1 className="text-3xl font-bold">Exchange Hoteis!</h1>
                        </div>
                        <p className="text-xl text-blue-100 mb-2">Sistema Completo para Gestão Hoteleira</p>
                        <p className="text-blue-200">A plataforma completa para gerenciar sua rede de hotéis</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Segurança Avançada</h3>
                                <p className="text-blue-200 text-sm">Proteção de dados e controle de acesso</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Gestão Multi-Usuários</h3>
                                <p className="text-blue-200 text-sm">Perfis de acesso personalizados</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Analytics em Tempo Real</h3>
                                <p className="text-blue-200 text-sm">Relatórios e estatísticas detalhadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Lado Direito - Formulário */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Logo e título */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                <img src="/exchange-logo.png" alt="Exchange Hoteis" className="w-8 h-8 object-contain" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-2xl font-bold text-gray-900">Exchange Hoteis!</h1>
                                <p className="text-sm text-gray-600">Hoteis Platform</p>
                            </div>
                        </Link>
                    </div>

                    {/* Card do formulário */}
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                        {children}
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center mt-8 text-sm text-gray-500">
                        <p>&copy; 2026 Exchange Hotel Manager. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
