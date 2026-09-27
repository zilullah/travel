BEGIN;

ALTER TABLE public.properties
  DROP CONSTRAINT properties_status_check,
  ADD CONSTRAINT properties_status_check
    CHECK (status IN ('For Sale', 'For Rent', 'Exclusive', 'Under Offer', 'Sold'));

COMMIT;
