export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          color: string
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          size: string
          user_id: string
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          size: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          size?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          id: string
          image: string | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          name?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          current_uses: number
          discount_amount: number | null
          discount_percent: number | null
          end_date: string
          id: string
          is_active: boolean
          max_uses: number | null
          minimum_purchase: number | null
          start_date: string
        }
        Insert: {
          code: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percent?: number | null
          end_date: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date: string
        }
        Update: {
          code?: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percent?: number | null
          end_date?: string
          id?: string
          is_active?: boolean
          max_uses?: number | null
          minimum_purchase?: number | null
          start_date?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          banner_image: string | null
          code: string
          created_at: string
          description: string | null
          discount: number | null
          expiry: string
          id: string
          is_active: boolean
          shop_id: string | null
          start_date: string
          title: string
          type: string
        }
        Insert: {
          banner_image?: string | null
          code: string
          created_at?: string
          description?: string | null
          discount?: number | null
          expiry: string
          id?: string
          is_active?: boolean
          shop_id?: string | null
          start_date?: string
          title: string
          type: string
        }
        Update: {
          banner_image?: string | null
          code?: string
          created_at?: string
          description?: string | null
          discount?: number | null
          expiry?: string
          id?: string
          is_active?: boolean
          shop_id?: string | null
          start_date?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      order_coupon_usage: {
        Row: {
          coupon_id: string | null
          created_at: string
          discount_applied: number
          id: string
          order_id: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          discount_applied: number
          id?: string
          order_id: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          discount_applied?: number
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          size?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: string | null
          shipping_address_id: string | null
          shipping_method: string | null
          shop_id: string | null
          status: string
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string | null
          shipping_address_id?: string | null
          shipping_method?: string | null
          shop_id?: string | null
          status: string
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: string | null
          shipping_address_id?: string | null
          shipping_method?: string | null
          shop_id?: string | null
          status?: string
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_requests: {
        Row: {
          business_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          mobile_number: string
          status: string
        }
        Insert: {
          business_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          mobile_number: string
          status?: string
        }
        Update: {
          business_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          mobile_number?: string
          status?: string
        }
        Relationships: []
      }
      platform_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          new_shops: number | null
          new_users: number | null
          total_orders: number | null
          total_revenue: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          new_shops?: number | null
          new_users?: number | null
          total_orders?: number | null
          total_revenue?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          new_shops?: number | null
          new_users?: number | null
          total_orders?: number | null
          total_revenue?: number | null
        }
        Relationships: []
      }
      popular_search_terms: {
        Row: {
          count: number
          created_at: string | null
          id: string
          query: string
        }
        Insert: {
          count?: number
          created_at?: string | null
          id?: string
          query: string
        }
        Update: {
          count?: number
          created_at?: string | null
          id?: string
          query?: string
        }
        Relationships: []
      }
      product_analytics: {
        Row: {
          created_at: string | null
          date: string
          id: string
          product_id: string
          purchases: number | null
          revenue: number | null
          shop_id: string
          views: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          product_id: string
          purchases?: number | null
          revenue?: number | null
          shop_id: string
          views?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          product_id?: string
          purchases?: number | null
          revenue?: number | null
          shop_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_analytics_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number
          id: string
          images: string[] | null
          product_id: string
          rating: number
          review_type: string
          shop_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[] | null
          product_id: string
          rating: number
          review_type?: string
          shop_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          images?: string[] | null
          product_id?: string
          rating?: number
          review_type?: string
          shop_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_view_history: {
        Row: {
          created_at: string
          id: string
          last_viewed_at: string
          product_id: string
          user_id: string
          view_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          product_id: string
          user_id: string
          view_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_viewed_at?: string
          product_id?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_view_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_view_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          colors: string[] | null
          description: string | null
          id: string
          images: string[] | null
          is_new: boolean | null
          is_trending: boolean | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          sale_price: number | null
          shop_id: string | null
          sizes: string[] | null
          stock: number | null
          tags: string[] | null
        }
        Insert: {
          category_id?: string | null
          colors?: string[] | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_new?: boolean | null
          is_trending?: boolean | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          sale_price?: number | null
          shop_id?: string | null
          sizes?: string[] | null
          stock?: number | null
          tags?: string[] | null
        }
        Update: {
          category_id?: string | null
          colors?: string[] | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_new?: boolean | null
          is_trending?: boolean | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          sale_price?: number | null
          shop_id?: string | null
          sizes?: string[] | null
          stock?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          id: string
          query: string
          searched_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          query: string
          searched_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          query?: string
          searched_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shop_admins: {
        Row: {
          created_at: string | null
          id: string
          role: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_admins_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_analytics: {
        Row: {
          conversion_rate: number | null
          created_at: string | null
          date: string
          id: string
          orders: number | null
          revenue: number | null
          shop_id: string
          visitors: number | null
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string | null
          date: string
          id?: string
          orders?: number | null
          revenue?: number | null
          shop_id: string
          visitors?: number | null
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          orders?: number | null
          revenue?: number | null
          shop_id?: string
          visitors?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_analytics_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_follower_details: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          email: string | null
          followed_at: string
          id: string
          shop_id: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          email?: string | null
          followed_at?: string
          id?: string
          shop_id: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          email?: string | null
          followed_at?: string
          id?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_follower_details_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_follows: {
        Row: {
          created_at: string
          id: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_follows_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_sales_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          orders_count: number | null
          sales_amount: number | null
          shop_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          orders_count?: number | null
          sales_amount?: number | null
          shop_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          orders_count?: number | null
          sales_amount?: number | null
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_sales_analytics_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          address: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          followers_count: number | null
          id: string
          is_verified: boolean | null
          logo: string | null
          name: string
          owner_email: string | null
          owner_name: string | null
          password: string | null
          phone_number: string | null
          rating: number | null
          review_count: number | null
          shop_id: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          followers_count?: number | null
          id?: string
          is_verified?: boolean | null
          logo?: string | null
          name: string
          owner_email?: string | null
          owner_name?: string | null
          password?: string | null
          phone_number?: string | null
          rating?: number | null
          review_count?: number | null
          shop_id?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          followers_count?: number | null
          id?: string
          is_verified?: boolean | null
          logo?: string | null
          name?: string
          owner_email?: string | null
          owner_name?: string | null
          password?: string | null
          phone_number?: string | null
          rating?: number | null
          review_count?: number | null
          shop_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          postal_code: string
          state: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          postal_code: string
          state: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          postal_code?: string
          state?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cart_items: {
        Row: {
          added_at: string
          color: string | null
          id: string
          product_id: string
          quantity: number
          saved_for_later: boolean
          size: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          added_at?: string
          color?: string | null
          id?: string
          product_id: string
          quantity?: number
          saved_for_later?: boolean
          size?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          added_at?: string
          color?: string | null
          id?: string
          product_id?: string
          quantity?: number
          saved_for_later?: boolean
          size?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_payment_methods: {
        Row: {
          billing_address_id: string | null
          created_at: string
          expiry_date: string | null
          id: string
          is_default: boolean
          last_four: string | null
          payment_type: string
          provider_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address_id?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          last_four?: string | null
          payment_type: string
          provider_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address_id?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          last_four?: string | null
          payment_type?: string
          provider_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_payment_methods_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          phone: string | null
          preferences: Json
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          phone?: string | null
          preferences?: Json
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          phone?: string | null
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          device_info: Json
          id: string
          ip_address: string | null
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          device_info?: Json
          id?: string
          ip_address?: string | null
          session_end?: string | null
          session_start?: string
          user_id: string
        }
        Update: {
          device_info?: Json
          id?: string
          ip_address?: string | null
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      monthly_shop_analytics: {
        Row: {
          month: string | null
          order_count: number | null
          shop_id: string | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
