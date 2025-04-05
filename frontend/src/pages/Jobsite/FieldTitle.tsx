import { useFieldTitleStyle } from "../../components/shared/styles/recordStyles";

export const FieldTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <span style={useFieldTitleStyle()}>
      {children}
    </span>
  );
};