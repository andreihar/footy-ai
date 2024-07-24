import { Box, Typography, SvgIcon, Link } from '@mui/material';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import Logo from './Logo';

function Footer() {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box px={2} width="100%" color="white" bgcolor="black">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <SvgIcon component={Logo} sx={{ width: 100, height: 100, color: 'black' }} />
          <Typography fontFamily="Logo" variant="h1" noWrap sx={{}}>Footy AI</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" pb={1}>
          <Typography>© 2024 Andrei Harbachov. {formatMessage({ id: 'footer.rights' })}</Typography>
          <Link href="https://www.uefa.com/" target="_blank" rel="noopener noreferrer">
            <Image src="https://img.uefa.com/imgml/uefacom/elements/main-nav/uefa-logo.svg" alt="UEFA Logo" width={100} height={16} />
          </Link>
        </Box>
      </Box>
    </>
  );
}
export default Footer;
