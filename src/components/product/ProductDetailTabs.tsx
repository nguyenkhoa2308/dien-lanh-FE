'use client';

import { useState, useMemo } from 'react';
import { marked } from 'marked';
import { formatNumber } from '@/lib/utils';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface Attribute {
  id: string;
  attribute: {
    id: string;
    name: string;
    displayGroup?: string;
    displayOrder?: number;
  };
  value: string;
}

interface ProductDetailTabsProps {
  productName: string;
  typeLabel: string;
  roomSize: string;
  brandLabel: string;
  featureList: Array<{ label: string; description: string }>;
  ratingCount: number;
  description?: string;
  attributes?: Attribute[];
}

interface SpecsAccordionProps {
  attributes: Attribute[];
}

// Check if value should be highlighted (blue color)
function isHighlightValue(value: string): boolean {
  const highlightKeywords = ['inverter', 'có', 'r-32', 'r32', 'hp', 'btu', 'chiều', 'wifi', 'ion', 'plasma'];
  const lowerValue = value.toLowerCase();
  return highlightKeywords.some(keyword => lowerValue.includes(keyword));
}

// Check if section is "Tiện ích" type (should display vertically)
function isUtilitySection(title: string): boolean {
  const utilityKeywords = ['tiện ích', 'tính năng', 'công nghệ'];
  return utilityKeywords.some(keyword => title.toLowerCase().includes(keyword));
}

