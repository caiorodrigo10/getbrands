-- Função para executar SQL dinâmico
create or replace function exec_sql(sql text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  execute format('select array_to_json(array_agg(row_to_json(t))) from (%s) t', sql) into result;
  return result;
end;
$$;
