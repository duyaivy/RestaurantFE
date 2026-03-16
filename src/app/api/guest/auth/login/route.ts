
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import guestApiRequest from "@/apiRequests/guest";

export async function POST(request: Request) {
    const body = (await request.json()) as GuestLoginBodyType
    const cookieStore = await cookies()
    try {

        const { payload } = await guestApiRequest.sLogin(body)
        const { accessToken, refreshToken } = payload.data
        const decodeAccessToken = jwt.decode(accessToken) as { exp?: number } | null
        const decodeRefreshToken = jwt.decode(refreshToken) as { exp?: number } | null
        if (!decodeAccessToken?.exp || !decodeRefreshToken?.exp) {
            return Response.json(
                { message: "Token không hợp lệ hoặc thiếu exp" },
                { status: 500 },
            )
        }
        cookieStore.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: new Date(decodeAccessToken.exp * 1000),
            sameSite: 'lax',
        })
        cookieStore.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            expires: new Date(decodeRefreshToken.exp * 1000),
            sameSite: 'lax',
        })
        return Response.json(payload)

    }
    catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload,
                {
                    status: error.status

                })
        }
        else {
            return Response.json({
                message: 'Lỗi không xác định'
            },
                { status: 500 })
        }
    }
}
