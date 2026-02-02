import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore= await cookies()
    const accessToken= cookieStore.get('accessToken')?.value
    const refreshToken= cookieStore.get('refreshToken')?.value

    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    if(!accessToken || !refreshToken){
    return Response.json({ 
        message:'khong nhan duoc accesstoken hoac refresh token'
    },{
        status:200
    })

    }
   
    try {

        const result = await authApiRequest.sLogout({
            accessToken,
            refreshToken
        })

        return Response.json(result.payload)
    }    
catch (error) {
    console.log(error)
   
       return Response.json({
                    message: 'loi khi goi Api den server backen'
                }, 
                    {
                        status: 200
                    }
                )


}
    }
