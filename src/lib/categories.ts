export interface Product {
  id: string
  code: string
  name: string
  price: number
  rating: number
  category: string
  image: string
  description: string
  details: string
}

export const products: Product[] = [
  {
    id: '1',
    code: 'MS001',
    name: 'Nụ trâm hộp trơn đỏ',
    price: 95000,
    rating: 4.5,
    category: 'Nhang Nu',
    image: '/product-agarwood.jpg',
    description: 'Nụ trâm hộp trơn đỏ - sản phẩm cao cấp từ Đà Nẵng',
    details:
      'Nụ trâm tự nhiên, hộp gỗ đẹp, phù hợp làm quà tặng và thờ cúng. Mùi thơm dịu dàng, lâu bền.',
  },
  {
    id: '2',
    code: 'MS002',
    name: 'Nụ trâm hộp trơn xanh',
    price: 1250000,
    rating: 4.5,
    category: 'Hương/Nhang',
    image: '/product-agarwood.jpg',
    description: 'Nụ trâm hộp trơn xanh - sản phẩm premium',
    details:
      'Nụ trâm nguyên chất, hộp gỗ cao cấp, mùi thơm đặc biệt. Thích hợp cho những dịp quan trọng.',
  },
  {
    id: '3',
    code: 'MS003',
    name: 'Nụ dưỡi muỗi thảo dược',
    price: 1250000,
    rating: 4.5,
    category: 'Tinh dầu',
    image: '/product-agarwood.jpg',
    description: 'Tinh dầu dưỡi muỗi - thảo dược tự nhiên',
    details:
      'Sản phẩm từ thảo dược tự nhiên, giúp xua đuổi muỗi và tạo mùi hương dễ chịu.',
  },
  {
    id: '4',
    code: 'MS004',
    name: 'Vòng trâm hạt tròn',
    price: 500000,
    rating: 4.8,
    category: 'Khác',
    image: '/product-agarwood.jpg',
    description: 'Vòng trâm hạt tròn - trang sức phong thủy',
    details: 'Vòng trâm hạt tròn nguyên chất, mang lại may mắn và bình an.',
  },
  {
    id: '5',
    code: 'MS005',
    name: 'Hộp trâm hương cao cấp',
    price: 2500000,
    rating: 4.9,
    category: 'Nhang Nu',
    image: '/product-agarwood.jpg',
    description: 'Hộp trâm hương cao cấp - bộ sưu tập đặc biệt',
    details:
      'Bộ sưu tập trâm hương cao cấp nhất của chúng tôi, phù hợp làm quà tặng VIP.',
  },
  {
    id: '6',
    code: 'MS006',
    name: 'Trâm hương lẳng',
    price: 750000,
    rating: 4.6,
    category: 'Hương/Nhang',
    image: '/product-agarwood.jpg',
    description: 'Trâm hương lẳng - hương liệu tự nhiên',
    details:
      'Trâm hương nguyên chất ở dạng lẳng, sử dụng với lò điêu hoặc máy xông hương.',
  },
]

export const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'nhang-nu', name: 'Nhang Nu' },
  { id: 'huong-nhang', name: 'Hương/Nhang' },
  { id: 'tinh-dau', name: 'Tinh dầu' },
  { id: 'khac', name: 'Khác' },
]