function SpecsAccordion({ attributes }: SpecsAccordionProps) {
  // Group attributes by displayGroup field and sort by displayOrder
  const groupedAttributes = useMemo(() => {
    const groups: Record<string, Attribute[]> = {};

    // Sort attributes by displayOrder first
    const sortedAttrs = [...attributes].sort((a, b) =>
      (a.attribute.displayOrder || 0) - (b.attribute.displayOrder || 0)
    );

    sortedAttrs.forEach(attr => {
      const groupName = attr.attribute.displayGroup || 'Thông tin sản phẩm';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(attr);
    });

    return Object.entries(groups).map(([title, items], index) => ({
      id: `group-${index}`,
      title,
      items: items.map(item => ({ label: item.attribute.name, value: item.value })),
    }));
  }, [attributes]);

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    // Only open "Thông tin sản phẩm" by default (first group)
    const firstGroup = groupedAttributes.find(g => g.title === 'Thông tin sản phẩm');
    return new Set(firstGroup ? [firstGroup.id] : []);
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (groupedAttributes.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6 sm:py-8 text-xs sm:text-sm">Chưa có thông số chi tiết</p>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {groupedAttributes.map((section) => {
        const isOpen = openSections.has(section.id);
        const isUtility = isUtilitySection(section.title);

        return (
          <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <h4 className="text-sm font-bold text-gray-900">{section.title}</h4>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ease-out ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Section Content with smooth animation */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-3 sm:px-5 pb-3 sm:pb-4">
                  {isUtility ? (
                    // Utility section: display vertically
                    <div className="space-y-2 sm:space-y-3">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3 py-1.5 sm:py-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{item.label}</span>
                            {item.value && item.value !== 'Có' && item.value !== 'có' && (
                              <span className="text-xs sm:text-sm text-gray-600 ml-1 break-words">- {item.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Regular section: display as table
                    <div className="divide-y divide-gray-100">
                      {section.items.map((item, idx) => (
                        <div key={idx} className="flex py-2 sm:py-3 gap-2 sm:gap-4">
                          <span className="text-xs sm:text-sm font-medium text-gray-700 w-[35%] sm:w-2/5 flex-shrink-0 break-words">{item.label}:</span>
                          <span className={`text-xs sm:text-sm flex-1 break-words ${isHighlightValue(item.value) ? 'text-[#1976d2]' : 'text-gray-900'}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ProductDetailTabs({
  typeLabel,
  ratingCount,
  description,
  attributes = [],
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'qna'>('description');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`flex-1 min-w-0 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'description'
              ? 'text-white bg-gradient-to-r from-[var(--primary)] to-blue-600'
              : 'text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Mô tả sản phẩm</span>
          <span className="sm:hidden">Mô tả</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`flex-1 min-w-0 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'specs'
              ? 'text-white bg-gradient-to-r from-[var(--primary)] to-blue-600'
              : 'text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Thông số chi tiết</span>
          <span className="sm:hidden">Thông số</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 min-w-0 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'text-white bg-gradient-to-r from-[var(--primary)] to-blue-600'
              : 'text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Đánh giá ({formatNumber(ratingCount)})</span>
          <span className="sm:hidden">Đánh giá</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('qna')}
          className={`flex-1 min-w-0 px-2 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'qna'
              ? 'text-white bg-gradient-to-r from-[var(--primary)] to-blue-600'
              : 'text-gray-600 hover:text-[var(--primary)] hover:bg-gray-50'
          }`}
        >
          <span className="hidden sm:inline">Hỏi & Đáp</span>
          <span className="sm:hidden">Hỏi đáp</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-8">
        {/* Product Description Tab */}
        {activeTab === 'description' && (
          <div className="markdown-content animate-fade-in">
            {description ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(description.replace(/\\n/g, '\n')) as string
                }}
              />
            ) : (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-xs sm:text-sm">Chưa có mô tả sản phẩm</p>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && (
          <div className="animate-fade-in">
            <SpecsAccordion attributes={attributes} />
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Đánh giá từ khách hàng</h3>
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p className="text-sm sm:text-lg font-medium">Chưa có đánh giá nào</p>
              <p className="text-xs sm:text-sm mt-2">Hãy là người đầu tiên đánh giá sản phẩm này</p>
            </div>
          </div>
        )}

        {/* Q&A Tab */}
        {activeTab === 'qna' && (
          <div className="animate-fade-in">
            <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Câu hỏi thường gặp</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Sản phẩm có bảo hành bao lâu?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Sản phẩm được bảo hành chính hãng 24 tháng toàn quốc. Trong thời gian bảo hành,
                  quý khách sẽ được sửa chữa miễn phí linh kiện nếu có lỗi do nhà sản xuất.
                  Máy nén được bảo hành riêng từ 5-10 năm tùy model.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Chi phí lắp đặt là bao nhiêu?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Lắp đặt hoàn toàn miễn phí trong nội thành (bao gồm ống đồng 3m, dây điện cơ bản).
                  Đối với khu vực ngoại thành, sẽ có phụ phí vận chuyển và lắp đặt tùy theo khoảng cách.
                  Vật tư phát sinh sẽ được báo giá trước khi thi công.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Thời gian giao hàng mất bao lâu?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Đơn hàng nội thành sẽ được giao trong vòng 2-4 giờ. Đơn hàng ngoại thành
                  và tỉnh thành khác sẽ được giao trong 1-3 ngày làm việc tùy khu vực.
                  Bạn có thể lựa chọn lắp đặt ngay hoặc hẹn lịch thuận tiện.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Máy lạnh Inverter tiết kiệm điện như thế nào?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Máy lạnh {typeLabel} tiết kiệm điện bằng cách điều chỉnh tốc độ máy nén liên tục
                  thay vì bật/tắt liên tục như máy thường. Điều này giúp tiết kiệm đến 40-60% điện năng,
                  duy trì nhiệt độ ổn định và kéo dài tuổi thọ máy nén gấp 1.5 lần.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Tôi có thể trả góp không?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của các ngân hàng
                  (Sacombank, VPBank, FE Credit, Home Credit...). Thủ tục đơn giản, duyệt nhanh
                  chỉ cần CMND/CCCD. Bạn cũng có thể trả góp qua công ty tài chính với nhiều gói
                  lãi suất ưu đãi.
                </p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <h4 className="font-bold text-gray-900 mb-2 flex items-start gap-2 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Nên bảo dưỡng máy lạnh bao lâu một lần?
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 ml-6 sm:ml-7">
                  Nên vệ sinh bảo dưỡng máy lạnh 3-4 tháng/lần để đảm bảo hiệu suất tối ưu và
                  tiết kiệm điện. Chúng tôi cung cấp dịch vụ bảo dưỡng định kỳ với giá ưu đãi,
                  bao gồm vệ sinh dàn lạnh, dàn nóng, thay gas (nếu cần), kiểm tra hệ thống điện.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
