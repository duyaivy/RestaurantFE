export type NormalizedOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  note?: string;
  status?: string;
};

export type NormalizedOrder = {
  id: number;
  status: string;
  totalAmount: number;
  createdAtTs: number;
  items: NormalizedOrderItem[];
};

export type StatusUI = {
  label: string;
  className: string;
  dotClassName: string;
};
