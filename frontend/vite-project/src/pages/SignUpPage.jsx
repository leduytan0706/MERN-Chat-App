import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toastError from '../store/toastError';



const SignUpPage = () => {
    const [showPassword, setShowPassword] =  useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const {signUp, isSigningUp} = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toastError("Full Name is required");
        // if (!formData.username.trim()) return toast.error("Username is required");
        if (!formData.email.trimEnd()) return toastError("Email is required");
        if (!/\S+@\S+\S+/.test(formData.email)) return toastError("Invalid email format");
        if (!formData.password) return toastError("Password is required");
        if (formData.password.length < 6) return toastError("Password must be at least 6 characters long");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) {
            signUp(formData);
        }


    };




    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/*logo*/}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Create account</h1>
                        <p className="text-base-content/60">Get started for free</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate={true}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40"/>
                                </div>
                                <input 
                                    type="text"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="John Doe"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40"/>
                                </div>
                                <input 
                                    type="email"
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="johndoe@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40"/>
                                </div>
                                <input 
                                    type={showPassword? "text": "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="••••••"
                                    name="password"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => {setShowPassword(prev => !prev)}}
                                >
                                    {showPassword? (
                                        <EyeOff className="size-5 text-base-content/40" />
                                    ): (
                                        <Eye className="size-5 text-base-content/40"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSigningUp}
                        >
                            {isSigningUp? (
                                <>
                                    <Loader2 className="size-5 animate-spin"/>
                                    Loading...
                                </>
                        
                            ) : (
                                "Create Account"
                            )}

                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link 
                                to="/login" 
                                className="link link-primary"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/*right size*/}
            <AuthImagePattern 
                title="Join our community"
                subtitle="Connect with friends, share moments and stay in touch with your close ones."
            />
        </div>
    )
}

export default SignUpPage