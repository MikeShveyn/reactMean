import {useCallback, useEffect, useState} from "react";
let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [userId, setUserId] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const login = useCallback((uid, token,  isAdmin, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setIsAdmin(isAdmin)
        const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpiration)
        localStorage.setItem('userData',
            JSON.stringify({
                userId: uid,
                token: token,
                isAdmin: isAdmin,
                expiration: tokenExpiration.toISOString()
            }))

    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null)
        setUserId(null)
        setIsAdmin(false)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const timeLeft = tokenExpirationDate.getTime() - new Date().getTime()
            logoutTimer = setTimeout(logout, timeLeft)
        } else {
            clearTimeout(logoutTimer)
        }
    }, [token, logout, tokenExpirationDate])

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, storedData.isAdmin, new Date(storedData.expiration))
        }
    }, [login])

    return {token, login, logout, userId}
}