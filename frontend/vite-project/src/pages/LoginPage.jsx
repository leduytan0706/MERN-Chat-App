import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]= useState({
    email: "",
    password: ""
  });
  const {logIn, isLoggingIn }= useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    logIn(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">  
      {/*left side*/}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/*logo*/}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back!</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/*form*/}
          <form action="" onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40"/>
                </div>
                <input 
                  type="email" 
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="" className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40"/>
                </div>
                <input 
                  type={showPassword? "text": "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword? (
                    <EyeOff className="h-5 w-5 text-base-content/40"/>
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40"/>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              { isLoggingIn? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                 </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
              <p className="text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Sign up
                </Link>
              </p>
          </div>
        </div>
      </div>

      {/*right side*/}
      <AuthImagePattern 
        title="The internet isn't the same without you"
        subtitle="Sign in to catch up with your friends, family and more."
      />
    </div>
  )
}

export default LoginPage