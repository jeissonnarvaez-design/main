
create table if not exists public.tareas (
  id          bigint generated always as identity primary key,
  titulo      text not null,
  completada  boolean default false,
  user_id     uuid references auth.users default auth.uid(),
  created_at  timestamptz default now()
);

alter table public.tareas enable row level security;

drop policy if exists "ver mis tareas"    on public.tareas;
drop policy if exists "crear mis tareas"  on public.tareas;
drop policy if exists "editar mis tareas" on public.tareas;
drop policy if exists "borrar mis tareas" on public.tareas;

create policy "ver mis tareas" on public.tareas
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "crear mis tareas" on public.tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "editar mis tareas" on public.tareas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "borrar mis tareas" on public.tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.tareas to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tareas'
  ) then
    alter publication supabase_realtime add table public.tareas;
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "ver mis archivos"          on storage.objects;
drop policy if exists "subir a mi carpeta"        on storage.objects;
drop policy if exists "reemplazar mis archivos"   on storage.objects;
drop policy if exists "eliminar mis archivos"     on storage.objects;

create policy "ver mis archivos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
