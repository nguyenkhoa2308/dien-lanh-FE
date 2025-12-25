import Link from 'next/link';

export const metadata = {
  title: 'Bảo hành & Bảo dưỡng - Hùng Thành',
  description: 'Chính sách bảo hành và dịch vụ bảo dưỡng máy lạnh tại Hùng Thành',
};

const warrantyPolicies = [
  {
    brand: 'Daikin',
    compressor: '5 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Panasonic',
    compressor: '5 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'LG',
    compressor: '10 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Samsung',
    compressor: '10 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Toshiba',
    compressor: '5 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Sharp',
    compressor: '5 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Casper',
    compressor: '3 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
  {
    brand: 'Midea',
    compressor: '3 năm',
    parts: '2 năm',
    labor: '1 năm',
  },
];

const maintenanceServices = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: 'Vệ sinh máy lạnh',
    description: 'Vệ sinh dàn lạnh, dàn nóng, lưới lọc, kiểm tra gas',
    price: '150.000đ - 300.000đ',
    duration: '30-60 phút',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    title: 'Bảo dưỡng định kỳ',
    description: 'Kiểm tra toàn diện, vệ sinh, bơm gas, thay linh kiện hao mòn',
    price: '300.000đ - 500.000đ',
    duration: '60-90 phút',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      </svg>
    ),
    title: 'Nạp gas lạnh',
    description: 'Kiểm tra rò rỉ, nạp gas theo tiêu chuẩn nhà sản xuất',
    price: '200.000đ - 400.000đ',
    duration: '30-45 phút',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
      </svg>
    ),
    title: 'Sửa chữa máy lạnh',
    description: 'Khắc phục các lỗi kỹ thuật, thay thế linh kiện hỏng',
    price: 'Tùy lỗi',
    duration: 'Tùy lỗi',
  },
];

const faqs = [
  {
    question: 'Khi nào cần bảo dưỡng máy lạnh?',
    answer: 'Nên bảo dưỡng máy lạnh định kỳ 6 tháng - 1 năm/lần hoặc khi máy có dấu hiệu: làm lạnh yếu, có mùi hôi, tiếng ồn bất thường, tiêu thụ điện nhiều hơn bình thường.',
  },
  {
    question: 'Điều kiện để được bảo hành miễn phí?',
    answer: 'Sản phẩm còn trong thời hạn bảo hành, có hóa đơn mua hàng và phiếu bảo hành hợp lệ, lỗi do nhà sản xuất (không phải do người dùng gây ra), tem bảo hành còn nguyên vẹn.',
  },
  {
    question: 'Thời gian khắc phục sự cố là bao lâu?',
    answer: 'Với các lỗi thông thường, kỹ thuật viên sẽ khắc phục trong ngày. Trường hợp cần thay thế linh kiện đặc biệt, thời gian có thể từ 2-5 ngày tùy tình trạng.',
  },
  {
    question: 'Hùng Thành có hỗ trợ bảo hành tại nhà không?',
    answer: 'Có, Hùng Thành cung cấp dịch vụ bảo hành tại nhà hoàn toàn miễn phí trong thời gian bảo hành. Khách hàng chỉ cần đặt lịch hẹn qua hotline 0779 886 666.',
  },
  {
    question: 'Chi phí di chuyển có tính riêng không?',
    answer: 'Miễn phí di chuyển trong phạm vi 20km từ chi nhánh gần nhất. Ngoài phạm vi này sẽ tính phí 10.000đ/km.',
  },
];

