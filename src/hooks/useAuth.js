const useAuth = () => {
    const user = localStorage.getItem('access-token');
    console.log("🚀 ~ useAuth ~ user:", user)
    return {
        isAuthenticated: !!user,
    };
};

export default useAuth;