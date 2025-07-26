import { getFieldTitleStyle } from '../../components/shared/styles/recordStyles';

export const FieldTitle = ({ children }: { children: React.ReactNode }) => {
  return <span style={getFieldTitleStyle()}>{children}</span>;
};
