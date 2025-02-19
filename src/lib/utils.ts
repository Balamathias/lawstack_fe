import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum status {
  HTTP_200_SUCCESSFUL = 200,
  HTTP_201_CREATED = 201,
  HTTP_204_NO_CONTENT = 204,

  HTTP_400_BAD_REQUEST = 400,
  HTTP_401_UNAUTHORIZED = 401,
  HTTP_403_FORBIDDEN = 403,
  HTTP_404_NOT_FOUND = 404,
  HTTP_405_METHOD_NOT_ALLOWED = 405,
  HTTP_409_CONFLICT = 409,
  HTTP_422_UNPROCESSABLE_ENTITY = 422,

  HTTP_500_INTERNAL_SERVER_ERROR = 500,

  HTTP_205_RESET_CONTENT = 205,

  HTTP_429_TOO_MANY_REQUESTS = 429,

  HTTP_502_BAD_GATEWAY = 502,

  HTTP_503_SERVICE_UNAVAILABLE = 503,

  HTTP_504_GATEWAY_TIMEOUT = 504,

  HTTP_507_INSUFFICIENT_STORAGE = 507,

  HTTP_511_NETWORK_AUTHENTICATION_REQUIRED = 511,

  HTTP_520_UNKNOWN_ERROR = 520,
  HTTP_521_WEB_SERVER_IS_DOWN = 521,
  HTTP_522_CONNECTION_TIMED_OUT = 522,
  HTTP_523_ORIGIN_IS_UNREACHABLE = 523,
  HTTP_524_A_TIMEOUT_OCCURRED = 524,
  HTTP_525_SSL_HANDSHAKE_FAILED = 525,
  HTTP_526_INVALID_SSL_CERTIFICATE = 526,
  HTTP_527_RAILGUN_ERROR = 527,
  HTTP_530_ORIGIN_DNS_ERROR = 530,
  HTTP_598_NETWORK_READ_TIMEOUT_ERROR = 598,
  HTTP_599_NETWORK_CONNECT_TIMEOUT_ERROR = 599,

  HTTP_100_CONTINUE = 100,
  HTTP_101_SWITCHING_PROTOCOLS = 101,
  HTTP_102_PROCESSING = 102,
  HTTP_103_EARLY_HINTS = 103,
  HTTP_104_CHECKPOINT = 104,
}

export const addQueryParams = (qs: string, params: Record<string, string | number | undefined>): string => {
  const urlParams = new URLSearchParams(qs);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      urlParams.delete(key);
    } else {
      const existingValue = urlParams.get(key);
      if (existingValue === value.toString()) {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value.toString());
      }
    }
  });

  return `?${urlParams.toString()}`;
};

export const clipString = (text: string, by=50) => {
  if (text.length <= by) return text
  else return text.slice(0, by) + '...'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12

  const formattedHours = String(hours).padStart(2, '0')

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const pastDate = new Date(dateString);

  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}s.`;
  } else if (minutes < 60) {
    return `${minutes}m.`;
  } else if (hours < 24) {
    return `${hours}h.`;
  } else {
    return `${days}d.`;
  }
}

export function isImageOrVideo(url: string): 'image' | 'video' | 'unknown' {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];

  const lowercasedUrl = url.toLowerCase();

  if (imageExtensions.some(ext => lowercasedUrl.endsWith(ext))) {
    return 'image';
  } else if (videoExtensions.some(ext => lowercasedUrl.endsWith(ext))) {
    return 'video';
  }

  return 'unknown';
}

export const setToken = (token?: string | null, refreshToken?: string | null) => {
  if (token && refreshToken) {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const setCookies = (cookies: any, token?: string | null, refreshToken?: string | null) => {
  if (token && refreshToken) {
    cookies.set('token', token)
    cookies.set('refreshToken', refreshToken)
  }
}
