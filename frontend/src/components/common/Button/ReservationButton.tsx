import { PrimaryButton } from './PrimaryButton';
import { useTranslation } from 'react-i18next';

interface ReservationButtonProps {
  variant?: 'desktop' | 'mobile';
  onClick?: () => void;
}

export const ReservationButton = ({
  variant = 'desktop',
  onClick
}: ReservationButtonProps) => {
  const { t } = useTranslation();

  return (
    <PrimaryButton
      text={t('buttons.reserveNow')}
      textMobile={t('buttons.reserve')}
      variant={variant}
      onClick={onClick}
    />
  );
};
