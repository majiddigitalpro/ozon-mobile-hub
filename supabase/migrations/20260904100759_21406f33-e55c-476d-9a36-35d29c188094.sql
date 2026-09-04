CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.products (
  id text PRIMARY KEY,
  brand text NOT NULL,
  name text NOT NULL,
  condition text NOT NULL DEFAULT 'new',
  price numeric,
  original_price numeric,
  storage integer[] NOT NULL DEFAULT '{}',
  ram integer[] NOT NULL DEFAULT '{}',
  colours text[] NOT NULL DEFAULT '{}',
  os text NOT NULL DEFAULT 'Android',
  five_g boolean NOT NULL DEFAULT true,
  display_inches numeric NOT NULL DEFAULT 6.5,
  battery integer NOT NULL DEFAULT 5000,
  main_camera_mp integer NOT NULL DEFAULT 50,
  key_spec text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  branches text[] NOT NULL DEFAULT '{}',
  finance_available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  popular boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published products" ON public.products
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all products" ON public.products
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.accessories (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  price numeric,
  image_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.accessories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accessories TO authenticated;
GRANT ALL ON public.accessories TO service_role;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published accessories" ON public.accessories
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can view all accessories" ON public.accessories
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert accessories" ON public.accessories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update accessories" ON public.accessories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete accessories" ON public.accessories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER accessories_updated_at BEFORE UPDATE ON public.accessories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  branches text[] NOT NULL DEFAULT '{}',
  expires_on date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active offers" ON public.offers
  FOR SELECT USING (active = true);
CREATE POLICY "Admins can view all offers" ON public.offers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert offers" ON public.offers
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update offers" ON public.offers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete offers" ON public.offers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();