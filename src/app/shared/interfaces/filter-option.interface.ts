export interface FilterOption {
  key: string;
  label: string;
  type: string;
  options: { value: string; label: string }[] | [];
}
