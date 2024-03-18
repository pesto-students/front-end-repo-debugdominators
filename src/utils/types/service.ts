export interface UnsplashAPI {
  search: string;
  page: number;
  per_page: number;
}

export interface UnsplashResponse {
  imgLinks: string[];
  total: number;
  total_pages: number;
}

export interface RazorpayAPI {
  amount: number;
  currency: string;
}

export interface RazorSuccessRes {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface SendEmailProps {
  subject?: string;
  html: string;
  token?: string;
  email: string;
}
