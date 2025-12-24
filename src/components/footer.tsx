import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#172B4D] text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-[#1976d2]"
                >
                  <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
                  <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
                  <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-white">
                  Hùng <span className="text-[#90caf9]">Thanh</span>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  Mát lạnh tận nhà
                </div>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Hệ thống phân phối máy lạnh chính hãng. Giá tốt nhất, bảo hành uy
              tín, lắp đặt chuyên nghiệp.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-[#1877f2] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Zalo"
                className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-[#0068ff] transition-colors"
              >
                <span className="text-[10px] font-bold">Zalo</span>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-white mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/?feature=inverter#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Máy lạnh Inverter
                </Link>
              </li>
              <li>
                <Link
                  href="/?brand=daikin#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Máy lạnh Daikin
                </Link>
              </li>
              <li>
                <Link
                  href="/?brand=panasonic#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Máy lạnh Panasonic
                </Link>
              </li>
              <li>
                <Link
                  href="/?brand=lg#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Máy lạnh LG
                </Link>
              </li>
              <li>
                <Link
                  href="/?price=0-7000000#products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Máy lạnh giá rẻ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/bao-hanh"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#1976d2] mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-400">
                  Nam Từ Liêm, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+84779886666"
                  className="text-white font-semibold hover:text-[#90caf9]"
                >
                  0779 886 666
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-orange-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:hungle@hagency.vn"
                  className="text-gray-400 hover:text-white"
                >
                  hungle@hagency.vn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#1976d2] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-400">8:00 - 21:00 (T2 - CN)</span>
              </li>
            </ul>

            {/* Payment */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Thanh toán</p>
              <div className="flex gap-1.5">
                <div className="px-2 py-1 bg-white rounded text-[9px] font-bold text-blue-600">
                  VISA
                </div>
                <div className="px-2 py-1 bg-white rounded text-[9px] font-bold text-red-500">
                  Master
                </div>
                <div className="px-2 py-1 bg-white rounded text-[9px] font-bold text-blue-500">
                  ATM
                </div>
                <div className="px-2 py-1 bg-white rounded text-[9px] font-bold text-green-600">
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>&copy; 2025 Hùng Thanh. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-3">
              <Link href="#" className="hover:text-white">
                Điều khoản
              </Link>
              <span>|</span>
              <Link href="#" className="hover:text-white">
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
