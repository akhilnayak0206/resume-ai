import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedProps {
  children: ReactNode;
}

const Protected = ({children}: ProtectedProps) => {
    const { loading,user } = useAuth()

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected
