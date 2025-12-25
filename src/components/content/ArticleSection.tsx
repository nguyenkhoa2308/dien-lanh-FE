'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tableOfContents = [
  { id: 'what-is-ac', title: 'Máy lạnh là gì?' },
  { id: 'types', title: 'Các loại máy lạnh phổ biến' },
  { id: 'how-to-choose', title: 'Cách chọn mua máy lạnh phù hợp' },
  { id: 'power-guide', title: 'Hướng dẫn chọn công suất' },
  { id: 'brands', title: 'Các thương hiệu uy tín' },
  { id: 'maintenance', title: 'Bảo trì và vệ sinh máy lạnh' },
];

export default function ArticleSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToc, setShowToc] = useState(true);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Table of contents - sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-36 bg-gray-50 rounded-lg p-4">
              <button
                onClick={() => setShowToc(!showToc)}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
              >
                <span>📋 Mục lục</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className={cn('w-5 h-5 transition-transform', showToc && 'rotate-180')}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {showToc && (
                <ul className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="text-sm text-gray-600 hover:text-[#1976d2] text-left w-full"
                      >
                        {index + 1}. {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Article content */}
          <div className="flex-1">
            <article className="prose prose-gray max-w-none">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Hướng dẫn chọn mua máy lạnh phù hợp nhất 2024
              </h1>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-500',
                  isExpanded ? 'max-h-none' : 'max-h-[600px]'
                )}
              >
                <section id="what-is-ac" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">1.</span> Máy lạnh là gì?
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Máy lạnh (hay còn gọi là điều hòa không khí, máy điều hòa) là thiết bị điện tử
                    dùng để điều chỉnh nhiệt độ trong phòng, giúp làm mát không khí trong những ngày
                    nóng bức. Máy lạnh hoạt động theo nguyên lý trao đổi nhiệt, hút không khí nóng
                    từ trong phòng, làm lạnh và đẩy không khí mát trở lại phòng.
                  </p>
                </section>

                <section id="types" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">2.</span> Các loại máy lạnh phổ biến
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🔹 Máy lạnh 1 chiều</h3>
                      <p className="text-sm text-gray-600">
                        Chỉ có chức năng làm lạnh, phù hợp với khí hậu nóng quanh năm như Việt Nam.
                        Giá thành rẻ hơn, tiết kiệm điện hơn máy 2 chiều.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🔹 Máy lạnh 2 chiều</h3>
                      <p className="text-sm text-gray-600">
                        Có cả chức năng làm lạnh và sưởi ấm. Phù hợp với vùng có mùa đông lạnh.
                        Giá thành cao hơn nhưng đa năng hơn.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-[#1976d2] mb-2">⭐ Máy lạnh Inverter</h3>
                      <p className="text-sm text-gray-600">
                        Công nghệ biến tần giúp tiết kiệm điện 30-50%, hoạt động êm ái, làm lạnh
                        nhanh và bền bỉ hơn. Được khuyên dùng cho mọi gia đình.
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🔹 Điều hòa cây (tủ đứng)</h3>
                      <p className="text-sm text-gray-600">
                        Công suất lớn, phù hợp với phòng khách rộng, văn phòng, showroom.
                        Thiết kế sang trọng, làm lạnh diện tích lớn.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="how-to-choose" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">3.</span> Cách chọn mua máy lạnh phù hợp
                  </h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976d2]">✓</span>
                      <span><strong>Xác định diện tích phòng:</strong> Đây là yếu tố quan trọng nhất để chọn công suất máy lạnh phù hợp.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976d2]">✓</span>
                      <span><strong>Chọn công nghệ Inverter:</strong> Tiết kiệm điện, hoạt động êm ái, tuổi thọ cao hơn.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976d2]">✓</span>
                      <span><strong>Xem xét tính năng bổ sung:</strong> Lọc không khí, kháng khuẩn, điều khiển WiFi...</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976d2]">✓</span>
                      <span><strong>Chọn thương hiệu uy tín:</strong> Daikin, Panasonic, LG, Samsung, Toshiba...</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#1976d2]">✓</span>
                      <span><strong>Kiểm tra chế độ bảo hành:</strong> Thường từ 1-2 năm cho cả cục nóng và cục lạnh.</span>
                    </li>
                  </ul>
                </section>

                <section id="power-guide" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">4.</span> Hướng dẫn chọn công suất
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-[#1976d2] text-white">
                          <th className="px-4 py-3 text-left">Công suất</th>
                          <th className="px-4 py-3 text-left">BTU</th>
                          <th className="px-4 py-3 text-left">Diện tích phòng</th>
                          <th className="px-4 py-3 text-left">Phù hợp với</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">1 HP</td>
                          <td className="px-4 py-3">9.000 BTU</td>
                          <td className="px-4 py-3">Dưới 15m²</td>
                          <td className="px-4 py-3">Phòng ngủ nhỏ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">1.5 HP</td>
                          <td className="px-4 py-3">12.000 BTU</td>
                          <td className="px-4 py-3">15-20m²</td>
                          <td className="px-4 py-3">Phòng ngủ, phòng làm việc</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">2 HP</td>
                          <td className="px-4 py-3">18.000 BTU</td>
                          <td className="px-4 py-3">20-30m²</td>
                          <td className="px-4 py-3">Phòng khách</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">2.5 HP</td>
                          <td className="px-4 py-3">24.000 BTU</td>
                          <td className="px-4 py-3">30-40m²</td>
                          <td className="px-4 py-3">Phòng khách lớn, văn phòng</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="brands" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">5.</span> Các thương hiệu máy lạnh uy tín
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Daikin', country: 'Nhật Bản', highlight: 'Bền bỉ, tiết kiệm điện' },
                      { name: 'Panasonic', country: 'Nhật Bản', highlight: 'Làm lạnh nhanh' },
                      { name: 'LG', country: 'Hàn Quốc', highlight: 'Thiết kế đẹp, WiFi' },
                      { name: 'Samsung', country: 'Hàn Quốc', highlight: 'Công nghệ AI' },
                      { name: 'Toshiba', country: 'Nhật Bản', highlight: 'Êm ái, bền' },
                      { name: 'Sharp', country: 'Nhật Bản', highlight: 'Lọc không khí tốt' },
                      { name: 'Casper', country: 'Thái Lan', highlight: 'Giá rẻ, tốt' },
                      { name: 'Midea', country: 'Trung Quốc', highlight: 'Giá rẻ nhất' },
                    ].map((brand) => (
                      <div key={brand.name} className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-gray-900">{brand.name}</div>
                        <div className="text-xs text-gray-500">{brand.country}</div>
                        <div className="text-xs text-[#1976d2] mt-1">{brand.highlight}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="maintenance" className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-[#1976d2]">6.</span> Bảo trì và vệ sinh máy lạnh
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-800 mb-2">⚠️ Lưu ý quan trọng</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Vệ sinh lưới lọc bụi 2-4 tuần/lần</li>
                      <li>• Bảo trì định kỳ 6 tháng - 1 năm/lần</li>
                      <li>• Kiểm tra gas máy lạnh hàng năm</li>
                      <li>• Không để nhiệt độ quá thấp (dưới 20°C) để tiết kiệm điện</li>
                      <li>• Tắt máy khi không sử dụng, dùng hẹn giờ để tiết kiệm điện</li>
                    </ul>
                  </div>
                </section>
              </div>

              {/* Gradient overlay when collapsed */}
              {!isExpanded && (
                <div className="relative h-24 -mt-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}

              {/* Expand/Collapse button */}
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Thu gọn
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Xem thêm
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </article>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
