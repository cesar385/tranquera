-- Tranquera: datos en la nube por empresa
create extension if not exists pgcrypto;

create table public.orgs(
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  lic jsonb,
  creado_por uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);
create table public.miembros(
  org_id uuid not null references public.orgs on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  nombre text not null default '',
  email text not null default '',
  rol text not null default 'Colaborador' check (rol in ('Administrador','Administrador con finanzas','Colaborador','Solo carga de datos','Solo lectura')),
  alta timestamptz not null default now(),
  primary key(org_id,user_id)
);
create index miembros_user_idx on public.miembros(user_id);
create table public.invitaciones(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs on delete cascade,
  email text not null,
  nombre text not null default '',
  rol text not null default 'Colaborador',
  creado timestamptz not null default now(),
  unique(org_id,email)
);
create index invitaciones_email_idx on public.invitaciones(lower(email));
create table public.campos(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.orgs on delete cascade,
  nombre text not null,
  data jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by text not null default ''
);
create index campos_org_idx on public.campos(org_id);
create table public.tg_links(
  chat_id bigint primary key,
  org_id uuid not null references public.orgs on delete cascade,
  campo_id uuid references public.campos on delete set null,
  user_id uuid not null references auth.users on delete cascade,
  nombre text not null default '',
  tg_usuario text not null default '',
  undo jsonb,
  creado timestamptz not null default now()
);
create index tg_links_org_idx on public.tg_links(org_id);
create table public.tg_codigos(
  codigo text primary key,
  org_id uuid not null references public.orgs on delete cascade,
  campo_id uuid references public.campos on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  expira timestamptz not null
);
create table public.tg_log(
  id bigint generated always as identity primary key,
  org_id uuid not null references public.orgs on delete cascade,
  chat_id bigint,
  quien text not null default '',
  texto text not null default '',
  resp text not null default '',
  creado timestamptz not null default now()
);
create index tg_log_org_idx on public.tg_log(org_id, creado desc);

-- funciones de permisos
create or replace function public.mis_orgs() returns setof uuid language sql stable security definer set search_path=public as $$
  select org_id from miembros where user_id = auth.uid()
$$;
create or replace function public.mi_rol(p_org uuid) returns text language sql stable security definer set search_path=public as $$
  select rol from miembros where user_id = auth.uid() and org_id = p_org
$$;
create or replace function public.es_admin(p_org uuid) returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.mi_rol(p_org) in ('Administrador','Administrador con finanzas'), false)
$$;
create or replace function public.es_editor(p_org uuid) returns boolean language sql stable security definer set search_path=public as $$
  select coalesce(public.mi_rol(p_org) <> 'Solo lectura', false)
$$;

alter table public.orgs enable row level security;
alter table public.miembros enable row level security;
alter table public.invitaciones enable row level security;
alter table public.campos enable row level security;
alter table public.tg_links enable row level security;
alter table public.tg_codigos enable row level security;
alter table public.tg_log enable row level security;

create policy orgs_ver on public.orgs for select to authenticated using (id in (select public.mis_orgs()));
create policy orgs_editar on public.orgs for update to authenticated using (public.es_admin(id)) with check (public.es_admin(id));
revoke update on public.orgs from authenticated, anon;
grant update (nombre) on public.orgs to authenticated;

create policy miembros_ver on public.miembros for select to authenticated using (org_id in (select public.mis_orgs()));
create policy miembros_editar on public.miembros for update to authenticated using (public.es_admin(org_id)) with check (public.es_admin(org_id));
create policy miembros_quitar on public.miembros for delete to authenticated using (public.es_admin(org_id) and user_id <> auth.uid());
revoke update on public.miembros from authenticated, anon;
grant update (rol, nombre) on public.miembros to authenticated;

create policy inv_ver on public.invitaciones for select to authenticated using (public.es_admin(org_id) or lower(email) = lower(coalesce(auth.jwt()->>'email','')));
create policy inv_borrar on public.invitaciones for delete to authenticated using (public.es_admin(org_id));

create policy campos_ver on public.campos for select to authenticated using (org_id in (select public.mis_orgs()));
create policy campos_borrar on public.campos for delete to authenticated using (public.es_admin(org_id));
revoke insert, update on public.campos from authenticated, anon;

create policy tg_ver on public.tg_links for select to authenticated using (org_id in (select public.mis_orgs()));
create policy tg_quitar on public.tg_links for delete to authenticated using (public.es_admin(org_id) or user_id = auth.uid());
revoke update, insert on public.tg_links from authenticated, anon;
revoke all on public.tg_codigos from authenticated, anon;
create policy tglog_ver on public.tg_log for select to authenticated using (org_id in (select public.mis_orgs()));
revoke insert, update, delete on public.tg_log from authenticated, anon;

