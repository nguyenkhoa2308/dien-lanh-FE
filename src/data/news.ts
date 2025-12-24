export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  tags: string[];
}

export const newsCategories = [
  { value: "all", label: "Tất cả" },
  { value: "tips", label: "Mẹo hay" },
  { value: "guide", label: "Hướng dẫn" },
  { value: "news", label: "Tin tức" },
  { value: "review", label: "Đánh giá" },
];

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "huong-dan-chon-mua-may-lanh-phu-hop-2024",
    title: "Hướng dẫn chọn mua máy lạnh phù hợp nhất 2024",
    excerpt:
      "Tổng hợp kiến thức cần biết khi mua máy lạnh: công suất, thương hiệu, tính năng và mẹo tiết kiệm điện.",
    content: `
## 1. Máy lạnh là gì?

Máy lạnh (hay còn gọi là điều hòa không khí, máy điều hòa) là thiết bị điện tử dùng để điều chỉnh nhiệt độ trong phòng, giúp làm mát không khí trong những ngày nóng bức.

## 2. Các loại máy lạnh phổ biến

### Máy lạnh 1 chiều
Chỉ có chức năng làm lạnh, phù hợp với khí hậu nóng quanh năm như Việt Nam.

### Máy lạnh 2 chiều
Có cả chức năng làm lạnh và sưởi ấm, phù hợp với vùng có mùa đông lạnh.

### Máy lạnh Inverter
Công nghệ biến tần giúp tiết kiệm điện 30-50%, hoạt động êm ái.

## 3. Cách chọn công suất phù hợp

| Công suất | BTU | Diện tích |
|-----------|-----|-----------|
| 1 HP | 9.000 BTU | Dưới 15m² |
| 1.5 HP | 12.000 BTU | 15-20m² |
| 2 HP | 18.000 BTU | 20-30m² |
| 2.5 HP | 24.000 BTU | 30-40m² |

## 4. Các thương hiệu uy tín

- **Daikin** (Nhật Bản): Bền bỉ, tiết kiệm điện
- **Panasonic** (Nhật Bản): Làm lạnh nhanh
- **LG** (Hàn Quốc): Thiết kế đẹp, có WiFi
- **Samsung** (Hàn Quốc): Công nghệ AI thông minh
    `,
    thumbnail: "https://images.unsplash.com/photo-1631545806609-35d4ae440431?w=800",
    category: "guide",
    author: "CoolMart",
    publishedAt: "2024-12-20",
    readTime: 8,
    featured: true,
    tags: ["máy lạnh", "hướng dẫn", "mua sắm"],
  },
  {
    id: "2",
    slug: "5-meo-tiet-kiem-dien-khi-su-dung-may-lanh",
    title: "5 mẹo tiết kiệm điện khi sử dụng máy lạnh mùa hè",
    excerpt:
      "Những cách đơn giản giúp bạn giảm đáng kể hóa đơn tiền điện mà vẫn mát mẻ suốt mùa hè.",
    content: `
## 1. Đặt nhiệt độ hợp lý (25-27°C)

Mỗi độ C giảm xuống dưới 25°C sẽ tiêu tốn thêm 3-5% điện năng. Nhiệt độ lý tưởng là 25-27°C.

## 2. Sử dụng quạt kết hợp

Quạt trần hoặc quạt đứng giúp phân tán không khí lạnh đều khắp phòng, cho phép bạn tăng nhiệt độ điều hòa lên 2-3°C mà vẫn cảm thấy mát.

## 3. Vệ sinh định kỳ

Lưới lọc bụi bẩn làm giảm hiệu suất làm lạnh. Vệ sinh 2 tuần/lần để máy hoạt động tối ưu.

## 4. Sử dụng hẹn giờ

Hẹn giờ tắt máy khi ngủ sâu (sau 2-3 tiếng) giúp tiết kiệm đáng kể.

## 5. Che chắn cửa sổ

Rèm cửa, màn che giúp ngăn nhiệt từ ngoài vào, giảm tải cho máy lạnh.
    `,
    thumbnail: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
    category: "tips",
    author: "CoolMart",
    publishedAt: "2024-12-18",
    readTime: 5,
    featured: true,
    tags: ["tiết kiệm điện", "mẹo hay", "mùa hè"],
  },
  {
    id: "3",
    slug: "so-sanh-may-lanh-inverter-va-may-lanh-thuong",
    title: "So sánh máy lạnh Inverter và máy lạnh thường: Nên mua loại nào?",
    excerpt:
      "Phân tích chi tiết ưu nhược điểm của 2 loại máy lạnh phổ biến nhất hiện nay.",
    content: `
## Máy lạnh thường (Non-Inverter)

### Ưu điểm:
- Giá thành rẻ hơn 20-30%
- Chi phí sửa chữa thấp hơn
- Phù hợp nếu ít sử dụng

### Nhược điểm:
- Tốn điện hơn 30-50%
- Hoạt động ồn hơn
- Nhiệt độ không ổn định

## Máy lạnh Inverter

### Ưu điểm:
- Tiết kiệm điện 30-50%
- Hoạt động êm ái
- Nhiệt độ ổn định
- Tuổi thọ cao hơn

### Nhược điểm:
- Giá thành cao hơn
- Chi phí sửa chữa đắt hơn

## Kết luận

Nếu sử dụng thường xuyên (>4 tiếng/ngày), máy lạnh Inverter sẽ hoàn vốn sau 2-3 năm nhờ tiết kiệm điện.
    `,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    category: "review",
    author: "CoolMart",
    publishedAt: "2024-12-15",
    readTime: 6,
    featured: false,
    tags: ["inverter", "so sánh", "đánh giá"],
  },
  {
    id: "4",
    slug: "cach-ve-sinh-may-lanh-tai-nha-don-gian",
    title: "Cách vệ sinh máy lạnh tại nhà đơn giản, ai cũng làm được",
    excerpt:
      "Hướng dẫn từng bước vệ sinh máy lạnh để máy hoạt động hiệu quả và bền bỉ hơn.",
    content: `
## Dụng cụ cần chuẩn bị

- Khăn mềm, khăn khô
- Nước rửa chén hoặc nước vệ sinh điều hòa
- Bàn chải mềm
- Bình xịt nước

## Các bước thực hiện

### Bước 1: Tắt nguồn điện
Rút phích cắm hoặc tắt cầu dao để đảm bảo an toàn.

### Bước 2: Tháo lưới lọc
Mở nắp máy lạnh, tháo lưới lọc bụi ra ngoài.

### Bước 3: Vệ sinh lưới lọc
Dùng nước và bàn chải mềm chải sạch bụi. Để khô tự nhiên.

### Bước 4: Lau dàn lạnh
Dùng khăn ẩm lau nhẹ dàn lạnh, tránh làm cong các cánh tản nhiệt.

### Bước 5: Lắp lại và test
Lắp lưới lọc, bật máy kiểm tra.

## Tần suất vệ sinh

- Lưới lọc: 2-4 tuần/lần
- Dàn lạnh: 3-6 tháng/lần
- Bảo trì tổng thể: 1 năm/lần
    `,
    thumbnail: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    category: "guide",
    author: "CoolMart",
    publishedAt: "2024-12-12",
    readTime: 7,
    featured: false,
    tags: ["vệ sinh", "bảo trì", "hướng dẫn"],
  },
  {
    id: "5",
    slug: "daikin-ra-mat-dong-san-pham-moi-2024",
    title: "Daikin ra mắt dòng sản phẩm mới 2024 với công nghệ tiết kiệm điện vượt trội",
    excerpt:
      "Daikin Việt Nam vừa giới thiệu dòng máy lạnh mới với công nghệ Inverter thế hệ mới.",
    content: `
## Điểm nổi bật của dòng sản phẩm mới

### Công nghệ Inverter thế hệ 5
- Tiết kiệm điện lên đến 60%
- Khởi động nhanh hơn 30%
- Hoạt động siêu êm (chỉ 19dB)

### Tính năng thông minh
- Điều khiển qua smartphone
- Cảm biến thông minh tự điều chỉnh
- Lọc không khí 3 lớp

### Thiết kế mới
- Kiểu dáng thanh lịch
- Màu sắc hiện đại
- Màn hình LED ẩn

## Giá bán tham khảo

- 1HP: từ 12.990.000đ
- 1.5HP: từ 15.990.000đ
- 2HP: từ 21.990.000đ

## Ưu đãi ra mắt

Giảm ngay 2.000.000đ khi mua trong tháng 12/2024.
    `,
    thumbnail: "https://images.unsplash.com/photo-1628744876497-eb30460be9f6?w=800",
    category: "news",
    author: "CoolMart",
    publishedAt: "2024-12-10",
    readTime: 4,
    featured: true,
    tags: ["daikin", "sản phẩm mới", "tin tức"],
  },
  {
    id: "6",
    slug: "top-5-may-lanh-ban-chay-nhat-2024",
    title: "Top 5 máy lạnh bán chạy nhất năm 2024 tại CoolMart",
    excerpt:
      "Điểm danh những model máy lạnh được khách hàng yêu thích và lựa chọn nhiều nhất.",
    content: `
## 1. Daikin FTKZ25VVMV (1HP Inverter)

**Giá: 12.990.000đ**

- Tiết kiệm điện hàng đầu
- Bền bỉ, ít hỏng vặt
- Bảo hành 2 năm

## 2. Panasonic CU/CS-N12XKH-8 (1.5HP Inverter)

**Giá: 11.490.000đ**

- Làm lạnh nhanh với công nghệ Nanoe-X
- Lọc không khí, diệt khuẩn
- Giá tốt

## 3. LG V13WIN (1.5HP Inverter)

**Giá: 13.990.000đ**

- Điều khiển WiFi
- Thiết kế đẹp
- Công nghệ AI

## 4. Samsung AR13CYHAAWKNSV (1.5HP Inverter)

**Giá: 10.990.000đ**

- Giá rẻ nhất phân khúc
- Lọc bụi PM2.5
- Bảo hành 2 năm

## 5. Casper GC-12TL32 (1.5HP Inverter)

**Giá: 8.490.000đ**

- Giá siêu rẻ
- Chất lượng ổn
- Phù hợp ngân sách hạn chế
    `,
    thumbnail: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800",
    category: "review",
    author: "CoolMart",
    publishedAt: "2024-12-08",
    readTime: 5,
    featured: false,
    tags: ["top 5", "bán chạy", "đánh giá"],
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getRelatedArticles(
  currentSlug: string,
  limit: number = 3
): NewsArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return newsArticles.slice(0, limit);

  return newsArticles
    .filter((a) => a.slug !== currentSlug)
    .filter(
      (a) =>
        a.category === current.category ||
        a.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, limit);
}

export function getFeaturedArticles(limit: number = 3): NewsArticle[] {
  return newsArticles.filter((a) => a.featured).slice(0, limit);
}
