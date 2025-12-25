"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import Input from "@/components/common/Input";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  paymentMethod: "cod" | "bank";
  note: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    address: "",
    paymentMethod: "cod",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.city.trim()) {
      newErrors.city = "Vui lòng nhập tỉnh/thành phố";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ chi tiết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate order ID
    const newOrderId = `CM${Date.now().toString().slice(-8)}`;
    setOrderId(newOrderId);
    setOrderSuccess(true);
    clearCart();
    setIsSubmitting(false);
  };

  // Redirect to cart if empty
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-500 mb-8">
              Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
            >
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Order success state
  if (orderSuccess) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-500 mb-6">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận đơn hàng
              trong thời gian sớm nhất.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-sm text-gray-500 mb-1">Mã đơn hàng</div>
              <div className="text-2xl font-bold text-[var(--primary)]">
                {orderId}
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-dark)] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Về trang chủ
              </Link>
              <Link
                href="/#products"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-[var(--primary)] transition-colors"
            >
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/gio-hang"
              className="text-gray-500 hover:text-[var(--primary)] transition-colors"
            >
              Giỏ hàng
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Thanh toán</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[var(--primary)] text-white text-sm font-bold rounded-full flex items-center justify-center">
                      1
                    </span>
                    Thông tin khách hàng
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="fullName"
                      label="Họ và tên"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A"
                      error={errors.fullName}
                    />

                    <Input
                      type="tel"
                      name="phone"
                      label="Số điện thoại"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                      error={errors.phone}
                    />

                    <Input
                      type="email"
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      error={errors.email}
                      containerClassName="sm:col-span-2"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[var(--primary)] text-white text-sm font-bold rounded-full flex items-center justify-center">
                      2
                    </span>
                    Địa chỉ giao hàng
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="city"
                      label="Tỉnh/Thành phố"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="TP. Hồ Chí Minh"
                      error={errors.city}
                    />

                    <Input
                      type="text"
                      name="district"
                      label="Quận/Huyện"
                      required
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="Quận 1"
                      error={errors.district}
                    />

                    <Input
                      type="text"
                      name="address"
                      label="Địa chỉ chi tiết"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Số nhà, tên đường, phường/xã"
                      error={errors.address}
                      containerClassName="sm:col-span-2"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[var(--primary)] text-white text-sm font-bold rounded-full flex items-center justify-center">
                      3
                    </span>
                    Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "cod"
                          ? "border-[var(--primary)] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[var(--primary)]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Thanh toán khi nhận hàng (COD)
                        </div>
                        <div className="text-sm text-gray-500">
                          Thanh toán trực tiếp cho nhân viên giao hàng
                        </div>
                      </div>
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M6 8a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm7 2a1 1 0 11-2 0 1 1 0 012 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.paymentMethod === "bank"
                          ? "border-[var(--primary)] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[var(--primary)]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Chuyển khoản ngân hàng
                        </div>
                        <div className="text-sm text-gray-500">
                          Chuyển khoản trước, nhận hàng sau
                        </div>
                      </div>
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Note */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-[var(--primary)] text-white text-sm font-bold rounded-full flex items-center justify-center">
                      4
                    </span>
                    Ghi chú đơn hàng
                  </h2>

                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
                    placeholder="Ghi chú về đơn hàng, thời gian nhận hàng..."
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 sticky top-36">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Đơn hàng của bạn
                  </h2>

                  {/* Products */}
                  <div className="space-y-3 pb-4 border-b border-gray-100 max-h-[300px] overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--primary)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </div>
                          <div className="text-sm font-bold text-red-600 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 py-4 border-b border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium text-green-600">
                        Miễn phí
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="text-base font-semibold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Đặt hàng
                      </>
                    )}
                  </button>

                  <Link
                    href="/gio-hang"
                    className="w-full flex items-center justify-center gap-2 mt-3 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Quay lại giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
}
