import { GraphQLClient } from 'graphql-request';
import { Product, Category } from '@/types';

// GraphQL endpoint
export const graphQLClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_URL ?? '',
  {
    credentials: 'include',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  }
);

// REST client (fallback when GraphQL is unavailable)
export class RestClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL ?? '') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const query = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const url = query
      ? `${this.baseUrl}${path}?${query}`
      : `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  }
}

export const apiClient = new RestClient();

export const GET_PRODUCTS = `
  query GetProducts($limit: Int, $offset: Int, $category: String, $search: String) {
    products(limit: $limit, offset: $offset, category: $category, search: $search) {
      id
      slug
      title
      price
      currency
      thumbnail
      inStock
      rating
      reviewCount
      vendorId
      attributes
    }
  }
`;

export const GET_PRODUCT = `
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      slug
      title
      description
      price
      originalPrice
      currency
      images
      thumbnail
      inStock
      stockQuantity
      inventoryPolicy
      rating
      reviewCount
      tags
      vendorId
      categoryId
      attributes
      seo {
        title
        description
        keywords
        openGraph {
          title
          description
          image
          url
        }
      }
    }
  }
`;

export const GET_CATEGORIES = `
  query GetCategories {
    categories {
      id
      name
      slug
      parentId
      children {
        id
        name
        slug
      }
    }
  }
`;

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function fetchProducts(
  params?: Record<string, unknown>
): Promise<PaginatedProducts> {
  const variables = {
    limit: 12,
    offset: 0,
    ...params,
  };

  try {
    const data = await graphQLClient.request<{
      products: Product[];
      total: number;
    }>(GET_PRODUCTS, variables);

    const perPage = variables.limit as number;
    const offset = variables.offset as number;

    return {
      items: data.products,
      page: Math.floor(offset / perPage) + 1,
      perPage,
      total: data.total,
      totalPages: Math.ceil(data.total / perPage),
    };
  } catch (error) {
    console.warn('GraphQL failed, falling back to REST:', error);

    const restData = await apiClient.get<{
      items: Product[];
      total: number;
      page: number;
      perPage: number;
    }>('/api/products', variables);

    return {
      items: restData.items,
      page: restData.page,
      perPage: restData.perPage,
      total: restData.total,
      totalPages: Math.ceil(restData.total / restData.perPage),
    };
  }
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const data = await graphQLClient.request<{ product: Product }>(GET_PRODUCT, {
      slug,
    });
    return data.product;
  } catch (error) {
    console.warn('GraphQL failed, falling back to REST:', error);
    try {
      const product = await apiClient.get<Product>(`/api/products/${slug}`);
      return product;
    } catch {
      return null;
    }
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await graphQLClient.request<{ categories: Category[] }>(
      GET_CATEGORIES
    );
    return data.categories;
  } catch (error) {
    console.warn('GraphQL failed, falling back to REST:', error);
    return apiClient.get<Category[]>('/api/categories');
  }
}
