
-- =========================================================
-- ENUM: app_role (admin | user)
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =========================================================
-- updated_at trigger function (reusable)
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- TABLE: profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- TABLE: user_roles
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to avoid recursive RLS issues
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- Auto-create profile + default user role on signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- TABLE: products
-- =========================================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock INTEGER NOT NULL DEFAULT 10,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);

-- =========================================================
-- TABLE: orders + order_items
-- =========================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'manual',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  selected_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items from their own orders"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create items for their own orders"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- =========================================================
-- SEED PRODUCTS (11 items from original project)
-- =========================================================
INSERT INTO public.products (id, name, description, price, discount_price, category, image_url, colors, in_stock, stock, specs) VALUES
('case-001',
 '{"az":"Premium Silikon Keys — Qara","ru":"Премиум Силиконовый Чехол — Чёрный","en":"Premium Silicone Case — Black"}',
 '{"az":"Yüksək keyfiyyətli silikon material, əl yaxşı hiss edir.","ru":"Высококачественный силикон.","en":"High-quality silicone material."}',
 25, NULL, 'cases',
 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600&q=80',
 '["#1a1a1a","#1e3a5f","#8b0000"]', true, 12,
 '{"az":["Material: Silikon"],"ru":["Материал: Силикон"],"en":["Material: Silicone"]}'),

('case-002',
 '{"az":"Şəffaf Qoruyucu Keys","ru":"Прозрачный Защитный Чехол","en":"Clear Protective Case"}',
 '{"az":"Ultra şəffaf dizayn.","ru":"Ультрапрозрачный дизайн.","en":"Ultra-clear design."}',
 20, 15, 'cases',
 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80',
 '["transparent"]', true, 18,
 '{"az":["Material: TPU"],"ru":["Материал: ТПУ"],"en":["Material: TPU"]}'),

('case-003',
 '{"az":"Premium Silikon Keys — Göy","ru":"Премиум Силиконовый Чехол — Синий","en":"Premium Silicone Case — Navy"}',
 '{"az":"Dərin göy rəngdə elegant dizayn.","ru":"Элегантный дизайн глубокого синего цвета.","en":"Elegant deep navy design."}',
 30, NULL, 'cases',
 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=600&q=80',
 '["#1e3a5f","#1a1a1a","#2d5016"]', true, 9,
 '{"az":["Material: Silikon + MagSafe"],"ru":["Материал: Силикон + MagSafe"],"en":["Material: Silicone + MagSafe"]}'),

('case-004',
 '{"az":"Dəri Keys — Qırmızı","ru":"Кожаный Чехол — Красный","en":"Leather Case — Red"}',
 '{"az":"Həqiqi dəridən hazırlanmış premium keys.","ru":"Премиум чехол из натуральной кожи.","en":"Premium case made from genuine leather."}',
 45, 35, 'cases',
 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
 '["#8b0000","#4a2c2a","#1a1a1a"]', true, 6,
 '{"az":["Material: Həqiqi Dəri"],"ru":["Материал: Натуральная кожа"],"en":["Material: Genuine Leather"]}'),

('charger-001',
 '{"az":"Simsiz Şarj Stansiyası","ru":"Беспроводная Зарядная Станция","en":"Wireless Charging Pad"}',
 '{"az":"15W sürətli simsiz şarj.","ru":"Быстрая беспроводная зарядка 15 Вт.","en":"15W fast wireless charging."}',
 35, NULL, 'chargers',
 'https://images.unsplash.com/photo-1606293459339-c1755e8a4e98?w=600&q=80',
 '["#f5f5f5","#1a1a1a"]', true, 14,
 '{"az":["Güc: 15W"],"ru":["Мощность: 15 Вт"],"en":["Power: 15W"]}'),

('charger-002',
 '{"az":"20W USB-C Sürətli Adapter","ru":"20W USB-C Быстрый Адаптер","en":"20W USB-C Fast Charger"}',
 '{"az":"Kompakt dizaynlı 20W sürətli şarj adapteri.","ru":"Компактный адаптер быстрой зарядки 20 Вт.","en":"Compact 20W fast charging adapter."}',
 18, 14, 'chargers',
 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
 '["#f5f5f5","#1a1a1a"]', true, 22,
 '{"az":["Güc: 20W"],"ru":["Мощность: 20 Вт"],"en":["Power: 20W"]}'),

('charger-003',
 '{"az":"Avtomobil Şarj Cihazı","ru":"Автомобильное Зарядное Устройство","en":"Car Charger"}',
 '{"az":"İkili USB portlu avtomobil şarj cihazı.","ru":"Автомобильное зарядное с двумя USB-портами.","en":"Dual USB port car charger."}',
 22, NULL, 'chargers',
 'https://images.unsplash.com/photo-1620678977026-25c43f1bba9b?w=600&q=80',
 '["#1a1a1a"]', true, 16,
 '{"az":["İkili USB-A portlu"],"ru":["Два USB-A порта"],"en":["Dual USB-A ports"]}'),

('charger-004',
 '{"az":"MagSafe Şarj","ru":"MagSafe Зарядка","en":"MagSafe Charger"}',
 '{"az":"Maqnit ilə bərkidilən simsiz şarj.","ru":"Магнитная беспроводная зарядка.","en":"Magnetic wireless charger."}',
 40, 32, 'chargers',
 'https://images.unsplash.com/photo-1659095739263-f2cce95dc6d6?w=600&q=80',
 '["#f5f5f5"]', true, 8,
 '{"az":["MagSafe uyğun"],"ru":["MagSafe совместимый"],"en":["MagSafe compatible"]}'),

('cable-001',
 '{"az":"USB-C Kabel — Qara","ru":"USB-C Кабель — Чёрный","en":"USB-C Cable — Black"}',
 '{"az":"Davamlı 1m USB-C kabel.","ru":"Прочный кабель USB-C 1м.","en":"Durable 1m USB-C cable."}',
 12, NULL, 'cables',
 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=600&q=80',
 '["#1a1a1a","#f5f5f5"]', true, 30,
 '{"az":["Uzunluq: 1m"],"ru":["Длина: 1м"],"en":["Length: 1m"]}'),

('cable-002',
 '{"az":"Lightning Kabel","ru":"Lightning Кабель","en":"Lightning Cable"}',
 '{"az":"Apple sertifikatlı Lightning kabel.","ru":"Сертифицированный Apple Lightning кабель.","en":"Apple-certified Lightning cable."}',
 15, 10, 'cables',
 'https://images.unsplash.com/photo-1583394293214-28a4b0025e35?w=600&q=80',
 '["#f5f5f5","#1a1a1a"]', true, 25,
 '{"az":["MFi sertifikatlı"],"ru":["MFi сертифицированный"],"en":["MFi certified"]}'),

('cable-003',
 '{"az":"3-in-1 Kabel","ru":"3-в-1 Кабель","en":"3-in-1 Cable"}',
 '{"az":"USB-C, Lightning və Micro-USB bir kabeldə.","ru":"USB-C, Lightning и Micro-USB в одном.","en":"USB-C, Lightning and Micro-USB in one."}',
 18, 13, 'cables',
 'https://images.unsplash.com/photo-1619262943126-8c1eebd4a9b5?w=600&q=80',
 '["#1a1a1a"]', true, 20,
 '{"az":["3 konnektor"],"ru":["3 коннектора"],"en":["3 connectors"]}');
