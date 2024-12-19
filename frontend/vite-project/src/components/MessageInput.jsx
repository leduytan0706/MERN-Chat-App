import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toastError from '../store/toastError';

const MessageInput = () => {
    const [text, setText]= useState("")
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const {sendMessage} = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!(file.type.startsWith("image/"))){
            toastError("Please select an image file");
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            setImagePreview(reader.result);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current){
            fileInputRef.current.value = null;
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            });

            //clear input fields
            setText("");
            setImagePreview(null);
            if (fileInputRef.current){
                fileInputRef.current.value = null;
            }
        } catch (error) {
            console.error("Failed to send message: ",error);
        }
    }

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img 
                            src={imagePreview} 
                            alt="image preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700" 
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                        >
                            <X className="size-3"/>
                        </button>
                    </div>
                </div>
            )}

            <form action="" onSubmit={handleSendMessage} className="flex items-center gap-2" >
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text" 
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    {/*click this button = call the file input above*/}
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-cirlce ${imagePreview? "text-emerald-500": "text-zince-400"}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20}/>
                    </button>
                </div>
            
                {/*submit button*/}
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={22}/>
                </button>
            </form>
        </div>
    );
};

export default MessageInput