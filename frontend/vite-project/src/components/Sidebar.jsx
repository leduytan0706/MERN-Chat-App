import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const {getUsers, users, selectedUser, setSelectedUser, isLoadingUsers}= useChatStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const {onlineUsers} = useAuthStore();
    
    useEffect(() => {
        getUsers();
    },[getUsers]);

    const filteredUsers = showOnlineOnly? users.filter((user) => onlineUsers.includes(user.id)): users;

    if (isLoadingUsers) return <SidebarSkeleton />

    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6"/>
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>

                {/*online filter toggle*/}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label htmlFor="online-users" className="cursor-pointer flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            checked={showOnlineOnly} 
                            id="online-users"
                            className="checkbox checkbox-sm"
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
                
            </div>

            <div className="overflow-y-auto -w-full py-3">
                {/*display users*/}
                {filteredUsers.map((user) => (
                    <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id? "bg-base-300 ring-1 ring-base-300": ""}
                        `}
                    >   {/*avatar*/}
                        <div className="relative mx-auto lg:mx-0">
                            <img 
                                src={user.profilePic || "/avatar.png"} 
                                alt={user.fullName}
                                className="size-12 object-cover rounded-full" 
                            />
                            {/*online users will have a green dot in the top right corner*/}
                            {onlineUsers.includes(user.id) && (
                                <span
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"
                                >
                                </span>
                            )}
                        </div>
                        
                        {/*user info - only visible on large screens*/}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">{user.fullName}</div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user.id)? "Online": "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar