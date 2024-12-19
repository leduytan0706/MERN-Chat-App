import {create} from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import toastError from "./toastError.js";
import {io} from "socket.io-client";
import {Types} from "mongoose";

const BASE_URL = import.meta.env.MODE === "development"? "http://localhost:5001": "/";

// Define a store for authentication state
// return initial state
const useAuthStore = create((set, get) => ({
    authUser: null, //dont know if the user is authenticated or not
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,

    onlineUsers: [],

    checkAuth: async() => {
        try {
            // check user
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            // connect to socket when accessing the app and authenticated
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({authUser: null});
        } finally{
            set({isCheckingAuth: false});
        }    
    },

    signUp: async (data) => {
        set({isSigningUp: true});
        try {
           
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            //connect to socket when signed up
            get().connectSocket();
        } catch (error) {
            // toast.error(error.response.data.message);
            console.log("Error in signUp: ", error);
        } finally {
            set({isSigningUp: false});
        }
    },

    logIn: async (data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
            //connect to socket when logged in
            get().connectSocket();
        } catch (error) {
            console.log("Error in logIn: ", error);
            toastError(error.response.data.message);
        } finally {
            set({isLoggingIn: false});
        }
    },

    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logOut: ", error);
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser: res.data});
            toast.success("Profile picture updated successfully");
        } catch (error) {
            console.log("Error in updateProfile: ", error);
            toastError(error.response.data.message);
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        // if not authenticated or already connected to socket
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.id
            },
        });
        socket.connect();
        // set state
        set({socket: socket});

        // listen for events from getOnlineUsers and update the state onlineUsers
        socket.on("getOnlineUsers",(userIds) => {
            // const onlineIds = userIds.map((id) => Types.ObjectId.createFromHexString(id));
            set({onlineUsers: userIds});
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected){
            get().socket.disconnect();
        }
    }

}));

export {useAuthStore};