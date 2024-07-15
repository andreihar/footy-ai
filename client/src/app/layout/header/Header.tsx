import { AppBar, Box, Container, Toolbar, IconButton, Typography, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Select, MenuItem, SvgIcon, Fade, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useStats } from '@/utils/StatsContext';
import { useLanguage } from '@/utils/LanguageProvider';
import { useIntl } from 'react-intl';
import { useTheme, lighten } from '@mui/material/styles';
import Logo from '../shared/logo/Logo';
import EuroLogo from '../shared/logo/EuroLogo';

const drawerWidth = 240;

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { year, setYear } = useStats();
  const { language, setLanguage } = useLanguage();
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const menuItems = [
    { title: formatMessage({ id: 'header.overview' }), href: "/", },
    { title: formatMessage({ id: 'header.matches' }), href: "/matches", },
    { title: formatMessage({ id: 'header.group' }), href: "/group", },
    { title: formatMessage({ id: 'header.knockout' }), href: "/knockout", },
    { title: formatMessage({ id: 'header.custom' }), href: "/custom", },
  ];

  const isSmOrLarger = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const updateAppBarState = () => {
      const isAppBarStuck = !isSmOrLarger || window.scrollY > (document.getElementById('box-id')?.offsetHeight || 0);
      setIsStuck(isAppBarStuck);
    };
    updateAppBarState();
    window.addEventListener('scroll', updateAppBarState);
    return () => window.removeEventListener('scroll', updateAppBarState);
  }, [isSmOrLarger]);

  return (
    <>
      <Box id="box-id" py={2} color="white" sx={{ bgcolor: lighten(theme.palette.primary.main, 0.12), display: { xs: 'none', sm: 'flex' } }}>
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Box display="flex" alignItems="center" component="a" href="/" color="white" sx={{ textDecoration: 'none' }}>
              <SvgIcon component={Logo} sx={{ width: 68, height: 68, color: 'black', mr: 2 }} />
              <Typography fontFamily="Logo" className="custom-font-element" variant="h2" noWrap sx={{ color: 'inherit', lineHeight: 'normal', mt: '14px', }}>
                Footy AI
              </Typography>
            </Box>
            <Select variant="outlined" value={language} onChange={(event) => setLanguage(event.target.value as string)}
              sx={{ color: 'white', borderColor: 'white', height: '32px', '.MuiSvgIcon-root': { fontSize: '1rem' }, '.MuiSelect-icon': { color: 'white' }, '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' }, '&& fieldset': { border: 'none' }, }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fr">Français</MenuItem>
              <MenuItem value="de">Deutsch</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </Box >
      <AppBar component="nav" position="sticky">
        <Container sx={{ maxWidth: "1200px" }}>
          <Toolbar variant='dense' ref={containerRef}>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box display="flex" alignItems="center" component="a" href="/" color="white" sx={{ textDecoration: 'none' }}>
              <Fade in={isStuck}>
                <Box alignItems="center" sx={{ display: isStuck ? 'flex' : 'none' }}>
                  <SvgIcon component={Logo} sx={{ width: 40, height: 40, color: 'black', mr: 1 }} />
                  <Box sx={{ height: '24px', width: '1px', bgcolor: 'rgba(0, 0, 0, 0.6)', mx: 1 }} />
                </Box>
              </Fade>
              <EuroLogo />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
              {menuItems.map((item) => (
                <Button key={item.title} href={item.href} sx={{ color: 'white', display: 'block' }}>
                  {item.title}
                </Button>
              ))}
              <Box px={1} sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Typography variant="body1">
                  EURO
                </Typography>
                <Select
                  variant="outlined"
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  sx={{
                    paddingTop: '1px',
                    color: 'white', borderColor: 'white', height: '32px',
                    '.MuiOutlinedInput-input': { paddingLeft: '4px', paddingRight: '24px !important' },
                    '.MuiSvgIcon-root': { fontSize: '1rem' },
                    '.MuiSelect-icon': { color: 'white' },
                    '&& fieldset': { border: 'none' }
                  }}
                >
                  {Array.from({ length: (2024 - 1960) / 4 + 1 }, (_, index) => 2024 - index * 4).map(year => (
                    <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar >
      <nav>
        <Drawer variant="temporary" open={mobileOpen} onClick={() => setMobileOpen((prevState) => !prevState)} ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Box onClick={() => setMobileOpen((prevState) => !prevState)} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
              MUI
            </Typography>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton href={item.href} sx={{ textAlign: 'center' }}>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </nav>
    </>
  );
}
export default Header;
