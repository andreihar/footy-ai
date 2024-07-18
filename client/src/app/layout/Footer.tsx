import { AppBar, Box, Container, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Select, MenuItem, SvgIcon, Fade, useMediaQuery, Menu, Collapse, SxProps, Theme, Link } from '@mui/material';
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useStats } from '@/utils/StatsContext';
import { useLanguage } from '@/utils/LanguageProvider';
import { useIntl } from 'react-intl';
import { useTheme, lighten, darken } from '@mui/material/styles';
import Logo from './Logo';
import EuroLogo from './EuroLogo';

function Footer() {
  const { formatMessage } = useIntl();

  return (
    <>
      <Box px={2} width="100%" color="white" bgcolor="black">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <SvgIcon component={Logo} sx={{ width: 100, height: 100, color: 'black' }} />
          <Typography fontFamily="Logo" variant="h1" noWrap sx={{}}>
            Footy AI
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" pb={1}>
          <Typography>© 2024 Andrei Harbachov. {formatMessage({ id: 'footer.rights' })}</Typography>
          <Link href="https://www.uefa.com/" target="_blank" rel="noopener noreferrer">
            <img width="100px" src="https://img.uefa.com/imgml/uefacom/elements/main-nav/uefa-logo.svg" />
          </Link>
        </Box>
      </Box>
    </>
  );
}
export default Footer;;;