export default function WarrantyPage() {
  return (
    <>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[var(--primary)] via-[var(--primary-dark)] to-[#001a4d] text-white py-16 md:py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bảo hành & Bảo dưỡng</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Cam kết bảo hành chính hãng và dịch vụ bảo dưỡng chuyên nghiệp cho mọi sản phẩm
            </p>
          </div>
        </section>

        {/* Warranty Policy Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
                Chính sách bảo hành
              </span>
              <h2 className="text-3xl font-bold text-[var(--gray-900)] mt-3">
                Bảo hành theo từng thương hiệu
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--primary)] text-white">
                    <th className="px-6 py-4 text-left font-semibold rounded-tl-xl">Thương hiệu</th>
                    <th className="px-6 py-4 text-center font-semibold">Máy nén</th>
                    <th className="px-6 py-4 text-center font-semibold">Linh kiện</th>
                    <th className="px-6 py-4 text-center font-semibold rounded-tr-xl">Công lắp đặt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--gray-200)]">
                  {warrantyPolicies.map((policy, index) => (
                    <tr key={index} className="hover:bg-[var(--gray-50)] transition-colors">
                      <td className="px-6 py-4 font-semibold text-[var(--gray-900)]">{policy.brand}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] font-medium rounded-full text-sm">
                          {policy.compressor}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] font-medium rounded-full text-sm">
                          {policy.parts}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-[var(--gray-100)] text-[var(--gray-700)] font-medium rounded-full text-sm">
                          {policy.labor}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-xl">
              <h4 className="font-semibold text-[var(--gray-900)] flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[var(--warning)]">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                </svg>
                Lưu ý quan trọng
              </h4>
              <ul className="space-y-2 text-sm text-[var(--gray-700)]">
                <li>• Bảo hành chỉ áp dụng khi sản phẩm được lắp đặt bởi kỹ thuật viên Hùng Thành hoặc đại lý ủy quyền</li>
                <li>• Không áp dụng bảo hành cho các trường hợp hư hỏng do thiên tai, sử dụng sai cách, hoặc tự ý sửa chữa</li>
                <li>• Vui lòng giữ hóa đơn mua hàng và phiếu bảo hành trong suốt thời gian bảo hành</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Maintenance Services Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
                Dịch vụ bảo dưỡng
              </span>
              <h2 className="text-3xl font-bold text-[var(--gray-900)] mt-3">
                Chăm sóc máy lạnh chuyên nghiệp
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {maintenanceServices.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center text-[var(--primary)] mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)] mb-2">{service.title}</h3>
                  <p className="text-sm text-[var(--gray-600)] mb-4">{service.description}</p>
                  <div className="space-y-2 pt-4 border-t border-[var(--gray-100)]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--gray-500)]">Chi phí:</span>
                      <span className="font-semibold text-[var(--accent)]">{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--gray-500)]">Thời gian:</span>
                      <span className="font-medium text-[var(--gray-700)]">{service.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/lien-he" className="btn btn-primary">
                Đặt lịch bảo dưỡng ngay
              </Link>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
                Quy trình
              </span>
              <h2 className="text-3xl font-bold text-[var(--gray-900)] mt-3">
                Quy trình bảo hành - bảo dưỡng
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Liên hệ', desc: 'Gọi hotline hoặc đặt lịch online' },
                { step: '02', title: 'Tiếp nhận', desc: 'Nhân viên ghi nhận và xác nhận lịch hẹn' },
                { step: '03', title: 'Xử lý', desc: 'Kỹ thuật viên đến kiểm tra và xử lý' },
                { step: '04', title: 'Hoàn tất', desc: 'Nghiệm thu và bàn giao' },
              ].map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-[var(--gray-900)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--gray-600)]">{item.desc}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-[var(--gray-200)]">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--gray-300)] rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="text-3xl font-bold text-[var(--gray-900)] mt-3">
                Câu hỏi thường gặp
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[var(--gray-900)] hover:bg-[var(--gray-50)]">
                    <span>{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-[var(--gray-500)] transition-transform group-open:rotate-180"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-[var(--gray-600)] leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cần hỗ trợ bảo hành hoặc bảo dưỡng?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Liên hệ ngay để được hỗ trợ nhanh chóng từ đội ngũ kỹ thuật viên chuyên nghiệp
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+84779886666" className="btn bg-white text-[var(--primary)] hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" clipRule="evenodd" />
                </svg>
                Gọi ngay 0779 886 666
              </a>
              <Link href="/lien-he" className="btn btn-secondary border-white text-white hover:bg-white hover:text-[var(--primary)]">
                Đặt lịch online
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
