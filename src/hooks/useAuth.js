const useAuth = () => {
    const user = sessionStorage.getItem('token');
    return {
        isAuthenticated: !!user,
    };
};

export default useAuth;