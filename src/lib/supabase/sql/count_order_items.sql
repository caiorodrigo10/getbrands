
CREATE OR REPLACE FUNCTION count_order_items(order_ids uuid[])
RETURNS TABLE (sample_request_id uuid, count bigint) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    sample_request_id, 
    COUNT(*) as count
  FROM 
    sample_request_products
  WHERE 
    sample_request_id = ANY(order_ids)
  GROUP BY 
    sample_request_id;
$$;
