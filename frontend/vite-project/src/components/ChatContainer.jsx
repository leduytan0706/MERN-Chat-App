import React, {useEffect, useRef} from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils.js';

const ChatContainer = () => {
    const {messages, getMessages, isLoadingMessages, selectedUser, subscribeToMessages, unsubscribeFromMessages}= useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef= useRef(null);

    // console.log(authUser)

    useEffect(() => {
        getMessages(selectedUser.id);

        console.log(authUser);

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    },[selectedUser.id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavio: "smooth"});
        }
    },[messages])

    if (isLoadingMessages){
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }
    


    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat ${message.senderId === authUser.id? "chat-end": "chat-start" }
                        `}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img 
                                    src={message.senderId === authUser.id? authUser.profilePic || "/avatar.png": selectedUser.profilePic || "/avatar.png" } 
                                    alt="profile picture" 
                                />
                            </div>
                        </div>

                      <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
  
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img 
                                    src={message.image} 
                                    alt="chat image" 
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    )
}

export default ChatContainer