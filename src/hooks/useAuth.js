const useAuth = () => {
    const user = sessionStorage.getItem('token');
    console.log("🚀 ~ useAuth ~ user:", user)
    return {
        isAuthenticated: !!user,
    };
};

export default useAuth;