export interface AssistanceTypes {
  id: number;
  name: string;
  isActive?: boolean;
  extraFieldLabel?: string | null;
  extraFieldPlaceholder?: string | null;
  extraFieldRequired?: boolean;
}
