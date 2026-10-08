-- Wi-Fi credentials on dotra profiles
alter table public.dotra_profiles
  add column if not exists wifi_ssid text,
  add column if not exists wifi_password text,
  add column if not exists wifi_encryption text;
