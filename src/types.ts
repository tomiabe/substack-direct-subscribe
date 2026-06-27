export type FormLayout = "card" | "banner";
export type FormAlign = "left" | "center" | "right";

export interface SubstackFormProps {
  substackUrl: string;
  publicationId: string;
  layout?: FormLayout;
  fullWidth?: boolean;
  align?: FormAlign;
  onSuccess?: () => void;
}

export interface SubstackPopupProps {
  substackUrl: string;
  publicationId: string;
  delayMinutes?: number;
  onSubscribe?: () => void;
}