-- crear empresa con su primer campo
create or replace function public.crear_org(p_org text, p_campo text, p_data jsonb, p_nombre text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_org uuid; v_campo uuid; v_email text;
begin
  if auth.uid() is null then raise exception 'sin sesion'; end if;
  select email into v_email from auth.users where id = auth.uid();
  insert into orgs(nombre, creado_por) values (coalesce(nullif(trim(p_org),''),'Mi empresa'), auth.uid()) returning id into v_org;
  insert into miembros(org_id,user_id,nombre,email,rol) values (v_org, auth.uid(), coalesce(nullif(trim(p_nombre),''), split_part(v_email,'@',1)), v_email, 'Administrador con finanzas');
  insert into campos(org_id,nombre,data,updated_by) values (v_org, coalesce(nullif(trim(p_campo),''),'Mi campo'), coalesce(p_data,'{}'::jsonb), coalesce(p_nombre,'')) returning id into v_campo;
  return jsonb_build_object('org', v_org, 'campo', v_campo);
end $$;

-- mis empresas e invitaciones pendientes
create or replace function public.mi_cuenta() returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'orgs', coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'nombre',o.nombre,'lic',o.lic,'created_at',o.created_at,'rol',m.rol,'nombre_miembro',m.nombre) order by o.created_at)
             from miembros m join orgs o on o.id = m.org_id where m.user_id = auth.uid()), '[]'::jsonb),
    'invitaciones', coalesce((select jsonb_agg(jsonb_build_object('org',i.org_id,'org_nombre',o.nombre,'rol',i.rol,'nombre',i.nombre))
             from invitaciones i join orgs o on o.id = i.org_id where lower(i.email) = lower(coalesce(auth.jwt()->>'email',''))), '[]'::jsonb))
$$;

create or replace function public.aceptar_invitacion(p_org uuid) returns void language plpgsql security definer set search_path=public as $$
declare v_inv invitaciones; v_email text;
begin
  select email into v_email from auth.users where id = auth.uid();
  select * into v_inv from invitaciones where org_id = p_org and lower(email) = lower(v_email);
  if not found then raise exception 'sin invitacion'; end if;
  insert into miembros(org_id,user_id,nombre,email,rol) values (p_org, auth.uid(), coalesce(nullif(v_inv.nombre,''), split_part(v_email,'@',1)), v_email, v_inv.rol)
    on conflict (org_id,user_id) do update set rol = excluded.rol;
  delete from invitaciones where id = v_inv.id;
end $$;

create or replace function public.invitar(p_org uuid, p_email text, p_rol text, p_nombre text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not public.es_admin(p_org) then raise exception 'sin permiso'; end if;
  if p_rol not in ('Administrador','Administrador con finanzas','Colaborador','Solo carga de datos','Solo lectura') then raise exception 'rol invalido'; end if;
  insert into invitaciones(org_id,email,rol,nombre) values (p_org, lower(trim(p_email)), p_rol, coalesce(p_nombre,''))
    on conflict (org_id,email) do update set rol = excluded.rol, nombre = excluded.nombre;
end $$;

-- campos
create or replace function public.crear_campo(p_org uuid, p_nombre text, p_data jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare v uuid;
begin
  if not public.es_admin(p_org) then raise exception 'sin permiso'; end if;
  insert into campos(org_id,nombre,data,updated_by) values (p_org, coalesce(nullif(trim(p_nombre),''),'Campo'), coalesce(p_data,'{}'::jsonb),
    coalesce((select nombre from miembros where org_id=p_org and user_id=auth.uid()),'')) returning id into v;
  return v;
end $$;

create or replace function public.guardar_campo(p_id uuid, p_data jsonb, p_version integer) returns integer language plpgsql security definer set search_path=public as $$
declare v_org uuid; v_new integer;
begin
  select org_id into v_org from campos where id = p_id;
  if v_org is null then raise exception 'campo inexistente'; end if;
  if not public.es_editor(v_org) then raise exception 'sin permiso'; end if;
  update campos set data = p_data, version = version + 1, updated_at = now(),
     nombre = coalesce(nullif(p_data->>'establecimiento',''), nombre),
     updated_by = coalesce((select nombre from miembros where org_id = v_org and user_id = auth.uid()),'')
   where id = p_id and version = p_version returning version into v_new;
  if v_new is null then raise exception 'conflicto' using errcode = 'P0001', hint = 'version'; end if;
  return v_new;
end $$;

-- código de un uso para vincular Telegram (vale 30 minutos)
create or replace function public.crear_codigo_tg(p_org uuid, p_campo uuid) returns text language plpgsql security definer set search_path=public as $$
declare v text;
begin
  if p_org not in (select public.mis_orgs()) then raise exception 'sin permiso'; end if;
  delete from tg_codigos where expira < now() or (user_id = auth.uid() and org_id = p_org);
  v := upper(substr(encode(gen_random_bytes(6),'hex'),1,10));
  insert into tg_codigos(codigo,org_id,campo_id,user_id,expira) values (v, p_org, p_campo, auth.uid(), now() + interval '30 minutes');
  return v;
end $$;

revoke execute on all functions in schema public from public, anon;
grant execute on function public.mis_orgs(), public.mi_rol(uuid), public.es_admin(uuid), public.es_editor(uuid) to authenticated;
grant execute on all functions in schema public to service_role;
grant execute on function public.crear_org(text,text,jsonb,text), public.mi_cuenta(), public.aceptar_invitacion(uuid), public.invitar(uuid,text,text,text),
  public.crear_campo(uuid,text,jsonb), public.guardar_campo(uuid,jsonb,integer), public.crear_codigo_tg(uuid,uuid) to authenticated;

-- avisos en vivo cuando otro dispositivo o el bot actualizan un campo
alter publication supabase_realtime add table public.campos;
