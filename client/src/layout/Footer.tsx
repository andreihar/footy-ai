import { Box, Typography, SvgIcon, Link } from '@mui/material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Logo from './Logo';
import { endYear } from '@/config';

function Footer() {
  const t = useTranslations();
  const createdYear = 2024;
  const yearDisplay = endYear === createdYear ? `${createdYear}` : `${createdYear}—${endYear}`;

  return (
    <>
      <Box px={2} width="100%" color="white" bgcolor="black">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <SvgIcon component={Logo} sx={{ width: 100, height: 100, color: 'black' }} />
          <Typography fontFamily="Logo" variant="h1" noWrap sx={{}}>Footy AI</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" pb={1}>
          <Box flex={1} display="flex" justifyContent="flex-start">
            <Typography>© {yearDisplay} Andrei Harbachov. {t('Footer.rights')}</Typography>
          </Box>
          <Box flex={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
            <Link href="https://www.uefa.com/" target="_blank" rel="noopener noreferrer">
              <Image src="https://img.uefa.com/imgml/uefacom/elements/main-nav/uefa-logo.svg" alt="UEFA Logo" width={100} height={16} />
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Footer;
