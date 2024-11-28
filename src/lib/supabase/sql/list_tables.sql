create or replace function list_tables()
returns table (table_name text)
language plpgsql
security definer
as $$
begin
  return query
  select t.table_name::text
  from information_schema.tables t
  where t.table_schema = 'public'
  and t.table_type = 'BASE TABLE';
end;
$$;
