import React, { useState } from 'react';
import Avatar from './Avatar';
import {
  Star,
  Search,
  ArrowLeftRight,
  MessageCircle,
  Settings,
  Home,
  LogOut,
  Menu
} from 'lucide-react';
import { PageType } from '../types';
import { User as APIUser } from '../services/api';
import { currentUser } from '../data/mockData';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onLogout: () => void;
  user: APIUser | null;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout, user, isCollapsed, onToggleCollapse }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMouseEnter = () => {
    onToggleCollapse(false);
  };

  const handleMouseLeave = () => {
    onToggleCollapse(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' as PageType },
    { icon: Star, label: 'My Skills', page: 'my-skills' as PageType },
    { icon: Search, label: 'Find Skills', page: 'find-skills' as PageType },
    { icon: ArrowLeftRight, label: 'Swap Requests', page: 'swap-requests' as PageType },
    { icon: MessageCircle, label: 'Messages', page: 'messages' as PageType },
    { icon: Settings, label: 'Settings', page: 'settings' as PageType }
  ];

  // return (
  //   <>
  //     {/* Mobile Menu Button */}
  //     <button
  //       onClick={toggleMobileSidebar}
  //       className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
  //       aria-label="Toggle mobile menu"
  //     >
  //       <Menu className="w-6 h-6" />
  //     </button>

  //     {/* Mobile Overlay */}
  //     {isMobileOpen && (
  //       <div
  //         className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
  //         onClick={toggleMobileSidebar}
  //         aria-hidden="true"
  //       />
  //     )}

  //     {/* Sidebar */}
  //     {/* <div
  //       className={`
  //       fixed top-0 left-0 h-full z-50 flex flex-col bg-black text-white
  //       transition-transform duration-300 ease-in-out
  //       ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
  //       ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
  //       md:translate-x-0
  //     `}
  //       onMouseEnter={handleMouseEnter}
  //       onMouseLeave={handleMouseLeave}
  //       aria-expanded={isCollapsed ? 'false' : 'true'}
  //     > */}
  //     <div
  //       className={`
  //   fixed top-0 left-0 h-full z-50 flex flex-col bg-black text-white
  //   transition-all duration-300 ease-in-out
  //   ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
  //   ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
  //   md:translate-x-0
  // `}
  //       onMouseEnter={handleMouseEnter}
  //       onMouseLeave={handleMouseLeave}
  //       aria-expanded={isCollapsed ? 'false' : 'true'}
  //     >

  //       {/* Logo */}
  //       <div
  //         className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'
  //           } transition-all duration-300`}
  //       >
  //         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
  //           <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
  //             <Star className="w-5 h-5 text-black" />
  //           </div>
  //           {!isCollapsed && (
  //             <span className="text-xl font-semibold whitespace-nowrap">SkillSwap</span>
  //           )}
  //         </div>
  //       </div>

  //       {/* Navigation */}
  //       <div className="p-4 flex-1 min-h-0 overflow-y-auto">
  //         <nav className="flex flex-col justify-between h-full" aria-label="Main navigation">
  //           {navigationItems.map((item) => (
  //             <button
  //               key={item.page}
  //               onClick={() => {
  //                 onPageChange(item.page);
  //                 setIsMobileOpen(false);
  //               }}
  //               className={`
  //               w-full flex items-center space-x-3 px-4 py-2 rounded-xl
  //               transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400
  //               ${currentPage === item.page
  //                   ? 'bg-lime-400 text-black shadow-lg'
  //                   : 'text-gray-300 hover:bg-gray-800 hover:text-white'
  //                 }
  //             `}
  //               aria-label={item.label}
  //               aria-current={currentPage === item.page ? 'page' : undefined}
  //             >
  //               <item.icon className="w-5 h-5 flex-shrink-0" />
  //               {!isCollapsed && (
  //                 <span className="font-medium">{item.label}</span>
  //               )}
  //               {/* Tooltip for collapsed state */}
  //               {isCollapsed && (
  //                 <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
  //                   {item.label}
  //                 </span>
  //               )}
  //             </button>
  //           ))}
  //         </nav>
  //       </div>

  //       {/* User Profile Section */}
  //       <div className={`p-2 space-y-1 ${isCollapsed ? 'px-2' : 'py-0'}`}>
  //         {/* Current User */}
  //         <button
  //           onClick={() => {
  //             onPageChange('profile');
  //             setIsMobileOpen(false);
  //           }}
  //           className={`w-full bg-lime-400 rounded-2xl p-3 text-black transition-all duration-300 hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-300 ${currentPage === 'profile' ? 'ring-2 ring-lime-300' : ''}`}
  //           aria-label="Go to Profile"
  //         >
  //           <div className="flex items-center space-x-3">
  //             <div className="relative flex-shrink-0">
  //               <Avatar
  //                 src={currentUser.avatar}
  //                 name={user?.name || currentUser.name}
  //                 size={32}
  //                 className={`transition-all duration-300`}
  //               />
  //               <div
  //                 className={`absolute -bottom-1 -right-1 rounded-full border-2 border-lime-400 transition-all duration-300 ${isCollapsed ? 'w-3 h-3' : 'w-4 h-4'
  //                   } ${getStatusColor(currentUser.status)}`}
  //               />
  //             </div>
  //             {!isCollapsed && (
  //               <div className="flex-1 min-w-0 text-left">
  //                 <p className="font-semibold truncate">{user?.name || currentUser.name}</p>
  //                 <p className="text-sm opacity-75 truncate">{currentUser.role}</p>
  //               </div>
  //             )}
  //           </div>
  //         </button>

  //         {/* Logout Button */}
  //         <button
  //           onClick={onLogout}
  //           className={`
  //           w-full flex items-center space-x-3 px-4 py-3 rounded-xl
  //           text-gray-300 hover:bg-gray-800 hover:text-white
  //           transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400
  //           ${isCollapsed ? 'px-2' : ''}
  //         `}
  //           aria-label="Sign Out"
  //         >
  //           <LogOut className="w-5 h-5 flex-shrink-0" />
  //           {!isCollapsed && <span className="font-medium">Sign Out</span>}
  //           {/* Tooltip for collapsed state */}
  //           {isCollapsed && (
  //             <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
  //               Sign Out
  //             </span>
  //           )}
  //         </button>
  //       </div>
  //     </div>
  //   </>
  // );
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col bg-black text-white
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
          md:translate-x-0
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isCollapsed ? 'false' : 'true'}
      >
        {/* Logo */}
        <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-300`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-black" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold whitespace-nowrap transition-all duration-300">
                SkillSwap
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        {/* <div className="p-4 flex-1 min-h-0 overflow-y-auto hide-scrollbar"> */}
        <div className="p-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          <nav className="flex flex-col justify-between h-full">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onPageChange(item.page);
                  setIsMobileOpen(false);
                }}
                className={`
                  group relative w-full flex items-center px-4 py-2 rounded-xl
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400
                  ${currentPage === item.page
                    ? 'bg-lime-400 text-black shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
                aria-label={item.label}
                aria-current={currentPage === item.page ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`
                    ml-3 font-medium whitespace-nowrap overflow-hidden
                    transition-all duration-300
                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed */}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className={`p-2 space-y-1 ${isCollapsed ? 'px-2' : 'py-0'}`}>
          {/* Profile Button */}
          <button
            onClick={() => {
              onPageChange('profile');
              setIsMobileOpen(false);
            }}
            className={`
              w-full bg-lime-400 rounded-2xl p-3 text-black transition-all duration-300 hover:bg-lime-500
              focus:outline-none focus:ring-2 focus:ring-lime-300
              ${currentPage === 'profile' ? 'ring-2 ring-lime-300' : ''}
            `}
            aria-label="Go to Profile"
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <Avatar
                  src={currentUser.avatar}
                  name={user?.name || currentUser.name}
                  size={32}
                  className="transition-all duration-300"
                />
                <div
                  className={`absolute -bottom-1 -right-1 rounded-full border-2 border-lime-400 transition-all duration-300
                    ${isCollapsed ? 'w-3 h-3' : 'w-4 h-4'} ${getStatusColor(currentUser.status)}
                  `}
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold truncate">{user?.name || currentUser.name}</p>
                  <p className="text-sm opacity-75 truncate">{currentUser.role}</p>
                </div>
              )}
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={`
              group relative w-full flex items-center px-4 py-3 rounded-xl
              text-gray-300 hover:bg-gray-800 hover:text-white
              transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-400
              ${isCollapsed ? 'px-2' : ''}
            `}
            aria-label="Sign Out"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={`
                ml-3 font-medium whitespace-nowrap overflow-hidden
                transition-all duration-300
                ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
              `}
            >
              Sign Out
            </span>

            {/* Tooltip */}
            {isCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;