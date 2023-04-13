import { HttpErrorInterceptor } from './http-error.interceptor';
import { CacheInterceptor } from './cache.interceptor'

export const interceptor: any[] = [HttpErrorInterceptor, CacheInterceptor];

export * from './http-error.interceptor';
export * from './cache.interceptor';