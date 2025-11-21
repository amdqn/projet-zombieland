import { PrimaryButton } from './PrimaryButton';

interface ReservationButtonProps {
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const ReservationButton = ({
  variant = 'desktop',
  onClick
}: ReservationButtonProps) => {
  return (
    <PrimaryButton
      text="RÉSERVER MAINTENANT"
      textMobile="RÉSERVER"
      variant={variant}
      onClick={onClick}
    />
  );
};
