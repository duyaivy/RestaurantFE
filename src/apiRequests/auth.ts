import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBody, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
 const authApiRequest = {
    requestTokenRequest : null as Promise<{
        status: number
        payload: RefreshTokenResType
    }> |null,

    sLogin: (body: LoginBodyType) => http.post<LoginResType>  ('/auth/login', body),

    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {
        baseUrl: '',
    }),
    
    sLogout: (body:LogoutBodyType & {
        accessToken: string
    }
)=> http.post('auth/logout',{
        refreshToken: body.refreshToken
    },{
        headers: {
            Authorization: `Bearer ${body.accessToken   }`
        }
    }),
    logout: () => 
        http.post('/api/auth/logout', null,{ baseUrl: ''}),

    sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
    async refreshToken() {
        if(this.requestTokenRequest){
            return this.requestTokenRequest}
        this.requestTokenRequest = http.post<RefreshTokenResType>('/api/auth/refresh-token', null, { baseUrl: ''})
        const result = await this.requestTokenRequest
        this.requestTokenRequest = null
        return result
    } 
}
    
export default authApiRequest;