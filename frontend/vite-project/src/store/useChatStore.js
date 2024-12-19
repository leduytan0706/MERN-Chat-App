import { create } from "zustand";
import toastError from "./toastError";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingUsers: false,
    isLoadingMessages: false,

    getUsers: async () => {
        set({isLoadingUsers: true})
        try {
            const res = await axiosInstance.get("/messages/user");
            set({users: res.data});
        } catch (error) {
            console.log("Error in getUsers: ", error);
            toastError(error.response.data.message);
        } finally {
            set({isLoadingUsers: false})
        }
    },

    getMessages: async (userId) => {
        set({isLoadingMessages: true});
        try {
            console.log(userId);
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            console.log("Error in getMessages: ", error);
            toastError(error.response.data.message);
        } finally {
            set({isLoadingMessages: false});
        }
    },

    sendMessage: async (messageData) => {
        // get the selectedUser and messages by using the getter in zustand
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log("Error in sendMessage: ", error);
            toastError(error.response.data.message);
        }
    },

    // todo: optimize this later
    setSelectedUser: (selectedUser) => set({selectedUser}),

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if (!selectedUser) return;

        // get the state socket from useAuthStore (supported by zustand)
        const socket = useAuthStore.getState().socket;

        // listen for newMessage and update the state messages
        // todo: optimize this later
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser.id) return;
            set({messages: [...get().messages, newMessage]});
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));