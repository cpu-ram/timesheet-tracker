import { FieldValue } from '../shared/FieldValue.tsx';

export const JobsiteFieldValue = ({
  children, isExpected
}: { children: React.ReactNode, isExpected?: boolean }) => (
  <FieldValue
    isExpected={isExpected}
    additionalStyles={{
      //textDecoration: 'underline',
      textUnderlineOffset: '0.3em',
      textDecorationThickness: '0.05em',
    }}
  >
    {children}
  </FieldValue>);