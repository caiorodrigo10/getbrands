create or replace function list_columns(table_name text)
returns table (
  column_name text,
  data_type text,
  is_nullable boolean
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text = 'YES' as is_nullable
  from information_schema.columns c
  where c.table_schema = 'public'
  and c.table_name = list_columns.table_name;
end;
$$;
