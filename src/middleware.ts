import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
// route bắt buoc phải đăng nhập mới vào được
const privatePaths = ['/manager']
// route dành cho người chưa đăng nhập
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
const {pathname} = request.nextUrl
const isAuth = Boolean(request.cookies.get('accessToken')?.value)


// chuưa đăng nhâpk thì không vào privatePaths
if(privatePaths.some(path=>pathname.startsWith(path)) && !isAuth){
    return NextResponse.redirect(new URL('/login', request.url))
}
// đã đăng nhập thì không vào LOGIN nữa
if(unAuthPaths.some(path=>pathname.startsWith(path)) && isAuth){
    return NextResponse.redirect(new URL('/', request.url))

}
return NextResponse.next()
}

export const config ={
    matcher:['/manager/:path*', '/login','/']
}
